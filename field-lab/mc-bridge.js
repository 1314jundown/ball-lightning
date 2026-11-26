/**
 * mc-bridge.js - 全局总控台（Mission Control）通信与状态总线
 * 
 * 作用：为各个子模块（序章、主站、武器实验室、打字机实验室）提供零侵入的总控连接通道。
 * 支持两种环境：
 * 1. 嵌入在总控台 iframe 中：通过 window.postMessage 实时收发事件
 * 2. 独立标签页打开：通过 BroadcastChannel ('bl-mission-control') 和 localStorage 双向同步
 * 3. 脱离总控单独运行：静默降级为默认参数，绝不报错或阻塞原业务逻辑
 */

(function (global) {
  'use strict';

  var CHANNEL_NAME = 'bl-mission-control';
  var STORAGE_KEY = 'bl_mc_config_v1';

  var DEFAULT_CONFIG = {
    // 1. 统一视听
    masterVolume: 1.0,        // 0.0 - 1.0 全局总推子
    muted: false,             // 静音总闸
    visualTheme: 'blueprint', // 'blueprint' (全息蓝图) | 'noir' (暗黑电影) | 'cloud' (量子点云) | 'raw' (原色) | 'minimal' (极简白)
    perfTier: 'high',         // 'low' | 'balanced' | 'high'
    bloomIntensity: 1.0,      // 0.0 - 2.0 辉光放大倍率
    
    // 2. 叙事与流转
    typewriterSpeed: 26,      // CPS (每秒打字数)
    typewriterMode: 'bc',     // 'a' (乱码解码) | 'b' (错字退格) | 'c' (视觉质感) 的组合，如 'bc', 'abc'
    skipIntro: false,         // 是否跳过序章动画

    // 3. 试验场与操作手感
    hitStopScale: 1.0,        // 顿帧缩放系数 (0.0 - 2.0)
    shakeScale: 1.0,          // 震屏缩放系数 (0.0 - 2.0)
    slowmoScale: 1.0,         // 慢镜头缩放系数 (0.0 - 2.0)
    mouseSensitivity: 1.0,    // 鼠标灵敏度
    invertY: false            // 视角垂直反转
  };

  // 读取已保存的持久化设置
  function loadPersistedConfig() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        return Object.assign({}, DEFAULT_CONFIG, parsed);
      }
    } catch (e) {}
    return Object.assign({}, DEFAULT_CONFIG);
  }

  var currentConfig = loadPersistedConfig();
  var listeners = [];
  var channel = null;

  try {
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = function (e) {
        if (e.data && e.data.type === 'MC_CONFIG_UPDATE') {
          handleConfigUpdate(e.data.payload, false);
        } else if (e.data && e.data.type === 'MC_COMMAND') {
          handleCommand(e.data.command, e.data.args);
        }
      };
    }
  } catch (err) {
    console.warn('[MC-Bridge] BroadcastChannel unavailable, fallback to storage events');
  }

  // 监听来自父窗口 (iframe 模式) 的消息
  window.addEventListener('message', function (e) {
    if (!e.data || typeof e.data !== 'object') return;
    if (e.data.type === 'MC_CONFIG_UPDATE') {
      handleConfigUpdate(e.data.payload, false);
    } else if (e.data.type === 'MC_COMMAND') {
      handleCommand(e.data.command, e.data.args);
    }
  });

  // 跨标签页 localStorage 事件监听
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        var parsed = JSON.parse(e.newValue);
        handleConfigUpdate(parsed, false);
      } catch (_) {}
    }
  });

  function handleConfigUpdate(newPatch, broadcast) {
    var changedKeys = [];
    for (var k in newPatch) {
      if (Object.prototype.hasOwnProperty.call(newPatch, k)) {
        if (currentConfig[k] !== newPatch[k]) {
          currentConfig[k] = newPatch[k];
          changedKeys.push(k);
        }
      }
    }
    if (changedKeys.length === 0) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentConfig));
    } catch (_) {}

    if (broadcast) {
      if (channel) {
        try { channel.postMessage({ type: 'MC_CONFIG_UPDATE', payload: newPatch }); } catch (_) {}
      }
      // 通知 iframe 父窗口或子窗口
      if (window.parent && window.parent !== window) {
        try { window.parent.postMessage({ type: 'MC_CONFIG_UPDATE', payload: newPatch }, '*'); } catch (_) {}
      }
    }

    // 触发所有已注册的局部监听器
    for (var i = 0; i < listeners.length; i++) {
      try {
        listeners[i](currentConfig, changedKeys, newPatch);
      } catch (err) {
        console.error('[MC-Bridge] Listener error:', err);
      }
    }
  }

  var commandHandlers = {};

  function handleCommand(cmd, args) {
    if (commandHandlers[cmd]) {
      for (var i = 0; i < commandHandlers[cmd].length; i++) {
        try { commandHandlers[cmd][i](args); } catch (err) { console.error('[MC-Bridge] Command handler error:', err); }
      }
    }
  }

  var MC = {
    DEFAULT_CONFIG: DEFAULT_CONFIG,
    
    // 获取当前配置副本
    get: function (key) {
      return key ? currentConfig[key] : Object.assign({}, currentConfig);
    },

    // 更新配置并广播
    update: function (patch) {
      handleConfigUpdate(patch, true);
    },

    // 订阅配置变更 (callback(config, changedKeys, patch))
    subscribe: function (fn) {
      if (typeof fn === 'function') {
        listeners.push(fn);
        // 订阅时立即通知一次当前配置
        try { fn(currentConfig, Object.keys(currentConfig), currentConfig); } catch (e) {}
      }
      return function unsubscribe() {
        var idx = listeners.indexOf(fn);
        if (idx !== -1) listeners.splice(idx, 1);
      };
    },

    // 注册跨模块动作指令处理 (如 'jumpChapter', 'lightCandle', 'fireWeapon')
    onCommand: function (cmd, fn) {
      if (!commandHandlers[cmd]) commandHandlers[cmd] = [];
      commandHandlers[cmd].push(fn);
      return function () {
        var arr = commandHandlers[cmd];
        if (arr) {
          var idx = arr.indexOf(fn);
          if (idx !== -1) arr.splice(idx, 1);
        }
      };
    },

    // 向其他模块或总控台发送动作指令
    sendCommand: function (cmd, args) {
      if (channel) {
        try { channel.postMessage({ type: 'MC_COMMAND', command: cmd, args: args }); } catch (_) {}
      }
      if (window.parent && window.parent !== window) {
        try { window.parent.postMessage({ type: 'MC_COMMAND', command: cmd, args: args }, '*'); } catch (_) {}
      }
      // 本地也可以响应
      handleCommand(cmd, args);
    },

    // 辅助工具：根据当前静音状态和主音量获取计算增益
    calcGain: function (baseGain) {
      if (currentConfig.muted) return 0;
      var factor = typeof currentConfig.masterVolume === 'number' ? currentConfig.masterVolume : 1.0;
      return (baseGain == null ? 1.0 : baseGain) * factor;
    }
  };

  global.MissionControl = MC;
  global.__MC = MC;
})(typeof window !== 'undefined' ? window : this);
