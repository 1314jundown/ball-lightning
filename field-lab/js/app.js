(function () {
function showBootError(msg) {
if (document.getElementById('booterr')) return;
var d = document.createElement('div');
d.id = 'booterr';
d.setAttribute('role', 'alert');
d.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;' +
'padding:6vh 5vw;background:radial-gradient(120% 90% at 50% 40%,#12151f 0%,#05060a 70%);' +
'font-family:ui-monospace,"Cascadia Mono",Consolas,monospace;color:#d8deee;';
d.innerHTML =
'<div style="max-width:620px;width:100%">' +
'<span style="display:block;font-size:18px;letter-spacing:.18em;color:#ff8f8f;margin-bottom:14px">主站没能启动</span>' +
'<p style="font-size:14px;line-height:1.9;color:#e6eaf6;margin:0 0 14px"></p>' +
'<p style="font-size:12px;line-height:1.8;color:#7f8aa3;margin:0 0 20px">按 F12 打开开发者工具能看到完整报错；也可以先重新加载一次，偶尔只是加载顺序的问题。</p>' +
'<a href="javascript:void(0)" style="display:inline-block;padding:10px 22px;border-radius:999px;background:#7d8cff;' +
'color:#07080d;font-size:13px;font-weight:650;text-decoration:none;letter-spacing:.04em">重新加载</a>' +
'</div>';
d.querySelector('p').textContent = msg;
d.querySelector('a').onclick = function () { location.reload(); };
document.body.appendChild(d);
}
setTimeout(function () {
try {
var toc = document.getElementById('toc');
if (!toc || toc.children.length > 0) return;
var errs = (window.__errs || []).filter(function (x) { return x; });
showBootError(errs.length
? '脚本在初始化阶段报错了：' + String(errs[0]).slice(0, 200)
: '页面打开了，但章节导航一个都没建出来——app.js 大约只跑了一半。');
} catch (e) { /* 看门狗自己出错时不要再抛 */ }
}, 8000);
})();
const stages = [
['01','序曲：雷雨夜与研究动机','主角生日夜，球形发光体穿墙进入家中，父母在强光和能量作用下化为灰烬。主角从此把球形发光体视为必须面对的对象。','档案线索','虚构设定','创伤 → 追索','从自然目击到个人问题','序曲','正文 1–5 页'],
['02','异象之一 · 旧屋：两年后的夏天','大二暑假回老家收房：客厅里的薄灰、倒扣的玻璃杯、一幅画面朝下的水塔画，盥洗池边的几根半黑半白头发。它不属于“解释”，只属于“目击”。','档案线索','虚构设定','重返 → 目击','从纸面回到那间屋子','番外 异象一','正文 9–10 页','anomaly'],
['03','中篇 · 研究：国际线索与科研共同体','主角与项目负责人等人通过网络和资料线索寻找球形发光体研究者，接触理论顾问、建模导师、观测站等人；研究从个人执念变为跨学科、跨机构协作。','报告归纳','虚构设定','合作 → 工程','从一个人的问题到一组人的任务','中篇 研究','正文 约 40–120 页'],
['04','军事化：从解释现象到设计武器','国家把球形发光体相关成果纳入新概念武器与战略项目。项目负责人在系统评价和项目协作中承担重要职责，主角与理论顾问的理论被改写为可部署的技术。','报告归纳','虚构设定','理论 → 武器','当知识进入制度接口','下篇 战争','正文 约 120–190 页'],
['05','战争：共振爆发与文明系统性崩溃','武器投入战争后，共振爆发造成大范围信息设备和芯片系统失效，社会退回低技术状态。主角在战场上经历行动、失散与死亡，项目负责人牺牲。','档案线索','虚构设定','局部 → 系统','风险不再只属于实验室','下篇 战争','正文 约 190–270 页'],
['06','尾声：婚姻、记忆与量子花','战争结束后，主角与伴侣结婚，外部观察者来访，把研究转向民用与“超级观察者”问题。量子花把科学概念重新连回婚姻、记忆与死亡体验。','档案线索','文学象征','解释 → 生活','最后留下的是不可替代的生活','尾声','正文 约 270–278 页'],
['07','后记：作者对科幻形象的自述','作者说明亲见球形发光体的经历，也说明作品并不声称解释真实机制，而是在现实灰色世界里创造一个想象的超现实对象。','报告归纳','虚构设定','想象 → 边界','科幻形象不是科学结论','后记','正文 279–281 页']
];
const lenses = {
reality: {
title:'球形发光体：现实中仍未完全解释的自然现象',
text:'现实研究有目击记录和少量仪器记录，但样本稀少、持续时间短、定义不一，至今没有被广泛接受的单一机制。',
src:'外部科学资料', bnd:'现实争议',
ev:[['可以说','雷暴、大气电学、等离子体和能量密度提供理解入口。'],['不能越界','现实球形发光体研究不等于设定的载流子体系。']]
},
hypothesis: {
title:'把候选假说当作“解释工具”，而不是答案',
text:'等离子体、蒸发材料、化学发光、微波与电磁场等模型可以解释部分观测，但模型之间仍需证据比较。',
src:'外部科学资料', bnd:'候选假说',
ev:[['课堂动作','比较每个模型解释了什么、遗漏了什么。'],['证据等级','目击记录能提出问题，却不能单独完成验证。']]
},
fiction: {
title:'载流子、空泡与共振爆发：本设定内部的自洽系统',
text:'设定把球形发光体写成可收集、可激发、可武器化的宏观量子结构。这套框架服务于叙事和伦理推演，不是现实科学结论。',
src:'报告归纳', bnd:'虚构设定',
ev:[['设定链','球形发光体 → 载流子 → 能量节点 → 共振爆发。'],['回收点','量子花把宏观量子设定重新折返为情感象征。']]
}
};
const nodes = {
storm: {
n:'雷暴电场', sub:'大气电学', rel:'云内电荷分离 → 强电场', bnd:'实测',
note:'雷暴云里冰晶与霰粒碰撞分离电荷，云底与地面之间形成上万伏每米的电场，是这一切的起点。'
},
macro: {
n:'梯级先导', sub:'放电起始', rel:'强电场 → 空气击穿', bnd:'高速摄影实测',
note:'电场把空气击穿的瞬间，一条电离通道一段一段往下探，每段数十米，肉眼几乎看不见。'
},
stroke: {
n:'回击', sub:'主放电', rel:'通道接通 → 反向大电流', bnd:'实测',
note:'先导与地面接通后，电荷沿通道猛地回流，通道被加热到上万度——我们看见的那道亮光就是它。'
},
ball: {
n:'球形发光体', sub:'核心现象', rel:'放电产物 → 持续发光', bnd:'观测记录 + 争议',
note:'雷暴中偶见直径十几到几十厘米的发光球，持续数秒，能穿窗、漂浮，最后爆裂或无声消失。'
},
bubble: {
n:'硅纳米颗粒', sub:'主流解释之一', rel:'雷击土壤 → 硅蒸气 → 凝聚', bnd:'实验支持',
note:'雷击把土壤里的硅蒸发，冷凝成纳米颗粒；这些颗粒在空气里缓慢氧化发光，能解释漂浮与穿窗。'
},
quantum: {
n:'微波孤子', sub:'另一条解释路径', rel:'电磁能量 → 自局域结构', bnd:'理论假说',
note:'电磁能量被自身非线性“困”成一团，像孤子一样维持数秒，不立刻散掉。'
},
transition: {
n:'等离子体', sub:'物质第四态', rel:'电离气体 → 导电发光', bnd:'实验室常规',
note:'原子被剥离电子后成为等离子体，能导电、能被磁场约束，是电弧与恒星共同的物质状态。'
},
fusion: {
n:'能量密度', sub:'量化指标', rel:'体积 → 可储能量', bnd:'可测量',
note:'同样大小的体积里能塞进多少焦耳。球形发光体的争议之一，就是观测到的能量密度高得不寻常。'
},
nucleus: {
n:'量子化', sub:'量子基础', rel:'连续 → 分立', bnd:'实验确证',
note:'能量、角动量这些量不能连续取值，只能一格一格地跳；这是量子力学最硬的实验事实。'
},
observer: {
n:'叠加态', sub:'量子基础', rel:'多种可能 → 同时存在', bnd:'实验确证（微观）',
note:'没被测量之前，系统可以同时处在多个状态的组合里；干涉实验一次次证明它不是“我们不知道”。'
},
rose: {
n:'观测与坍缩', sub:'量子测量', rel:'测量 → 单一结果', bnd:'实验确证 / 解释争议',
note:'一旦测量，叠加态给出一个确定结果。“为什么”至今没有共识——这是本节留给你的问题。'
}
};
const HYP = {
storm:    ['无需假说', '雷暴、电荷分离与放电是已被理解的物理过程，不属于待解释现象。', '现实知识'],
ball:     ['多个竞争模型', '硅纳米颗粒氧化（Abrahamson & Dinniss 2000）、微波激射—孤立子、相对论微波（Wu 2016）、等离子体模型等互相竞争，至今没有胜出者。', '现实争议'],
macro:    ['无对应候选', '现实没有“宏观尺度电子”的候选机制，只能类比等离子体、带电粒子与集体激发。', '虚构设定'],
nucleus:  ['无对应候选', '现实原子核遵循量子规律，但把结构放大到宏观尺度没有任何候选机制。', '虚构设定'],
bubble:   ['无对应候选', '只能类比真空腔、场局域化、拓扑缺陷等概念，现实中没有被确认的对应实体。', '虚构设定'],
quantum:  ['现实理论 + 本设定外推', '量子态是现实量子力学的基本描述；争议点在于宏观物体能否长期保持可观测叠加，即退相干问题。', '现实讨论'],
transition:['现实理论 + 文学类比', '能级跃迁真实存在；把宏观物体的位置与能量变化称作“量子跃迁”属于文学类比。', '文学类比'],
fusion:   ['现实机制 + 尺度虚构', '核聚变是真实机制，能量量级远高于化学反应的十万倍；但“能量节点聚变”没有对应物。', '虚构设定'],
observer: ['竞争解释', '测量问题真实存在（退相干、观测者效应），但“意识观察导致坍缩”不是物理学共识。', '现实讨论'],
rose:     ['无科学对应', '只对应“观察改变状态”这一隐喻，没有物理实体或候选机制。', '文学象征']
};
const CHAIN = {
storm:     ['自然现象', '主角的目击与创伤', '自然现象触发个人研究动机'],
ball:      ['雷暴', '载流子', '球形发光体被重新解释为可操作对象'],
macro:     ['球形发光体', '能量节点／能量单元', '从带电粒子到宏观物质单元'],
nucleus:   ['载流子', '空泡', '从带电粒子到宏观物质单元，再由空泡维持稳定'],
bubble:    ['能量节点', '量子态与量子跃迁', '空泡承担“保护壳／空间结构”的功能'],
quantum:   ['空泡', '观察、坍缩、状态改变', '把宏观现象接入量子解释'],
transition:['空泡', '观察、坍缩、状态改变', '把宏观现象接入量子解释'],
fusion:    ['能量节点', '武器化与大范围毁伤', '科学模型进入军事工程'],
observer:  ['量子态', '量子花', '科学概念回到家庭与死亡经验'],
rose:      ['量子态与观察者', '私人记忆与情感隐喻', '科学概念回到家庭与死亡经验']
};
const NAV = [
['报告归纳','现实争议'], ['外部科学资料','现实争议'], ['报告归纳','文学象征']
];
const GONE_SEL = new Set(['#stages', '#people', '#dos', '#dlg', '#prologue', '#chapStage', '#chapList',
'#chapHint', '#chapCoord', '#chapClose', '#chapStatic', '#archList', '#dosBody', '#stage3dWrap',
'#prologueText', '#prologueWorld', '#introPrompt', '#endCard']);
const $ = s => document.querySelector(s) || (GONE_SEL.has(s) ? document.createElement('div') : null);
const $$ = s => Array.from(document.querySelectorAll(s));
const screens = ['cover','concepts','rose'].map(id => document.getElementById(id));
let cur = 0;
const BOOT_HASH = location.hash;
let hashBooted = false;
const STATUS_WHY = {
'档案线索': '这一段的情节骨架能在本记录正文里找到对应页码，属于“档案里确实这么记”。',
'虚构设定': '记录里没明写、由整理者补写的部分；用来把证据链讲圆，不代表本设定结论。',
'报告归纳': '来自第二手材料（报道、访谈、研究综述）的归纳，不是本记录原句。',
'现实知识': '现实世界里可查证的科学结论，用来和设定对照。',
'现实争议': '现实里尚无定论的部分；单独标出来，免得被当成已确认的结论。',
'文学象征': '这个元素在本设定里主要承担象征功能（记忆、死亡），不是物理设定。',
'设计推演': '由现实机制往工程侧推演出的虚构设计，属于“可能长这样”。',
'人物关系': '依据人物之间的对话、书信与行动整理出的关系判断。',
'档案摘录': '档案摘录由本站撰写，按档案体例成文。',
'外部科学资料': '外部文献与观测记录，用来界定“现实里能说到哪里”。',
'现实机制 + 尺度虚构': '机制本身是真的（核聚变），被放大的尺度是虚构的。'
};
let whyKey = '';
function hideWhy(){
const el = $('#statusWhy');
if (el) el.hidden = true;
whyKey = '';
$$('#statusTags .chip').forEach(b => b.setAttribute('aria-pressed', 'false'));
}
function showWhy(term){
const el = $('#statusWhy');
if (!el) return;
if (whyKey === term) { hideWhy(); return; }
whyKey = term;
let why = STATUS_WHY[term];
if (!why && term.indexOf(' + ') > 0) {
why = term.split(' + ').map(t => (STATUS_WHY[t] ? t + '：' + STATUS_WHY[t] : t)).join('；');
}
el.innerHTML = '<b>' + term + '</b>　' + (why || '这个标签是把几种依据叠在一起写的，逐条看上面两个词。');
el.hidden = false;
$$('#statusTags .chip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.term === term)));
}
function setStatus(src, bnd){
const wrap = $('#statusTags');
if (!wrap) return;
wrap.innerHTML =
'<span class="chip accent" role="button" tabindex="0" data-term="' + src + '">' + src + '</span>' +
'<span class="chip" role="button" tabindex="0" data-term="' + bnd + '">' + bnd + '</span>';
hideWhy();
}
addEventListener('click', e => {
const t = e.target;
if (!t || !t.closest) return;
const b = t.closest('#statusTags .chip');
if (b) { showWhy(b.dataset.term); return; }
if (!t.closest('#statusWhy')) hideWhy();
});
addEventListener('keydown', e => {
if (e.key !== 'Enter' && e.key !== ' ') return;
const b = document.activeElement;
if (b && b.closest && b.closest('#statusTags')) {
e.preventDefault();
showWhy(b.dataset.term);
}
});
function syncHash(){
const want = '#' + cur;
if (location.hash !== want){
try { history.replaceState(null, '', want); } catch (_) { location.hash = want; }
}
}
window.__syncHash = syncHash;
function readHash(){
const src = hashBooted ? (location.hash || '') : (BOOT_HASH || location.hash || '');
hashBooted = true;
const m = /^#(\d)$/.exec(src);
if (!m) return;
const i = Math.max(0, Math.min(screens.length - 1, +m[1]));
if (i !== cur) go(i);
}
const SCREEN_NOTE = [
'封面 · 一个仍在争论的物理问题',
'概念关系 · 11 个概念 · 19 条关系，可切实验模式',
'量子花 · 观测者与坍缩'
];
function go(i){
i = Math.max(0, Math.min(screens.length - 1, i));
if (i !== cur && window.__dlgClose) window.__dlgClose();
cur = i;
const prologue = document.getElementById('prologue');
if (i !== 0 && prologue && document.body.classList.contains('prologue-active')){
prologue.classList.add('done');
document.body.classList.remove('prologue-active','cover-intro');
document.body.classList.add('cover-reveal');
}
if (i !== 0 && document.body.classList.contains('cover-intro')){
document.body.classList.remove('cover-intro');
document.body.classList.add('cover-reveal');
}
screens.forEach((s, j) => s.classList.toggle('on', i === j));
$$('#toc button').forEach(b => b.setAttribute('aria-current', String(+b.dataset.go === i)));
document.body.dataset.screen = String(i);
const nav = NAV[i] || ['', ''];
setStatus(nav[0], nav[1]);
const noteEl = $('#screenNote');
if (noteEl) noteEl.textContent = SCREEN_NOTE[i] || '';
if (screens[i].scrollTop) screens[i].scrollTop = 0;
if (window.__labFx) {
if (screens[i] && screens[i].id === 'concepts') requestAnimationFrame(() => { window.__labFx.resize(); window.__labFx.start(); if (window.__labGame) window.__labGame.resume(); if (window.__mini) window.__mini.resume(); });
else { window.__labFx.stop(); if (window.__labGame) window.__labGame.pause(); if (window.__mini) window.__mini.pause(); }
}
if (screens[i] && screens[i].id === 'rose' && !window.__roseStarted) {
window.__roseStarted = true;
try {
if (window.roseStage) {
window.roseStage();
window.__roseHold = true;
if (window.TUNE && window.__roseCFG) {
const T = window.TUNE, cfg = window.__roseCFG;
cfg.alpha = Math.min(2, Math.max(.15, T.bright / 100 * 0.75));
cfg.size = T.size / 100 * 1.25;
cfg.bloom = T.glow / 100;
cfg.hue = (202 + T.hue + 360) % 360;
}
}
} catch (err) { console.error('[rose]', err); }
}
syncHash();
}
$$('[data-go]').forEach(b => b.addEventListener('click', () => go(+b.dataset.go)));
addEventListener('keydown', e => {
if (e.key === 'ArrowRight' || e.key === 'PageDown') { go(cur + 1); e.preventDefault(); }
else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { go(cur - 1); e.preventDefault(); }
else if (e.key === 'Home') go(0);
else if (e.key === 'End') go(screens.length - 1);
});
const detached = () => document.createElement('div');
const chapStage = $('#chapStage') || detached();
const chapList = $('#chapList') || detached();
const chapHint = $('#chapHint') || detached();
const chapCoord = $('#chapCoord') || detached();
const CHAP_TINT = [
['#15181c', '#0a0a0b', '#c8d2d8'],
['#15181c', '#0a0a0b', '#c8d2d8'],
['#15181c', '#0a0a0b', '#c8d2d8'],
['#15181c', '#0a0a0b', '#c8d2d8'],
['#15181c', '#0a0a0b', '#c8d2d8'],
['#15181c', '#0a0a0b', '#c8d2d8'],
['#15181c', '#0a0a0b', '#c8d2d8']
];
const SCATTER = [[.13,.20],[.32,.44],[.61,.20],[.49,.66],[.79,.52],[.88,.18],[.23,.76]];
const SCATTER_N = [[.27,.15],[.60,.26],[.31,.37],[.63,.48],[.28,.59],[.61,.70],[.30,.81]];
const CHAP_LABEL = [
[.120, .247], [.162, .531], [.401, .214], [.397, .641],
[.658, .436], [.772, .244], [.845, .608]
];
const CHAP_NODE_VID = [
[.090, .3006], [.235, .4974], [.390, .5228], [.545, .6292],
[.700, .4185], [.810, .5400], [.930, .5505]
];
const BOLT_Y = [
[0, .3434], [.042, .3434], [.083, .2911], [.125, .3479], [.167, .4058],
[.208, .4804], [.25, .5069], [.292, .5385], [.333, .5051], [.375, .5073],
[.417, .5508], [.458, .5996], [.5, .6306], [.542, .6303], [.583, .4772],
[.625, .3647], [.667, .3699], [.708, .4285], [.75, .4745], [.792, .5219],
[.833, .5632], [.875, .4648], [.917, .6228], [.958, .3948], [1, .1408]
];
function boltYAt(x){
x = Math.max(0, Math.min(1, x));
for (let i = 1; i < BOLT_Y.length; i++){
if (x <= BOLT_Y[i][0]){
const a = BOLT_Y[i - 1], b = BOLT_Y[i];
const t = (x - a[0]) / (b[0] - a[0] || 1);
return a[1] + (b[1] - a[1]) * t;
}
}
return BOLT_Y[BOLT_Y.length - 1][1];
}
function seqRand(seed){
let s = seed >>> 0;
return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
const f2 = v => v.toFixed(2);
function chapArt(i){
const hl = CHAP_TINT[i][2];
const r = seqRand(3119 + i * 977);
const A = [];
const line = (x1, y1, x2, y2, o, w) =>
A.push('<line x1="' + x1.toFixed(0) + '" y1="' + y1.toFixed(0) + '" x2="' + x2.toFixed(0) +
'" y2="' + y2.toFixed(0) + '" stroke="' + hl + '" stroke-width="' + (w || .7) + '" opacity="' + f2(o) + '"/>');
if (i === 0){
for (let k = 0; k < 72; k++){
const x = r() * 300 - 20, y = r() * 340, l = 14 + r() * 46;
A.push('<line x1="' + x.toFixed(0) + '" y1="' + y.toFixed(0) + '" x2="' + (x - 8).toFixed(0) +
'" y2="' + (y + l).toFixed(0) + '" stroke="' + hl + '" stroke-width=".7" opacity="' + f2(.05 + r() * .13) + '"/>');
}
line(0, 262, 260, 262, .18, .8);
A.push('<rect x="152" y="98" width="82" height="108" fill="none" stroke="' + hl + '" stroke-width="1" opacity=".30"/>' +
'<line x1="193" y1="98" x2="193" y2="206" stroke="' + hl + '" stroke-width=".7" opacity=".20"/>' +
'<line x1="152" y1="152" x2="234" y2="152" stroke="' + hl + '" stroke-width=".7" opacity=".20"/>' +
'<rect x="176" y="264" width="64" height="9" fill="' + hl + '" opacity=".08"/>');
A.push('<circle cx="60" cy="244" r="44" fill="url(#b' + i + ')" opacity=".9"/>' +
'<polyline points="104,-4 92,62 110,70 80,146 100,154 60,244" fill="none" stroke="#fff" stroke-width="1.15" opacity=".82" stroke-linejoin="round"/>' +
'<circle cx="60" cy="244" r="3.4" fill="#fff" opacity=".92"/>');
A.push('<defs><radialGradient id="b' + i + '"><stop offset="0" stop-color="#fff" stop-opacity=".78"/>' +
'<stop offset=".42" stop-color="' + hl + '" stop-opacity=".26"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>');
}
if (i === 1){
line(28, 24, 28, 252, .13, .9);
line(232, 24, 232, 252, .13, .9);
line(28, 24, 232, 24, .07, .7);
line(28, 252, 232, 252, .24, 1.1);
line(28, 238, 232, 238, .06, .7);
A.push('<rect x="32" y="62" width="62" height="132" fill="none" stroke="' + hl + '" stroke-width="1" opacity=".32"/>' +
'<rect x="33" y="63" width="60" height="130" fill="' + hl + '" opacity=".028"/>' +
'<line x1="63" y1="62" x2="63" y2="194" stroke="' + hl + '" stroke-width=".7" opacity=".22"/>' +
'<line x1="32" y1="128" x2="94" y2="128" stroke="' + hl + '" stroke-width=".7" opacity=".20"/>' +
'<line x1="30" y1="196" x2="96" y2="196" stroke="' + hl + '" stroke-width=".9" opacity=".24"/>' +
'<path d="M94 62 L94 194 L188 252 L132 252 Z" fill="' + hl + '" opacity=".026"/>' +
'<path d="M94 74 L152 252" stroke="' + hl + '" stroke-width=".6" opacity=".12"/>' +
'<path d="M94 182 L118 252" stroke="' + hl + '" stroke-width=".6" opacity=".09"/>');
for (let k = 0; k < 30; k++){
const y = 256 + k * 2.0, x = 30 + r() * 90, w = 34 + r() * 118;
A.push('<line x1="' + x.toFixed(0) + '" y1="' + y.toFixed(0) + '" x2="' + (x + w).toFixed(0) + '" y2="' + y.toFixed(0) +
'" stroke="' + hl + '" stroke-width=".6" opacity="' + f2(.03 + r() * .06) + '"/>');
}
A.push('<rect x="50" y="200" width="106" height="4" fill="' + hl + '" opacity=".20"/>' +
'<line x1="56" y1="204" x2="56" y2="252" stroke="' + hl + '" stroke-width=".8" opacity=".15"/>' +
'<line x1="150" y1="204" x2="150" y2="252" stroke="' + hl + '" stroke-width=".8" opacity=".15"/>');
A.push('<path d="M118 200 L121 172 L139 172 L142 200 Z" fill="none" stroke="' + hl + '" stroke-width="1.1" opacity=".50"/>' +
'<ellipse cx="130" cy="200" rx="12" ry="2.6" fill="none" stroke="' + hl + '" stroke-width=".9" opacity=".40"/>' +
'<ellipse cx="130" cy="172" rx="9" ry="2" fill="none" stroke="' + hl + '" stroke-width=".7" opacity=".26"/>' +
'<line x1="125" y1="175" x2="123" y2="197" stroke="' + hl + '" stroke-width=".7" opacity=".22"/>');
A.push('<g transform="rotate(-5 191 208)">' +
'<rect x="158" y="86" width="66" height="122" fill="none" stroke="' + hl + '" stroke-width="1.2" opacity=".44"/>' +
'<rect x="164" y="92" width="54" height="110" fill="none" stroke="' + hl + '" stroke-width=".6" opacity=".20"/>' +
'<line x1="164" y1="92" x2="218" y2="202" stroke="' + hl + '" stroke-width=".6" opacity=".15"/>' +
'<line x1="218" y1="92" x2="164" y2="202" stroke="' + hl + '" stroke-width=".6" opacity=".15"/>' +
'<path d="M186 118 L212 118 L209 142 L189 142 Z" fill="none" stroke="' + hl + '" stroke-width=".7" opacity=".11"/>' +
'<line x1="190" y1="142" x2="184" y2="176" stroke="' + hl + '" stroke-width=".6" opacity=".08"/>' +
'<line x1="208" y1="142" x2="214" y2="176" stroke="' + hl + '" stroke-width=".6" opacity=".08"/>' +
'<line x1="186" y1="160" x2="212" y2="160" stroke="' + hl + '" stroke-width=".6" opacity=".07"/>' +
'</g>');
A.push('<ellipse cx="198" cy="292" rx="32" ry="8" fill="none" stroke="' + hl + '" stroke-width="1" opacity=".22"/>' +
'<ellipse cx="198" cy="292" rx="26" ry="5" fill="none" stroke="' + hl + '" stroke-width=".6" opacity=".12"/>' +
'<line x1="172" y1="296" x2="176" y2="318" stroke="' + hl + '" stroke-width=".8" opacity=".10"/>' +
'<line x1="224" y1="296" x2="220" y2="318" stroke="' + hl + '" stroke-width=".8" opacity=".10"/>');
for (let k = 0; k < 5; k++){
const x0 = 178 + k * 9 + r() * 4, y0 = 287 + r() * 3, p = [];
for (let t = 0; t <= 8; t++){
const u = t / 8, iu = 1 - u;
p.push((iu * iu * x0 + 2 * iu * u * (x0 - 5) + u * u * (x0 - 15)).toFixed(1) + ' ' +
(iu * iu * y0 + 2 * iu * u * (y0 - 11) + u * u * (y0 - 22)).toFixed(1));
}
A.push('<polyline points="' + p.slice(0, 5).join(',') + '" fill="none" stroke="' + hl + '" stroke-width=".8" opacity=".36"/>' +
'<polyline points="' + p.slice(4).join(',') + '" fill="none" stroke="' + hl + '" stroke-width=".8" opacity=".12"/>');
}
for (let k = 0; k < 40; k++){
A.push('<circle cx="' + (32 + r() * 196).toFixed(1) + '" cy="' + (30 + r() * 210).toFixed(1) +
'" r="' + (.5 + r() * .9).toFixed(1) + '" fill="' + hl + '" opacity="' + f2(.06 + r() * .11) + '"/>');
}
}
if (i === 2){
const pts = [];
for (let k = 0; k < 15; k++) pts.push([30 + r() * 196, 40 + r() * 250]);
for (let a = 0; a < pts.length; a++){
for (let b = a + 1; b < pts.length; b++){
const d = Math.hypot(pts[a][0] - pts[b][0], pts[a][1] - pts[b][1]);
if (d < 78) A.push('<line x1="' + pts[a][0].toFixed(0) + '" y1="' + pts[a][1].toFixed(0) + '" x2="' + pts[b][0].toFixed(0) +
'" y2="' + pts[b][1].toFixed(0) + '" stroke="' + hl + '" stroke-width=".6" opacity="' + f2(.10 + (1 - d / 78) * .16) + '"/>');
}
}
pts.forEach(function (p, k) {
const big = k % 5 === 0;
A.push('<circle cx="' + p[0].toFixed(0) + '" cy="' + p[1].toFixed(0) + '" r="' + (big ? 3.4 : 1.9) +
'" fill="' + hl + '" opacity="' + (big ? .95 : .62) + '"/>');
if (big) A.push('<circle cx="' + p[0].toFixed(0) + '" cy="' + p[1].toFixed(0) + '" r="8" fill="none" stroke="' + hl + '" stroke-width=".6" opacity=".26"/>');
});
for (let k = 0; k < 6; k++) A.push('<rect x="16" y="' + (44 + k * 9) + '" width="' + (16 + r() * 16).toFixed(0) + '" height="1.4" fill="' + hl + '" opacity=".20"/>');
A.push('<path d="M16 320 C 70 300, 118 322, 164 288 S 226 262, 248 244" fill="none" stroke="' + hl + '" stroke-width=".7" opacity=".18" stroke-dasharray="2 7"/>');
}
if (i === 3){
A.push('<circle cx="168" cy="150" r="92" fill="none" stroke="' + hl + '" stroke-width=".8" opacity=".16"/>' +
'<circle cx="168" cy="150" r="58" fill="none" stroke="' + hl + '" stroke-width=".7" opacity=".13" stroke-dasharray="2 8"/>' +
'<circle cx="168" cy="150" r="3" fill="' + hl + '" opacity=".6"/>');
for (let k = 0; k < 4; k++){
const a = k * Math.PI / 2;
A.push('<line x1="' + (168 + Math.cos(a) * 76).toFixed(0) + '" y1="' + (150 + Math.sin(a) * 76).toFixed(0) +
'" x2="' + (168 + Math.cos(a) * 100).toFixed(0) + '" y2="' + (150 + Math.sin(a) * 100).toFixed(0) +
'" stroke="' + hl + '" stroke-width=".8" opacity=".34"/>');
}
A.push('<rect x="128" y="196" width="80" height="52" rx="3" fill="none" stroke="' + hl + '" stroke-width=".9" opacity=".42"/>' +
'<rect x="176" y="206" width="22" height="14" rx="1" fill="none" stroke="' + hl + '" stroke-width=".7" opacity=".28"/>');
for (let k = 0; k < 6; k++){
A.push('<line x1="' + (132 + k * 14) + '" y1="196" x2="' + (132 + k * 14) + '" y2="190" stroke="' + hl + '" stroke-width=".7" opacity=".3"/>' +
'<line x1="' + (132 + k * 14) + '" y1="254" x2="' + (132 + k * 14) + '" y2="260" stroke="' + hl + '" stroke-width=".7" opacity=".3"/>');
}
A.push('<rect x="120" y="220" width="96" height="1.6" fill="' + hl + '" opacity=".55"/>' +
'<rect x="120" y="220" width="96" height="10" fill="' + hl + '" opacity=".07"/>');
[[18,18],[242,18],[18,322],[242,322]].forEach(function (c) {
A.push('<path d="M' + c[0] + ' ' + (c[1] + (c[1] < 170 ? 10 : -10)) + ' L' + c[0] + ' ' + c[1] + ' L' + (c[0] + (c[0] < 130 ? 10 : -10)) + ' ' + c[1] +
'" fill="none" stroke="' + hl + '" stroke-width=".9" opacity=".22"/>');
});
}
if (i === 4){
for (let row = 0; row < 11; row++){
const glitch = (row === 3 || row === 7) ? (r() * 16 - 8) : 0;
for (let col = 0; col < 10; col++){
const x = 14 + col * 24 + glitch, y = 26 + row * 26;
const o = .04 + r() * .12;
A.push('<rect x="' + x.toFixed(0) + '" y="' + y + '" width="17" height="17" rx="2" fill="' + hl + '" opacity="' + f2(o) + '"/>');
if (r() > .93) A.push('<rect x="' + x.toFixed(0) + '" y="' + y + '" width="17" height="17" rx="2" fill="none" stroke="' + hl + '" stroke-width=".8" opacity=".5"/>');
}
}
A.push('<path d="M-10 320 L270 30" stroke="' + hl + '" stroke-width=".9" opacity=".30"/>' +
'<path d="M-10 320 L270 30" stroke="' + hl + '" stroke-width="7" opacity=".05"/>' +
'<path d="M40 336 L250 96" stroke="' + hl + '" stroke-width=".6" opacity=".14" stroke-dasharray="3 9"/>');
for (let k = 0; k < 26; k++) A.push('<rect x="' + (r() * 252).toFixed(0) + '" y="' + (r() * 330).toFixed(0) + '" width="' + (2 + r() * 10).toFixed(0) + '" height="1.2" fill="' + hl + '" opacity="' + f2(.08 + r() * .2) + '"/>');
}
if (i === 5){
A.push('<circle cx="130" cy="150" r="104" fill="url(#b' + i + ')"/>' +
'<defs><radialGradient id="b' + i + '"><stop offset="0" stop-color="' + hl + '" stop-opacity=".24"/>' +
'<stop offset=".55" stop-color="' + hl + '" stop-opacity=".07"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>');
[{ n: 5, sc: 1, rot: -9, o: .30 }, { n: 5, sc: .74, rot: 29, o: .26 }, { n: 4, sc: .50, rot: 66, o: .22 }].forEach(function (L) {
for (let k = 0; k < L.n; k++){
const w = .80 + r() * .40;
const a = (L.rot + k * (360 / L.n) + (r() * 9 - 4.5)).toFixed(1);
const d = 'M0 0 C ' + (-31 * w).toFixed(1) + ' -18, ' + (-35 * w).toFixed(1) + ' -58, 0 -86 ' +
'C ' + (27 * w).toFixed(1) + ' -58, ' + (21 * w).toFixed(1) + ' -22, 0 0';
A.push('<path d="' + d + '" fill="none" stroke="' + hl + '" stroke-width=".9" opacity="' + L.o +
'" transform="translate(130 150) rotate(' + a + ') scale(' + L.sc + ')"/>');
}
});
for (let k = 0; k < 3; k++) A.push('<circle cx="130" cy="150" r="' + (7 + k * 5) + '" fill="none" stroke="' + hl + '" stroke-width=".7" opacity=".30"/>');
A.push('<path d="M130 150 L130 214" stroke="' + hl + '" stroke-width=".8" opacity=".22"/>' +
'<path d="M104 214 L156 214 L148 274 L112 274 Z" fill="none" stroke="' + hl + '" stroke-width=".8" opacity=".18"/>' +
'<line x1="112" y1="238" x2="148" y2="238" stroke="' + hl + '" stroke-width=".6" opacity=".10"/>');
for (let k = 0; k < 46; k++){
const a = r() * Math.PI * 2, rr = 24 + Math.pow(r(), .6) * 108;
A.push('<circle cx="' + (130 + Math.cos(a) * rr).toFixed(1) + '" cy="' + (150 + Math.sin(a) * rr * .96).toFixed(1) +
'" r="' + (.7 + r() * 1.1).toFixed(1) + '" fill="' + hl + '" opacity="' + f2(.10 + r() * .38) + '"/>');
}
}
if (i === 6){
line(0, 232, 260, 232, .20, .9);
for (let x = 0; x < 260; x += 22) line(x, 232, x, 238, .12, .7);
A.push('<ellipse cx="168" cy="196" rx="76" ry="22" fill="none" stroke="' + hl + '" stroke-width=".7" opacity=".22" stroke-dasharray="3 7" transform="rotate(-16 168 196)"/>' +
'<circle cx="168" cy="196" r="16" fill="url(#b' + i + ')"/>' +
'<circle cx="168" cy="196" r="3.2" fill="#fff" opacity=".9"/>' +
'<defs><radialGradient id="b' + i + '"><stop offset="0" stop-color="#fff" stop-opacity=".55"/>' +
'<stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>');
A.push('<path d="M18 292 C 66 244, 92 300, 146 252 S 214 240, 244 268" fill="none" stroke="' + hl + '" stroke-width="3" opacity=".10"/>' +
'<path d="M18 292 C 66 244, 92 300, 146 252 S 214 240, 244 268" fill="none" stroke="' + hl + '" stroke-width=".9" opacity=".34"/>');
A.push('<rect x="18" y="46" width="40" height="1.5" fill="' + hl + '" opacity=".2"/>' +
'<rect x="18" y="53" width="58" height="1.5" fill="' + hl + '" opacity=".12"/>');
}
A.push('<rect x="11.5" y="11.5" width="237" height="317" fill="none" stroke="' + hl + '" stroke-width=".7" opacity=".16"/>');
[[11.5, 11.5], [248.5, 11.5], [11.5, 328.5], [248.5, 328.5]].forEach(function (c, k) {
const sx = k % 2 ? -1 : 1, sy = k < 2 ? 1 : -1;
A.push('<line x1="' + c[0] + '" y1="' + c[1] + '" x2="' + (c[0] + sx * 9) + '" y2="' + c[1] + '" stroke="' + hl + '" stroke-width=".9" opacity=".4"/>' +
'<line x1="' + c[0] + '" y1="' + c[1] + '" x2="' + c[0] + '" y2="' + (c[1] + sy * 9) + '" stroke="' + hl + '" stroke-width=".9" opacity=".4"/>');
});
const shot = '<img class="art-img" src="assets/covers/' + ('0' + (i + 1)).slice(-2) + '.webp" alt="" decoding="async" onerror="this.remove()">';
return shot + '<svg viewBox="-16 -22 292 384" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + A.join('') + '</svg>';
}
const chapItems = [];
function projectVideo(vx, vy, w, h){
const vw = 1920, vh = 1080;
const k = Math.max(w / vw, h / vh);
const ox = (w - vw * k) / 2, oy = (h - vh * k) / 2;
return [(ox + vx * vw * k) / w, (oy + vy * vh * k) / h];
}
const chapNodeX = [];
let chapMode = 'scatter';
let chapIdx = 0;
stages.forEach((s, i) => {
const el = document.createElement('button');
el.className = 'chap-item';
el.dataset.i = String(i);
el.style.setProperty('--cc', CHAP_TINT[i][0]);
el.style.setProperty('--cc2', CHAP_TINT[i][1]);
el.innerHTML =
'<div class="cover"><div class="art">' + chapArt(i) + '</div></div>' +
'<div class="txt"><span class="no"><b>' + s[0] + '</b><i>' + s[8].replace(/^正文\s*/, '') + '</i></span><span class="ttl">' + s[1].split('：')[0] + '</span>' +
(i === 0 ? '<span class="play">▶ 进入序章场景</span>' : '') +
(i === 1 ? '<span class="play">▶ 进入番外场景</span>' : '') +
'<span class="ent">⚡ CH.' + s[0] + ' &gt; ENTER</span></div>' +
'<i class="nd" aria-hidden="true"></i><i class="ld" aria-hidden="true"></i>';
chapList.appendChild(el);
chapItems.push(el);
});
const HINTS = {
scatter: '点击任意章节 · 展开实体界面',
detail: '← → 换章 · 再次点击收成一横列',
row: '左右点选章节 · 点击展开'
};
function layoutChaps(){
if (!document.getElementById('stages')) return; /* 剧情屏已删：章节场没有宿主，直接空跑 */
const w = chapStage.clientWidth, h = chapStage.clientHeight;
const cx = w / 2, cy = h / 2;
const narrow = w <= 960;
const fit = Math.min(1, (w - 56) / 260, (h * 0.40) / 340);
chapItems.forEach((el, i) => {
let x = cx, y = cy, sc = 1, op = 1, z = 10, pe = 'auto', rot = 0;
if (chapMode === 'scatter'){
if (narrow){
const rowY = .132 + i * .108;
const ndX = w < 600 ? .62 : .74;
chapNodeX[i] = .18 + i * .12;
x = w * .075 + 130; y = h * rowY + 170;
sc = 1; op = 1; z = 10; pe = 'none';
const dx = (ndX - .075) * w, dy = 36;
el.style.setProperty('--ndx', dx.toFixed(1) + 'px');
el.style.setProperty('--ndy', dy.toFixed(1) + 'px');
const ttlEl = el.querySelector('.ttl');
const tw = Math.min(260, (ttlEl ? ttlEl.textContent.length : 4) * 26);
el.style.setProperty('--ldx', (tw + 12).toFixed(1) + 'px');
el.style.setProperty('--ldy', '36px');
el.style.setProperty('--ldw', Math.max(16, dx - tw - 26).toFixed(1) + 'px');
el.style.setProperty('--ldh', '1px');
} else {
const lb = CHAP_LABEL[i];
const nd = projectVideo(CHAP_NODE_VID[i][0], CHAP_NODE_VID[i][1], w, h);
chapNodeX[i] = nd[0];
x = w * lb[0] + 130; y = h * lb[1] + 170;
sc = 1; op = 1; z = 10 + i;
pe = 'none';
const dx = (nd[0] - lb[0]) * w, dy = (nd[1] - lb[1]) * h;
el.style.setProperty('--ndx', dx.toFixed(1) + 'px');
el.style.setProperty('--ndy', dy.toFixed(1) + 'px');
const adx = Math.abs(dx), ady = Math.abs(dy);
const ttlEl = el.querySelector('.ttl');
const tw = Math.min(320, (ttlEl ? ttlEl.textContent.length : 4) * 37);
let lx, ly, lw, lh;
if (adx > ady){
lh = 1;
if (dx > 0){ lx = tw + 14; lw = Math.max(10, adx - tw - 22); }
else { lx = dx + 8; lw = Math.max(10, adx - 8); }
ly = dy;
} else {
lw = 1; lh = Math.max(14, ady - 104);
lx = dx; ly = dy > 0 ? dy - lh : dy;
}
el.style.setProperty('--ldx', lx.toFixed(1) + 'px');
el.style.setProperty('--ldy', ly.toFixed(1) + 'px');
el.style.setProperty('--ldw', lw.toFixed(1) + 'px');
el.style.setProperty('--ldh', lh.toFixed(1) + 'px');
}
} else if (chapMode === 'row'){
const d = i - chapIdx;
x = cx + d * (narrow ? 268 : 292) + rowShiftPx; y = cy;
sc = (narrow ? .92 : 1) - Math.min(.16, Math.abs(d) * 0.05);
op = Math.abs(d) > 2 ? 0.18 : 1;
z = 20 - Math.abs(d);
} else if (narrow){
const on = i === chapIdx;
x = cx; y = h * 0.30;
sc = on ? fit : fit * 0.84;
op = on ? 1 : 0;
z = on ? 50 : 40;
pe = on ? 'auto' : 'none';
} else {
const on = i === chapIdx;
x = cx + 92; y = on ? cy - 6 : cy;
sc = on ? 1.62 : 1.3;
op = on ? 1 : 0;
z = on ? 50 : 40;
pe = on ? 'auto' : 'none';
}
el.style.transform = 'translate(' + (x - cx).toFixed(1) + 'px,' + (y - cy).toFixed(1) + 'px) scale(' + sc.toFixed(3) + ')' +
(rot ? ' rotate(' + rot + 'deg)' : '');
el.style.opacity = String(op);
el.style.zIndex = String(z);
el.style.pointerEvents = pe;
el.setAttribute('aria-current', String(i === chapIdx && chapMode !== 'scatter'));
el.classList.toggle('is-on', i === chapIdx);
});
chapStage.dataset.mode = chapMode;
chapList.querySelectorAll('.play').forEach(function (p) { p.style.display = chapMode === 'detail' ? 'none' : ''; });
chapHint.textContent = HINTS[chapMode];
const s = stages[chapIdx];
chapCoord.textContent = 'CH.' + s[0] + '  /  ' + s[7].toUpperCase();
$('#sidePages').textContent = s[8] + '  ·  ' + s[7];
$('#sideTitle').textContent = s[1];
$('#sideBody').textContent = s[2];
$('#sideTags').innerHTML = '<i>' + s[3] + '</i><i>' + s[4] + '</i><i>' + s[5] + '</i>';
setStatus(s[3], s[4]);
if (window.__dlgSync) window.__dlgSync();
syncArsenalEntry(chapIdx);
if (window.__chapMarks) window.__chapMarks();
if (window.__chapBolt) window.__chapBolt.sync(chapIdx);
}
function arsenalHref(){
return /\/src\/index\.html$/.test(location.pathname) ? '../dist/arsenal.html' : 'arsenal.html';
}
function labBase(){
var p = location.pathname;
if (/\/scene-lab\//.test(p) || /\/lab\//.test(p)) return '';
if (/\/src\/index\.html$/.test(p)) return '../lab/';
return 'lab/';
}
(function(){
var da = document.getElementById('destArena');
if (da) da.href = labBase() + 'arena.html';
Array.prototype.forEach.call(
document.querySelectorAll('#arenaPills a[data-lab], #labEntries a[data-lab]'),
function (el) { el.href = labBase() + el.getAttribute('data-lab'); }
);
})();
function entryHref(){
var b = '';
try { b = localStorage.getItem('bl.branch') || ''; } catch (e) {}
return labBase() + (b ? ('showcase.html?b=' + b) : 'quiz.html');
}
function syncArsenalEntry(i){
var host = $('#sideTags');
if (!host || !host.parentNode) return;
var a = document.getElementById('arsenalEntry');
if (!a){
a = document.createElement('a');
a.id = 'arsenalEntry';
a.className = 'arsenal-entry';
a.href = entryHref();
a.innerHTML = '<b>进入武器试验场</b><span>装配 · 蓄力试射 · V 切视角</span><em aria-hidden="true">→</em>';
host.parentNode.insertBefore(a, host.nextSibling);
}
a.hidden = true;
}
addEventListener('keydown', e => {
if (!$('#stages').classList.contains('on')) return;
const dlg = $('#dlg');
if (dlg && !dlg.hidden) return;
if (e.key === 'Escape'){ setChapMode('scatter'); return; }
if (chapMode !== 'row' && chapMode !== 'detail') return;
if (e.key === 'ArrowRight'){ chapIdx = Math.min(6, chapIdx + 1); layoutChaps(); e.preventDefault(); }
else if (e.key === 'ArrowLeft'){ chapIdx = Math.max(0, chapIdx - 1); layoutChaps(); e.preventDefault(); }
});
let rowShiftPx = 0, chapDragging = false, chapStartX = 0, chapMoved = 0, chapSuppressAt = 0;
const chapStep = () => (chapStage.clientWidth <= 960 ? 268 : 292); /* 同上：与 @media(max-width:960px) 对齐 */
chapStage.addEventListener('pointerdown', e => {
if (chapMode !== 'row') return;
chapDragging = true; chapStartX = e.clientX; chapMoved = 0; rowShiftPx = 0;
chapItems.forEach(el => { el.style.transition = 'none'; });
});
addEventListener('pointermove', e => {
if (!chapDragging) return;
const dx = e.clientX - chapStartX;
chapMoved = Math.max(chapMoved, Math.abs(dx));
const lo = -chapIdx * chapStep();
const hi = (6 - chapIdx) * chapStep();
rowShiftPx = Math.max(Math.min(lo, 0), Math.min(Math.max(hi, 0), dx));
layoutChaps();
});
function chapEndDrag(){
if (!chapDragging) return;
chapDragging = false;
chapItems.forEach(el => { el.style.transition = ''; });
const step = Math.max(-2, Math.min(2, Math.round(-rowShiftPx / chapStep())));
rowShiftPx = 0;
chapSuppressAt = chapMoved > 7 ? performance.now() : 0;
if (step !== 0) chapIdx = Math.max(0, Math.min(6, chapIdx + step));
layoutChaps();
}
addEventListener('pointerup', chapEndDrag);
addEventListener('pointercancel', chapEndDrag);
addEventListener('resize', layoutChaps);
layoutChaps();
requestAnimationFrame(layoutChaps);
addEventListener('load', () => requestAnimationFrame(layoutChaps));
(function bookmark(){
const btn = document.getElementById('markBtn');
const modal = document.getElementById('markModal');
if (!btn || !modal) return;
const QUOTE = '在打开之前，它既在也不在。在你抬头看它的那一刻，它只留下一种样子。';
const ROSE_B64 = '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nGlcwrSuVoiiVpfVxaN7e1BPUsHbSFZjYaHQbVavYbNgVURwsK608LSLjmV1SndyortIe6PRLrfGi0yQ+q6mWXBUcJb8SZvRKqtKiYa6r6fCK5pgkGVcnpuBpbgEP3B+7bSEjk2MO5ZfVL1mXk2KIK0rbK4ya0hoN7qYclKbn02KXonSq3mEtqioOXxwspSKNKkVmo58ocDxWb1gSsXmmklqULEfibgf6rR+iFCjSaLlV686anvFKa1YX3zPX0KHL49ifZPMvJCaOYZ3ML+IipUyPqBUhLYiYWxjipzAbKsvOKC6KqB5uKWOR8Tejp4zvbvJMJB5bmOnpllqR1dlpcDzpbolVp52L4dvvJRXqoqgdnRcR3/AgKXTS5iw/q2bjrXdmWVQlKDgMKRLKaiEt7DARo/H6rSEuWKWVcPgU6DuP3V1cHREn26hXlJttYW8uZ2sbFGXb1lHkF97r620SWmtjGtwsIywrmiGSbAWflJRU06qQ4eQqWWSeVy3Jq5TYVFPkECZQrIliHJTu21wdJ1gjaDhPXiBmkxn06ZxTWZ6W3VbObTMIqqLjUd6RK8tY11pRniNWW6cVmy4ZpT9b12fuKadDLuwfHRj5bWmfFqpg6nVNKVarWmat7c4UU+MWkODtK6yWlCSW6Po7bSBkEtohWpqRFhsXVBiflZlhZqyaJViWqrSiU2JILA0VbpkckBvCrq/v4liRWF7QGJ+KaGhSFFvbkdhrna76LSA6bWMYKg9wbFXqK02Z73XroeIK7C5va6lcKglpL2IQKyqOW+FhEVvs5mVc5/zX68fa0qqbYnKIK4u4rN3oo/Bd1yqxaW1prtJnEtshHeyV0eHvaZXFa5YqJvCjE6RVcFhNIB/LZOTUMTiTFdxSsXjXa82pUqcfYRLsnq6dkRadmRJr4zFmVmKm4uuJqQYuIOYSldeblLColB5n6h82K2dj2e6V71hZWhO87GmK5l/PHFehlpKJ68ocUqkYXmniZrOoG98MLIsnly5VIJRZUlkgVxYXnpJaHSjZz+bRqswTrfLbEd3Poqbg0OVlLwNmYechInIdHK/M4KEhZTMN42FglZd7cBdQJJEUUd2psDtrW+To3aGArTKSpbOrmBlG7zHk5JPXoHQLKRuu4t4RqKuMJpUY5f7O26A87KlY2KgWmNkMMKYErnQZX9ENaVCjKIxeawrwZyzmJY6uMDqjHuaprIwl0aVUYhtS5lOiKLwE65ZaESbQXyvm2a5WF29WX1ml12/97GWjD9rWIyEt6+xuX1wXaQqLqQSckmlikekbWW8nnunebEoUYfLens/mIGdMalYTp/XnFKjm2ZzeEZzVI5nVHFUuYFdMaxRaGfKVGSNNriVmj2Sj0+tsKs/XmNUQoqPe0mivpuN0bxXoEabeKq5qKljX2N/U2OyM5+RwZuBsJCVkKHkpJRpLa0hh1lOW3Y+VaxxW3iikZ2qTkt/k73ntH+QpLuHVW7EYEqW7sBbiaDRMqdZIqwlKp2cSqCzNqkUhHWxoHXFYVBqrafEuWWaI6NrWUWdf7sbJLE/TV+rmKeT+LGVtYi1LJSGgrnCgY5JqWS1gZxTuqmYUkeGlLnhnUxvLbIw4LSmaLIqUUyHVKPljapPlFm+gVOeP4ic1a6oWFp8lKxOtL/ePppCsI+OTKLmOIpyo7OHfVNtRLvFp459iXtb5rWYUkuIkZKX06OUZVN7tbC0cqouy498Q6LZv7JUXEWLK4x7z6utkXVXqrvbPrKbOYqJk7wLK7rMUcTj/ayid0pYg2mlSJ7TqHFXbHZdjkSUn1Zqro9aSrfIzaNnVMLfh2CqP6agQsDLXUyRNqgRfYPGK5WNVphIorZMtZivZT50WXlRiEqInKONYWN2wrVT9rCoKpthsoC0cY6uY1aojYo2iXuxQ22OhFJgxI6mMXqDm6yPd0VnopDG3LB1h5K+JKiCL6GFUJRNLpCXmG+YmlewQWNhXUWhqWWglYVOxXyNa3BTn2/DvKyfunNqF69h7bSIn2m43rFyuaFUxKqNbk2WgqAxqJt2RlaCaI2op7JV8bSLjHbPEq5ZZWKhoLcnkmWbi2CsyLC+rZ5Sn7wcz6ByQHiQta+zebAoZ6/NYZf6n1tbhkJ5YJ/xMqpUo7YAK64jlUalY4xAbpX+jVKwtWdpabzWI6+rc531arIps4W+zZ1vQ56TnU9oVKdISq7PuL7ybkGZnkdwKKZXmVGnhkp7hE2jV1a4dD1mRsXlYj57ikmOU6Lp4bOQgDuhhmCYY0ONLp6qoLd7mWBzMrIvgbwXqZLCspaXs466ILvQtrBPcURso2R5oZhhTpBQ5MBcM4N/z7C387OWWKVqnJqKtXuvQbGxKqZ8v7KsY2BdQ1+cXLAzgnzEkmRJq3lXcqe1grG9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';
let roseCache = null;
function roseCloud(){
if (roseCache) return roseCache;
const bin = atob(ROSE_B64);
const n = (bin.length / 3) | 0;
const xs = new Float32Array(n), ys = new Float32Array(n), zs = new Float32Array(n);
for (let i = 0; i < n; i++){
const j = i * 3;
xs[i] = (bin.charCodeAt(j) / 255) * 2 - 1;
ys[i] = (bin.charCodeAt(j + 1) / 255) * 2 - 1;
zs[i] = (bin.charCodeAt(j + 2) / 255) * 2 - 1;
}
roseCache = { n: n, xs: xs, ys: ys, zs: zs };
return roseCache;
}
const SERIF = '"Noto Serif SC","Source Han Serif SC","Songti SC","STSong","SimSun",serif';
const SANS  = '"Noto Sans SC","Source Han Sans SC","PingFang SC","Microsoft YaHei",sans-serif';
const MONO  = 'ui-monospace,"SF Mono",Consolas,monospace';
const INK   = [233, 238, 250];
const DIM   = [150, 163, 190];
const AMBER = [255, 196, 109];
function rgba(c, a){ return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
function tracked(g, text, x, y, track, align){
const chars = Array.from(text);
let w = 0;
for (const ch of chars) w += g.measureText(ch).width + track;
w -= chars.length ? track : 0;
let cx = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
for (const ch of chars){
g.fillText(ch, cx, y);
cx += g.measureText(ch).width + track;
}
return w;
}
let grainTile = null;
function grain(g, W, H, alpha){
if (!grainTile){
const t = document.createElement('canvas');
t.width = t.height = 96;
const tg = t.getContext('2d');
const img = tg.createImageData(96, 96);
for (let i = 0; i < img.data.length; i += 4){
const v = 190 + Math.random() * 65;
img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
img.data[i + 3] = Math.random() * 210;
}
tg.putImageData(img, 0, 0);
grainTile = t;
}
g.save();
g.globalAlpha = alpha;
g.fillStyle = g.createPattern(grainTile, 'repeat');
g.fillRect(0, 0, W, H);
g.restore();
}
const ROSE_VIEW = { spin: 0.62 };
const PALETTES = {
cold: { name: '冷蓝紫', deep: [226, 58, 22], mid: [250, 66, 50], tip: [270, 78, 66], core: [318, 92, 74], spark: [212, 92, 72] },
warm: { name: '暖粉金', deep: [298, 42, 26], mid: [330, 62, 54], tip: [22, 82, 70], core: [42, 96, 78], spark: [332, 88, 76] },
pale: { name: '苍白',   deep: [206, 26, 30], mid: [198, 34, 60], tip: [192, 24, 84], core: [0, 0, 96], spark: [196, 40, 88] },
amber: { name: '琥珀',  deep: [26, 52, 24], mid: [34, 74, 52], tip: [46, 88, 70], core: [16, 86, 72], spark: [40, 90, 74] }
};
function palHSL(c, dh, sMul, lAdd){
return 'hsl(' + (((c[0] + dh) % 360) + 360) % 360 + ',' +
Math.max(0, Math.min(100, Math.round(c[1] * sMul))) + '%,' +
Math.max(0, Math.min(100, Math.round(c[2] + lAdd))) + '%)';
}
function palHSLA(c, dh, sMul, lAdd, a){
return 'hsla(' + (((c[0] + dh) % 360) + 360) % 360 + ',' +
Math.max(0, Math.min(100, Math.round(c[1] * sMul))) + '%,' +
Math.max(0, Math.min(100, Math.round(c[2] + lAdd))) + '%,' + a + ')';
}
function rosePalette(seed){
const RM = (typeof window !== 'undefined' && window.__roseM) ? window.__roseM : {};
const ph = RM.phase || 'idle';
const gone = Math.max(0, Math.min(1, RM.gone || 0));
let key = 'cold';
if (gone > 0.35) key = 'pale';
else if (ph === 'gaze') key = 'warm';
const base = PALETTES[key];
const t = (seed === undefined ? Date.now() : seed) % 1000;
const spin = ((t / 1000) * 2 - 1) * 9;          /* ±9° 色相偏移：每张都不一样 */
return { p: base, dh: spin, key: key };
}
function roseArt(g, cx, cy, R, opt){
const o = opt || {};
const pal = o.pal || rosePalette();
const P0 = pal.p, DH = pal.dh;
const spin = o.spin === undefined ? ROSE_VIEW.spin + (DH / 90) : o.spin;
const RM = (typeof window !== 'undefined' && window.__roseM) ? window.__roseM : {};
const gk = Math.max(0, Math.min(1, RM.gone || 0));
const fade = 1 - gk * 0.8;
const dot = (x, y, r, col) => { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = col; g.fill(); };
const under = g.createRadialGradient(cx, cy, 0, cx, cy, R * 1.05);
under.addColorStop(0, palHSLA(P0.mid, DH, 1, 4, (0.22 * fade).toFixed(3)));
under.addColorStop(0.55, palHSLA(P0.deep, DH, 1, 6, (0.10 * fade).toFixed(3)));
under.addColorStop(1, palHSLA(P0.deep, DH, 0.9, 0, '0'));
g.fillStyle = under;
g.fillRect(cx - R * 1.1, cy - R * 1.1, R * 2.2, R * 2.2);
const PET = 12;
g.save();
g.globalAlpha = 0.94;
for (let i = 0; i < PET; i++){
if (i % 5 !== 0 || i > 10) continue;
const jit = i * 12.9898 + spin * 7.77;
const rnd = Math.abs(Math.sin(jit) * 43758.5453) % 1;
const next = Math.abs(Math.sin(jit * 3.1) * 55123.7) % 1;
const angB = spin + i * 2.39996 + (rnd - 0.5) * 0.16 + (next - 0.5) * 0.5;
const rrB = R * (1.02 + 0.06 * next) * (1 - 0.02 * i);
const wB = rrB * 0.58;
g.save();
g.translate(cx, cy);
g.rotate(angB);
g.shadowColor = 'rgba(3,5,14,.5)';
g.shadowBlur = R * 0.05;
const bg2 = g.createLinearGradient(0, 0, 0, -rrB);
bg2.addColorStop(0, palHSLA(P0.deep, DH, 1, -6, (0.44 * fade).toFixed(3)));
bg2.addColorStop(0.7, palHSLA(P0.deep, DH, 1, 2, (0.34 * fade).toFixed(3)));
bg2.addColorStop(1, palHSLA(P0.mid, DH, 1, 10, (0.24 * fade).toFixed(3)));
g.beginPath();
g.moveTo(0, 0);
g.bezierCurveTo(-wB * 1.10, -rrB * 0.22, -wB * 0.66, -rrB * 1.02, 0, -rrB);
g.bezierCurveTo(wB * 0.66, -rrB * 1.02, wB * 1.10, -rrB * 0.22, 0, 0);
g.closePath();
g.fillStyle = bg2;
g.fill();
g.restore();
}
for (let i = 0; i < PET; i++){
const t = i / (PET - 1);
const jit = i * 12.9898 + spin * 7.77;
const rnd = Math.abs(Math.sin(jit) * 43758.5453) % 1;
const rnd2 = Math.abs(Math.sin(jit * 1.7) * 23421.63) % 1;
const ang = spin + i * 2.39996 + (rnd - 0.5) * 0.16;
const rr = R * (0.34 + 0.66 * (1 - Math.pow(t, 1.55))) * (0.96 + 0.08 * rnd2);
const w = rr * (0.80 - 0.12 * t) * (0.92 + 0.16 * rnd);
g.save();
g.translate(cx, cy);
g.rotate(ang);
g.shadowColor = 'rgba(3,5,14,.65)';
g.shadowBlur = R * 0.055;
g.shadowOffsetY = R * 0.012;
const grad = g.createLinearGradient(0, 0, 0, -rr);
grad.addColorStop(0, palHSLA(P0.deep, DH, 1, -4 + 8 * t, ((0.62 + 0.20 * t) * fade).toFixed(3)));
grad.addColorStop(0.62, palHSLA(P0.mid, DH, 1, 2 + 10 * t, ((0.58 + 0.24 * t) * fade).toFixed(3)));
grad.addColorStop(1, palHSLA(P0.tip, DH, 1, 4 * t, ((0.42 + 0.26 * t) * fade).toFixed(3)));
g.beginPath();
g.moveTo(0, 0);
g.bezierCurveTo(-w * 1.02, -rr * 0.26, -w * 0.60, -rr * 0.96, 0, -rr);
g.bezierCurveTo(w * 0.60, -rr * 0.96, w * 1.02, -rr * 0.26, 0, 0);
g.closePath();
g.fillStyle = grad;
g.fill();
g.shadowColor = 'transparent';
g.shadowBlur = 0;
g.shadowOffsetY = 0;
g.strokeStyle = palHSLA(P0.tip, DH, 0.9, 14, ((0.10 + 0.14 * t) * fade).toFixed(3));
g.lineWidth = 1.2;
g.beginPath();
g.moveTo(0, -rr * 0.06);
g.quadraticCurveTo(w * 0.10, -rr * 0.6, 0, -rr * 0.94);
g.stroke();
g.globalCompositeOperation = 'lighter';
const N = 34;
for (let k = 0; k <= N; k++){
const u = k / N;
const a2 = Math.PI * u;
const px = Math.cos(a2) * w * (1.02 - 0.42 * Math.sin(a2));
const py = -rr * Math.sin(a2 * 0.88);
dot(px, py, 0.8 + Math.random() * 1.1,
palHSLA(P0.spark, DH + Math.random() * 14, 1, 12 + 10 * Math.random(), ((0.24 + 0.22 * t) * fade).toFixed(3)));
}
g.globalCompositeOperation = 'source-over';
g.restore();
}
g.restore();
{
const cloud = roseCloud();
const cs = Math.cos(spin * 0.3), sn = Math.sin(spin * 0.3);
const tilt = 1.26, ct = Math.cos(tilt), st = Math.sin(tilt);
g.save();
g.globalCompositeOperation = 'lighter';
g.shadowBlur = R * 0.03;
g.shadowColor = palHSLA(P0.spark, DH, 1, 0, '.35');
for (let i = 0; i < cloud.n; i++){
const x0 = cloud.xs[i], y0 = cloud.ys[i], z0 = cloud.zs[i];
const x1 = x0 * cs + z0 * sn;
const z1 = -x0 * sn + z0 * cs;
const y2 = y0 * ct - z1 * st;
const d2 = y0 * st + z1 * ct;
const persp = 1 / (1.58 - d2 * 0.44);
const depth = (d2 + 1) / 2;
const rad = Math.hypot(x1, y2);
if (rad > 1.02) continue;
const warm = Math.max(0, 1 - rad / 0.55) * (0.35 + 0.65 * depth);
const jx = (Math.random() - 0.5) * 0.02, jy = (Math.random() - 0.5) * 0.02;
dot(cx + (x1 + jx) * R * 1.24 * persp, cy + (y2 + jy) * R * 1.24 * persp * 0.99,
0.55 + Math.random() * 1.05 + 0.5 * depth,
palHSLA(warm > 0.35 ? P0.core : P0.spark, DH, 1, 10 + 12 * warm,
((0.03 + 0.10 * depth) * (0.8 + 0.5 * warm) * fade).toFixed(3)));
}
g.restore();
}
const core = g.createRadialGradient(cx, cy, 0, cx, cy, R * 0.26);
core.addColorStop(0, palHSLA(P0.core, DH, 1, 8, (0.55 * fade).toFixed(3)));
core.addColorStop(0.4, palHSLA(P0.core, DH, 1, -6, (0.26 * fade).toFixed(3)));
core.addColorStop(1, palHSLA(P0.mid, DH, 1, 0, '0'));
g.fillStyle = core;
g.fillRect(cx - R * 0.35, cy - R * 0.35, R * 0.7, R * 0.7);
g.save();
g.globalCompositeOperation = 'lighter';
for (let i = 0; i < 300; i++){
const t = i / 300;
const ang2 = spin * 2.1 + t * Math.PI * 9.4;
const r = R * (0.012 + 0.19 * t);
dot(cx + Math.cos(ang2) * r, cy + Math.sin(ang2) * r * 0.96, 0.5 + Math.random() * 0.9,
palHSLA(P0.core, DH + Math.round(Math.random() * 20) - 8, 1, 12,
((0.12 + 0.18 * (1 - t)) * fade).toFixed(3)));
}
for (let i = 0; i < 260; i++){
const ang2 = Math.random() * Math.PI * 2;
const rad = R * (0.12 + 0.86 * Math.pow(Math.random(), 0.55));
const inner = 1 - rad / R;
dot(cx + Math.cos(ang2) * rad, cy + Math.sin(ang2) * rad * 0.97, 0.6 + Math.random() * 1.3,
palHSLA(P0.spark, DH + Math.random() * 16, 1, 6 + 16 * inner,
((0.05 + 0.14 * inner) * fade).toFixed(3)));
}
g.restore();
}
window.__markGrid = function (){
const c = document.createElement('canvas');
c.width = 820; c.height = 820;
const g = c.getContext('2d');
g.fillStyle = '#080a12'; g.fillRect(0, 0, 820, 820);
const keys = ['cold', 'warm', 'pale', 'amber'];
keys.forEach(function (k, i){
roseArt(g, 215 + (i % 2) * 400, 215 + Math.floor(i / 2) * 400, 150, { pal: { p: PALETTES[k], dh: 0, key: k } });
g.fillStyle = 'rgba(200,214,238,.75)';
g.font = '12px ui-monospace,monospace';
g.fillText(PALETTES[k].name, 60 + (i % 2) * 400, 380 + Math.floor(i / 2) * 400);
});
return c.toDataURL('image/png');
};
let CAP = null, GLHooked = null;
function hookRoseGL(){
const cv = document.getElementById('gl');
if (!cv) return null;
let gl = null;
try { gl = cv.getContext('webgl') || cv.getContext('experimental-webgl'); } catch (e) { gl = null; }
if (!gl) return null;
if (GLHooked === gl) return gl;
GLHooked = gl;
const wrap = function (name){
const orig = gl[name];
if (typeof orig !== 'function') return;
gl[name] = function (){
const r = orig.apply(gl, arguments);
const cap = CAP;
if (cap && !cap.done){ cap.done = true; try { cap.read(); } catch (e) { cap.fail(); } }
return r;
};
};
wrap('drawArrays');
wrap('drawElements');
if (!gl.__capPatched){ gl.__capPatched = true; }
return gl;
}
function grabRose(){
return new Promise(function (resolve){
const cv = document.getElementById('gl');
const gl = hookRoseGL();
if (!cv || !gl) return resolve(null);
const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
if (!w || !h) return resolve(null);
const buf = new Uint8Array(w * h * 4);
let settled = false;
const timer = setTimeout(function (){ finish(false); }, 900);
function finish(ok){
if (settled) return;
settled = true;
clearTimeout(timer);
CAP = null;
if (!ok) return resolve(null);
const c = document.createElement('canvas');
c.width = w; c.height = h;
const g2 = c.getContext('2d');
const img = g2.createImageData(w, h);
let minX = w, minY = h, maxX = -1, maxY = -1;
for (let yy = 0; yy < h; yy++){
const src = (h - 1 - yy) * w * 4, dst = yy * w * 4;
img.data.set(buf.subarray(src, src + w * 4), dst);
}
for (let yy = 0; yy < h; yy += 2){
for (let xx = 0; xx < w; xx += 2){
const o = (yy * w + xx) * 4;
const lum = img.data[o] + img.data[o + 1] + img.data[o + 2];
if (lum > 26){
if (xx < minX) minX = xx;
if (xx > maxX) maxX = xx;
if (yy < minY) minY = yy;
if (yy > maxY) maxY = yy;
}
}
}
g2.putImageData(img, 0, 0);
if (maxX < 0 || maxY < 0) return resolve(null);
const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.04);
resolve({
canvas: c,
bbox: {
x: Math.max(0, minX - pad),
y: Math.max(0, minY - pad),
w: Math.min(w, maxX - minX + pad * 2),
h: Math.min(h, maxY - minY + pad * 2)
}
});
}
CAP = {
done: false,
read: function (){
gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buf);
finish(true);
},
fail: function (){ finish(false); }
};
});
}
function drawShot(g, shot, cx, cy, R){
const bb = shot.bbox;
const size = R * 2.06;
const S = 2;
const tmp = document.createElement('canvas');
tmp.width = Math.round(size * S); tmp.height = Math.round(size * S);
const tg = tmp.getContext('2d');
const k = Math.min(tmp.width / bb.w, tmp.height / bb.h);
const dw = bb.w * k, dh = bb.h * k;
tg.drawImage(shot.canvas, bb.x, bb.y, bb.w, bb.h,
(tmp.width - dw) / 2, (tmp.height - dh) / 2, dw, dh);
tg.globalCompositeOperation = 'destination-in';
const mask = tg.createRadialGradient(tmp.width / 2, tmp.height / 2, tmp.width * 0.26,
tmp.width / 2, tmp.height / 2, tmp.width * 0.50);
mask.addColorStop(0, 'rgba(0,0,0,1)');
mask.addColorStop(0.72, 'rgba(0,0,0,.92)');
mask.addColorStop(1, 'rgba(0,0,0,0)');
tg.fillStyle = mask;
tg.fillRect(0, 0, tmp.width, tmp.height);
g.save();
g.globalCompositeOperation = 'lighter';
g.filter = 'blur(' + Math.round(R * 0.20) + 'px)';
g.globalAlpha = 0.42;
g.drawImage(tmp, cx - size / 2, cy - size / 2, size, size);
g.filter = 'none';
g.globalAlpha = 0.96;
g.drawImage(tmp, cx - size / 2, cy - size / 2, size, size);
g.restore();
}
function draw(shot){
const W = 720, H = 1010, DPR = 2, M = 88;
const c = document.createElement('canvas');
c.width = W * DPR; c.height = H * DPR;
const g = c.getContext('2d');
g.scale(DPR, DPR);
g.textBaseline = 'alphabetic';
const base = g.createLinearGradient(0, 0, 0, H);
base.addColorStop(0, '#06070c');
base.addColorStop(0.55, '#080a12');
base.addColorStop(1, '#05060a');
g.fillStyle = base; g.fillRect(0, 0, W, H);
const mx = W * 0.64, my = H * 0.735;
const bg = g.createRadialGradient(mx, my, 0, mx, my, W * 0.86);
bg.addColorStop(0, 'rgba(96,124,232,.20)');
bg.addColorStop(0.42, 'rgba(64,84,180,.09)');
bg.addColorStop(1, 'rgba(5,6,10,0)');
g.fillStyle = bg; g.fillRect(0, 0, W, H);
g.save();
g.translate(36, 470);
g.rotate(-Math.PI / 2);
g.fillStyle = rgba(DIM, .78);
g.font = '10px ' + MONO;
tracked(g, '球形发光体 · 粒子之间', 0, 0, 3.2, 'left');
g.restore();
g.textAlign = 'left';
g.fillStyle = rgba(AMBER, .88);
g.font = '600 11px ' + MONO;
tracked(g, '05', W - M - 132, 100, 1.4, 'left');
g.fillStyle = rgba(DIM, .62);
g.font = '9px ' + MONO;
tracked(g, 'THE UNOBSERVABLE ROSE', W - M - 104, 100, 1.5, 'left');
g.fillStyle = rgba(DIM, .30);
g.fillRect(W - M - 148, 60, 1, 52);
g.fillStyle = rgba(INK, .97);
g.font = '600 86px ' + SERIF;
tracked(g, '球形发光体', M, 238, 2, 'left');
g.fillStyle = rgba(AMBER, .9);
g.fillRect(M, 264, 58, 2);
g.fillStyle = rgba(INK, .74);
g.font = '300 14px ' + SANS;
tracked(g, '粒子之间', M + 2, 306, 8.4, 'left');
g.fillStyle = rgba(AMBER, .55);
g.fillRect(M - 22, 364, 3, 62);
const quote = '在打开之前，它既在也不在。在你抬头看它的那一刻，它只留下一种样子。';
g.fillStyle = rgba(INK, .86);
g.font = '300 19px ' + SERIF;
const maxW = 486, lh = 37;
const NO_START = '，。、；：？！）」』】〉》·…—';
let y = 390, line = '';
const lines = [];
for (const ch of quote){
if (g.measureText(line + ch).width > maxW && line && NO_START.indexOf(ch) < 0){
lines.push(line); line = ch;
} else line += ch;
}
if (line) lines.push(line);
for (let i = 0; i < lines.length; i++){
g.fillText(lines[i], M, y + i * lh);
}
y += (lines.length - 1) * lh;
g.fillStyle = rgba(DIM, .40);
g.fillRect(M, y + 46, 26, 1);
g.fillStyle = rgba(DIM, .74);
g.font = '10px ' + MONO;
tracked(g, '球形发光体尾声 · 记录者', M + 38, y + 50, 1.6, 'left');
const RCX = 452, RCY = 722, RR = 184;
const RMs = (typeof window !== 'undefined' && window.__roseM) ? window.__roseM : {};
const gk = Math.max(0, Math.min(1, RMs.gone || 0));
const rPhase = RMs.phase || 'idle';
const ground = g.createRadialGradient(RCX, RCY + 104, 0, RCX, RCY + 104, RR * 1.5);
ground.addColorStop(0, 'rgba(120,150,255,.16)');
ground.addColorStop(1, 'rgba(120,150,255,0)');
g.save();
g.translate(RCX, RCY + 104);
g.scale(1, 0.32);
g.translate(-RCX, -(RCY + 104));
g.fillStyle = ground;
g.fillRect(RCX - RR * 1.6, RCY + 104 - RR * 1.6, RR * 3.2, RR * 3.2);
g.restore();
const halo = g.createRadialGradient(RCX, RCY, 0, RCX, RCY, RR * 1.75);
halo.addColorStop(0, 'rgba(150,165,255,.22)');
halo.addColorStop(0.45, 'rgba(110,140,240,.09)');
halo.addColorStop(1, 'rgba(120,150,255,0)');
g.fillStyle = halo;
g.fillRect(RCX - RR * 1.9, RCY - RR * 1.9, RR * 3.8, RR * 3.8);
if (shot) drawShot(g, shot, RCX, RCY, RR); else roseArt(g, RCX, RCY, RR);
g.fillStyle = rgba(DIM, .55);
g.font = '9px ' + MONO;
tracked(g, 'OBSERVATION', M, 716, 2.2, 'left');
g.fillStyle = rgba(INK, .52);
g.font = '300 13px ' + SERIF;
g.fillText('注意力转开时出现，', M, 744);
g.fillText('被测量时消失。', M, 768);
g.fillStyle = rgba([255, 255, 255], .10);
g.fillRect(M, H - 92, W - M * 2, 1);
g.fillStyle = rgba(DIM, .62);
g.font = '9px ' + MONO;
tracked(g, 'SCIENCE × FICTION · 2026', M, H - 64, 1.7, 'left');
tracked(g, 'BL · 05', W - M, H - 64, 1.7, 'right');
const dNow = new Date();
const dStr = dNow.getFullYear() + '.' + String(dNow.getMonth() + 1).padStart(2, '0') + '.' + String(dNow.getDate()).padStart(2, '0');
const stWord = gk > 0.05 ? '坍缩中' : (rPhase === 'gaze' ? '被凝视' : '静息');
g.fillStyle = rgba(DIM, .50);
g.font = '9px ' + MONO;
tracked(g, dStr + '  ·  ' + stWord, W - M, H - 42, 1.7, 'right');
grain(g, W, H, 0.055);
const vg = g.createRadialGradient(W / 2, H * 0.46, H * 0.22, W / 2, H * 0.46, H * 0.86);
vg.addColorStop(0, 'rgba(0,0,0,0)');
vg.addColorStop(1, 'rgba(0,0,0,.55)');
g.fillStyle = vg; g.fillRect(0, 0, W, H);
return c.toDataURL('image/png');
}
function drawBack(){
const BW = 591, BH = 1772;
const b = document.createElement('canvas');
b.width = BW; b.height = BH;
const g = b.getContext('2d');
g.fillStyle = '#f4efe4';
g.fillRect(0, 0, BW, BH);
for (let i = 0; i < 2600; i++){
const x = Math.random() * BW, y = Math.random() * BH;
g.fillStyle = 'rgba(120,104,82,' + (0.03 + Math.random() * 0.05).toFixed(3) + ')';
g.fillRect(x, y, 1 + Math.random() * 2.2, 0.6);
}
const LM = 64, RM = BW - 64;
g.fillStyle = 'rgba(58,48,36,.86)';
g.font = '600 30px ' + SERIF;
g.fillText('这本书，送给自己', LM, 232);
g.fillStyle = 'rgba(58,48,36,.55)';
g.font = '300 15px ' + SERIF;
g.fillText('读到这里，你已经替他们过了一次生日。', LM, 272);
g.fillText('下面的三行，写点只属于你的东西。', LM, 300);
const ys = [520, 800, 1080];
for (let i = 0; i < ys.length; i++){
g.fillStyle = 'rgba(92,78,58,.34)';
g.fillRect(LM, ys[i], RM - LM, 1);
g.fillStyle = 'rgba(92,78,58,.28)';
g.font = '12px ' + MONO;
const tag = ['当 天', '写 给 谁', '那 一 句'][i] || '';
if (tag) g.fillText(tag, LM, ys[i] - 12);
}
g.fillStyle = 'rgba(58,48,36,.45)';
g.font = '11px ' + MONO;
g.fillText('球形发光体 · 序曲 · 影子戏', LM, BH - 150);
g.fillStyle = 'rgba(58,48,36,.30)';
g.font = '300 13px ' + SERIF;
g.fillText('正面是一次观测，反面是一次书写。', LM, BH - 118);
return b.toDataURL('image/png');
}
window.__markBack = drawBack;
let backUrl = null;
btn.addEventListener('click', async () => {
let shot = null;
try { shot = await grabRose(); } catch (e) { shot = null; }
const url = draw(shot);
backUrl = drawBack();
document.getElementById('markImg').src = url;
document.getElementById('markSave').href = url;
modal.classList.add('on');
modal.setAttribute('aria-hidden', 'false');
});
document.getElementById('markSave').addEventListener('click', ev => {
if (!backUrl) return;
ev.preventDefault();
const a = document.createElement('a');
const stamp = new Date().toISOString().slice(0, 10);
a.href = ev.currentTarget.href;
a.download = '量子花书签-' + stamp + '-正面.png';
a.click();
setTimeout(() => {
const b2 = document.createElement('a');
b2.href = backUrl;
b2.download = '量子花书签-' + stamp + '-反面.png';
b2.click();
}, 420);
});
document.getElementById('markClose').addEventListener('click', () => {
modal.classList.remove('on');
modal.setAttribute('aria-hidden', 'true');
});
modal.addEventListener('click', e => {
if (e.target === modal){
modal.classList.remove('on');
modal.setAttribute('aria-hidden', 'true');
}
});
addEventListener('keydown', e => {
if (e.key === 'Escape' && modal.classList.contains('on')){
modal.classList.remove('on');
modal.setAttribute('aria-hidden', 'true');
}
});
})();
const REFS = [
['球形发光体的硅纳米颗粒氧化假说',
'Abrahamson & Dinniss · Nature · 2000',
'普通闪电击中土壤后可能产生含硅纳米颗粒网络，颗粒在空气中氧化、释放能量并发光。为“闪电—土壤成分—化学反应—能量释放”这条链提供真实科学背景。',
'假说'],
['球形发光体的光学与光谱特征观测',
'Cen、Yuan、Xue · Physical Review Letters · 2014',
'两台无狭缝光谱仪在约 0.9 公里外记录到一个持续约 1.6 秒的球形发光体，光谱中出现硅、铁、钙等土壤相关元素的发射线。',
'单次仪器观测'],
['球形发光体之谜：综述',
'Donoso、Trueba、Rañada · 2006',
'系统梳理目击特征、化学模型、电磁模型、等离子体模型与实验研究，适合用来搭建科普资料框架。',
'综述'],
['球形发光体的相对论微波理论',
'H.-C. Wu · Scientific Reports · 2016',
'闪电可能产生相对论性电子束并激发强微波；微波使空气电离，并可能形成暂时约束微波的等离子体气泡。有理论推导与数值模拟，不代表机制已被证实。',
'理论模拟'],
['球形发光体研究进展',
'Shmatov、Stephan · J. Atmos. Sol.-Terr. Phys. · 2019',
'整理近现代观测、理论模型、实验室模拟、潜在危险与未来研究方向，适合比较不同解释模型。',
'综述'],
['科学家与专业人员观测球形发光体简史',
'A. G. Keul · Hist. Geo- Space Sci. · 2021',
'汇总 1868—2020 年间八个国家的 41 个观测案例，并指出该研究仍受制于观测机会少、仪器记录不足、缺乏统一理论。',
'观测史'],
['通过窗户损伤分析球形发光体的能量与功率',
'K. D. Stephan · 2024',
'讨论目击报告中出现的圆形玻璃损伤，分析玻璃受热损坏所需的物理条件——用于检验一个模型能否解释全部目击特征。',
'单次分析'],
['2014 年山西新绛目击报道',
'《山西日报》· 人民网转载',
'一团红色火球在雷雨期间进入楼道并爆炸，导致五台计算机损坏、无人受伤。新闻记录能提出观察，但不能证明火球的物理性质。',
'新闻记录'],
['2023 年美国蒙大拿影像与 2025 年论文分析',
'雷暴期间拍摄的视频 · 论文分析',
'研究者讨论画面中的发光物体是否符合球形发光体特征。属于待评估的影像证据，不是已经确证的球形发光体。',
'待评估影像']
];
(function renderRefs(){
const list = document.getElementById('refsList');
if (!list) return;
list.innerHTML = REFS.map(r =>
'<li><p class="t">' + r[0] + '</p>' +
'<div class="m">' + r[1] + '</div>' +
'<p class="n">' + r[2] + '</p>' +
'<span class="g">' + r[3] + '</span></li>'
).join('');
})();
document.getElementById('refsTab').addEventListener('click', () => {
document.getElementById('concepts').classList.toggle('refs-open');
});
document.getElementById('nRefsAll').addEventListener('click', () => {
const el = document.getElementById('concepts');
el.classList.add('refs-open');
const drawer = document.getElementById('refs');
if (drawer) drawer.scrollTop = 0;
});
const SCENES = {
storm: () => `<svg viewBox="0 0 600 600" aria-hidden="true">
<line x1="110" y1="150" x2="490" y2="150" stroke="rgba(190,205,255,.42)" stroke-width="1"/>
<line x1="110" y1="450" x2="490" y2="450" stroke="rgba(125,140,255,.5)" stroke-width="1"/>
<text x="110" y="134" fill="#7d84a0" font-size="9" font-family="monospace" letter-spacing="2">− CHARGE LAYER</text>
<text x="110" y="472" fill="#7d84a0" font-size="9" font-family="monospace" letter-spacing="2">+ CHARGE LAYER</text>
${[150,203,256,309,362,415,468].map(x => `<line x1="${x}" y1="150" x2="${x}" y2="450" stroke="rgba(125,140,255,.45)" stroke-width="1" class="fx-dash"/>`).join('')}
<polyline points="300,252 286,300 314,306 296,352" fill="none" stroke="#dfe6ff" stroke-width="1.4" opacity=".9"/>
</svg>`,
ball: () => `<svg viewBox="0 0 600 600" aria-hidden="true">
<defs>
<radialGradient id="orbCore" cx="50%" cy="50%" r="50%">
<stop offset="0%" stop-color="#ffffff"/>
<stop offset="26%" stop-color="#fff6e0"/>
<stop offset="48%" stop-color="rgba(255,206,140,.86)"/>
<stop offset="72%" stop-color="rgba(255,138,72,.30)"/>
<stop offset="100%" stop-color="rgba(255,120,60,0)"/>
</radialGradient>
<radialGradient id="orbHaze" cx="50%" cy="50%" r="50%">
<stop offset="45%" stop-color="rgba(255,170,110,.15)"/>
<stop offset="100%" stop-color="rgba(255,150,90,0)"/>
</radialGradient>
</defs>
<circle cx="300" cy="300" r="196" fill="url(#orbHaze)" class="fx-breathe"/>
<circle cx="300" cy="300" r="176" fill="none" stroke="rgba(160,175,255,.14)" stroke-dasharray="3 10" class="fx-spin"/>
<circle cx="300" cy="300" r="116" fill="none" stroke="rgba(160,190,255,.18)"/>
<circle cx="300" cy="300" r="74" fill="url(#orbCore)" class="fx-breathe"/>
<text x="300" y="536" text-anchor="middle" fill="#7d84a0" font-size="9" font-family="monospace" letter-spacing="3">PLASMA ORB · 机制未定</text>
</svg>`,
macro: () => `<svg viewBox="0 0 600 600" aria-hidden="true">
<text x="300" y="140" text-anchor="middle" fill="#cfd6ff" font-size="10" font-family="monospace" letter-spacing="3">SCALE ×10¹⁴</text>
<circle cx="170" cy="310" r="5" fill="#dfe6ff"/>
<text x="170" y="340" text-anchor="middle" fill="#7d84a0" font-size="9" font-family="monospace">10⁻¹⁵ m</text>
<circle cx="430" cy="310" r="98" fill="rgba(125,140,255,.17)" stroke="rgba(195,208,255,.6)" class="fx-breathe"/>
<text x="430" y="446" text-anchor="middle" fill="#7d84a0" font-size="9" font-family="monospace">~10⁻¹ m</text>
<line x1="200" y1="310" x2="318" y2="310" stroke="rgba(255,255,255,.16)" stroke-dasharray="2 7"/>
</svg>`,
fusion: () => {
let cells = '';
for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++){
const i = y * 7 + x;
cells += `<rect x="${188 + x * 32}" y="${188 + y * 32}" width="20" height="20" rx="3" fill="rgba(255,255,255,.06)" style="animation:fxFail 6s ease-in-out ${(i * 0.09).toFixed(2)}s infinite"/>`;
}
return `<svg viewBox="0 0 600 600" aria-hidden="true">${cells}
<circle cx="300" cy="300" r="42" fill="none" stroke="rgba(195,208,255,.45)" class="fx-breathe"/>
<text x="300" y="520" text-anchor="middle" fill="#7d84a0" font-size="9" font-family="monospace" letter-spacing="3">INFRASTRUCTURE · 连锁失效</text>
</svg>`;
},
observer: () => `<svg viewBox="0 0 600 600" aria-hidden="true">
<path d="M80 300 q34 -68 68 0 t68 0 t68 0 t68 0 t68 0 t68 0" fill="none" stroke="rgba(160,175,255,.5)" stroke-width="1.2" class="fx-breathe"/>
<line x1="80" y1="300" x2="520" y2="300" stroke="rgba(255,255,255,.12)" stroke-dasharray="2 8"/>
<circle cx="300" cy="300" r="6" fill="#e6ebff"/>
<text x="300" y="430" text-anchor="middle" fill="#7d84a0" font-size="9" font-family="monospace" letter-spacing="3">OBSERVED → COLLAPSED</text>
</svg>`,
nucleus: () => `<svg viewBox="0 0 600 600" aria-hidden="true">
<circle cx="300" cy="300" r="120" fill="none" stroke="rgba(160,175,255,.16)" stroke-dasharray="4 10" class="fx-spin"/>
<circle cx="300" cy="300" r="52" fill="rgba(125,140,255,.16)" stroke="rgba(195,208,255,.55)" class="fx-breathe"/>
<circle cx="300" cy="300" r="14" fill="#e6ebff"/>
<text x="300" y="530" text-anchor="middle" fill="#7d84a0" font-size="9" font-family="monospace" letter-spacing="3">MACRO NUCLEUS</text>
</svg>`,
bubble: () => `<svg viewBox="0 0 600 600" aria-hidden="true">
<circle cx="300" cy="300" r="150" fill="rgba(125,140,255,.05)" stroke="rgba(160,175,255,.22)"/>
<circle cx="300" cy="300" r="148" fill="none" stroke="rgba(195,208,255,.35)" stroke-dasharray="2 12" class="fx-spin"/>
<circle cx="300" cy="300" r="86" fill="rgba(160,190,255,.10)" stroke="rgba(195,208,255,.4)" class="fx-breathe"/>
<circle cx="300" cy="300" r="26" fill="#e6ebff" opacity=".85"/>
<text x="300" y="520" text-anchor="middle" fill="#7d84a0" font-size="9" font-family="monospace" letter-spacing="3">VACUUM BUBBLE · 透明</text>
</svg>`,
quantum: () => `<svg viewBox="0 0 600 600" aria-hidden="true">
<circle cx="268" cy="300" r="96" fill="rgba(125,140,255,.10)" stroke="rgba(160,175,255,.22)" stroke-dasharray="5 9"/>
<circle cx="332" cy="300" r="96" fill="rgba(125,140,255,.10)" stroke="rgba(160,175,255,.22)" stroke-dasharray="5 9"/>
<circle cx="300" cy="300" r="8" fill="#e6ebff" class="fx-breathe"/>
<text x="300" y="520" text-anchor="middle" fill="#7d84a0" font-size="9" font-family="monospace" letter-spacing="3">SUPERPOSITION · 概率云</text>
</svg>`,
transition: () => `<svg viewBox="0 0 600 600" aria-hidden="true">
<circle cx="170" cy="300" r="34" fill="none" stroke="rgba(160,175,255,.35)"/>
<circle cx="430" cy="300" r="34" fill="none" stroke="rgba(160,175,255,.35)"/>
<line x1="215" y1="300" x2="385" y2="300" stroke="rgba(195,208,255,.4)" stroke-dasharray="3 9" class="fx-dash"/>
<circle cx="300" cy="300" r="9" fill="#e6ebff" class="fx-breathe"/>
<text x="300" y="520" text-anchor="middle" fill="#7d84a0" font-size="9" font-family="monospace" letter-spacing="3">QUANTUM JUMP</text>
</svg>`,  rose: () => `<svg viewBox="0 0 600 600" aria-hidden="true">
<circle cx="300" cy="300" r="152" fill="none" stroke="rgba(160,175,255,.2)" class="fx-spin"/>
<circle cx="300" cy="300" r="106" fill="none" stroke="rgba(160,175,255,.16)" stroke-dasharray="4 9" class="fx-spin-r"/>
<circle cx="300" cy="300" r="60" fill="none" stroke="rgba(160,175,255,.24)" class="fx-spin"/>
<circle cx="300" cy="300" r="12" fill="#e6ebff" class="fx-breathe"/>
</svg>`
};
const cgList = $('#cgList');
Object.keys(nodes).forEach(k => {
const li = document.createElement('li');
li.innerHTML = '<button data-node="'+k+'"><span>'+nodes[k].n+'</span><span class="b">'+nodes[k].bnd+'</span></button>';
cgList.appendChild(li);
});
let zScale = 1;
function applyZoom(){
$('#stageInner').style.transform = 'scale(' + zScale + ')';
if (window.__stage3D) window.__stage3D.cam(12.8 / zScale);
$('#zVal').textContent = Math.round(zScale * 100) + '%';
}
function setZoom(v){
zScale = Math.max(.55, Math.min(2.6, v));
applyZoom();
}
let nodeKey = 'ball';
function setNode(k){
nodeKey = k;
const d = nodes[k];
$$('#cgList [data-node]').forEach(n => n.setAttribute('aria-current', String(n.dataset.node === k)));
$('#nTitle').textContent = d.n;
$('#nSub').textContent = d.sub;
const sciEl = $('#nSci'), ficEl = $('#nFic'), qEl = $('#nQ');
const noteEl = document.querySelector('#concepts .cg-lab');
if (noteEl) noteEl.textContent = d.note || '';
if (sciEl) sciEl.textContent = '';
if (ficEl) ficEl.textContent = d.fic || '';
if (qEl){
if (d.q){ qEl.textContent = d.q; qEl.hidden = false; }
else { qEl.textContent = ''; qEl.hidden = true; }
}
$('#nRel').textContent = d.rel;
$('#nBnd').textContent = d.bnd;
const rc = (window.LAB && window.LAB.reality && window.LAB.reality.concepts || {})[k];
const rBox = $('#nRefsBox');
if (rBox){
const srcEl = $('#nRefs');
const hypEl = $('#nRefsHyp');
if (rc && rc.src){ srcEl.textContent = '出处：' + rc.src; srcEl.hidden = false; }
else { srcEl.textContent = '出处：待核实'; srcEl.hidden = false; }
if (rc && rc.hyp){ hypEl.textContent = '仍在争论：' + rc.hyp; hypEl.hidden = false; }
else { hypEl.hidden = true; }
}
const c = CHAIN[k] || null;
if (c){
$('#nFlow').innerHTML = '<span>' + c[0] + '</span><i>→</i><b>' + d.n + '</b><i>→</i><span>' + c[1] + '</span>';
$('#nChainNote').textContent = c[2];
} else {
$('#nFlow').textContent = '—';
$('#nChainNote').textContent = '';
}
$('#stageInner').innerHTML = (SCENES[k] || SCENES.ball)();
if (window.__stageFx) window.__stageFx.scene(k);
if (window.__stage3D) window.__stage3D.scene(k);
$('#stageCapName').textContent = d.n;
setStatus('报告归纳', d.bnd);
setZoom(1);
}
cgList.addEventListener('click', e => {
const b = e.target.closest('[data-node]');
if (!b) return;
const k = b.dataset.node;
if (dragClickPid === k && Date.now() <= dragClickUntil){ dragClickPid = null; return; }
dragClickPid = null;
putInCombo(k);
if (innerWidth <= 1000 && combo.a && combo.b) $('#concepts').classList.remove('drawer-open');
});
$('#drawerTab').addEventListener('click', () => $('#concepts').classList.toggle('drawer-open'));
(function compactConceptPanel(){
const def = document.querySelector('#concepts .cg-def');
const more = $('#nMore');
if (!def || !more) return;
def.classList.add('compact');
more.addEventListener('click', () => {
const collapse = !def.classList.contains('compact');
def.classList.toggle('compact', collapse);
more.setAttribute('aria-expanded', String(!collapse));
more.textContent = collapse ? '展开完整资料 ↓' : '收起资料 ↑';
});
})();
$('#zIn').addEventListener('click', () => setZoom(zScale + .2));
$('#zOut').addEventListener('click', () => setZoom(zScale - .2));
$('#zReset').addEventListener('click', () => setZoom(1));
$('#stage').addEventListener('wheel', e => {
e.preventDefault();
setZoom(zScale + (e.deltaY < 0 ? .12 : -.12));
}, { passive: false });
const TUNE = { bright: 200, size: 40, glow: 100, hue: 30, fluct: 100, decay: 160 };
window.TUNE = TUNE;
function applyTune(){
const st = $('#stage');
st.style.setProperty('--fx-b', (TUNE.bright / 100).toFixed(3));
st.style.setProperty('--fx-glow', (TUNE.glow / 100).toFixed(3));
st.style.setProperty('--fx-hue', TUNE.hue + 'deg');
$('#vBright').textContent = TUNE.bright;
$('#vSize').textContent = TUNE.size;
$('#vGlow').textContent = TUNE.glow;
$('#vHue').textContent = TUNE.hue;
if ($('#vFluct')) $('#vFluct').textContent = TUNE.fluct;
if ($('#vDecay')) $('#vDecay').textContent = TUNE.decay;
const cfg = window.__roseCFG;
if (cfg){
cfg.alpha = Math.min(2, Math.max(.15, TUNE.bright / 100 * 0.75));
cfg.size = TUNE.size / 100 * 1.25;
cfg.bloom = TUNE.glow / 100;
cfg.hue = (202 + TUNE.hue + 360) % 360;
cfg.fluct = TUNE.fluct / 100;
cfg.decay = Math.max(0.4, TUNE.decay / 100);
}
}
$('#tuneTab').addEventListener('click', () => {
const t = $('#tune');
t.dataset.open = t.dataset.open === 'true' ? 'false' : 'true';
});
$('#pBright').addEventListener('input', e => { TUNE.bright = +e.target.value; applyTune(); });
$('#pSize').addEventListener('input', e => { TUNE.size = +e.target.value; applyTune(); });
$('#pGlow').addEventListener('input', e => { TUNE.glow = +e.target.value; applyTune(); });
$('#pHue').addEventListener('input', e => { TUNE.hue = +e.target.value; applyTune(); });
if ($('#pFluct')) $('#pFluct').addEventListener('input', e => { TUNE.fluct = +e.target.value; applyTune(); });
if ($('#pDecay')) $('#pDecay').addEventListener('input', e => { TUNE.decay = +e.target.value; applyTune(); });
$('#tuneReset').addEventListener('click', () => {
TUNE.bright = 200; TUNE.size = 40; TUNE.glow = 100; TUNE.hue = 30; TUNE.fluct = 100; TUNE.decay = 160;
$('#pBright').value = 200; $('#pSize').value = 40; $('#pGlow').value = 100; $('#pHue').value = 30;
if ($('#pFluct')) $('#pFluct').value = 100;
if ($('#pDecay')) $('#pDecay').value = 160;
window.__tuneReady = false;
applyTune();
window.__tuneReady = true;
});
applyTune();
setNode('ball');
if (window.__stage3D && typeof window.__stage3D.human === 'function') window.__stage3D.human(false);
let statusQuiet = false;
function conceptStatusPair(){
const sec = screens[2];
if (!sec || !sec.classList.contains('on')) return null;
const d = nodes[nodeKey];
if (!d) return null;
const bnd = String(d.bnd || '');
return ['报告归纳', innerWidth <= 1000 ? bnd.split('+')[0].trim() : bnd];
}
function syncConceptStatus(){
const pair = conceptStatusPair();
if (!pair) return;
statusQuiet = true;
setStatus(pair[0], pair[1]);
statusQuiet = false;
}
const statusWrap = $('#statusTags');
if (statusWrap) {
new MutationObserver(() => {
if (statusQuiet) return;
const pair = conceptStatusPair();
if (!pair) return;
const cur = statusWrap.textContent || '';
if (cur.indexOf(pair[0]) > -1 && cur.indexOf(pair[1]) > -1) return;
syncConceptStatus();
}).observe(statusWrap, { childList: true });
}
syncConceptStatus();
const HANDS = {
state: 'off',          // off | loading | live | fallback
src: '',               // landmark | motion | debug
delegate: '',
active: false,         // 手势层是否在控制点云（手离开画面时为 false，让位移平滑归零而不是硬跳）
present: false,        // 这一帧画面里有没有手
handsN: 0,             // 认出几只（0/1/2）
lm: null, lm2: null,   // 主手 / 副手的关键点（画框用）
x: 300, y: 300, tx: 300, ty: 300,
pinch: 0, pin: 0, open: 0, burst: 0,
fingers: 0, ext: [0, 0, 0, 0, 0], scale: 0.13,
pinchHold: false, pinchEdge: 0,
fistHold: false,               // 握拳稳定态（0 指连续 2 帧才算，0 指一散就退出）
fistRaw: 0, fist: 0,           // 握拳 → 熄灭 / 收成一个点
swirlRaw: 0, swirl: 0,         // 手腕 roll → 旋涡方向与速度
depthRaw: 0, depth: 0,         // 掌部大小当深度 → 推远 / 拉近
bridgeRaw: 0, bridge: 0,       // 双手 → 两掌之间拉一条炬桥
bp: { x1: 300, y1: 300, x2: 300, y2: 300 },
gesture: '',                   // 当前主导手势，给面板读数用
man: { depth: 0, fist: 0, swirl: 0, bridge: 0 },   // 键盘手动的同类量（和真手势取 max）
inferMs: 0, hz: 0, latency: 0, errText: ''
};
window.__conceptHands = HANDS;
(function conceptHands(){
const sec = $('#concepts');
const panel = document.querySelector('#tune .tune-panel');
if (!sec || !panel) return;
const HAS_WORKER = typeof Worker === 'function' && typeof OffscreenCanvas !== 'undefined';
const row = document.createElement('div');
row.className = 'tune-row hands-row';
row.innerHTML = '<span>手势</span><button class="hands-btn" id="handsToggle" type="button" aria-pressed="false">开启</button><output id="handsOut">关</output>';
const note = document.createElement('p');
note.className = 'tune-note hands-note';
const TIPS = '手势：牵引 · 收束 · 爆散 · 熄灭 · 旋涡 · 远近 · 挥手切概念 · 双手炬桥；键盘 A/D 切概念、W/S 远近、F 熄灭、Q/E 旋涡、B 炬桥。首次开启下载约 17 MB（之后离线可用），没有摄像头或加载失败自动退回帧差追踪。';
note.textContent = TIPS;
const firstRow = panel.querySelector('.tune-row');
if (firstRow) panel.insertBefore(row, firstRow); else panel.appendChild(row);
panel.insertBefore(note, row.nextSibling);
const btn = row.querySelector('#handsToggle');
const out = row.querySelector('#handsOut');
let video = null, stream = null, worker = null, timer = null;
let busy = false, busyAt = 0, lastFrame = 0, tCap = 0;
const lat = [];
let lastOut = '';
function ui(){
const s = HANDS.state;
btn.textContent = s === 'off' ? '开启' : s === 'loading' ? '取消' : '关闭';
btn.setAttribute('aria-pressed', s === 'off' ? 'false' : 'true');
let o =
s === 'off' ? '关' :
s === 'loading' ? '加载中…' :
s === 'live' ? '就绪 · ' + (HANDS.delegate || 'CPU') + ' · ' + Math.round(HANDS.hz) + ' Hz' :
s === 'fallback' ? '降级 · 帧差追踪' : '失败';
if (HANDS.active && HANDS.gesture && s !== 'off') o += ' · ' + HANDS.gesture;
if (HANDS.active) o += ' · ' + HANDS.fingers + '指' + (HANDS.pinchHold ? ' 捏合' : '');
if (o !== lastOut) { out.textContent = o; lastOut = o; }
sec.dataset.hands = s === 'off' ? 'off' : s;
const want = (HANDS.errText && s !== 'live' && s !== 'fallback') ? HANDS.errText : TIPS;
if (note.textContent !== want) note.textContent = want;
}
function fail(text, allowFallback){
HANDS.errText = text;
if (allowFallback && stream) { toMotion(); return; }
HANDS.state = 'off'; HANDS.present = false; stopAll(); closeCam(); ui();
}
const CONCEPT_KEYS = Object.keys(nodes);
let swipeCool = 0, swipeLock = 0, lastPx = 0, lastPxt = 0, lastPy = 0, lastPyt = 0;
let swipeArmed = true;
const swipeHist = [];
let pinState = false, pinFrames = 0;
let fistState = false, fistFrames = 0;
let labelNow = '', labelN = 0;   // 手势标签稳定窗：同一个标签连续 3 帧才写进 HANDS.gesture
function handTo600(px, py){ return { x: 300 + (0.5 - px) * 520, y: 300 + (py - 0.5) * 380 }; }
function straight(a, b, c){
const ux = b.x - a.x, uy = b.y - a.y, vx = c.x - b.x, vy = c.y - b.y;
const lu = Math.hypot(ux, uy) || 1e-6, lv = Math.hypot(vx, vy) || 1e-6;
const cos = (ux * vx + uy * vy) / (lu * lv);
const len = Math.max(0, Math.min(1, (lv / lu - 0.22) / 0.55));
return Math.max(0, Math.min(1, (cos - 0.34) / 0.52)) * len;
}
const FINGER_CHAINS = [[5, 6, 8], [9, 10, 12], [13, 14, 16], [17, 18, 20]];
function fingersOf(lm, px, py, wid){
const ext = [];
FINGER_CHAINS.forEach(g => {
const straightness = straight(lm[g[0]], lm[g[1]], lm[g[2]]);
const reach = Math.max(0, Math.min(1, (Math.hypot(lm[g[2]].x - lm[g[0]].x, lm[g[2]].y - lm[g[0]].y) / wid - 0.28) / 0.50));
ext.push(straightness * (0.30 + 0.70 * reach));
});
const tS = straight(lm[2], lm[3], lm[4]);
const tSpread = Math.max(0, Math.min(1, (Math.hypot(lm[4].x - lm[17].x, lm[4].y - lm[17].y) / wid - 0.55) / 0.55));
const tFar = Math.max(0, Math.min(1, (Math.hypot(lm[4].x - px, lm[4].y - py) / wid - 0.55) / 0.40));
ext.unshift(tS * tSpread * tFar);
return ext;
}
function readHand(lm){
let px = 0, py = 0;
for (let i = 0; i < 21; i++) { px += lm[i].x; py += lm[i].y; }
px /= 21; py /= 21;
let cx5 = 0, cy5 = 0;
[0, 5, 9, 13, 17].forEach(i => { cx5 += lm[i].x; cy5 += lm[i].y; });
cx5 /= 5; cy5 /= 5;
const wid = Math.hypot(lm[5].x - lm[17].x, lm[5].y - lm[17].y) || 0.08;
const scale = Math.hypot(lm[9].x - lm[0].x, lm[9].y - lm[0].y) || wid;
const pinchD = Math.hypot(lm[4].x - lm[8].x, lm[4].y - lm[8].y) / wid;
let tips = 0;
[8, 12, 16, 20].forEach(i => { tips += Math.hypot(lm[i].x - cx5, lm[i].y - cy5) / wid; });
tips /= 4;
const open = Math.max(0, Math.min(1, (tips - 1.05) / 0.55));
const fist = open < 0.34 ? Math.max(0, Math.min(1, (1.32 - tips) / 0.34)) : 0;
const axU = lm[9].x - lm[0].x, axV = lm[9].y - lm[0].y;
let roll = Math.atan2(axU, -axV);
while (roll > Math.PI / 2) roll -= Math.PI;
while (roll < -Math.PI / 2) roll += Math.PI;
const swirl = Math.max(-1, Math.min(1, roll / (Math.PI / 3.2)));
const depth = Math.max(-1, Math.min(1, (0.118 - wid) / 0.055));
const ext = fingersOf(lm, cx5, cy5, wid);
let fingers = 0;
ext.forEach(v => { if (v > 0.55) fingers++; });
return {
px, py, wid, scale, open, fist, swirl, depth, roll: roll * 180 / Math.PI,
pinch: Math.max(0, Math.min(1, (0.62 - pinchD) / 0.27)),
ext, fingers
};
}
const HAND_MIN_W = 0.085;      // 约 1.1 m 以内：60 cm 处 ≈0.13，2 m 处 ≈0.04
const HAND_KEEP_W = 0.068;     // 已锁定的手放宽一点，避免一有抖动就掉
const HAND_LOOSE_W = 0.058;    // 炬桥的第二只手：只剩「不是背景路人」这一道门槛
let lockUntil = 0;
function pickHand(list, loose){
let best = null;
for (let i = 0; i < list.length; i++){
const lm = list[i];
if (!lm || lm.length < 21) continue;
const wid = Math.hypot(lm[5].x - lm[17].x, lm[5].y - lm[17].y);
let px = 0, py = 0;
[0, 5, 9, 13, 17].forEach(j => { px += lm[j].x; py += lm[j].y; });
px /= 5; py /= 5;
if (px < 0.06 || px > 0.94 || py < 0.06 || py > 0.94) continue;
if (!best || wid > best.wid) best = { lm, wid, px, py };
}
if (!best) return null;
const now = performance.now();
const min = loose ? HAND_LOOSE_W : (now < lockUntil ? HAND_KEEP_W : HAND_MIN_W);
HANDS.nearWid = best.wid;
if (best.wid < min) return null;
if (!loose) lockUntil = now + 700;
return best;
}
let debugHold = 0;   // 注入口给的时间窗，避免真 worker 的空帧把测试值立刻冲掉
function ingestAll(list){
if (performance.now() < debugHold) return;
if (!list || !list.length) {
HANDS.handsN = 0; HANDS.present = false; HANDS.lm = null; HANDS.lm2 = null;
HANDS.tx = 300; HANDS.ty = 300; HANDS.pin = 0;
HANDS.fistRaw = 0; HANDS.swirlRaw = 0; HANDS.depthRaw = 0; HANDS.bridgeRaw = 0; HANDS.roll = 0;
return;
}
const picked = pickHand(list);
if (!picked) {
HANDS.handsN = 0; HANDS.present = false; HANDS.lm = null; HANDS.lm2 = null;
HANDS.tx = 300; HANDS.ty = 300; HANDS.pin = 0;
HANDS.fistRaw = 0; HANDS.swirlRaw = 0; HANDS.depthRaw = 0; HANDS.bridgeRaw = 0; HANDS.roll = 0;
HANDS.fingers = 0; HANDS.ext = [0, 0, 0, 0, 0];
pinState = false; pinFrames = 0; fistState = false; fistFrames = 0;
labelNow = ''; labelN = 0;
HANDS.pinchHold = false; HANDS.pinchEdge = 0; HANDS.fistHold = false;
HANDS.gesture = '未识别';
return;
}
HANDS.lm = picked.lm;
const a = readHand(picked.lm), p = handTo600(a.px, a.py);
const others = list.filter(l => l !== picked.lm);
HANDS.handsN = 1 + others.length;
HANDS.present = true; HANDS.active = true;
HANDS.open = a.open;
HANDS.ext = a.ext; HANDS.fingers = a.fingers; HANDS.scale = a.scale;
if (HANDS.pinchEdge > 0) HANDS.pinchEdge = Math.max(0, HANDS.pinchEdge - 0.12);
if (!fistState) {
if (a.fingers === 0) { if (++fistFrames >= 2) { fistState = true; fistFrames = 0; pinState = false; pinFrames = 0; HANDS.pinchHold = false; } }
else fistFrames = 0;
} else if (a.fingers >= 1) { if (++fistFrames >= 2) { fistState = false; fistFrames = 0; } }
HANDS.fistHold = fistState;
HANDS.fistRaw = fistState ? Math.max(a.fist, 0.75) : 0;
if (!fistState) {
if (!pinState) {
if (a.pinch > 0.62) { if (++pinFrames >= 3) { pinState = true; pinFrames = 0; HANDS.pinchEdge = 1; } }
else pinFrames = 0;
} else if (a.pinch < 0.42) { pinState = false; pinFrames = 0; }
}
HANDS.pinchHold = pinState;
HANDS.pin = pinState ? Math.max(a.pinch, 0.80) : Math.min(a.pinch, 0.30);
HANDS.swirlRaw = a.swirl; HANDS.depthRaw = a.depth; HANDS.roll = a.roll;
HANDS.tFrame = performance.now();
const now = performance.now();
const dt = lastFrame ? Math.max(0.016, (now - lastFrame) / 1000) : 0.08;
lastFrame = now;
const dtV = lastPxt ? Math.max(0.016, (now - lastPxt) / 1000) : 0.08;
const vxRaw = lastPxt ? (a.px - lastPx) / dtV : 0;
const vyRaw = lastPyt ? (a.py - lastPy) / dtV : 0;
HANDS.vxRaw = vxRaw; HANDS.vyRaw = vyRaw;
HANDS.vx = HANDS.vx * 0.55 + vxRaw * 0.45;
lastPx = a.px; lastPxt = now; lastPy = a.py; lastPyt = now;
const other = others.length ? pickHand(others, true) : null;
if (other) {
const b = readHand(other.lm), q = handTo600(b.px, b.py);
HANDS.lm2 = other.lm;
HANDS.bridgeRaw = 1;
HANDS.bp.x1 = p.x; HANDS.bp.y1 = p.y; HANDS.bp.x2 = q.x; HANDS.bp.y2 = q.y;
HANDS.gesture = '桥接';
} else {
HANDS.lm2 = null;
HANDS.bridgeRaw = 0;
if (swipeLock > 0) swipeLock -= dt;
if (swipeCool > 0) swipeCool -= dt;
const fastNow = Math.abs(vxRaw) > 0.85 && Math.abs(vxRaw) > Math.abs(vyRaw) * 1.6;
swipeHist.push({ t: now, x: a.px, y: a.py });
while (swipeHist.length && now - swipeHist[0].t > 0.22) swipeHist.shift();
const h0 = swipeHist[0];
const dxWin = h0 ? a.px - h0.x : 0;
const dyWin = h0 ? a.py - h0.y : 1;
const swing = Math.abs(dxWin) > 0.20 && Math.abs(dxWin) > Math.abs(dyWin) * 1.3;
const handOk = (a.fingers >= 4 || a.open > 0.34) && !pinState && !fistState;
if ((fastNow || swing) && handOk && swipeArmed && swipeCool <= 0 && sec.classList.contains('on')) {
swipe((((fastNow && Math.abs(vxRaw) > 0.85) ? vxRaw : dxWin) > 0) ? -1 : 1);
swipeCool = 0.5; swipeLock = 0.26;
swipeArmed = false; swipeHist.length = 0;
}
if (!swipeArmed && swipeCool <= 0 && Math.abs(vxRaw) < 0.6) swipeArmed = true;
if (swipeLock <= 0) { HANDS.tx = p.x; HANDS.ty = p.y; }
const cand = fistState ? '熄灭' : pinState ? '收束' : Math.abs(a.swirl) > 0.5 ? '旋涡' : '牵引';
if (cand === labelNow) { if (labelN < 9) labelN++; }
else { labelNow = cand; labelN = 1; }
if (labelN >= 3) HANDS.gesture = cand;
}
if (a.open > 0.55 && HANDS.vy < -1.15 && HANDS.burst <= 0.02 && others.length === 0) { HANDS.burst = 1; HANDS.gesture = '爆散'; }
if (pinState) HANDS.burst = Math.min(HANDS.burst, 0.001);
}
function swipe(dir){
const cur = (typeof nodeKey === 'string') ? nodeKey : 'ball';
const i = CONCEPT_KEYS.indexOf(cur);
if (i < 0) return;
const n = CONCEPT_KEYS.length;
const next = CONCEPT_KEYS[(i + dir + n) % n];
const el = document.querySelector('#cgList [data-node="' + next + '"]');
if (typeof setNode === 'function') setNode(next);
if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
HANDS.gesture = dir > 0 ? '下一个' : '上一个';
HANDS.swipes = (HANDS.swipes || 0) + 1;
}
let lastY = 0, lastYt = 0;
function trackVy(ny){
const now = performance.now();
if (lastYt) {
const dt = Math.max(0.016, (now - lastYt) / 1000);
HANDS.vy = HANDS.vy * 0.6 + ((ny - lastY) / dt) * 0.4;
}
lastY = ny; lastYt = now;
}
function sample(){
if (!video || video.readyState < 2) return;
if (document.hidden || !sec.classList.contains('on')) return;   /* 离开 02 屏 / 切到后台就不再抓帧，摄像头和 CPU 都省下来 */
const now = performance.now();
if (now - lastFrame < 1000 / 15) return;         // 15Hz 上限，别跟点云抢
if (busy && now - busyAt < 1500) return;          // 上一帧没回来，跳过
busy = true; busyAt = now; tCap = now;
createImageBitmap(video, { resizeWidth: 384, resizeHeight: 288, resizeQuality: 'medium' }).then(bmp => {
if (!worker) { try { bmp.close(); } catch (e) {} return; }
worker.postMessage({ type: 'frame', bitmap: bmp, ts: now }, [bmp]);
}).catch(() => { busy = false; });
}
function onWorker(ev){
const m = ev.data || {};
if (m.type === 'ready') {
HANDS.delegate = m.delegate || '';
HANDS.state = 'live'; HANDS.src = 'landmark'; HANDS.errText = '';
ui(); startSample();
return;
}
if (m.type === 'error') { fail('手势模型出错（' + m.stage + '）：' + m.message, true); return; }
busy = false;
if (m.ts) { lat.push(performance.now() - m.ts); if (lat.length > 10) lat.shift(); HANDS.latency = lat.slice().sort((a, b) => a - b)[lat.length >> 1] || 0; }
if (m.inferMs) { HANDS.inferMs = HANDS.inferMs * 0.8 + m.inferMs * 0.2; HANDS.hz = Math.min(15, 1000 / Math.max(16, m.inferMs + 33)); }
if (m.type === 'hands' && m.hands && m.hands.length) { HANDS.score = m.hands[0].score || 0; ingestAll(m.hands.map(h => h.landmarks)); trackVy(m.hands[0].landmarks[0].y); }
else if (m.type === 'empty') { ingestAll(null); }
ui();
}
function startSample(){
stopSample();
timer = setInterval(sample, 1000 / 15);
}
function stopSample(){ if (timer) { clearInterval(timer); timer = null; } }
let mcv = null, mctx = null, prev = null, motionTimer = null;
function toMotion(){
HANDS.state = 'fallback'; HANDS.src = 'motion'; HANDS.errText = '';
if (worker) { try { worker.terminate(); } catch (e) {} worker = null; }
stopSample();
mcv = mcv || document.createElement('canvas');
mcv.width = 80; mcv.height = 60;
mctx = mcv.getContext('2d', { willReadFrequently: true });
prev = null;
ui();
if (motionTimer) clearInterval(motionTimer);
motionTimer = setInterval(motionTick, 90);
}
function motionTick(){
if (!video || video.readyState < 2 || !mctx) return;
mctx.drawImage(video, 0, 0, 80, 60);
let d;
try { d = mctx.getImageData(0, 0, 80, 60).data; } catch (e) { return; }
const cur = new Uint8Array(80 * 60);
for (let i = 0, j = 0; i < cur.length; i++, j += 4) cur[i] = (d[j] * 3 + d[j + 1] * 4 + d[j + 2] * 2) >> 3;
if (!prev) { prev = cur; return; }
let w = 0, sx = 0, sy = 0, s2 = 0;
for (let i = 0; i < cur.length; i++) {
const v = Math.abs(cur[i] - prev[i]);
if (v < 12) continue;
const x = i % 80, y = (i / 80) | 0;
w += v; sx += x * v; sy += y * v; s2 += v * (x * x + y * y);
}
prev = cur;
if (w < 80 * 60 * 3) { HANDS.present = false; HANDS.tx = 300; HANDS.ty = 300; HANDS.pin = 0; HANDS.fistRaw = 0; HANDS.swirlRaw = 0; HANDS.depthRaw = 0; HANDS.bridgeRaw = 0; HANDS.roll = 0; return; }
const cx = sx / w / 80, cy = sy / w / 60;
const spread = Math.sqrt(Math.max(0, s2 / w - Math.pow(sx / w, 2) - Math.pow(sy / w, 2)));
HANDS.tx = 300 + (0.5 - cx) * 520;
HANDS.ty = 300 + (cy - 0.5) * 380;
HANDS.pin = Math.max(0, Math.min(1, 1 - spread / 22));
HANDS.open = Math.max(0, Math.min(1, spread / 26));
HANDS.present = true; HANDS.active = true;
trackVy(cy);
ui();
}
function stopAll(){
stopSample();
if (motionTimer) { clearInterval(motionTimer); motionTimer = null; }
if (worker) { try { worker.terminate(); } catch (e) {} worker = null; }
if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
if (video) { try { video.pause(); video.srcObject = null; } catch (e) {} }
HANDS.lm = null; HANDS.score = 0; HANDS.lm2 = null;
HANDS.present = false; HANDS.active = false; HANDS.burst = 0; HANDS.pin = 0;
HANDS.tx = 300; HANDS.ty = 300;
lastY = lastYt = 0; lat.length = 0; lastFrame = 0;
}
async function start(){
HANDS.errText = '';
if (location.protocol === 'file:') {
fail('本地文件（file://）打开时浏览器不允许摄像头与 worker，手势不可用；用 http 打开或在线上看。', false);
return;
}
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { fail('这台浏览器没有摄像头接口（getUserMedia 不可用）。', false); return; }
HANDS.state = 'loading'; ui();
try {
stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }, audio: false });
} catch (e) {
fail('摄像头不可用（' + (e && e.name || 'error') + '）：拒绝授权或没有设备。', false);
return;
}
video = camEl;
video.muted = true; video.playsInline = true; video.srcObject = stream;
try { await video.play(); } catch (e) {}
openCam();
if (!HAS_WORKER) { toMotion(); return; }
try {
worker = new Worker('assets/hands/hand-worker.js');
} catch (e) { toMotion(); return; }
worker.onmessage = onWorker;
worker.onerror = () => { fail('手势 worker 启动失败（模型或 wasm 没找到）。', true); };
const base = new URL('assets/hands/', location.href).href;
worker.postMessage({ type: 'init', wasmPath: base + 'wasm', modelPath: base + 'hand_landmarker.task' });
setTimeout(() => { if (HANDS.state === 'loading' && !HANDS.delegate) toMotion(); }, 20000);
}
btn.addEventListener('click', () => {
if (HANDS.state === 'off' || HANDS.state === 'fallback') { stopAll(); start(); }
else closeHands();
});
ui();
const stage = $('#stage');
const camEl = document.createElement('video');
camEl.className = 'stage-cam'; camEl.muted = true; camEl.playsInline = true; camEl.autoplay = true;
const veilEl = document.createElement('div');
veilEl.className = 'stage-veil';
const boxEl = document.createElement('canvas');
boxEl.className = 'stage-hands';
const exitBtn = document.createElement('button');
exitBtn.type = 'button'; exitBtn.className = 'hands-exit';
exitBtn.innerHTML = '关闭手势 <span>ESC</span>';
const helpBtn = document.createElement('button');
helpBtn.type = 'button'; helpBtn.className = 'hands-exit hands-help';
helpBtn.innerHTML = '手势教程 <span>?</span>';
const tourEl = document.createElement('div');
tourEl.className = 'hands-tour';
tourEl.innerHTML =
'<div class="ht-head"><b id="htN">手势教程 1 / 7</b><button class="ht-skip" type="button">跳过</button></div>' +
'<div class="ht-body"><b id="htT">移动手掌</b><span id="htD"></span></div>' +
'<div class="ht-dots" id="htDots"></div>';
if (stage) {
stage.insertBefore(camEl, stage.firstChild);
stage.insertBefore(veilEl, camEl.nextSibling);
stage.appendChild(boxEl);
stage.appendChild(exitBtn);
stage.appendChild(helpBtn);
stage.appendChild(tourEl);
}
exitBtn.addEventListener('click', () => closeHands());
const boxCtx = boxEl.getContext('2d');
const htN = tourEl.querySelector('#htN'), htT = tourEl.querySelector('#htT');
const htD = tourEl.querySelector('#htD'), htDots = tourEl.querySelector('#htDots');
const TOUR = [
{ k: 'move',   t: '移动手掌',   d: '手在画面里左右上下移动 → 闪电跟着走' },
{ k: 'pinch',  t: '捏合',       d: '拇指和食指靠近 → 收束成球，松手回弹' },
{ k: 'fist',   t: '握拳',       d: '握拳 → 整团收紧、变暗' },
{ k: 'swirl',  t: '转手腕',     d: '手腕向左/右转 → 云被搅成旋涡' },
{ k: 'depth',  t: '推近 / 拉远', d: '手掌靠近镜头 → 放大变亮；推远 → 缩回' },
{ k: 'swipe',  t: '快速挥手',   d: '张着手快速左右一挥 → 切到下一个概念' },
{ k: 'bridge', t: '双手',       d: '两只手都进场 → 粒子连成一道桥' }
];
let tourOn = false, tourI = 0, tourHold = 0, tourSwipe0 = 0, tourTimer = null;
const TOUR_KEY = 'bh.handsTour';
TOUR.forEach(() => {});           /* 占位：点阵按下标渲染 */
function tourTest(k){
const H = HANDS;
if (k === 'move') return H.present && (Math.abs(H.x - 300) > 45 || Math.abs(H.y - 300) > 40);
if (k === 'pinch') return H.pin > 0.55;
if (k === 'fist') return (H.fist || 0) > 0.5;
if (k === 'swirl') return Math.abs(H.swirl || 0) > 0.55;
if (k === 'depth') return Math.abs(H.depth || 0) > 0.5;
if (k === 'swipe') return (H.swipes || 0) > tourSwipe0;
if (k === 'bridge') return (H.handsN || 0) > 1;
return false;
}
function tourRender(){
if (!tourEl) return;
tourEl.classList.toggle('on', tourOn);
if (!tourOn) return;
if (tourI >= TOUR.length) return;
const s = TOUR[tourI];
htN.textContent = '手势教程 ' + (tourI + 1) + ' / ' + TOUR.length;
htT.textContent = s.t; htD.textContent = s.d;
if (htDots.childElementCount !== TOUR.length) {
htDots.innerHTML = TOUR.map(() => '<i></i>').join('');
}
for (let i = 0; i < htDots.children.length; i++) {
const el = htDots.children[i];
el.className = i < tourI ? 'done' : i === tourI ? 'now' : '';
}
}
function tourStart(force){
if (!force && localStorage.getItem(TOUR_KEY)) return;
tourOn = true; tourI = 0; tourHold = 0; tourSwipe0 = HANDS.swipes || 0;
tourRender();
if (!tourTimer) tourTimer = setInterval(tourTick, 120);
}
function tourStop(done){
tourOn = false; tourRender();
if (tourTimer) { clearInterval(tourTimer); tourTimer = null; }
if (done) { try { localStorage.setItem(TOUR_KEY, '1'); } catch (e) {} }
}
function tourTick(){
if (!tourOn) { if (tourTimer) { clearInterval(tourTimer); tourTimer = null; } return; }
if (tourTest(TOUR[tourI].k)) tourHold += 0.12; else tourHold = Math.max(0, tourHold - 0.18);
if (tourHold > 0.5) {
tourHold = 0; tourI++;
if (tourI >= TOUR.length) { tourStop(true); return; }
}
tourRender();
}
(function bindTour(){
var skip = tourEl && tourEl.querySelector ? tourEl.querySelector('.ht-skip') : null;
if (skip) skip.addEventListener('click', () => tourStop(true));
if (helpBtn) helpBtn.addEventListener('click', () => tourStart(true));
})();
let boxRaf = null;
const bS = { x: 0, y: 0, w: 0, h: 0, on: false };
const bS2 = { x: 0, y: 0, w: 0, h: 0, on: false };
function openCam(){ sec.dataset.cam = 'on'; document.body.classList.add('hands-cam'); startBox(); tourStart(false); }
function closeCam(){ delete sec.dataset.cam; document.body.classList.remove('hands-cam'); stopBox(); tourStop(false); }
function closeHands(){ stopAll(); closeCam(); HANDS.state = 'off'; HANDS.errText = ''; ui(); }
function startBox(){ if (!boxRaf) boxRaf = requestAnimationFrame(drawBox); }
function stopBox(){
if (boxRaf) { cancelAnimationFrame(boxRaf); boxRaf = null; }
bS.on = false; bS2.on = false;
if (boxCtx) boxCtx.clearRect(0, 0, boxEl.width, boxEl.height);
}
function handRect(lm, r){
let x0 = 1, y0 = 1, x1 = 0, y1 = 0;
for (let i = 0; i < lm.length; i++){
const mx = 1 - lm[i].x;
if (mx < x0) x0 = mx; if (mx > x1) x1 = mx;
if (lm[i].y < y0) y0 = lm[i].y; if (lm[i].y > y1) y1 = lm[i].y;
}
const padx = (x1 - x0) * 0.15, pady = (y1 - y0) * 0.15;
x0 -= padx; x1 += padx; y0 -= pady; y1 += pady;
let tx = x0 * r.width, ty = y0 * r.height, tw = (x1 - x0) * r.width, th = (y1 - y0) * r.height;
tw = Math.min(tw, r.width * 0.96); th = Math.min(th, r.height * 0.96);
tx = Math.max(0, Math.min(r.width - tw, tx));
ty = Math.max(0, Math.min(r.height - th, ty));
return { tx, ty, tw, th };
}
function boxTrack(st, rect){
if (!st.on) { st.x = rect.tx; st.y = rect.ty; st.w = rect.tw; st.h = rect.th; st.on = true; }
else {
const k = 0.3;
st.x += (rect.tx - st.x) * k; st.y += (rect.ty - st.y) * k;
st.w += (rect.tw - st.w) * k; st.h += (rect.th - st.h) * k;
}
}
function boxCenter(st, dp){ return { x: (st.x + st.w / 2) * dp, y: (st.y + st.h / 2) * dp }; }
function drawBoxShape(st, dp, label, dim){
const x = st.x * dp, y = st.y * dp;
const bw = Math.max(26 * dp, st.w * dp), bh = Math.max(26 * dp, st.h * dp);
const rad = Math.min(16 * dp, bw * 0.22, bh * 0.22);
const line = dim ? 'rgba(255,214,150,.42)' : 'rgba(127,212,232,.5)';
const edge = dim ? 'rgba(255,214,150,.9)' : 'rgba(127,212,232,.95)';
const text = dim ? 'rgba(255,214,150,.96)' : 'rgba(127,212,232,.96)';
boxCtx.save();
boxCtx.lineJoin = 'round';
boxCtx.strokeStyle = line;
boxCtx.lineWidth = (dim ? 1 : 1.3) * dp;
boxCtx.beginPath();
if (boxCtx.roundRect) boxCtx.roundRect(x, y, bw, bh, rad); else boxCtx.rect(x, y, bw, bh);
boxCtx.stroke();
const c = Math.min(24 * dp, bw * 0.3, bh * 0.3);
boxCtx.strokeStyle = edge;
boxCtx.lineWidth = (dim ? 2 : 3) * dp;
boxCtx.beginPath();
boxCtx.moveTo(x, y + c); boxCtx.lineTo(x, y); boxCtx.lineTo(x + c, y);
boxCtx.moveTo(x + bw - c, y); boxCtx.lineTo(x + bw, y); boxCtx.lineTo(x + bw, y + c);
boxCtx.moveTo(x + bw, y + bh - c); boxCtx.lineTo(x + bw, y + bh); boxCtx.lineTo(x + bw - c, y + bh);
boxCtx.moveTo(x + c, y + bh); boxCtx.lineTo(x, y + bh); boxCtx.lineTo(x, y + bh - c);
boxCtx.stroke();
if (label) {
boxCtx.font = (10.5 * dp) + 'px ui-monospace, Consolas, "Courier New", monospace';
const lw = boxCtx.measureText(label).width;
const ly = Math.max(2 * dp, y - 21 * dp);
boxCtx.fillStyle = 'rgba(8,10,13,.74)';
boxCtx.fillRect(x, ly, lw + 16 * dp, 18 * dp);
boxCtx.fillStyle = text;
boxCtx.fillText(label, x + 8 * dp, ly + 13 * dp);
}
boxCtx.restore();
}
const BONES = [
[0, 1, 2, 3, 4],        /* 拇指 */
[0, 5, 6, 7, 8],        /* 食指 */
[0, 9, 10, 11, 12],     /* 中指 */
[0, 13, 14, 15, 16],    /* 无名指 */
[0, 17, 18, 19, 20]     /* 小指 */
];
const PALM = [[5, 9], [9, 13], [13, 17], [5, 17]];
const FINGER_HUE = ['255,178,108', '150,220,255', '176,214,255', '196,196,255', '255,150,196'];
function drawHand(lm, st, dp, label, dim){
if (!boxCtx || !lm || lm.length < 21) return;
const ext = (HANDS.ext && HANDS.ext.length === 5) ? HANDS.ext : [1, 1, 1, 1, 1];
const P = i => ({ x: (1 - lm[i].x) * st.dimW, y: lm[i].y * st.dimH });
const col = (j, a) => 'rgba(' + FINGER_HUE[j] + ',' + a + ')';
boxCtx.save();
boxCtx.lineCap = 'round';
boxCtx.lineJoin = 'round';
boxCtx.strokeStyle = 'rgba(127,212,232,' + (dim ? 0.30 : 0.52) + ')';
boxCtx.lineWidth = 1.6 * dp;
for (const [a, b] of PALM) {
const p = P(a), q = P(b);
boxCtx.beginPath(); boxCtx.moveTo(p.x, p.y); boxCtx.lineTo(q.x, q.y); boxCtx.stroke();
}
for (let j = 0; j < 5; j++) {
const e = Math.max(0, Math.min(1, ext[j] === undefined ? 1 : ext[j]));
const alpha = (dim ? 0.28 : 0.42) + e * (dim ? 0.34 : 0.52);
const segs = BONES[j].length - 1;
for (let k = 0; k < segs; k++) {
const a = BONES[j][k], b = BONES[j][k + 1];
const fade = 1 - (1 - e) * (k / segs) * 0.85;
const p = P(a), q = P(b);
boxCtx.strokeStyle = col(j, alpha * fade);
boxCtx.lineWidth = (1.4 + e * 1.5) * dp;
boxCtx.beginPath(); boxCtx.moveTo(p.x, p.y); boxCtx.lineTo(q.x, q.y); boxCtx.stroke();
}
const tip = P(BONES[j][4]);
if (e > 0.55) {
boxCtx.beginPath();
boxCtx.arc(tip.x, tip.y, (4.2 + e * 3.4) * dp, 0, Math.PI * 2);
boxCtx.fillStyle = col(j, 0.10 + e * 0.12);
boxCtx.fill();
}
boxCtx.beginPath();
boxCtx.arc(tip.x, tip.y, (2.1 + e * 1.1) * dp, 0, Math.PI * 2);
boxCtx.fillStyle = col(j, 0.35 + e * 0.6);
boxCtx.fill();
}
for (let i = 0; i < 21; i++) {
const p = P(i);
const r = (i === 0 ? 2.6 : (i % 4 === 0 ? 1.6 : 1.9)) * dp;
boxCtx.beginPath(); boxCtx.arc(p.x, p.y, r, 0, Math.PI * 2);
boxCtx.fillStyle = dim ? 'rgba(232,240,250,.34)' : 'rgba(236,244,252,.86)';
boxCtx.fill();
}
const th = P(4), ix = P(8);
const pd = Math.abs(HANDS.pinch || 0);
if (pd > 0.12) {
boxCtx.strokeStyle = 'rgba(255,214,150,' + (0.18 + pd * 0.62) + ')';
boxCtx.lineWidth = (0.9 + pd * 1.2) * dp;
boxCtx.setLineDash([3 * dp, 3 * dp]);
boxCtx.beginPath(); boxCtx.moveTo(th.x, th.y); boxCtx.lineTo(ix.x, ix.y); boxCtx.stroke();
boxCtx.setLineDash([]);
if (pd > 0.5) {
const cx = (th.x + ix.x) / 2, cy = (th.y + ix.y) / 2;
boxCtx.font = (9.5 * dp) + 'px ui-monospace, Consolas, "Courier New", monospace';
boxCtx.fillStyle = 'rgba(255,214,150,.9)';
boxCtx.fillText('捏合', cx + 4 * dp, cy - 4 * dp);
}
}
boxCtx.restore();
try {
const a0 = P(0), a9 = P(9);
const mx = (a0.x + a9.x) / 2, my = (a0.y + a9.y) / 2;
const rad = Math.atan2(a9.x - a0.x, -(a9.y - a0.y));
const sw = Math.abs(HANDS.swirlRaw || 0);
const hot = sw > 0.72;
const col2 = hot ? 'rgba(255,214,150,' : 'rgba(127,212,232,';
boxCtx.save();
boxCtx.strokeStyle = col2 + (hot ? 0.95 : 0.55) + ')';
boxCtx.lineWidth = (hot ? 2.2 : 1.4) * dp;
boxCtx.beginPath();
boxCtx.moveTo(mx - Math.sin(rad) * 26 * dp, my + Math.cos(rad) * 26 * dp);
boxCtx.lineTo(mx + Math.sin(rad) * 30 * dp, my - Math.cos(rad) * 30 * dp);
boxCtx.stroke();
boxCtx.strokeStyle = 'rgba(150,159,172,.22)';
boxCtx.lineWidth = 1 * dp;
boxCtx.setLineDash([3 * dp, 3 * dp]);
boxCtx.beginPath(); boxCtx.moveTo(mx - 34 * dp, my); boxCtx.lineTo(mx + 34 * dp, my); boxCtx.stroke();
boxCtx.setLineDash([]);
const deg = Math.round(HANDS.roll || 0);
if (Math.abs(deg) >= 8) {
boxCtx.font = (9.5 * dp) + 'px ui-monospace, Consolas, "Courier New", monospace';
boxCtx.fillStyle = col2 + '0.9)';
boxCtx.fillText((hot ? '换层 ' : '拧 ') + deg + '°', mx + 14 * dp, my - 12 * dp);
}
boxCtx.restore();
} catch (e) {}
if (label) {
const x = st.x * dp, y = st.y * dp;
const txt = label + (HANDS.fingers != null ? ' · ' + HANDS.fingers + ' 指' : '');
boxCtx.save();
boxCtx.font = (10.5 * dp) + 'px ui-monospace, Consolas, "Courier New", monospace';
const lw = boxCtx.measureText(txt).width;
const ly = Math.max(2 * dp, y - 21 * dp);
boxCtx.fillStyle = 'rgba(8,10,13,.74)';
boxCtx.fillRect(x, ly, lw + 16 * dp, 18 * dp);
boxCtx.fillStyle = dim ? 'rgba(255,214,150,.96)' : 'rgba(127,212,232,.96)';
boxCtx.fillText(txt, x + 8 * dp, ly + 13 * dp);
boxCtx.restore();
}
}
function drawBox(){
boxRaf = requestAnimationFrame(drawBox);
if (!stage || !boxCtx) return;
const r = stage.getBoundingClientRect(), dp = Math.min(2, devicePixelRatio || 1);
const w = Math.max(1, Math.round(r.width * dp)), h = Math.max(1, Math.round(r.height * dp));
if (boxEl.width !== w || boxEl.height !== h) { boxEl.width = w; boxEl.height = h; }
bS.dimW = bS2.dimW = w; bS.dimH = bS2.dimH = h;
boxCtx.clearRect(0, 0, w, h);
let main = null;
const lm = HANDS.lm;
if (lm && lm.length >= 21 && HANDS.present) {
main = handRect(lm, r);
main.label = '手 · ' + Math.round((HANDS.score || 0) * 100) + '%';
} else if (HANDS.src === 'motion' && HANDS.present) {
const cx0 = (0.5 + (HANDS.x - 300) / 520) * r.width;
const cy0 = (0.5 + (HANDS.y - 300) / 380) * r.height;
main = { tx: cx0 - 75, ty: cy0 - 86, tw: 150, th: 172, label: '运动 · 降级' };
}
if (!main) { bS.on = false; bS2.on = false; return; }
boxTrack(bS, main);
let second = null;
const lm2 = HANDS.lm2;
if (lm2 && lm2.length >= 21) { second = handRect(lm2, r); second.label = '副手'; }
if (second) boxTrack(bS2, second); else bS2.on = false;
if (second) {
const pc = boxCenter(bS, dp), qc = boxCenter(bS2, dp);
boxCtx.save();
boxCtx.setLineDash([6 * dp, 6 * dp]);
boxCtx.strokeStyle = 'rgba(255,214,150,.5)';
boxCtx.lineWidth = 1.2 * dp;
boxCtx.beginPath(); boxCtx.moveTo(pc.x, pc.y); boxCtx.lineTo(qc.x, qc.y); boxCtx.stroke();
boxCtx.restore();
}
if (lm && lm.length >= 21 && HANDS.present) drawHand(lm, bS, dp, main.label, false);
else drawBoxShape(bS, dp, main.label, false);
if (second && lm2 && lm2.length >= 21) drawHand(lm2, bS2, dp, '副手', true);
else if (second) drawBoxShape(bS2, dp, second.label, true);
}
let drag = false;
if (stage) {
stage.addEventListener('pointerdown', e => { if (e.button !== 0) return; if (e.target.closest('button, a, input')) return; drag = true; });
addEventListener('pointerup', () => { drag = false; });
stage.addEventListener('pointermove', e => {
if (HANDS.src === 'landmark' || HANDS.src === 'motion') return;   // 真手势在跑时不抢
if (!drag) return;
const r = stage.getBoundingClientRect();
const c = stage.querySelector('.stage-center').getBoundingClientRect();
const u = c.width / 600;
HANDS.tx = ((e.clientX - r.left) - (c.left - r.left) - c.width / 2) / u + 300;
HANDS.ty = ((e.clientY - r.top) - (c.top - r.top) - c.height / 2) / u + 300;
HANDS.present = true; HANDS.active = true;
});
addEventListener('pointerup', () => {
if (HANDS.src) return;
HANDS.present = false;
HANDS.tx = 300; HANDS.ty = 300;
});
addEventListener('keydown', e => {
if (e.target && /input|textarea/i.test(e.target.tagName)) return;
if (!sec.classList.contains('on')) return;
const k = e.key.toLowerCase();
if (e.key === 'Escape' && HANDS.state !== 'off') { e.preventDefault(); closeHands(); return; }
if (e.code === 'Space') { e.preventDefault(); HANDS.burst = 1; HANDS.active = true; }
else if (k === 'shift') HANDS.pin = 1;
else if (!e.repeat && (k === 'a' || k === 'd')) { e.preventDefault(); swipe(k === 'a' ? -1 : 1); }
else if (k === 'w' || k === 's') { e.preventDefault(); HANDS.man.depth = k === 'w' ? 1 : -1; }
else if (k === 'f') { HANDS.man.fist = 1; HANDS.active = true; }
else if (k === 'q' || k === 'e') { HANDS.man.swirl = k === 'q' ? -0.9 : 0.9; HANDS.active = true; }
else if (k === 'b') { HANDS.man.bridge = 1; HANDS.active = true; }
});
addEventListener('keyup', e => {
const k = e.key.toLowerCase();
if (k === 'shift' && !HANDS.src) HANDS.pin = 0;
if (k === 'w' || k === 's') HANDS.man.depth = 0;
if (k === 'f') HANDS.man.fist = 0;
if (k === 'q' || k === 'e') HANDS.man.swirl = 0;
if (k === 'b') HANDS.man.bridge = 0;
});
stage.addEventListener('dblclick', e => { if (e.target.closest('button, a, input')) return; HANDS.burst = 1; });
}
const OE = {
x: { v: 300, d: 0 }, y: { v: 300, d: 0 },
step: function (st, target, dt, minCut, beta) {
dt = Math.max(1e-3, Math.min(0.1, dt));
const raw = (target - st.v) / dt;
const ad = 1 / (1 + 1 / (2 * Math.PI * 1.0 * dt));
st.d += (raw - st.d) * ad;
const cut = minCut + beta * Math.abs(st.d);
const a = 1 / (1 + 1 / (2 * Math.PI * cut * dt));
st.v += (target - st.v) * a;
return st.v;
}
};
const dz = (v, t) => (Math.abs(v) < t ? 0 : (v - Math.sign(v) * t) / (1 - t));
window.__handsTick = function (dt) {
const nowS = performance.now() / 1000;
const dts = Math.max(1e-3, Math.min(0.12, nowS - (OE.t || nowS - dt || 0.016)));
OE.t = nowS;
if (OE.lx == null) { OE.lx = HANDS.tx; OE.ly = HANDS.ty; }
const vTxN = (HANDS.tx - OE.lx) / dts, vTyN = (HANDS.ty - OE.ly) / dts;
OE.lx = HANDS.tx; OE.ly = HANDS.ty;
const ka = Math.min(1, dts * 14);
OE.vxN = (OE.vxN || 0) + (vTxN - (OE.vxN || 0)) * ka;
OE.vyN = (OE.vyN || 0) + (vTyN - (OE.vyN || 0)) * ka;
const LEAP = 0.04;
const pTx = HANDS.tx + Math.max(-46, Math.min(46, OE.vxN * LEAP));
const pTy = HANDS.ty + Math.max(-46, Math.min(46, OE.vyN * LEAP));
HANDS.x = OE.step(OE.x, pTx, dt, 2.2, 0.18);
HANDS.y = OE.step(OE.y, pTy, dt, 2.2, 0.18);
const kp = 1 - Math.exp(-dt / 0.07);
HANDS.pinch += (HANDS.pin - HANDS.pinch) * kp;
if (HANDS.tFrame && nowS * 1000 - HANDS.tFrame > 400) {
HANDS.swirlRaw = 0; HANDS.depthRaw = 0; HANDS.fistRaw = 0; HANDS.roll = 0;
}
const m = HANDS.man;
const fist = Math.max(HANDS.fistRaw, m.fist), bridge = Math.max(HANDS.bridgeRaw, m.bridge);
const swirl = Math.abs(m.swirl) > Math.abs(HANDS.swirlRaw) ? m.swirl : HANDS.swirlRaw;
const depth = m.depth || HANDS.depthRaw;
const kf = 1 - Math.exp(-dt / 0.10);
HANDS.fist += (fist - HANDS.fist) * kf;
HANDS.bridge += (bridge - HANDS.bridge) * kf;
HANDS.swirl += (dz(swirl, 0.34) * 0.8 - HANDS.swirl) * (1 - Math.exp(-dt / 0.16));
HANDS.depth += (dz(depth, 0.40) * 0.75 - HANDS.depth) * (1 - Math.exp(-dt / 0.18));
if (m.bridge && !HANDS.bridgeRaw) {                 /* 键盘桥接：从舞台中心连到指针处 */
HANDS.bp.x1 = 300; HANDS.bp.y1 = 300;
HANDS.bp.x2 = HANDS.x; HANDS.bp.y2 = HANDS.y;
}
if (HANDS.burst > 0) HANDS.burst = Math.max(0, HANDS.burst - dt / 1.2);
if ((__handsTick.n = (__handsTick.n || 0) + 1) % 4 === 0) ui();
};
window.__conceptHands.debug = function (nx, ny, pinch, open, burst) {
HANDS.tx = 300 + (0.5 - nx) * 520;
HANDS.ty = 300 + (ny - 0.5) * 380;
HANDS.pin = Math.max(0, Math.min(1, +pinch || 0));
HANDS.open = Math.max(0, Math.min(1, +open || 0));
if (burst) HANDS.burst = 1;
HANDS.present = true; HANDS.active = true;
HANDS.src = 'debug';
if (HANDS.state === 'off' || HANDS.state === 'fallback') HANDS.state = 'live';
HANDS.delegate = HANDS.delegate || '模拟';
ui();
return { state: HANDS.state, x: HANDS.x, y: HANDS.y, pinch: HANDS.pinch, burst: HANDS.burst };
};
window.__conceptHands.sim = function (o) {
o = o || {};
['fist', 'swirl', 'depth'].forEach(k => {
if (k in o) { HANDS[k + 'Raw'] = Math.max(-1, Math.min(1, +o[k] || 0)); HANDS.active = true; }
});
if ('bridge' in o) {
HANDS.bridgeRaw = Math.max(0, Math.min(1, +o.bridge || 0));
HANDS.active = true;
if (o.p1) { HANDS.bp.x1 = o.p1[0]; HANDS.bp.y1 = o.p1[1]; }
if (o.p2) { HANDS.bp.x2 = o.p2[0]; HANDS.bp.y2 = o.p2[1]; }
HANDS.gesture = HANDS.bridgeRaw > 0.05 ? '桥接' : HANDS.gesture;
}
if ('gesture' in o) HANDS.gesture = o.gesture;
else if (HANDS.bridgeRaw > 0.05) HANDS.gesture = '桥接';
else if (HANDS.fistRaw > 0.4) HANDS.gesture = '熄灭';
else if (Math.abs(HANDS.swirlRaw) > 0.4) HANDS.gesture = '旋涡';
else if (Math.abs(HANDS.depthRaw) > 0.4) HANDS.gesture = HANDS.depthRaw < 0 ? '拉近' : '推远';
if (o.two) {
const mk = (cx, cy, w) => {
const lm = [];
for (let i = 0; i < 21; i++) lm.push({ x: cx, y: cy, z: 0 });
lm[0].x = cx; lm[0].y = cy + w * 0.9;
[5, 9, 13, 17].forEach((j, n) => { lm[j].x = cx + (n - 1.5) * w * 0.32; lm[j].y = cy + w * 0.32; });
[8, 12, 16, 20].forEach((j, n) => { lm[j].x = cx + (n - 1) * w * 0.30; lm[j].y = cy - w * 1.05; });
lm[4].x = cx - w * 0.30; lm[4].y = cy - w * 0.85;
lm[8].x = lm[4].x + 0.80 * w; lm[8].y = cy - w * 1.10;
return lm;
};
HANDS.lm = mk(+o.h1x || 0.34, +o.h1y || 0.55, 0.15);
HANDS.lm2 = mk(+o.h2x || 0.67, +o.h2y || 0.60, 0.12);
HANDS.score = 0.97;
HANDS.bridgeRaw = 1; HANDS.gesture = '桥接';
}
HANDS.present = true; HANDS.active = true; HANDS.src = 'debug';
if (HANDS.state === 'off' || HANDS.state === 'fallback') HANDS.state = 'live';
HANDS.delegate = HANDS.delegate || '模拟';
ui();
return { fist: HANDS.fist, swirl: HANDS.swirl, depth: HANDS.depth, bridge: HANDS.bridge };
};
window.__conceptHands.idle = function () { HANDS.present = false; HANDS.pin = 0; HANDS.burst = 0; HANDS.tx = 300; HANDS.ty = 300; HANDS.src = 'debug'; HANDS.state = 'live'; HANDS.delegate = HANDS.delegate || '模拟'; ui(); };
window.__conceptHands.boxes = function (on) {
if (on) { sec.dataset.cam = 'on'; document.body.classList.add('hands-cam'); startBox(); }
else closeCam();
return { cam: sec.dataset.cam || '', on: !!boxRaf };
};
window.__conceptHands.feed = function (w, cx, cy, fist) {
const lm = [];
const W = Math.max(0.01, +w || 0.12), X0 = cx === undefined ? 0.5 : cx, Y0 = cy === undefined ? 0.55 : cy;
for (let i = 0; i < 21; i++) lm.push({ x: X0, y: Y0, z: 0 });
lm[0].x = X0; lm[0].y = Y0 + W * 0.9;                       // 腕
[5, 9, 13, 17].forEach((j, n) => { lm[j].x = X0 + (n - 1.5) * W * 0.32; lm[j].y = Y0 + W * 0.32; });
const tip = fist === undefined ? 0.55 : +fist;
[12, 16, 20].forEach((j, n) => { lm[j].x = X0 + (n - 1) * W * 0.30 * tip; lm[j].y = Y0 - W * 1.1 * tip; });
lm[4].x = X0 - W * 0.30; lm[4].y = Y0 - W * 0.90 * tip;         // 拇指尖
lm[8].x = lm[4].x + (0.06 + 0.78 * tip) * W; lm[8].y = Y0 - W * 1.15 * tip;  // 食指尖
debugHold = 0;
ingestAll([lm]);
debugHold = performance.now() + 1200;
return { wid: HANDS.nearWid, present: HANDS.present, handsN: HANDS.handsN, gesture: HANDS.gesture };
};
window.__conceptHands.read = function () {
return {
fingers: HANDS.fingers,
ext: HANDS.ext.map(v => +v.toFixed(2)),
pinchHold: HANDS.pinchHold,
fistHold: HANDS.fistHold,
pinch: +HANDS.pin.toFixed(2),
open: +HANDS.open.toFixed(2),
fist: +HANDS.fistRaw.toFixed(2),
scale: +(HANDS.scale || 0).toFixed(3),
roll: +(HANDS.roll || 0).toFixed(1),
swirl: +(HANDS.swirlRaw || 0).toFixed(2),
gesture: HANDS.gesture
};
};
window.__conceptHands.pose = function (opts) {
const o = opts || {};
const W = Math.max(0.01, +o.w || 0.12);
const X0 = o.cx === undefined ? 0.5 : o.cx, Y0 = o.cy === undefined ? 0.55 : o.cy;
const lm = [];
for (let i = 0; i < 21; i++) lm.push({ x: X0, y: Y0, z: 0 });
lm[0].x = X0; lm[0].y = Y0 + W * 1.45;                        // 腕：掌心下方约 1.4 个掌宽（真实比例）
[[5, 0], [9, 1], [13, 2], [17, 3]].forEach(pair => {
lm[pair[0]].x = X0 + (pair[1] - 1.5) * W * 0.34;
lm[pair[0]].y = Y0 + W * 0.30;
});
const want = [o.thumb, o.index, o.middle, o.ring, o.pinky]
.map(v => v === undefined ? 1 : Math.max(0, Math.min(1, +v)));
const chains = [[5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16], [17, 18, 19, 20]];
chains.forEach((c, n) => {
const e = want[n + 1], bx = lm[c[0]].x, by = lm[c[0]].y;
const ys = [-0.30, -0.60, -0.90], yf = [-0.10, 0.02, 0.16];
for (let k = 1; k <= 3; k++) {
lm[c[k]].x = bx;
lm[c[k]].y = by + W * (e * ys[k - 1] + (1 - e) * yf[k - 1]);
}
});
const te = want[0];
lm[1].x = X0 - W * 0.42; lm[1].y = Y0 + W * 0.10;
lm[2].x = X0 - W * 0.52; lm[2].y = Y0 - W * 0.05;
lm[3].x = X0 - W * (0.52 + 0.22 * te); lm[3].y = Y0 + W * (-0.05 - 0.13 * te + 0.07 * (1 - te));
lm[4].x = X0 - W * (0.52 + 0.55 * te); lm[4].y = Y0 + W * (-0.05 - 0.25 * te + 0.15 * (1 - te));
if (o.pinch !== undefined) {
const p = Math.max(0, Math.min(1, +o.pinch));
const wid = Math.hypot(lm[5].x - lm[17].x, lm[5].y - lm[17].y) || W;
const d = Math.max(0.004, wid * (0.62 - 0.27 * p));
const dx = lm[4].x - lm[8].x, dy = lm[4].y - lm[8].y;
const len = Math.hypot(dx, dy) || 1;
lm[4].x = lm[8].x + dx / len * d; lm[4].y = lm[8].y + dy / len * d;
}
if (o.roll) {
const r = (+o.roll) * Math.PI / 180;
const cx0 = (lm[0].x + lm[9].x) / 2, cy0 = (lm[0].y + lm[9].y) / 2;
const cos = Math.cos(r), sin = Math.sin(r);
for (let i = 0; i < 21; i++) {
const dx = lm[i].x - cx0, dy = lm[i].y - cy0;
lm[i].x = cx0 + dx * cos - dy * sin;
lm[i].y = cy0 + dx * sin + dy * cos;
}
}
if (o.jitter) {
const j = Math.max(0, Math.min(0.05, +o.jitter));
for (let i = 0; i < 21; i++) { lm[i].x += (Math.random() - 0.5) * 2 * j; lm[i].y += (Math.random() - 0.5) * 2 * j; }
}
debugHold = 0;
ingestAll([lm]);
debugHold = performance.now() + 1200;
return window.__conceptHands.read();
};
window.__conceptHands.tourState = function () {
const all = {};
TOUR.forEach(s => { all[s.k] = tourTest(s.k); });
return { on: tourOn, i: tourI, hold: +tourHold.toFixed(2), seen: !!localStorage.getItem(TOUR_KEY),
present: HANDS.present, x: Math.round(HANDS.x), y: Math.round(HANDS.y),
pin: +HANDS.pin.toFixed(2), fist: +HANDS.fist.toFixed(2), all: all };
};
})();
const PAIRS = {
'ball|storm':        ['雷暴电场', '球形发光体', '【强相关 · 形成条件】强电场把空气击穿、蒸发土壤里的硅，才可能出现持续发光的球体——它不是凭空出现的。'],
'ball|stroke':       ['回击', '球形发光体', '【强相关 · 同一场雷暴】回击提供瞬时上万度的高温通道，球形发光体出现在通道附近，被同一次放电“烤”出来。'],
'ball|bubble':       ['硅纳米颗粒', '球形发光体', '【主流解释】雷击土壤蒸发出硅蒸气，冷凝成纳米颗粒并在空气中缓慢氧化发光——这条链条能解释漂浮、穿窗与数秒寿命。'],
'ball|quantum':      ['微波孤子', '球形发光体', '【竞争解释】电磁能量被非线性自局域成一团，不立刻散掉，因此看起来是一个“会飘的亮点”。'],
'bubble|quantum':    ['硅纳米颗粒', '微波孤子', '【两条假设】一条从物质出发（颗粒氧化），一条从场出发（能量自局域）——目前谁也说服不了谁。'],
'transition|fusion': ['等离子体', '能量密度', '【同一件事的两种说法】电离气体能储存多少能量，决定它看起来是微弱电晕还是刺眼的电弧。'],
'nucleus|observer':  ['量子化', '叠加态', '【量子基础】能量只能一格一格地取值；没被测量前，系统可以同时处在多个状态的组合里。'],
'observer|rose':     ['叠加态', '观测与坍缩', '【测量的谜】测量让叠加给出一个确定结果——为什么？这是本节留给你的问题。'],
'transition|stroke': ['等离子体', '回击', '【放电本质】回击就是一条被瞬间加热成等离子体的通道，亮度来自上万度的电离气体。'],
'storm|macro':       ['雷暴电场', '梯级先导', '【放电第一步】电场达到击穿阈值，空气被撕开一条通道，一段一段往下探——闪电真正开始的地方。']
};
const EDGES = [
['storm', 'macro', '击穿空气'],
['macro', 'stroke', '接通通道'],
['stroke', 'transition', '通道被烧成等离子体'],
['stroke', 'ball', '同一次放电里出现'],
['ball', 'bubble', '主流解释'],
['ball', 'quantum', '竞争解释'],
['ball', 'fusion', '能量密度估算'],
['bubble', 'quantum', '两条假设互不相让'],
['transition', 'fusion', '同体积能存多少能量'],
['transition', 'nucleus', '能级与跃迁'],
['nucleus', 'observer', '离散取值与叠加'],
['observer', 'rose', '测量与坍缩']
];
const CONCEPT_GRAPH = {};
EDGES.forEach(([x, y, label]) => {
(CONCEPT_GRAPH[x] = CONCEPT_GRAPH[x] || {})[y] = label;
(CONCEPT_GRAPH[y] = CONCEPT_GRAPH[y] || {})[x] = label;
});
function findConceptPath(start, end) {
if (start === end) return [start];
const queue = [[start]];
const visited = new Set([start]);
while (queue.length > 0) {
const path = queue.shift();
const curr = path[path.length - 1];
if (curr === end) return path;
const neighbors = CONCEPT_GRAPH[curr] || {};
for (const nb of Object.keys(neighbors)) {
if (!visited.has(nb)) {
visited.add(nb);
queue.push([...path, nb]);
}
}
}
return null;
}
(function normalizePairs(){
Object.keys(PAIRS).forEach(k => {
const norm = k.split('|').sort().join('|');
if (norm !== k) { PAIRS[norm] = PAIRS[k]; delete PAIRS[k]; }
});
})();
const combo = { a:null, b:null };
const slotEls = { a: $('[data-slot="a"]'), b: $('[data-slot="b"]') };
const REALITY = (window.LAB && window.LAB.reality) || { concepts:{}, pairs:{}, statusLine:{} };
let rlOpen = false;
let shotCtl = null;
let theaterOn = false;
function escHtml(s){
return String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
}
function realityLayer(ids, key, midNames){
const con = REALITY.concepts || {};
const pair = (REALITY.pairs || {})[key] || null;
const verdict = pair ? pair.verdict : 'none';
const verdictLabel = !pair ? '未收录' : (verdict === 'partial' ? '部分成立' : '不成');
const gapTpl = pair ? pair.gap : '这一对还没有写现实层条目：只有被单独讨论过的概念对才有结论，其余只能看它们各自在现实里是什么。';
const gap = gapTpl.replace('{mid}', midNames ? '「' + midNames + '」' : '中介');
const rows = ids.map(id => {
const c = con[id];
if (!c) return '';
const tag = (REALITY.statusLine || {})[c.status] || '';
return '<p class="rl-row"><b>' + escHtml(nodes[id].n) + '</b>' +
(tag ? '<span class="rl-tag t-' + escHtml(c.status) + '">' + escHtml(tag) + '</span>' : '') +
escHtml(c.real) + '</p>' +
(c.hyp ? '<p class="rl-hyp"><b>仍在争论</b>' + escHtml(c.hyp) + '</p>' : '');
}).join('');
const srcs = ids.map(id => con[id] && con[id].src).filter(Boolean);
const srcLine = srcs.length ? srcs.map(s => escHtml(s)).join('；') : '待核实';
const shotId = ids.map(id => con[id] && con[id].shot).filter(Boolean)[0] || '';
const shotMeta = shotId && window.REALITY_SHOTS && window.REALITY_SHOTS.list[shotId];
const fig = shotMeta
? '<div class="rl-fig"' + (rlOpen ? '' : ' hidden') + '><div class="rl-shot" data-shot="' + escHtml(shotId) + '"></div>' +
'<button class="rl-expand" type="button" aria-label="把短片放大到舞台">放大 ⤢</button>' +
'<p class="rl-num">' + escHtml(shotMeta.nums) + '</p></div>'
: '';
const tools = '<span class="co-tools"><span class="co-verdict">现实 <b class="v-' + verdict + '">' + verdictLabel + '</b></span>' +
'<button class="rl-toggle" type="button" aria-expanded="' + (rlOpen ? 'true' : 'false') + '" aria-controls="comboReality">' +
'现实里呢<i aria-hidden="true">▾</i></button></span>';
const panel = fig + '<div class="rl" id="comboReality"' + (rlOpen ? '' : ' hidden') + '>' +
'<div class="rl-head">② 现实里</div>' + rows +
'<div class="rl-head">③ 分界</div><p class="rl-gap">' + escHtml(gap) + '</p>' +
'<p class="rl-src">出处：' + srcLine + '</p></div>';
return { tools: tools, panel: panel };
}
function comboMode(a, b, hasPair){
const label = (CONCEPT_GRAPH[a] && CONCEPT_GRAPH[a][b]) || '';
if (label === '测量与坍缩' || label === '离散取值与叠加') return 'collapse';
if (label.indexOf('击穿') >= 0 || label.indexOf('接通') >= 0 || label.indexOf('等离子体') >= 0) return 'flash';
if (label.indexOf('同一次放电') >= 0) return 'flash';
if (hasPair || label) return 'bloom';
return 'collapse';
}
function paintCombo(){
['a','b'].forEach(s => {
const el = slotEls[s], k = combo[s];
if (k){
el.textContent = nodes[k].n;
el.classList.add('full');
el.title = '点击移除该概念';
} else {
el.textContent = s === 'a' ? '拖入第 1 个概念' : '拖入第 2 个概念';
el.classList.remove('full');
el.title = '';
}
});
const out = $('#comboOut');
$('#comboClear').disabled = !combo.a && !combo.b;
if (combo.a && combo.b){
const ids = [combo.a, combo.b];
const key = [combo.a, combo.b].sort().join('|');
const p = PAIRS[key];
let cls = 'ok', flow = '', fic = '', midNames = '';
if (p){
flow = p[0] + '　⊕　' + p[1];
fic = p[2];
triggerStageResonance(combo.a, combo.b, true);
} else {
const path = findConceptPath(combo.a, combo.b);
if (path && path.length === 3) {
cls = 'ok chain-out';
const flowSteps = path.map(id => nodes[id].n).join(' → ');
midNames = path.slice(1, -1).map(id => nodes[id].n).join('、');
flow = '间接关联　' + flowSteps;
fic = '这两个概念没有直接关系，但都连得到「' + midNames + '」——它们在同一张网里，中间隔着的就是这一步。';
triggerStageResonance(combo.a, combo.b, false, path);
} else {
cls = 'no';
flow = nodes[combo.a].n + '　·　' + nodes[combo.b].n;
fic = path
? '它们在同一张网里，但隔着 ' + (path.length - 2) + ' 步——现在的证据还不足以把这条线说成一条因果。'
: '现在的关系网里，这两个概念之间还没有通路：要么是缺了一个中间概念，要么它们本来就不该被连起来。';
}
}
if (window.__stageMorph) window.__stageMorph(combo.a, combo.b, comboMode(combo.a, combo.b, !!p));
const rl = realityLayer(ids, key, midNames);
out.className = 'combo-out ' + cls + (rlOpen ? ' rl-open' : '');
out.innerHTML = '<span class="co-top"><span class="flow">' + flow + '</span>' + rl.tools + '</span>' +
'<span class="co-fic">' + fic + '</span>' + rl.panel;
} else {
rlOpen = false;
out.className = 'combo-out no';
out.textContent = '放进两个概念看看：有直接关系就给出结论，没关系就找出它们隔着谁。';
}
mountShot();
}
function currentShotId(){
const con = (REALITY && REALITY.concepts) || {};
return [combo.a, combo.b].map(id => con[id] && con[id].shot).filter(Boolean)[0] || '';
}
function mountShot(){
if (shotCtl){ shotCtl.destroy(); shotCtl = null; }
if (!theaterOn && !rlOpen) return;
const host = theaterOn ? $('#shotTheaterHost') : $('#comboOut').querySelector('.rl-shot');
const id = currentShotId();
if (!host || !id || !window.REALITY_SHOTS) return;
shotCtl = window.REALITY_SHOTS.mount(host, id);
}
const SHOT_TITLES = { leader: '阶梯先导与回击', decohere: '测量与退相干', barrier: '库仑势垒与聚变' };
function openTheater(){
const id = currentShotId();
const box = $('#shotTheater');
if (!id || !box) return;
theaterOn = true;
box.hidden = false;
const sec = document.getElementById('concepts');
if (sec) sec.classList.add('theater-on');
$('#shotTheaterTitle').textContent = '现实里 · ' + (SHOT_TITLES[id] || '机制短片');
mountShot();
const btn = $('#shotTheaterClose');
if (btn) btn.focus();
}
function closeTheater(){
const box = $('#shotTheater');
if (!box || !theaterOn) return;
theaterOn = false;
box.hidden = true;
const sec = document.getElementById('concepts');
if (sec) sec.classList.remove('theater-on');
mountShot();
}
function triggerStageResonance(nodeA, nodeB, direct, path) {
const inner = $('#stageInner');
if (!inner) return;
inner.classList.remove('combo-resonate', 'combo-chain');
void inner.offsetWidth; // 触发 reflow 重置动画
if (direct) {
inner.classList.add('combo-resonate');
} else {
inner.classList.add('combo-chain');
}
}
function putInCombo(k, slotName){
if (slotName){
const other = slotName === 'a' ? 'b' : 'a';
if (combo[other] === k) combo[other] = null;
combo[slotName] = k;
} else if (combo.a === k){ combo.a = null; }
else if (combo.b === k){ combo.b = null; }
else if (!combo.a) combo.a = k;
else if (!combo.b) combo.b = k;
else combo.a = k;
paintCombo();
setNode(k);
}
let dragK = null, dragMoved = false, dragSrc = null, ghostEl = null, gStartX = 0, gStartY = 0;
let dragClickPid = null, dragClickUntil = 0;
function killGhost(){
if (ghostEl){ ghostEl.remove(); ghostEl = null; }
if (dragSrc){ dragSrc.classList.remove('src-drag'); dragSrc = null; }
}
function makeGhost(k, x, y){
ghostEl = document.createElement('div');
ghostEl.className = 'drag-ghost';
ghostEl.textContent = nodes[k].n;
document.body.appendChild(ghostEl);
moveGhost(x, y);
}
function moveGhost(x, y){
if (!ghostEl) return;
ghostEl.style.left = x + 'px';
ghostEl.style.top = y + 'px';
}
function slotAt(x, y){
for (const s of Object.values(slotEls)){
const r = s.getBoundingClientRect();
if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return s;
}
const t = document.elementFromPoint(x, y);
return t && t.closest ? t.closest('[data-slot]') : null;
}
cgList.addEventListener('pointerdown', e => {
const b = e.target.closest('[data-node]');
if (!b) return;
dragK = b.dataset.node; dragMoved = false; dragSrc = b;
gStartX = e.clientX; gStartY = e.clientY;
});
addEventListener('pointermove', e => {
if (!dragK) return;
if (!dragMoved && Math.hypot(e.clientX - gStartX, e.clientY - gStartY) > 4){
dragMoved = true;
if (dragSrc) dragSrc.classList.add('src-drag');
makeGhost(dragK, e.clientX, e.clientY);
}
if (!dragMoved) return;
moveGhost(e.clientX, e.clientY);
const slot = slotAt(e.clientX, e.clientY);
Object.values(slotEls).forEach(s => s.classList.toggle('armed', s === slot));
});
addEventListener('pointerup', e => {
if (!dragK) return;
const slot = slotAt(e.clientX, e.clientY);
Object.values(slotEls).forEach(s => s.classList.remove('armed'));
if (slot && dragMoved){ putInCombo(dragK, slot.dataset.slot); dragClickPid = dragK; dragClickUntil = Date.now() + 500; }
else if (!dragMoved){ putInCombo(dragK); dragClickPid = dragK; dragClickUntil = Date.now() + 500; }
killGhost();
dragK = null; dragMoved = false;
});
addEventListener('pointercancel', () => { killGhost(); dragK = null; dragMoved = false; });
$('#comboClear').addEventListener('click', () => { closeTheater(); combo.a = null; combo.b = null; paintCombo(); });
$('#comboOut').addEventListener('click', e => {
const exp = e.target.closest('.rl-expand');
if (exp){
e.preventDefault();
e.stopPropagation();
openTheater();
return;
}
const btn = e.target.closest('.rl-toggle');
if (!btn) return;
e.preventDefault();
rlOpen = !rlOpen;
paintCombo();
const again = $('#comboOut').querySelector('.rl-toggle');
if (again) again.focus();
});
const shotTheaterEl = $('#shotTheater');
if (shotTheaterEl){
$('#shotTheaterClose').addEventListener('click', () => closeTheater());
shotTheaterEl.addEventListener('click', e => { if (e.target === shotTheaterEl) closeTheater(); });
document.addEventListener('keydown', e => {
if (e.key === 'Escape' && theaterOn) closeTheater();
});
}
Object.entries(slotEls).forEach(([slotKey, el]) => {
if (!el) return;
el.addEventListener('click', e => {
if (combo[slotKey]) {
combo[slotKey] = null;
paintCombo();
}
});
});
window.__combo = combo;
paintCombo();
const ARCH = [
{ id:'main', no:'01', name:'主角', rm:'THE NARRATOR', tag:'第一人称 · 未具名', role:'目击者 → 研究者', seal:'主', hue:226,
idn:['全书第一人称，没有出现姓名，只给出身份：雷电研究所的研究者。',
'十四岁生日那夜，父母被球形发光体烧成灰，他活了下来。此后一生都在追这颗球。'],
idq:{p:17, w:'我', t:'那块蛋糕上应该只插一根蜡烛。不，一根都不插，那是我的新生之夜'},
dir:['球形发光体的物理结构：不是被造出来，而是自然界早已存在的结构',
'载流子与空泡的探测、捕获与储存',
'共振爆发的武器化，以及它带来的系统毁伤'],
story:[['序曲','十四岁生日夜，一颗球形发光体进到屋里，父母在他眼前化为灰烬，他活了下来。'],
['大学','选大气电学专业，跟观测导师去云南做雷电统计，第一次看到球形发光体留下的痕迹。'],
['博士','导师建模导师，用数学模型逼近球形发光体；模型一个接一个失败。'],
['基地','捕获到一个载流子，理论顾问给出量子解释；此后是武器化。'],
['战争','球形发光体被装上舰载武器，共振爆发在戈壁上空升起一颗蓝太阳。'],
['尾声','项目负责人消失。他活下来，结婚，重新过普通人的日子——只有那朵玫瑰留了下来。']],
rel:[['parents','目击 · 父母死亡'],['zhang','学术启蒙'],['zhao','野外观测'],['gao','博士导师'],['ding','理论合作'],['lin','项目协作'],['jiang','战场行动'],['dai','大学同学 → 妻子'],['parker','战后 · 观察者']],
con:['ball','macro','bubble','rose'],
idx:[{p:13,w:'我',t:'十四岁生日，我们在十四个小火苗前坐下。'},
{p:16,w:'我',t:'我知道要多久才烧得成灰，所以这一定是个梦。'},
{p:17,w:'我',t:'那块蛋糕上应该只插一根蜡烛。不，一根都不插，那是我的新生之夜'}] },
{ id:'parents', no:'02', name:'父母', rm:'THE PARENTS', tag:'童年雷雨夜', role:'故事起点 · 目击者的失去', seal:'父', hue:212,
idn:['全记录中没有名字，只以「爸爸」「妈妈」出现。',
'他们的死是整本书的起点：一道球形发光体穿过房间，把人烧成灰，却让身下的板凳完好、冰凉。'],
idq:{p:14, w:'我', t:'平时忙得脚不沾地的两个人，那晚忽然都成了哲学家。'},
dir:['（没有研究方向）他们只出现在序曲的一夜。',
'留下的线索是那条选择性燃烧的痕迹：人成灰，板凳冰凉，旁边的书只烧掉一部分。',
'这条痕迹后来变成了主角一生的谜题，也变成了观测导师相册里最要紧的一页。'],
story:[['序曲','十四岁生日夜，雷雨中一道球形发光体进到屋里，父母当场化为灰烬。'],
['序曲','身下的板凳却是奇迹般的冰凉——烧人不烧物，这个细节成了全书的第一条线索。'],
['尾声','多年后那间屋子还在，桌子还在，椅子还在。']],
rel:[['main','儿子 · 唯一目击者']],
con:['storm','ball'],
idx:[{p:13,w:'我',t:'那是个雷雨的夜晚'},
{p:14,w:'我',t:'平时忙得脚不沾地的两个人，那晚忽然都成了哲学家。'}] },
{ id:'zhang', no:'03', name:'观测导师', rm:'GUANCE DAOSHI', tag:'大气电学 · 观测', role:'启蒙者 · 把目击变成证据', seal:'观', hue:232,
idn:['主角大学时的大气电学副教授，五十岁左右，「那种最一般的人」。',
'他有一本没给别人看过的相册：球形发光体穿过房间之后留下的痕迹。他把它交了出来。'],
idq:{p:46, w:'观测导师', t:'这东西我没给别人看过。给他们看，他们只会说是伪造的。'},
dir:['雷电观测与大气电学的工程化',
'把「目击」变成「证据」：痕迹、相册、旧计算稿',
'在基础理论的框架里做推演，也承认这个框架的边界'],
story:[['大学','讲大气电学的副教授；带主角去云南做雷电统计。'],
['大学','给主角看他藏了多年的相册：球形发光体留下的痕迹。'],
['大学','反对主角把球形发光体作为硕士论文课题：「年轻人不应热衷于一些虚无缥缈的东西。」'],
['基地','球形发光体武器测试时他还在场，说这次可能真的要再次看到它了。']],
rel:[['main','学生 → 同行'],['zhao','研究生']],
con:['storm','ball'],
idx:[{p:24,w:'叙述',t:'讲大气电学的是一位副教授，五十岁上下，最普通的那种人。'},
{p:46,w:'观测导师',t:'这东西我没给别人看过。给他们看，他们只会说是伪造的。'},
{p:136,w:'观测导师',t:'我们都是凡人。用超过常人的力气去追问，也只能在基础理论给的框架里推一步，越不过那道界。'}] },
{ id:'zhao', no:'04', name:'野外观测员', rm:'YEWAI GUANCE', tag:'野外观测 · 学生', role:'现场的普通人视角', seal:'野', hue:204,
idn:['观测导师的研究生，跟主角同一组去云南做雷电统计。',
'在球形发光体这件事上，他代表「这跟我没关系」的那一面：能自圆其说，就够了。'],
idq:{p:29, w:'野外观测员', t:'挺完美的。等离子体也好，孤立子谐振腔也好，能告诉你的不见得比这个学说多。'},
dir:['雷电野外观测的日常执行',
'对「解释」保持一种很健康的怀疑：能自圆其说，不等于是对的'],
story:[['大学','随观测导师和主角去云南做雷电统计，住县里的气象站。'],
['大学','当地人早就见惯球形发光体，管它叫「鬼魂的灯笼」。'],
['大学','在泰山气象站，他从炊事员老王嘴里问出了观测导师的旧事。']],
rel:[['zhang','研究生导师'],['main','同组观测']],
con:['storm','ball'],
idx:[{p:28,w:'叙述',t:'那组里除了司机和实验工，正式成员只有三个人：我、导师，还有他的一个研究生。'},
{p:29,w:'野外观测员',t:'挺完美的。等离子体也好，孤立子谐振腔也好，能告诉你的不见得比这个学说多。'}] },
{ id:'gao', no:'05', name:'建模导师', rm:'JIANMO DAOSHI', tag:'数学模型 · 导师', role:'把现象算成方程', seal:'建', hue:240,
idn:['主角的博士导师，麻省理工的博士，外号「火球」。',
'他和观测导师正好是两个极端：一个靠现场与痕迹，一个靠模型与计算。'],
idq:{p:33, w:'我', t:'我的博士导师牌子很硬，麻省理工出身。'},
dir:['雷电定位系统的工程实现',
'用数学模型逼近球形发光体的结构',
'把军用技术转民用：龙卷风预报、空泡探测'],
story:[['博士','收主角做博士生，先让他做雷电定位系统。'],
['博士','提醒主角：这东西的性质决定了它最后会和武器有关系。'],
['尾声','战后把空泡探测系统转为民用，让主角去做龙卷风预报。']],
rel:[['main','博士生'],['zhang','两条路：现场 vs 模型']],
con:['storm','ball','bubble'],
idx:[{p:33,w:'我',t:'我的博士导师牌子很硬，麻省理工出身。'},
{p:33,w:'我',t:'他管事很干脆，学生都怕他。'},
{p:72,w:'建模导师',t:'球形发光体的性质决定了它的研究最后肯定会和武器有关系，你信誓旦旦要追求一生的东西就这么抛弃了？'}] },
{ id:'lin', no:'06', name:'项目负责人', rm:'XIANGMU FUZEREN', tag:'少校 · 装备与作战', role:'把研究翻译成装备的人', seal:'项', hue:268,
idn:['新概念武器研究中心系统评价二部的少校，球形发光体武器项目的实际推动者。上级的女儿。',
'她关心的是「这东西能不能变成武器」——从第一次见面到最后一次，这一点没有变过。'],
idq:{p:57, w:'我', t:'她穿着军装走过来，笑得很亮。那种美不在时尚里。'},
dir:['新概念武器的系统评价',
'球形发光体的武器化：机载、舰载、部署',
'共振爆发武器的工程实现'],
story:[['大学','在系统评价二部第一次见面，她给主角看了那些「新概念武器」的样品。'],
['西伯利亚','和主角一起去见档案管理员，看 1962 年的球形发光体实验记录。'],
['基地','推动球形发光体武器项目；上级请主角在项目里「监督」她。'],
['战争','珠峰号被击沉、舰长阵亡之后，她越来越脆弱。'],
['尾声','共振爆发的那一夜，她的身体变得透明，量子态的项目负责人消失了。']],
rel:[['main','项目协作'],['ding','理论 → 武器化'],['jiang','恋人']],
con:['ball','fusion','observer'],
idx:[{p:57,w:'我',t:'她穿着军装走过来，笑得很亮。那种美不在时尚里。'},
{p:118,w:'上级',t:'她是我替自己选的。'},
{p:280,w:'叙述',t:'她的身体开始变透，成了一个晶莹的影子。然后，量子态的她消失了。'}] },
{ id:'jiang', no:'07', name:'舰长', rm:'JIANZHANG', tag:'海军上校 · 珠峰号', role:'另一条路上的人', seal:'舰', hue:198,
idn:['海军上校，珠峰号舰长。项目负责人办公桌照片上的那个人。',
'他代表军队里身体力行的另一面，也是主角始终无法成为的那种人。'],
idq:{p:78, w:'项目负责人', t:'舰长。珠峰号是他的船。'},
dir:['水面舰艇指挥',
'与球形发光体研究没有工作交集——这正是上级那句话的弦外之音'],
story:[['基地','第一次见面在海上；他把主角带到甲板上看海。'],
['基地','带主角出海，在小岛上目睹龙卷风；劝主角回到项目里。'],
['战争','珠峰号被击沉，他在舰上阵亡。']],
rel:[['lin','恋人'],['main','劝他回项目']],
con:['ball'],
idx:[{p:78,w:'项目负责人',t:'舰长。珠峰号是他的船。'},
{p:107,w:'舰长',t:'你退出球形发光体研究项目，项目负责人很难过，这个项目确实离不开你，所以我自告奋勇地来劝你回去，并对项目负责人保证我能成功。'},
{p:212,w:'叙述',t:'珠峰号的主甲板折断，半小时后沉没，包括舰长在内的两千多名官兵阵亡。'}] },
{ id:'ding', no:'08', name:'理论顾问', rm:'LILUN GUWEN', tag:'理论物理 · 量子解释', role:'给出解释的人', seal:'理', hue:252,
idn:['理论物理学家，档案里称他是「国内理论物理的顶峰人物」。',
'载流子、能量节点、量子态与观察者——球形发光体能被想明白的那一半，是他给的。'],
idq:{p:161, w:'理论顾问', t:'是自由电子，还是某个能量单元里的电子？如果是后者，这颗宏观原子的核在哪里？'},
dir:['载流子与能量节点的结构',
'量子态的坍缩与观察者',
'「超级观察者」的可能性'],
story:[['基地','第一次看到捕获的空泡，提出载流子与能量节点的问题。'],
['基地','指出球形发光体的飘行其实是不断的量子跃迁。'],
['基地','做观察者实验：去掉观察者，命中率只剩十分之一。'],
['尾声','战后被外部观察者找上门：怎么让球形发光体在没有观察者时也保持坍缩。']],
rel:[['main','理论合作'],['lin','理论 → 武器化'],['parker','超级观察者']],
con:['nucleus','quantum','observer','transition'],
idx:[{p:161,w:'理论顾问',t:'是自由电子，还是某个能量单元里的电子？如果是后者，这颗宏观原子的核在哪里？'},
{p:176,w:'理论顾问',t:'摄像机也算观察者，一样会让量子态坍缩。'},
{p:177,w:'叙述',t:'对目标的命中率只剩有人观察时的十分之一。'}] },
{ id:'dai', no:'09', name:'伴侣', rm:'BANLV', tag:'日常生活 · 婚姻', role:'他必须回去的那个世界', seal:'伴', hue:320,
idn:['大学同班同学。深夜的图书馆里，她问过主角在找什么。',
'战后她和主角结婚。她看得见主角在跟谁说话，却看不见那朵玫瑰。'],
idq:{p:19, w:'我', t:'桌对面坐着一个同班的女生，书都没摊开，只用手撑着脑袋看我。'},
dir:['（没有研究方向）她的位置是「日常」：战争结束后，人得重新学会过普通日子。',
'她与主角之间那道裂痕，来自一件她无法验证的东西：一朵看不见的玫瑰。'],
story:[['大学','深夜图书馆，她问主角：你很有目的性，你在找什么？'],
['尾声','战后重逢，两个月后两人结婚。'],
['尾声','她坚持要知道那朵「想象中的玫瑰」是谁插的——这成了他们之间的裂痕。']],
rel:[['main','大学同学 → 妻子']],
con:['rose','observer'],
idx:[{p:19,w:'我',t:'桌对面坐着一个同班的女生，书都没摊开，只用手撑着脑袋看我。'},
{p:283,w:'我',t:'再往后两个月，我们结婚了。'},
{p:289,w:'伴侣',t:'那朵玫瑰是谁插的，你一定得告诉我。不然我受不了。'}] },
{ id:'parker', no:'10', name:'外部观察者', rm:'WAIBU GUANCHAZHE', tag:'SETI · 观察者', role:'把问题推到最后一步的人', seal:'外', hue:186,
idn:['外部观察者，天文学家，SETI@home 项目主管。',
'战后他亲自找上门，要验证一个猜想：这世界上存在一个「超级观察者」。'],
idq:{p:284, w:'外部观察者', t:'我们想找的是这种情形：没有观察者在场，它仍然坍缩着，而不是回到量子态。'},
dir:['SETI：寻找外星文明',
'用球形发光体检验「超级观察者」',
'把球形发光体研究带出战争语境'],
story:[['大学','主角拿 SETI@home 的计算资源算球形发光体模型；那份工作的主管署名外部观察者。'],
['尾声','战后亲自来访，提出超级观察者的实验。'],
['尾声','「如果早些发现那个超级观察者，这场战争也许就能避免了。」']],
rel:[['main','战后 · 观察者'],['ding','请教理论']],
con:['observer','quantum'],
idx:[{p:83,w:'外部观察者',t:'SETI@home项目主管外部观察者'},
{p:284,w:'外部观察者',t:'我们想找的是这种情形：没有观察者在场，它仍然坍缩着，而不是回到量子态。'},
{p:285,w:'外部观察者',t:'如果真能证明有一个超级观察者一直看着我们这个世界，人类的行为大概会检点得多。'}] }
];
const PORTRAITS = {
main: 'data:image/webp;base64,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',
parents: 'data:image/webp;base64,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',
zhang: 'data:image/webp;base64,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',
zhao: 'data:image/webp;base64,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',
gao: 'data:image/webp;base64,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',
lin: 'data:image/webp;base64,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',
jiang: 'data:image/webp;base64,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',
ding: 'data:image/webp;base64,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',
dai: 'data:image/webp;base64,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',
parker: 'data:image/webp;base64,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'
};
(function elementLab(){
const D = window.LAB;
if (!D) { console.warn('[lab] 数据缺失'); return; }
const root = document.getElementById('lab');
const svg = document.getElementById('labSvg');
const palette = document.getElementById('labPalette');
const consoleEl = document.getElementById('labConsole');
const resultEl = document.getElementById('labResult');
const panelEl = document.getElementById('labPanel');
const switchEl = document.getElementById('labSwitch');
const taskBar = document.getElementById('labTasks');
const logEl = document.getElementById('labLog');
if (!root || !svg) return;
const LV = D.meta.levels;
const LEVEL_PLAIN = {
canon: '本设定摘录直接写了这件事',
infer: '摘录没直说，是从情节推出来的',
sim: '我们为了能操作而定的规则，不是本记录的内容',
todo: '目前没找到依据，只能存疑'
};
const state = {
on: false, task: 'game', nodes: [], links: [], sel: null, linkFrom: null, mark: null,
scanR: 0.45, scanState: 'idle', found: false,
sig: null,
result: null, log: [], runs: {}, anim: null
};
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const badge = (lv, plain) => '<i class="lb lv-' + lv + '" title="' + esc(LEVEL_PLAIN[lv] || '') + '">' +
(LV[lv] ? LV[lv].label : lv) + '</i>' + (plain ? '<i class="lb-note">' + esc(LEVEL_PLAIN[lv] || '') + '</i>' : '');
const elOf = id => D.elements[id] || null;
const size = () => {
const r = svg.getBoundingClientRect();
return { w: Math.max(320, r.width || root.clientWidth), h: Math.max(240, r.height || 420) };
};
const stopAnim = () => { if (state.anim) { clearTimeout(state.anim); state.anim = null; } };
function place(id, x, y) {
if (!elOf(id) || state.nodes.some(n => n.id === id)) return;
const s = size(), n = state.nodes.length;
const px = x == null ? s.w * 0.28 + (n % 3) * 96 : x;
const py = y == null ? s.h * 0.22 + Math.floor(n / 3) * 92 : y;
state.nodes.push({ id, x: Math.max(46, Math.min(s.w - 46, px)), y: Math.max(46, Math.min(s.h - 46, py)) });
draw(); renderPalette();
}
function autoLinks() {
const ids = new Set(state.nodes.map(n => n.id));
const keep = state.links.filter(l => l.user && ids.has(l.a) && ids.has(l.b));
const auto = D.relations.filter(r => ids.has(r.from) && ids.has(r.to))
.map(r => ({ a: r.from, b: r.to, type: r.type, level: r.level, desc: r.desc }));
state.links = auto.concat(keep);
}
function draw() {
const s = size();
svg.setAttribute('viewBox', '0 0 ' + s.w + ' ' + s.h);
const pos = {};
state.nodes.forEach(n => { pos[n.id] = n; });
let g = '';
state.links.forEach(l => {
const a = pos[l.a], b = pos[l.b];
if (!a || !b) return;
const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
const ux = dx / len, uy = dy / len, r = 34;
const x1 = a.x + ux * r, y1 = a.y + uy * r, x2 = b.x - ux * r, y2 = b.y - uy * r;
const dash = l.level === 'canon' ? '' : l.level === 'infer' ? '7 6' : '2 6';
g += '<g class="llink lv-' + l.level + '">' +
'<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) +
'" stroke-dasharray="' + dash + '"/>' +
'<text x="' + ((x1 + x2) / 2).toFixed(1) + '" y="' + ((y1 + y2) / 2 - 6).toFixed(1) + '">' + esc(l.type) + '</text></g>';
});
state.nodes.forEach(n => {
const e = elOf(n.id);
if (!e) return;
const on = state.sel === n.id;
g += '<g class="lnode' + (on ? ' sel' : '') + '" data-node="' + n.id + '" transform="translate(' + n.x.toFixed(1) + ',' + n.y.toFixed(1) + ')">' +
'<circle r="34"/><circle class="ring" r="39"/>' +
'<text class="nm" y="1">' + esc(e.name) + '</text>' +
'<text class="lv" y="16">' + esc(LV[e.evidenceLevel] ? LV[e.evidenceLevel].label : '') + '</text></g>';
});
if (state.sig && state.sig.state !== 'gone') {
const g0 = state.sig;
g += '<g class="sig-label"><text x="' + (g0.x + 30).toFixed(1) + '" y="' + (g0.y + 4).toFixed(1) + '">' +
esc(SIG_LABEL[g0.state] || '信号') + '</text></g>';
}
if (state.mark) {
const mk = state.mark;
g += '<g class="lab-mark"><circle cx="' + mk.x.toFixed(1) + '" cy="' + mk.y.toFixed(1) + '" r="10"/>' +
'<circle class="pulse-ring" cx="' + mk.x.toFixed(1) + '" cy="' + mk.y.toFixed(1) + '" r="16"/>' +
'<line x1="' + (mk.x - 16).toFixed(1) + '" y1="' + mk.y.toFixed(1) + '" x2="' + (mk.x + 16).toFixed(1) + '" y2="' + mk.y.toFixed(1) + '"/>' +
'<line x1="' + mk.x.toFixed(1) + '" y1="' + (mk.y - 16).toFixed(1) + '" x2="' + mk.x.toFixed(1) + '" y2="' + (mk.y + 16).toFixed(1) + '"/>' +
'<text x="' + (mk.x + 22).toFixed(1) + '" y="' + (mk.y - 14).toFixed(1) + '">信号</text></g>';
}
svg.innerHTML = g;
}
function hit(x, y) {
let best = null, bd = 44;
state.nodes.forEach(n => { const d = Math.hypot(n.x - x, n.y - y); if (d < bd) { bd = d; best = n; } });
return best;
}
let drag = null;
svg.addEventListener('pointerdown', e => {
const box = svg.getBoundingClientRect();
const x = e.clientX - box.left, y = e.clientY - box.top;
const n = hit(x, y);
if (!n) { state.sel = null; draw(); renderPanel(); return; }
drag = { id: n.id, dx: x - n.x, dy: y - n.y, x0: n.x, y0: n.y };
svg.setPointerCapture(e.pointerId);
select(n.id);
});
svg.addEventListener('pointermove', e => {
if (!drag) return;
const box = svg.getBoundingClientRect();
const n = state.nodes.find(k => k.id === drag.id);
if (!n) return;
n.x = Math.max(44, Math.min(size().w - 44, e.clientX - box.left - drag.dx));
n.y = Math.max(44, Math.min(size().h - 44, e.clientY - box.top - drag.dy));
draw();
});
svg.addEventListener('pointerup', e => {
if (!drag) return;
const drag0 = drag;
const box = svg.getBoundingClientRect();
const x = e.clientX - box.left, y = e.clientY - box.top;
const id = drag.id;
drag = null;
if (state.sig && Math.hypot(state.sig.x - x, state.sig.y - y) < 58) {
const n = state.nodes.find(k => k.id === id);
if (n) { n.x = drag0.x0; n.y = drag0.y0; }   /* 施加后回到原位，别堆在信号上 */
applyToSignal(id);
} else { draw(); }
});
svg.addEventListener('pointercancel', () => { drag = null; });
function select(id) {
if (state.linkFrom && state.linkFrom !== id) {
const a = state.linkFrom, b = id;
state.linkFrom = null;
state.links.push({ a: a, b: b, type: '假设', level: 'todo', desc: '用户提出的假设，待核实', user: true });
state.sel = id;
draw(); renderPanel(); renderPalette();
showResult({
level: 'todo',
title: '连好了：' + elOf(a).name + ' → ' + elOf(b).name,
plain: '这条线是你自己提的，本设定里没有这么写。',
why: ['点线 = 待核实，表示"这只是个猜想"。', '右侧「关系」页签里是摘录已有的关系，可以拿来对照。'],
next: ['换两个节点再连一条', '去 02 屏看这两个词的摘录边界']
});
return;
}
state.sel = id;
draw();
renderPanel();
}
function renderPalette() {
const on = new Set(state.nodes.map(n => n.id));
const task = D.tasks.find(t => t.id === state.task);
palette.innerHTML = Object.keys(D.elements).map(id => {
const e = D.elements[id];
const active = on.has(id), inTask = task && task.elements.indexOf(id) >= 0;
return '<button class="pl-item' + (active ? ' on' : '') + (inTask ? ' task' : '') +
'" data-add="' + id + '"' + (active ? ' disabled' : '') + ' title="' + esc(e.definition) + '">' +
esc(e.name) + badge(e.evidenceLevel) + '</button>';
}).join('');
}
palette.addEventListener('click', e => {
const b = e.target.closest('[data-add]');
if (!b) return;
place(b.dataset.add);
autoLinks();
draw();
select(b.dataset.add);
});
let panelTab = 'def';
function renderPanel() {
if (!panelEl) return;
const e = state.sel ? elOf(state.sel) : null;
if (!e) {
panelEl.innerHTML =
'<div class="lp-empty"><b>选中一个元素看看</b>' +
'<p>点画布上的圆，这里会出现：它是什么、摘录怎么说、有什么规则、和谁有关系。</p>' +
'<p class="lp-legend"><i class="lg solid"></i>摘录直接写了<i class="lg dashed"></i>从情节推出<i class="lg dotted"></i>我们定的规则／待核实</p></div>';
return;
}
const rels = D.relations.filter(r => r.from === state.sel || r.to === state.sel);
const tabs = [['def', '是什么'], ['ev', '摘录'], ['rule', '规则'], ['rel', '关系']];
let body = '';
if (panelTab === 'def') {
body = '<p>' + esc(e.definition) + '</p>' +
'<p class="lp-k">在本设定里的作用</p><p>' + esc(e.role) + '</p>' +
'<p class="lp-k">摘录没交代的</p><p>' + esc((e.unknowns || []).join('；') || '—') + '</p>';
} else if (panelTab === 'ev') {
body = '<p class="lp-k">出处</p><p>' + esc(e.chapter) + ' · ' + esc(e.page) + '</p>' +
'<blockquote>' + esc(e.evidence) + '</blockquote>' +
'<p class="lp-note">' + esc(LEVEL_PLAIN[e.evidenceLevel] || '') + '。编号取自档案内部标记，与任何印本版次无关。</p>' +
'<button class="lp-jump" data-jump="' + esc(state.sel) + '">去 02 屏看这个词的三种读法</button>';
} else if (panelTab === 'rule') {
const r = e.rules || {};
const rows = [['什么时候成立', r.pre], ['怎么触发', r.trigger], ['状态怎么变', r.states], ['能看到什么', r.observable], ['什么情况会失败', r.fail], ['后果', r.consequence]];
body = rows.map(([k, v]) => '<div class="lp-rule"><b>' + k + '</b><span>' + esc((v || []).join('；') || '—') + '</span></div>').join('');
} else {
body = rels.length
? rels.map(r => {
const other = r.from === state.sel ? r.to : r.from;
const dir = r.from === state.sel ? '→' : '←';
return '<div class="lp-rel">' + esc(dir) + ' <b>' + esc(elOf(other) ? elOf(other).name : other) + '</b> ' +
badge(r.level) + '<span>' + esc(r.type) + '：' + esc(r.desc) + '</span>' +
'<i class="lp-page">档案 NO.' + esc(r.page) + '</i></div>';
}).join('')
: '<p class="lp-note">这一条还没录入和其他元素的关系。</p>';
}
panelEl.innerHTML =
'<div class="lp-head"><span class="lp-name">' + esc(e.name) + '</span>' + badge(e.evidenceLevel) + '</div>' +
'<div class="lp-tabs">' + tabs.map(([k, n]) => '<button data-tab="' + k + '"' + (k === panelTab ? ' aria-current="true"' : '') + '>' + n + '</button>').join('') + '</div>' +
'<div class="lp-body">' + body + '</div>';
}
if (panelEl) panelEl.addEventListener('click', e => {
const j = e.target.closest('[data-jump]');
if (j) {
const id = j.dataset.jump;
if (typeof go === 'function') go(2);
if (typeof setWord === 'function') setWord(id);
return;
}
const b = e.target.closest('[data-tab]');
if (!b) return;
panelTab = b.dataset.tab;
renderPanel();
});
const LEVEL_CLASS = { canon: 'ok', infer: 'maybe', sim: 'sim', todo: 'todo' };
function showResult(res, silent) {
state.result = res;
if (!resultEl) return;
if (!res) { resultEl.innerHTML = ''; resultEl.classList.remove('on'); return; }
resultEl.className = 'lab-result on ' + (LEVEL_CLASS[res.level] || 'sim');
resultEl.dataset.closable = '1';
const tries = state.runs[state.task] || 0;
resultEl.innerHTML =
'<button class="lr-close" data-close="1" aria-label="收起结果">收起</button>' +
'<div class="lr-sec lr-1"><span class="lr-num">①</span><b class="lr-title">' + esc(res.title) + '</b></div>' +
(res.plain ? '<p class="lr-plain">' + esc(res.plain) + '</p>' : '') +
(res.carry && res.carry.length
? '<p class="lr-carry">这一步留下：' + res.carry.map(esc).join(' · ') + '</p>' : '') +
(res.next && res.next.length
? '<div class="lr-sec lr-3"><span class="lr-num">②</span><b>下一步点这里</b></div><div class="lr-next">' +
res.next.map(s => '<span>' + esc(s) + '</span>').join('') + '</div>'
: '') +
'<button class="lr-more" data-more="1">为什么？看摘录 ▾</button>' +
'<div class="lr-extra">' +
'<div class="lr-sec"><span class="lr-num">③</span><b>为什么</b>' + badge(res.level || 'sim', true) + '</div>' +
'<div class="lr-body">' + (res.why || res.body || []).map(s => '<p>' + esc(s) + '</p>').join('') +
(res.ev ? '<p class="lr-ev">摘录：' + esc(res.ev) + '</p>' : '') + '</div></div>' +
(tries > 1 ? '<p class="lr-tries">这是本任务第 ' + tries + ' 次尝试</p>' : '');
if (!silent) {
state.runs[state.task] = tries + 1;
state.log.push(Object.assign({ t: Date.now(), task: state.task }, res));
renderLog();
renderSteps();
renderQuest();
}
}
function renderSteps() {
const t = D.tasks.find(x => x.id === state.task);
const box = document.getElementById('labSteps');
if (!box || !t) return;
const done = (state.runs[state.task] || 0) > 0;
const steps = t.steps || [];
const curIdx = done ? steps.length - 1 : 0;
box.innerHTML = '<span class="st-label">步骤</span>' + steps.map((txt, i) =>
'<span class="st' + (i === curIdx ? ' cur' : '') + (done && i < curIdx ? ' done' : '') + '">' +
(i + 1) + '. ' + esc(txt) + '</span>').join('<em>›</em>');
}
function renderConsole() {
if (QZ_META[state.task]) {
const m = QZ_META[state.task];
consoleEl.innerHTML =
'<div class="lc-head"><span class="lc-task">' + m.icon + ' ' + esc(m.name) + '</span>' +
'<span class="lc-goal">' + esc(m.intro) + '</span></div>' +
'<div class="lc-controls"><button class="lc-run" data-act="run">' + (QZ && QZ.phase !== 'intro' ? '重新开始' : '开始') + '</button>' +
'<span class="lc-drag-hint">题目全部来自本设定摘录，编号已核对</span></div>';
return;
}
if (state.task === 'game') {
const playing = G && G.phase === 'play';
consoleEl.innerHTML =
'<div class="lc-head"><span class="lc-task">⚡ 雷雨夜 · 抓球闪</span>' +
'<span class="lc-goal">60 秒里尽量多抓。每抓一个，解锁一句本设定摘录。</span></div>' +
'<div class="lc-controls">' +
'<button class="lc-run" data-act="run">' + (playing ? '重新开始' : '开始（60 秒）') + '</button>' +
'<span class="lc-drag-hint">点一下 = 定住 · 再点一下 = 抓住 · 红刺球别碰</span></div>';
return;
}
const t = state.task === 'line'
? {
id: 'line',
name: '任务线 · 完整推演',
goal: '从发现一个信号，一路推到"要不要把它变成武器"，每一步的选择都会留在档案里。',
ask: '按顺序过关：第 1 步拖概念，后面四步每步一个小玩法，玩完自动进下一关。',
steps: ['找到信号', '激发它', '捕获它', '推断结构', '决定怎么用'],
sim: '阈值、窗口、就绪度的算法都是我们定的模拟参数；引用的摘录页码是真的。',
todo: ['就绪度的权重（四项平均）属于我们的设定，不是本记录的内容。']
}
: (D.tasks.find(x => x.id === state.task) || D.tasks[0]);
consoleEl.innerHTML =
'<div class="lc-head"><span class="lc-task">' + esc(t.name) + '</span>' +
'<span class="lc-goal">' + esc(t.goal) + '</span></div>' +
'<p class="lc-ask">你要做：' + esc(t.ask || '') + '</p>' +
'<div class="lc-steps" id="labSteps"></div>' +
'<div class="lc-controls">' + controlsFor(t) + '</div>' +
'<div class="lc-foot">' + footFor(t) + '</div>';
renderSteps();
}
const CHAIN = [
{ id: 'search', name: '找到信号' },
{ id: 'state', name: '激发它' },
{ id: 'capture', name: '捕获它' },
{ id: 'nucleus', name: '推断结构' },
{ id: 'observer', name: '观察与玫瑰' }
];
function chainIndex() { return CHAIN.findIndex(c => c.id === state.task); }
const questEl = document.getElementById('labQuest');
function renderQuest() {
if (!questEl) return;
if (state.task === 'game' || QZ_META[state.task]) { questEl.innerHTML = ''; return; }
if (state.task === 'line') {
questEl.innerHTML = LINE_STEPS.map((st, k) => {
const done = state.line.step > k;
return '<span class="q' + (k === state.line.step && !state.line.done ? ' cur' : '') + (done ? ' done' : '') + '">' +
(done ? '✓' : (k + 1)) + ' ' + esc(st.name) + '</span>';
}).join('<em>→</em>') + '<em class="qv">LINE</em>';
return;
}
const i = chainIndex();
questEl.innerHTML = CHAIN.map((c, k) => {
const done = state.runs[c.id] > 0;
const cur = k === i;
return '<span class="q' + (cur ? ' cur' : '') + (done ? ' done' : '') + '">' +
(done ? '✓' : (k + 1)) + ' ' + esc(c.name) + '</span>';
}).join('<em>→</em>') + '<em class="qv">' + LAB_VERSION + '</em>';
}
function objChain() {
const i = chainIndex();
if (i < 0) return '';
const cur = CHAIN[i];
const next = CHAIN[i + 1];
const done = state.runs[cur.id] > 0;
return '<button class="lc-obj-btn" data-act="obj">本步目标：' + esc(cur.name) + (done ? ' ✓' : '') + '</button>' +
(next ? '<button class="lc-obj-next" data-act="next">下一步：' + esc(next.name) + ' →</button>' : '<span class="lc-obj-end">这条线走到头了</span>');
}
function footFor(t) {
return '<span class="lc-sim">模拟参数：' + esc(t.sim) + '</span>' +
(t.todo && t.todo.length ? '<span class="lc-todo">待核对：' + esc(t.todo[0]) + '</span>' : '') +
'<button class="lc-hypo" data-act="hypo">把选中节点设为假设起点</button>';
}
function controlsFor(t) {
if (t.id === 'line') return lineControls();
switch (t.id) {
case 'search':
return '<span class="lc-drag-hint">把左边的概念拖到画布上的「信号」上</span>' +
'<button class="lc-run" data-act="run">看提示</button><button class="lc-reset" data-act="reset">重置信号</button>';
case 'state':
case 'capture':
case 'nucleus':
case 'observer':
return miniControls(t.id, '再玩一次');
case 'state_old':
return '<label>怎么激发<select id="pEx">' + D.scenarios.excitation.map(a => '<option value="' + a.id + '">' + esc(a.name) + '</option>').join('') + '</select></label>' +
'<label>给多少能量<input id="pPower" type="range" min="0" max="100" value="60"><output id="oPower">60</output></label>' +
'<button class="lc-run" data-act="run">施加激发</button><button class="lc-reset" data-act="reset">回到低能态</button>';
case 'capture':
return '<label>等多久再出手<input id="pWait" type="range" min="0" max="100" value="50"><output id="oWait">50</output></label>' +
'<button class="lc-run" data-act="run">按下捕获</button><button class="lc-reset" data-act="reset">重新观察</button>';
case 'nucleus':
return '<label>采几个点<input id="pSamples" type="range" min="3" max="24" value="8"><output id="oSamples">8</output></label>' +
'<label>轨迹看起来<select id="pTrack"><option value="bound">弯了</option><option value="free">基本是直线</option><option value="noise">乱得看不出</option></select></label>' +
'<button class="lc-run" data-act="run">推断一下</button><button class="lc-reset" data-act="reset">重新观测</button>';
case 'observer':
return '<label>谁来观察<select id="pObs">' + D.scenarios.observers.map(o => '<option value="' + o.id + '">' + esc(o.name) + '</option>').join('') + '</select></label>' +
'<button class="lc-run" data-act="run">运行</button><button class="lc-reset" data-act="reset">清空</button>' +
'<button class="lc-rose" data-act="rose">去看那朵玫瑰</button>';
default:
return '';
}
}
function runSearch() {
const g = state.sig;
if (!g) { initSignal(); showResult({ level: 'sim', title: '信号出现了', plain: '把左边元素库里的概念拖到它身上试试。', next: ['先拖「雷暴」或「观察者与坍缩」'] }); return; }
if (g.state === 'ready') {
showResult({ level: 'infer', title: '已经拿下了', plain: '信号被关进空泡，这一关完成。', next: ['重置信号再走一遍（换个顺序）'] });
return;
}
showResult({
level: 'sim', title: '这一关靠拖，不靠调参',
plain: '把元素库里的概念拖到信号上，它会给出反应。',
why: ['能对它动手的只有三类：激发（雷暴）、观察（观察者／量子态）、约束（空泡）。'],
next: ['拖「雷暴」过去：点着它', '拖「观察者与坍缩」过去：定住它'],
carry: g.steps.length ? ['已经试过：' + g.steps.join(' → ')] : []
});
}
function runState() {
const ex = D.scenarios.excitation.find(x => x.id === (document.getElementById('pEx') || {}).value) || D.scenarios.excitation[0];
const power = +(document.getElementById('pPower') || {}).value || 0;
if (!ex.power) {
showResult({
level: 'canon',
title: '没变化：还是那颗空泡',
plain: '不激发它，它就保持原样。',
why: ['本设定里的"激发"必须有外部能量：闪电、人工电弧之类。'],
next: ['把「怎么激发」换成人工电弧或自然雷击'],
ev: '档案 NO.161：我们所捕获到的那个空泡，哦，那个载流子……'
});
animNode('bubble', 'idle');
return;
}
const effective = power / 100 * ex.power;
if (effective < 0.45) {
showResult({
level: 'sim',
title: '能量不够：亮了一下又暗了',
plain: '注入的能量低于我们设的阈值（45%），没能把它点起来。',
why: ['摘录只写了"被激发"，没给具体数值，所以这个阈值是我们自己定的。'],
next: ['把「给多少能量」往右拉到 60 以上', '换成自然雷击，它的激发强度更高'],
ev: '摘录没有能量阈值——这条规则属于设计模拟。'
});
animNode('bubble', 'fail');
return;
}
animNode('macro', 'excite');
place('ball', null, null);
showResult({
level: 'canon',
title: '成了：空泡变成球形发光体',
plain: '能量注入后，它从"低能态"跳到"高能态"——就是本设定里的球形发光体。',
why: ['本设定原话是"闪电只是点燃或激发了它"，也就是说球形发光体不是被造出来的，是早就在那儿的结构被点着了。',
'注意"低能态／高能态"这个说法是我们为了方便理解用的，摘录没有用这个词。'],
next: ['等一会看它回落（约 2.6 秒）', '趁它亮着的时候做捕获（任务三）'],
ev: '档案 NO.113：球形发光体并不是由闪电产生的，而是自然界早已存在的一种结构。'
});
state.anim = setTimeout(() => {
showResult({
level: 'infer',
title: '回落：又变回暗的空泡',
plain: '高能态维持不住，能量散掉后回到原样。',
why: ['摘录没有写回落要多久，这里的 2.6 秒是模拟节奏。'],
next: ['再激发一次，比较两次是不是一样']
});
}, 2600);
}
function animNode(id, kind) {
const g = svg.querySelector('[data-node="' + id + '"]');
if (!g) return;
g.classList.add(kind === 'fail' ? 'fail' : 'pulse');
setTimeout(() => g.classList.remove('pulse', 'fail'), 900);
}
function runCapture() {
const wait = +(document.getElementById('pWait') || {}).value || 50;
const inWindow = wait >= 38 && wait <= 62;
if (inWindow) {
showResult({
level: 'canon',
title: '抓住了：关进空泡里',
plain: '出手时机落在它最稳定的那一段（38–62%）。',
why: ['本设定里这一步是直升机拉着电弧去"兜住"它，后来改用氦气飞艇。',
'这个百分比窗口是我们设的——摘录没有给出可以照着按的秒数。'],
next: ['拿它去做任务二的激发实验', '换个时机再抓一次，看会不会失手'],
ev: '档案 NO.161：我们所捕获到的那个空泡；档案 NO.164：捕获改用氦气飞艇。'
});
place('bubble', null, null);
} else {
showResult({
level: 'sim',
title: '没抓住：时机早了或晚了',
plain: '现在 ' + wait + '%，不在它最稳的 38–62% 之间。',
why: ['太早它还没稳，太晚它已经开始暗下去。',
'需求记录里提到"约 0.5 秒"的窗口，但全文检索没有这句话，所以这里只用一个模拟百分比。'],
next: ['把滑块调到 50 左右再按', '先看它亮起来的过程，再决定什么时候按']
});
}
}
function runNucleus() {
const n = +(document.getElementById('pSamples') || {}).value || 8;
const track = (document.getElementById('pTrack') || {}).value || 'bound';
if (n < 8) {
showResult({
level: 'sim',
title: '还不能判断：点太少了',
plain: '只有 ' + n + ' 个观测点，看不出轨迹是弯是直。',
why: ['本设定里的研究者也是先攒数据，再谈结构。'],
next: ['把「采几个点」拉到 8 以上']
});
return;
}
if (track === 'free') {
showResult({
level: 'infer',
title: '像自由电子：没找到中心',
plain: '轨迹基本是直的，看不出有东西拽着它。',
why: ['这不等于"没有能量节点"，只说明这批数据不支持。',
'摘录里研究者正是把"自由电子"和"原子里的电子"并列成两种可能。'],
next: ['观测更久一点再判断', '换一个电场更强的环境'],
ev: '档案 NO.161：是自由电子呢，还是一个能量单元中的电子？'
});
return;
}
if (track === 'noise') {
showResult({
level: 'sim',
title: '数据太乱：判断不了',
plain: '点散得看不出规律，任何结论都不可靠。',
why: ['这种失败在研究里很常见，不是你操作错了。'],
next: ['多采一些点', '换更安静的环境重新测']
});
return;
}
showResult({
level: 'infer',
title: '推断：中间有个没露面的核',
plain: '轨迹反复弯向同一个位置，说明那儿有东西在拉住它。',
why: ['这就是"能量节点"的推断方式：看不见它，但从轨迹能算出它大概在哪儿。',
'注意这是推出来的，不是直接看到的。'],
next: ['看看共振爆发需要的相撞速度（档案 NO.251）', '继续采样，确认弯折是不是稳定的'],
ev: '档案 NO.161：那这个能量单元的原子核在哪里呢？'
});
place('nucleus', null, null);
}
function runObserver() {
const id = (document.getElementById('pObs') || {}).value || 'direct';
const o = D.scenarios.observers.find(x => x.id === id) || D.scenarios.observers[0];
if (o.collapses === 'unknown') {
showResult({
level: 'todo',
title: '这个问题没有答案',
plain: '本设定只把"超级观察者"写成一个猜想，没说它存不存在。',
why: ['所以这里不给"成功／失败"，只把它标成待核实。'],
next: ['先对比"直接观察"和"关掉所有观测"两种确定的情况'],
ev: '档案 NO.176–177：观察者不需要有意识；去掉观察者后命中率只剩十分之一。'
});
return;
}
if (o.collapses === false) {
showResult({
level: 'canon',
title: '没人看着：结果散掉了',
plain: '关掉所有观测后，落点变得没法预测。',
why: ['摘录写得很具体：去掉观察者后，命中率只有有人观察时的十分之一。',
'这不是"实验更成功"，而是它退回了概率状态。'],
next: ['换成摄像机观察，看看有什么区别', '记住：摄像机也算观察者'],
ev: '档案 NO.177：只要去除观察者……命中率只及存在观察者时的十分之一。'
});
place('quantum', null, null);
return;
}
showResult({
level: 'canon',
title: '有人看着：定住了',
plain: id === 'camera' ? '摄像机没有人，但摘录明确说它也算观察者。' : '你在看，它就定成了确定的样子。',
why: ['本设定用这一点把物理和哲学接在一起：观察者不需要有意识。'],
next: ['试试"关闭所有观测"', '再去看那朵玫瑰'],
ev: '档案 NO.176：摄像机也是观察者……观察者并不需要有意识。'
});
place('observer', null, null);
place('quantum', null, null);
}
function runRose() {
showResult({
level: 'todo',
title: '量子花：没有配方',
plain: '你越盯着看，它越不出现；视线移开，余光里才有蓝色轮廓。',
why: ['设定把它写成文学意象：理解理论并不能让你"做"出它，也不能让你再看一次。'],
next: ['把这段和尾声摘录对照', '回 05 屏看那朵点云玫瑰'],
ev: '档案 NO.283：它只在你观测的那一刻开。'
});
}
let logOpen = false;
let compareSel = [];
function stamp(t) {
const d = new Date(t);
return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
}
function renderLog() {
if (!logEl) return;
const n = state.log.length;
logEl.classList.toggle('open', logOpen);
let html = '<button class="ll-head" data-log="toggle">实验记录 · ' + n + (logOpen ? ' ▾' : ' ▸') + '</button>';
if (logOpen && n) {
html += '<div class="ll-list">' + state.log.slice().reverse().map(function (r, i) {
const idx = state.log.length - 1 - i;
const on = compareSel.indexOf(idx) >= 0;
return '<div class="ll-item' + (on ? ' on' : '') + '">' +
'<button class="ll-title" data-log="show" data-i="' + idx + '">' + esc(r.title) + '</button>' +
'<span class="ll-lv">' + (LV[r.level] ? LV[r.level].label : '') + '</span>' +
'<span class="ll-time">' + stamp(r.t) + '</span>' +
'<button class="ll-cmp" data-log="cmp" data-i="' + idx + '">' + (on ? '已选' : '对比') + '</button></div>';
}).join('') + '</div>';
html += compareSel.length === 2
? '<button class="ll-do" data-log="docmp">并排对比这两次</button>'
: '<p class="ll-tip">选两条可以并排对比</p>';
}
logEl.innerHTML = html;
}
if (logEl) logEl.addEventListener('click', e => {
const b = e.target.closest('[data-log]');
if (!b) return;
const act = b.dataset.log;
if (act === 'toggle') { logOpen = !logOpen; renderLog(); return; }
if (act === 'show') { showResult(state.log[+b.dataset.i], true); return; }
if (act === 'cmp') {
const i = +b.dataset.i, k = compareSel.indexOf(i);
if (k >= 0) compareSel.splice(k, 1);
else { compareSel.push(i); if (compareSel.length > 2) compareSel.shift(); }
renderLog();
return;
}
if (act === 'docmp') {
const pair = compareSel.map(i => state.log[i]);
showCompare(pair[0], pair[1]);
}
});
function showCompare(a, b) {
if (!resultEl || !a || !b) return;
resultEl.className = 'lab-result on sim';
resultEl.innerHTML = '<div class="lr-sec"><span class="lr-num">≡</span><b>两次结果并排看</b></div>' +
'<div class="lr-cmp">' + [a, b].map(r =>
'<div class="lr-col"><b>' + esc(r.title) + '</b>' + badge(r.level || 'sim') +
(r.plain ? '<p class="lr-plain">' + esc(r.plain) + '</p>' : '') +
(r.why || r.body || []).map(x => '<p>' + esc(x) + '</p>').join('') +
(r.ev ? '<p class="lr-ev">摘录：' + esc(r.ev) + '</p>' : '') + '</div>').join('') + '</div>';
}
if (resultEl) resultEl.addEventListener('click', e => {
if (e.target.closest('[data-close]')) { showResult(null); return; }
if (e.target.closest('[data-more]')) {
resultEl.classList.toggle('open');
const b = resultEl.querySelector('[data-more]');
if (b) b.textContent = resultEl.classList.contains('open') ? '收起解释 ▴' : '为什么？看摘录 ▾';
}
});
consoleEl.addEventListener('input', e => {
const out = e.target.parentElement && e.target.parentElement.querySelector('output');
if (out) out.textContent = e.target.value;
if (e.target.id === 'pRadius' || e.target.id === 'lnRadius') {
state.scanR = (+e.target.value || 45) / 100;
state.scanState = 'idle';
state.mark = state.found ? state.mark : null;
draw();
}
});
consoleEl.addEventListener('click', e => {
const b = e.target.closest('[data-act]');
if (!b) return;
const act = b.dataset.act;
if (state.task === 'game' && act === 'run') { gameStart(); renderConsole(); return; }
if (QZ_META[state.task] && act === 'run') { quizStart(); renderConsole(); return; }
if (MINI_TASK[state.task] && act === 'run') { miniStartTask(state.task); return; }
if (act === 'mgeye') { miniEye(b.dataset.v === '1'); return; }
if (act === 'mgfire') { miniFire(); return; }
if (act === 'linerun' && state.task === 'line' && state.line && state.line.step >= 1 && state.line.step <= 4 && !LINE_FORCE) { miniStartLine(); return; }
if (act === 'reset') {
stopAnim(); state.log = []; compareSel = []; renderLog(); showResult(null);
state.runs[state.task] = 0;
setTask(state.task);
return;
}
if (act === 'hypo') {
if (!state.sel) {
showResult({ level: 'sim', title: '先在画布上点一个节点', plain: '选中一个元素，再点这个按钮。', next: ['从左边元素库点一个概念'] });
return;
}
state.linkFrom = state.sel;
showResult({ level: 'todo', title: '起点已设：' + elOf(state.sel).name, plain: '现在点画布上的另一个节点，就会连出一条你自己提的关系。', next: ['点另一个节点完成连线'] });
return;
}
if (act === 'linerun') { runLineStep(); return; }
if (act === 'lineweapon') { lineDecision('weapon'); return; }
if (act === 'linepeace') { lineDecision('peace'); return; }
if (act === 'linerestart') { startLine(); return; }
if (act === 'next') {
const i = chainIndex();
if (i >= 0 && CHAIN[i + 1]) setTask(CHAIN[i + 1].id);
return;
}
if (act === 'obj') {
showResult({ level: 'infer', title: '这一步的目标：' + CHAIN[chainIndex()].name,
plain: '整条线索是：找到信号 → 激发它 → 捕获它 → 推断结构 → 观察与玫瑰。',
why: ['每一步都在用本设定里同一条研究路径：先有信号，再谈结构，最后才是能不能用它。'],
next: ['按底部那个按钮往下走'] });
return;
}
if (act === 'rose') { runRose(); return; }
if (act !== 'run') return;
switch (state.task) {
case 'search': runSearch(); break;
case 'state': runState(); break;
case 'capture': runCapture(); break;
case 'nucleus': runNucleus(); break;
case 'observer': runObserver(); break;
}
});
var MINI_TASK = { state: 1, capture: 1, nucleus: 1, observer: 1 };
var LINE_FORCE = null;
var mgWrap = null, mgCv = null, mgx = null, mgRaf = 0, mgLast = 0, mgW = 0, mgH = 0, mgDpr = 1;
var MG = null;
const MG_HELP = {
state: { title: '按住，让雷劈它', plain: '画面里是一颗暗着的空泡。按住画面（或空格）就有雷劈下来给它充能，能量进了绿区就松手。', next: ['按住画面', '看底部的能量条，进绿区就松手'] },
capture: { title: '等它最亮的时候点', plain: '球形发光体一明一暗地飘。外圈变绿、底部指针进绿区时点一下画面（或空格），飞艇就把它兜住。抓 3 个。', next: ['盯住外圈颜色', '变绿就点'] },
nucleus: { title: '记下电子走过的地方', plain: '一个载流子在绕着看不见的东西转。点 6 下画面，每点一下记下它此刻的位置；然后点你觉得核所在的地方。', next: ['点 6 下记录轨迹', '再点一下你猜的核'] },
observer: { title: '开着摄像机打一轮，关掉再打一轮', plain: '左边发射球形发光体，右边是靶。先开着摄像机打 5 发，再关掉打 5 发，看命中差多少。', next: ['点「发射 5 发」', '再关掉摄像机打一轮'] }
};
function mgBuild() {
if (mgWrap) return true;
const host = root.querySelector('.lab-canvas');
if (!host) return false;
mgWrap = document.createElement('div');
mgWrap.className = 'lab-mini';
mgWrap.id = 'labMini';
mgWrap.innerHTML = '<canvas class="mg-cv" aria-label="小玩法画布"></canvas><div class="mg-top"></div><div class="mg-cap"></div>';
host.appendChild(mgWrap);
mgCv = mgWrap.querySelector('canvas');
mgx = mgCv.getContext('2d');
mgCv.addEventListener('pointerdown', e => { e.preventDefault(); try { mgCv.setPointerCapture(e.pointerId); } catch (_) {} mgDown(mgPt(e)); });
mgCv.addEventListener('pointerup', e => mgUp(mgPt(e)));
mgCv.addEventListener('pointercancel', () => mgUp(null));
addEventListener('keydown', e => {
if (!MG || !labVisible() || e.code !== 'Space' || e.repeat) return;
if (e.target && /INPUT|TEXTAREA|SELECT|BUTTON/.test(e.target.tagName)) return;
e.preventDefault(); mgDown(null);
});
addEventListener('keyup', e => { if (MG && e.code === 'Space') mgUp(null); });
addEventListener('resize', () => { if (MG) { mgPlace(); mgSize(); } });
return true;
}
function mgPt(e) { const r = mgCv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
function mgSize() {
const r = mgWrap.getBoundingClientRect();
mgDpr = Math.min(2, devicePixelRatio || 1);
mgW = Math.max(200, r.width); mgH = Math.max(200, r.height);
mgCv.width = Math.round(mgW * mgDpr); mgCv.height = Math.round(mgH * mgDpr);
mgx.setTransform(mgDpr, 0, 0, mgDpr, 0, 0);
}
function mgPlace() {
if (!mgWrap) return;
if (getComputedStyle(mgWrap).position !== 'absolute') { mgWrap.style.top = ''; mgWrap.style.bottom = ''; return; }
const host = mgWrap.parentElement.getBoundingClientRect();
const tb = taskBar && taskBar.offsetParent ? taskBar.getBoundingClientRect() : null;
const top = tb && tb.height ? Math.max(12, Math.round(tb.bottom - host.top + 8)) : 64;
let bottom = 10;
const q = questEl && questEl.offsetParent ? questEl.getBoundingClientRect() : null;
if (q && q.height && q.top > host.top + top + 120) bottom = Math.max(10, Math.round(host.bottom - q.top + 8));
mgWrap.style.top = top + 'px';
mgWrap.style.bottom = bottom + 'px';
}
function miniStartTask(id) {
miniStart(id, false, q => miniResult(id, q));
showResult(Object.assign({ level: 'sim' }, MG_HELP[id], { why: ['这一步的玩法是我们设计的，用来把本设定里的研究步骤变成能上手的操作。'] }), true);
}
function miniStartLine() {
const L = state.line, kind = ['state', 'capture', 'nucleus', 'observer'][L.step - 1];
miniStart(kind, true, q => {
const f = {};
if (kind === 'state') { f.lnEx = 'nature'; f.lnPower = Math.round(50 + q * 30); }
if (kind === 'capture') { f.lnWait = Math.round(50 + (1 - q) * 11); }
if (kind === 'nucleus') { f.lnSamples = Math.round(8 + q * 8); }
if (kind === 'observer') { f.lnObs = q.eye ? 'direct' : 'off'; }
LINE_FORCE = f;
try { runLineStep(); } finally { LINE_FORCE = null; }
const M = MG;
setTimeout(() => { if (state.task === 'line' && MG === M) miniStop(); }, 1600);
});
showResult(Object.assign({ level: 'sim' }, MG_HELP[kind], { why: ['任务线这一步用小玩法代替调参数；你玩得越准，后面的"就绪度"越高。'] }), true);
}
function miniStart(kind, line, done) {
if (!mgBuild()) return;
stopAnim();
root.classList.add('mini-on');
MG = { kind, line, done, t: 0, phase: 'play', sparks: [], bolts: [], floats: [], msg: '' };
mgPlace(); mgSize();
({ state: mgInitCharge, capture: mgInitCatch, nucleus: mgInitNuc, observer: mgInitObs })[kind]();
mgCap('');
renderConsole();
miniResume();
}
function miniStop() {
cancelAnimationFrame(mgRaf); mgRaf = 0;
MG = null;
root.classList.remove('mini-on');
}
function miniPause() { cancelAnimationFrame(mgRaf); mgRaf = 0; }
function miniResume() {
if (!MG || mgRaf) return;
mgLast = performance.now();
mgRaf = requestAnimationFrame(mgTick);
}
function mgTick(now) {
mgRaf = 0;
if (!MG || !state.on) return;
if (!labVisible() || document.hidden) { mgRaf = requestAnimationFrame(mgTick); mgLast = now; return; }
const dt = Math.min(0.05, (now - mgLast) / 1000); mgLast = now;
MG.t += dt;
try { mgStep(dt); mgDraw(); } catch (err) { console.error(err); }
mgRaf = requestAnimationFrame(mgTick);
}
function mgCap(html) { const c = mgWrap && mgWrap.querySelector('.mg-cap'); if (c) { c.innerHTML = html; c.classList.toggle('on', !!html); } }
function mgTop(html) { const c = mgWrap && mgWrap.querySelector('.mg-top'); if (c && c.innerHTML !== html) c.innerHTML = html; }
function mgFinish(q, cap) {
MG.phase = 'done';
mgCap(cap);
const M = MG;
setTimeout(() => { if (MG === M) { state.runs[M.kind] = (state.runs[M.kind] || 0); M.done(q); renderConsole(); } }, 900);
}
function mgFloat(x, y, txt, col) { MG.floats.push({ x, y, txt, col: col || '#fff', life: 1.2 }); }
function mgBurst(x, y, n, col, sp) {
for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, v = (sp || 160) * (0.3 + Math.random());
MG.sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.5 + Math.random() * 0.6, col: col || '255,200,120' }); }
}
function mgBolt(x0, y0, x1, y1) {
const pts = [[x0, y0]], n = 9;
for (let i = 1; i < n; i++) { const k = i / n; pts.push([x0 + (x1 - x0) * k + (Math.random() - 0.5) * 46, y0 + (y1 - y0) * k + (Math.random() - 0.5) * 16]); }
pts.push([x1, y1]);
MG.bolts.push({ pts, life: 0.22 });
}
function mgCommonStep(dt) {
MG.sparks.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.94; p.vy = p.vy * 0.94 + 60 * dt; p.life -= dt; });
MG.sparks = MG.sparks.filter(p => p.life > 0);
MG.bolts.forEach(b => b.life -= dt); MG.bolts = MG.bolts.filter(b => b.life > 0);
MG.floats.forEach(f => { f.y -= 34 * dt; f.life -= dt; }); MG.floats = MG.floats.filter(f => f.life > 0);
}
function mgBg() {
const g = mgx.createLinearGradient(0, 0, 0, mgH);
g.addColorStop(0, '#070a18'); g.addColorStop(1, '#04050c');
mgx.fillStyle = g; mgx.fillRect(0, 0, mgW, mgH);
mgx.strokeStyle = 'rgba(150,170,230,.05)'; mgx.lineWidth = 1;
for (let x = 0; x < mgW; x += 40) { mgx.beginPath(); mgx.moveTo(x, 0); mgx.lineTo(x, mgH); mgx.stroke(); }
for (let y = 0; y < mgH; y += 40) { mgx.beginPath(); mgx.moveTo(0, y); mgx.lineTo(mgW, y); mgx.stroke(); }
}
function mgGlow(x, y, r, rgb, a) {
const g = mgx.createRadialGradient(x, y, 0, x, y, r);
g.addColorStop(0, 'rgba(' + rgb + ',' + a + ')'); g.addColorStop(1, 'rgba(' + rgb + ',0)');
mgx.fillStyle = g; mgx.beginPath(); mgx.arc(x, y, r, 0, 6.283); mgx.fill();
}
function mgCommonDraw() {
mgx.save(); mgx.globalCompositeOperation = 'lighter';
MG.bolts.forEach(b => {
mgx.strokeStyle = 'rgba(200,215,255,' + Math.min(1, b.life * 5) + ')'; mgx.lineWidth = 2.4; mgx.shadowColor = '#9fb6ff'; mgx.shadowBlur = 14;
mgx.beginPath(); b.pts.forEach((p, i) => i ? mgx.lineTo(p[0], p[1]) : mgx.moveTo(p[0], p[1])); mgx.stroke();
});
mgx.shadowBlur = 0;
MG.sparks.forEach(p => { mgx.fillStyle = 'rgba(' + p.col + ',' + Math.min(1, p.life * 1.6) + ')'; mgx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3); });
mgx.restore();
MG.floats.forEach(f => { mgx.globalAlpha = Math.min(1, f.life); mgx.fillStyle = f.col; mgx.font = '600 16px system-ui,sans-serif'; mgx.textAlign = 'center'; mgx.fillText(f.txt, f.x, f.y); });
mgx.globalAlpha = 1;
}
function mgMeter(v, lo, hi, label) {
const w = Math.min(420, mgW - 60), x = (mgW - w) / 2, y = mgH - 34;
mgx.fillStyle = 'rgba(255,255,255,.08)'; mgx.fillRect(x, y, w, 10);
mgx.fillStyle = 'rgba(120,235,170,.45)'; mgx.fillRect(x + w * lo, y, w * (hi - lo), 10);
mgx.fillStyle = '#fff'; mgx.fillRect(x + w * Math.max(0, Math.min(1, v)) - 2, y - 5, 4, 20);
mgx.font = '11px system-ui,sans-serif'; mgx.fillStyle = 'rgba(220,230,255,.6)'; mgx.textAlign = 'left'; mgx.fillText(label, x, y - 8);
}
function mgDown(p) { if (!MG || MG.phase === 'done') return; ({ state: mgChargeDown, capture: mgCatchTap, nucleus: mgNucTap, observer: () => {} })[MG.kind](p); }
function mgUp(p) { if (MG && MG.kind === 'state') mgChargeUp(); }
function mgStep(dt) { mgCommonStep(dt); ({ state: mgChargeStep, capture: mgCatchStep, nucleus: mgNucStep, observer: mgObsStep })[MG.kind](dt); }
function mgDraw() { mgBg(); ({ state: mgChargeDraw, capture: mgCatchDraw, nucleus: mgNucDraw, observer: mgObsDraw })[MG.kind](); mgCommonDraw(); }
function mgInitCharge() { Object.assign(MG, { e: 0, hold: false, boltT: 0, lo: 0.5, hi: 0.85, miss: 0, lit: 0, shake: 0 }); }
function mgChargeDown() { if (MG.phase === 'play') MG.hold = true; }
function mgChargeUp() {
if (!MG.hold || MG.phase !== 'play') return;
MG.hold = false;
const cx = mgW / 2, cy = mgH * 0.48;
if (MG.e >= MG.lo && MG.e <= MG.hi) {
MG.lit = 0.001; mgBurst(cx, cy, 90, '255,190,110', 240); mgFloat(cx, cy - 90, '点着了！', '#ffd38a');
mgFinish(Math.max(0, 1 - Math.abs(MG.e - 0.675) / 0.2), '<b>空泡被点成了球形发光体</b>“闪电只是把它点亮了？”<i class="cite" data-cite="113" data-needle="q113" role="button" tabindex="0">档案 · 第 113 页</i>');
} else if (MG.e < MG.lo) {
MG.miss++; mgFloat(cx, cy - 80, '能量不够，再多按一会儿', '#b9c8ff');
} else {
MG.miss++; MG.shake = 0.4; mgBurst(cx, cy, 50, '200,215,255', 300); MG.e = 0; mgFloat(cx, cy - 80, '太猛了，散掉了', '#ffb0b0');
}
if (MG.miss >= 2) { MG.lo = 0.42; MG.hi = 0.92; }
}
function mgChargeStep(dt) {
const cx = mgW / 2, cy = mgH * 0.48;
if (MG.phase === 'play') {
if (MG.hold) {
MG.e = Math.min(1.05, MG.e + dt / 3.0);
MG.boltT -= dt;
if (MG.boltT <= 0) { MG.boltT = 0.14; mgBolt(cx + (Math.random() - 0.5) * 160, 0, cx + (Math.random() - 0.5) * 30, cy - 30); mgBurst(cx, cy - 30, 6, '200,215,255', 120); }
if (MG.e >= 1.05) mgChargeUp();
} else MG.e = Math.max(0, MG.e - dt * 0.5);
}
if (MG.lit) MG.lit = Math.min(1, MG.lit + dt * 2);
if (MG.shake) MG.shake = Math.max(0, MG.shake - dt);
}
function mgChargeDraw() {
const sx = MG.shake ? (Math.random() - 0.5) * 10 * MG.shake : 0;
const cx = mgW / 2 + sx, cy = mgH * 0.48, R = Math.min(mgW, mgH) * 0.13;
if (MG.lit) {
mgGlow(cx, cy, R * 3.4, '255,150,60', 0.55 * MG.lit);
mgGlow(cx, cy, R * 1.3, '255,230,180', 0.95 * MG.lit);
if (Math.random() < 0.4) mgBurst(cx + (Math.random() - 0.5) * R, cy + (Math.random() - 0.5) * R, 1, '255,200,120', 60);
} else {
mgGlow(cx, cy, R * 1.8, '150,175,255', 0.12 + MG.e * 0.5);
}
mgx.strokeStyle = 'rgba(190,210,255,' + (0.35 + MG.e * 0.5) + ')'; mgx.lineWidth = 1.6;
mgx.beginPath(); mgx.arc(cx, cy, R, 0, 6.283); mgx.stroke();
mgx.lineWidth = 7;
mgx.strokeStyle = 'rgba(255,255,255,.07)'; mgx.beginPath(); mgx.arc(cx, cy, R + 22, 0, 6.283); mgx.stroke();
const a0 = -Math.PI / 2;
mgx.strokeStyle = 'rgba(120,235,170,.4)'; mgx.beginPath(); mgx.arc(cx, cy, R + 22, a0 + MG.lo * 6.283, a0 + MG.hi * 6.283); mgx.stroke();
const inBand = MG.e >= MG.lo && MG.e <= MG.hi;
mgx.strokeStyle = inBand ? '#8ff0b8' : (MG.e > MG.hi ? '#ff9a9a' : '#cdd8ff');
mgx.beginPath(); mgx.arc(cx, cy, R + 22, a0, a0 + Math.min(1, MG.e) * 6.283); mgx.stroke();
mgMeter(MG.e, MG.lo, MG.hi, '能量（进绿区松手）');
mgTop(MG.phase === 'done' ? '✓ 点着了' : MG.hold ? (inBand ? '<b class="go">就是现在，松手！</b>' : '充能中…') : '<b>按住画面</b>（或空格）让雷劈它');
}
const CATCH_P = 2.6;
function mgInitCatch() { Object.assign(MG, { got: 0, need: 3, ph: Math.random() * CATCH_P, net: null, errs: [], gone: 0, seed: Math.random() * 10 }); }
function mgBall() {
const t = MG.t * 0.5 + MG.seed;
return { x: mgW * (0.5 + 0.28 * Math.sin(t * 1.1)), y: mgH * (0.42 + 0.16 * Math.sin(t * 1.7 + 1)) };
}
function mgBright() { const k = (MG.ph % CATCH_P) / CATCH_P; return 0.5 - 0.5 * Math.cos(k * 6.283); }
function mgCatchTap() {
if (MG.phase !== 'play' || MG.net || MG.gone > 0) return;
const b = mgBall(), v = mgBright();
MG.net = { x0: mgW / 2, y0: mgH - 20, x1: b.x, y1: b.y, k: 0, ok: v > 0.72 };
if (v > 0.72) {
MG.errs.push(1 - v);
} else {
const rising = (MG.ph % CATCH_P) / CATCH_P < 0.5;
mgFloat(b.x, b.y - 40, rising ? '早了，它还没最亮' : '晚了，它在变暗', '#b9c8ff');
}
}
function mgCatchStep(dt) {
if (MG.phase === 'play' && MG.gone <= 0) MG.ph += dt;
if (MG.gone > 0) { MG.gone -= dt; if (MG.gone <= 0) { MG.seed = Math.random() * 10; MG.ph = 0; } }
if (MG.net) {
MG.net.k += dt * 3.2;
if (MG.net.k >= 1) {
const n = MG.net; MG.net = null;
if (n.ok) {
MG.got++; mgBurst(n.x1, n.y1, 50, '255,200,120', 200); mgFloat(n.x1, n.y1 - 46, '抓住！' + MG.got + ' / ' + MG.need, '#8ff0b8');
if (MG.got >= MG.need) {
const err = MG.errs.reduce((a, b) => a + b, 0) / MG.errs.length;
mgFinish(Math.max(0, 1 - err / 0.28), '<b>三颗都关进了空泡</b>“我们抓到的那个空泡，里面有什么在转。”<i class="cite" data-cite="161" data-needle="q161a" role="button" tabindex="0">档案 · 第 161 页</i>');
} else MG.gone = 0.9;
}
}
}
}
function mgCatchDraw() {
const b = mgBall(), v = MG.gone > 0 ? 0 : mgBright(), R = Math.min(mgW, mgH) * 0.06;
const ok = v > 0.72;
mgx.fillStyle = 'rgba(200,210,240,.5)';
mgx.beginPath(); mgx.ellipse(mgW / 2, mgH - 18, 40, 11, 0, 0, 6.283); mgx.fill();
if (MG.gone <= 0 || MG.phase === 'done') {
if (MG.phase === 'done') {
mgGlow(b.x, b.y, R * 3, '255,160,70', 0.5);
mgx.strokeStyle = 'rgba(190,210,255,.7)'; mgx.lineWidth = 2; mgx.beginPath(); mgx.arc(b.x, b.y, R * 1.6, 0, 6.283); mgx.stroke();
} else {
mgGlow(b.x, b.y, R * (2 + v * 2.2), '255,160,70', 0.15 + v * 0.6);
mgGlow(b.x, b.y, R * 0.9, '255,235,190', 0.3 + v * 0.7);
mgx.strokeStyle = ok ? 'rgba(130,240,175,.95)' : 'rgba(200,210,255,.35)';
mgx.lineWidth = ok ? 3 : 1.5;
mgx.beginPath(); mgx.arc(b.x, b.y, R * (3.2 - v * 1.2), 0, 6.283); mgx.stroke();
}
}
if (MG.net) {
const n = MG.net, x = n.x0 + (n.x1 - n.x0) * n.k, y = n.y0 + (n.y1 - n.y0) * n.k;
mgx.strokeStyle = 'rgba(200,215,255,.8)'; mgx.lineWidth = 1.5; mgx.setLineDash([5, 5]);
mgx.beginPath(); mgx.moveTo(n.x0, n.y0); mgx.lineTo(x, y); mgx.stroke(); mgx.setLineDash([]);
mgx.beginPath(); mgx.arc(x, y, 10 + n.k * R, 0, 6.283); mgx.stroke();
}
mgMeter(v, 0.72, 1, '亮度（进绿区就点）');
mgx.fillStyle = 'rgba(255,255,255,.8)'; mgx.font = '600 13px system-ui,sans-serif'; mgx.textAlign = 'right';
mgx.fillText('抓到 ' + MG.got + ' / ' + MG.need, mgW - 16, mgH - 46);
mgTop(MG.phase === 'done' ? '✓ 三颗都抓到了' : ok ? '<b class="go">现在点！</b>' : '等外圈<b>变绿</b>再点（或空格）');
}
function mgInitNuc() {
Object.assign(MG, { cx: mgW * (0.4 + Math.random() * 0.2), cy: mgH * (0.4 + Math.random() * 0.12),
a: Math.min(mgW, mgH) * 0.3, b: Math.min(mgW, mgH) * 0.19, rot: Math.random() * 3, th: 0, marks: [], step: 'mark', guess: null, rev: 0, trail: [] });
}
function mgElec() {
const c = Math.cos(MG.rot), s = Math.sin(MG.rot);
const ex = MG.a * Math.cos(MG.th) * 0.7 + MG.a * 0.3, ey = MG.b * Math.sin(MG.th);
return { x: MG.cx + ex * c - ey * s - MG.a * 0.3 * c, y: MG.cy + ex * s + ey * c - MG.a * 0.3 * s };
}
function mgNucTap(p) {
if (MG.phase !== 'play') return;
if (MG.step === 'mark') {
const e = mgElec();
MG.marks.push(e); mgBurst(e.x, e.y, 12, '185,200,255', 110); mgFloat(e.x, e.y - 18, String(MG.marks.length), '#cdd8ff');
if (MG.marks.length >= 6) MG.step = 'guess';
return;
}
if (MG.step === 'guess') {
if (!p) return;
MG.guess = p; MG.step = 'reveal'; MG.rev = 0.001;
const d = Math.hypot(p.x - MG.cx, p.y - MG.cy), lim = Math.min(mgW, mgH) * 0.22;
const q = Math.max(0, 1 - d / lim);
mgFloat(MG.cx, MG.cy - 34, d < lim * 0.25 ? '正中！' : d < lim * 0.6 ? '很接近' : '偏了一些，但它确实在这儿', d < lim * 0.6 ? '#8ff0b8' : '#ffd38a');
mgFinish(q, '<b>它绕着一个看不见的核在转</b>“如果它是电子，这颗能量单元的核在哪里？”<i class="cite" data-cite="161" data-needle="q161b" role="button" tabindex="0">档案 · 第 161 页</i>');
}
}
function mgNucStep(dt) {
MG.th += dt * 1.7;
MG.rot += dt * 0.12;
const e = mgElec(); MG.trail.push(e); if (MG.trail.length > 26) MG.trail.shift();
if (MG.rev) MG.rev = Math.min(1, MG.rev + dt * 1.5);
}
function mgNucDraw() {
const e = mgElec();
if (MG.marks.length >= 6) {
mgx.strokeStyle = 'rgba(185,200,255,.22)'; mgx.lineWidth = 1; mgx.setLineDash([4, 6]);
mgx.beginPath();
for (let k = 0; k <= 64; k++) {
const th0 = MG.th; MG.th = k / 64 * 6.283; const p = mgElec(); MG.th = th0;
k ? mgx.lineTo(p.x, p.y) : mgx.moveTo(p.x, p.y);
}
mgx.stroke(); mgx.setLineDash([]);
}
MG.trail.forEach((p, i) => { mgx.fillStyle = 'rgba(185,200,255,' + (i / MG.trail.length * 0.5) + ')'; mgx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3); });
mgGlow(e.x, e.y, 22, '185,200,255', 0.8);
mgx.fillStyle = '#eef2ff'; mgx.beginPath(); mgx.arc(e.x, e.y, 4, 0, 6.283); mgx.fill();
MG.marks.forEach((m, i) => {
mgx.strokeStyle = '#ffc9e0'; mgx.lineWidth = 1.5; mgx.beginPath(); mgx.arc(m.x, m.y, 7, 0, 6.283); mgx.stroke();
mgx.fillStyle = '#ffc9e0'; mgx.font = '10px system-ui'; mgx.textAlign = 'center'; mgx.fillText(String(i + 1), m.x, m.y - 11);
});
if (MG.rev) {
mgGlow(MG.cx, MG.cy, 60 * MG.rev, '255,170,210', 0.6 * MG.rev);
for (let k = 0; k < 5; k++) { const a = k / 5 * 6.283 + MG.t; mgx.fillStyle = 'rgba(255,220,235,' + MG.rev + ')'; mgx.beginPath(); mgx.arc(MG.cx + Math.cos(a) * 7, MG.cy + Math.sin(a) * 7, 4, 0, 6.283); mgx.fill(); }
if (MG.guess) {
mgx.strokeStyle = 'rgba(255,255,255,.5)'; mgx.setLineDash([3, 4]); mgx.beginPath(); mgx.moveTo(MG.guess.x, MG.guess.y); mgx.lineTo(MG.cx, MG.cy); mgx.stroke(); mgx.setLineDash([]);
mgx.strokeStyle = '#ffd38a'; mgx.beginPath(); mgx.moveTo(MG.guess.x - 8, MG.guess.y); mgx.lineTo(MG.guess.x + 8, MG.guess.y); mgx.moveTo(MG.guess.x, MG.guess.y - 8); mgx.lineTo(MG.guess.x, MG.guess.y + 8); mgx.stroke();
}
}
mgTop(MG.step === 'mark' ? '点画面记下它的位置（或空格）· <b>' + MG.marks.length + ' / 6</b>' :
MG.step === 'guess' ? '<b class="go">它在绕着什么转？点你猜的核</b>' : '✓ 核在这儿');
}
function mgInitObs() {
Object.assign(MG, { eye: true, shots: [], queue: 0, qT: 0, round: [], cur: null, rose: 0, tx: mgW - 70 });
MG.ty = mgH * 0.45;
}
function miniEye(on) { if (!MG || MG.kind !== 'observer' || MG.cur) return; MG.eye = on; renderConsole(); }
function miniFire() {
if (!MG || MG.kind !== 'observer' || MG.cur || MG.phase !== 'play') return;
MG.cur = { eye: MG.eye, n: 0, hit: 0, left: 5 };
MG.queue = 5; MG.qT = 0; renderConsole();
}
function mgObsStep(dt) {
const sx = 60, sy = mgH * 0.45;
if (MG.queue > 0) {
MG.qT -= dt;
if (MG.qT <= 0) {
MG.qT = 0.55; MG.queue--;
const eye = MG.cur.eye;
const hit = eye ? true : Math.random() < 0.1;
const ey = hit ? MG.ty : MG.ty + (Math.random() < 0.5 ? -1 : 1) * (50 + Math.random() * mgH * 0.3);
MG.shots.push({ x: sx, y: sy, k: 0, eye, hit, ey: Math.max(20, Math.min(mgH - 50, ey)) });
}
}
MG.shots.forEach(s => {
s.k += dt * 0.9;
if (s.k >= 1 && !s.done) {
s.done = true;
const c = MG.cur;
if (s.hit) { c.hit++; mgBurst(MG.tx, MG.ty, 30, '255,200,120', 200); } else mgBurst(MG.tx - 10, s.ey, 14, '185,200,255', 120);
c.n++;
if (c.n >= 5) {
MG.round.push(c); MG.cur = null;
const roundDone = MG.line ? true : MG.round.length >= 2;
if (MG.line) {
mgFinish({ eye: c.eye }, c.eye ? '<b>摄像机开着：' + c.hit + ' / 5 命中</b>“摄像机也算观察者，而观察并不需要有意识。”<i class="cite" data-cite="176" data-needle="q176" role="button" tabindex="0">档案 · 第 176 页</i>' :
'<b>没人看：' + c.hit + ' / 5 命中</b>“撤走全部观察者，命中率只剩十分之一。”<i class="cite" data-cite="177" data-needle="q177" role="button" tabindex="0">档案 · 第 177 页</i>');
} else if (roundDone) {
MG.rose = 0.001;
const on = MG.round.find(r => r.eye), off = MG.round.find(r => !r.eye);
mgFinish({ on: on ? on.hit : null, off: off ? off.hit : null }, '<b>有人看 ' + (on ? on.hit : '–') + ' / 5，没人看 ' + (off ? off.hit : '–') + ' / 5</b>“撤走全部观察者，命中率只剩十分之一。”<i class="cite" data-cite="177" data-needle="q177" role="button" tabindex="0">档案 · 第 177 页</i>');
} else {
MG.eye = !c.eye;
mgFloat(mgW / 2, mgH * 0.2, c.eye ? '现在关掉摄像机，再打一轮' : '现在打开摄像机，再打一轮', '#ffd38a');
}
renderConsole();
}
}
});
MG.shots = MG.shots.filter(s => s.k < 1.25);
if (MG.rose) MG.rose = Math.min(1, MG.rose + dt * 0.6);
}
function mgObsDraw() {
const sx = 60, sy = mgH * 0.45;
[26, 17, 8].forEach((r, i) => { mgx.strokeStyle = 'rgba(255,200,120,' + (0.35 + i * 0.2) + ')'; mgx.lineWidth = 2; mgx.beginPath(); mgx.arc(MG.tx, MG.ty, r, 0, 6.283); mgx.stroke(); });
mgx.fillStyle = 'rgba(200,210,240,.5)'; mgx.fillRect(sx - 30, sy - 10, 30, 20);
const eyeOn = MG.cur ? MG.cur.eye : MG.eye;
mgx.fillStyle = eyeOn ? 'rgba(143,240,184,.9)' : 'rgba(255,255,255,.2)';
mgx.beginPath(); mgx.arc(mgW / 2, 34, 9, 0, 6.283); mgx.fill();
mgx.font = '11px system-ui'; mgx.textAlign = 'center'; mgx.fillStyle = 'rgba(220,230,255,.7)';
mgx.fillText(eyeOn ? '摄像机开着' : '摄像机关了', mgW / 2, 58);
MG.shots.forEach(s => {
const k = Math.min(1, s.k), x = sx + (MG.tx - sx) * k;
if (s.eye) {
const y = sy + (MG.ty - sy) * k;
mgGlow(x, y, 18, '255,160,70', 0.7); mgx.fillStyle = '#fff1d6'; mgx.beginPath(); mgx.arc(x, y, 4, 0, 6.283); mgx.fill();
if (eyeOn) { mgx.strokeStyle = 'rgba(143,240,184,.18)'; mgx.beginPath(); mgx.moveTo(mgW / 2, 40); mgx.lineTo(x, y); mgx.stroke(); }
} else if (k < 1) {
const spread = 10 + k * mgH * 0.32;
for (let i = 0; i < 18; i++) { mgx.fillStyle = 'rgba(185,200,255,' + (0.35 - k * 0.2) + ')'; mgx.fillRect(x + (Math.random() - 0.5) * 20, sy + (MG.ty - sy) * k + (Math.random() - 0.5) * spread * 2, 2.5, 2.5); }
} else {
mgGlow(MG.tx - 10, s.ey, 14, s.hit ? '255,160,70' : '185,200,255', 0.6 * (1.25 - s.k) * 4);
}
});
MG.round.concat(MG.cur ? [MG.cur] : []).forEach((r, i) => {
const y = mgH - 60 + i * 20;
mgx.textAlign = 'left'; mgx.font = '12px system-ui'; mgx.fillStyle = r.eye ? '#8ff0b8' : '#b9c8ff';
mgx.fillText((r.eye ? '有人看' : '没人看') + '  命中 ' + r.hit + ' / ' + r.n, 20, y);
mgx.fillStyle = 'rgba(255,255,255,.08)'; mgx.fillRect(130, y - 9, 150, 8);
mgx.fillStyle = r.eye ? 'rgba(143,240,184,.7)' : 'rgba(185,200,255,.7)'; mgx.fillRect(130, y - 9, 150 * r.hit / 5, 8);
});
if (MG.rose) {
const cx = mgW * 0.5, cy = mgH * 0.5, R = Math.min(mgW, mgH) * 0.18 * MG.rose;
mgx.save(); mgx.globalCompositeOperation = 'lighter';
for (let i = 0; i < 360; i++) {
const a = i / 360 * 6.283 * 2, r = R * Math.cos(2.5 * a);
mgx.fillStyle = 'rgba(255,140,190,' + (0.35 * MG.rose) + ')';
mgx.fillRect(cx + r * Math.cos(a) + (Math.random() - 0.5) * 2, cy + r * Math.sin(a) + (Math.random() - 0.5) * 2, 2, 2);
}
mgx.restore();
}
mgTop(MG.phase === 'done' ? '✓ 对比出来了' : MG.cur ? '发射中…' : (MG.line ? '选开或关，然后<b>发射 5 发</b>' : (MG.round.length ? '换个状态，再<b>发射 5 发</b>' : '先开着摄像机<b>发射 5 发</b>')));
}
function miniControls(kind, runLabel) {
const playing = MG && MG.kind === kind && MG.phase === 'play';
let h = '';
if (kind === 'observer' && MG && MG.kind === 'observer' && MG.phase === 'play') {
h += '<button class="mg-eye' + (MG.eye ? ' on' : '') + '" data-act="mgeye" data-v="1"' + (MG.cur ? ' disabled' : '') + '>📷 摄像机开</button>' +
'<button class="mg-eye' + (!MG.eye ? ' on' : '') + '" data-act="mgeye" data-v="0"' + (MG.cur ? ' disabled' : '') + '>摄像机关</button>' +
'<button class="lc-run" data-act="mgfire"' + (MG.cur ? ' disabled' : '') + '>发射 5 发</button>';
h += '<button class="lc-reset" data-act="' + (state.task === 'line' ? 'linerun' : 'run') + '">重来</button>';
} else {
h += '<button class="lc-run" data-act="' + (state.task === 'line' ? 'linerun' : 'run') + '">' + (playing ? '重来' : esc(runLabel)) + '</button>';
}
if (kind === 'observer' && state.task === 'observer') h += '<button class="lc-rose" data-act="rose">去看那朵玫瑰</button>';
h += '<span class="lc-drag-hint">' + esc({ state: '按住画面充能，进绿区松手', capture: '外圈变绿时点画面', nucleus: '点 6 下记录，再点你猜的核', observer: '开着打一轮，关掉打一轮' }[kind]) + '</span>';
return h;
}
function miniResult(id, q) {
const pct = v => Math.round(Math.max(0, Math.min(1, v)) * 100) + '%';
if (id === 'state') {
place('ball', null, null); draw();
showResult({ level: 'canon', title: '成了：空泡被点成球形发光体', plain: '雷电把能量灌进去，暗的空泡亮成了会飘的火球。',
carry: ['稳定度 ' + pct(q)],
why: ['本设定原话是"闪电只是点燃或激发了它"：球形发光体不是被造出来的，是早就在那儿的结构被点着了。',
'绿区、充能速度都是我们设计的；摘录没有给能量阈值。'],
next: ['再玩一次，争取停在绿区正中', '下一步：③ 抓住它'],
ev: '档案 NO.113：球形发光体并不是由闪电产生的，而是自然界早已存在的一种结构。' });
} else if (id === 'capture') {
place('bubble', null, null); draw();
showResult({ level: 'canon', title: '抓住了：三颗都关进空泡', plain: '每一次都在它最亮最稳的时候出手。',
carry: ['时机准度 ' + pct(q)],
why: ['本设定里这一步先是直升机拉电弧去兜住它，后来改用氦气飞艇。',
'"最亮时才能抓"和亮暗周期是我们设计的；摘录没有给出可以照着按的秒数。'],
next: ['再玩一次，看能不能每次都点在最亮的一刻', '下一步：④ 找原子核'],
ev: '档案 NO.161：我们所捕获到的那个空泡；档案 NO.164：捕获改用氦气飞艇。' });
} else if (id === 'nucleus') {
place('nucleus', null, null); draw();
showResult({ level: 'infer', title: '推断：中间有个没露面的核', plain: '电子一直弯向同一个地方转，说明那儿有东西拉着它。',
carry: ['你的猜测准度 ' + pct(q)],
why: ['这就是"能量节点"的推断方式：看不见它，但从轨迹能算出它大概在哪儿。',
'轨道形状和判定半径是我们设计的；摘录只提出了"原子核在哪里"这个问题。'],
next: ['再玩一次，核的位置每局都会变', '下一步：⑤ 看与不看'],
ev: '档案 NO.161：是自由电子，还是某个能量单元里的电子？如果是后者，这颗宏观原子的核在哪里？' });
} else {
place('observer', null, null); place('quantum', null, null); draw();
showResult({ level: 'canon', title: '有人看 ' + q.on + ' / 5，没人看 ' + q.off + ' / 5', plain: '摄像机开着，它就定成确定的样子、一打一个准；关掉，它退回一团概率云，落点散了。',
carry: ['有人看命中 ' + q.on + ' / 5', '没人看命中 ' + q.off + ' / 5'],
why: ['摘录写得很具体：去掉观察者后，命中率只有有人观察时的十分之一；摄像机也算观察者。',
'每发的落点是随机的，按十分之一的比例抽，所以偶尔也会碰巧打中。'],
next: ['去看那朵玫瑰', '再玩一次'],
ev: '档案 NO.176：摄像机也是观察者……观察者并不需要有意识。档案 NO.177：只要去除观察者……命中率只及存在观察者时的十分之一。' });
}
renderConsole();
}
window.__mini = {
state: () => MG && { kind: MG.kind, phase: MG.phase, line: MG.line, e: MG.e, got: MG.got, marks: MG.marks && MG.marks.length, step: MG.step, round: MG.round && MG.round.length, cur: !!MG.cur, eye: MG.eye, q: MG.queue, sh: MG.shots && MG.shots.length, raf: mgRaf, t: MG.t, n: MG.cur && MG.cur.n },
down: () => mgDown(null), up: () => mgUp(null), tap: p => mgDown(p || null),
fire: () => miniFire(), eye: v => miniEye(v), bright: () => MG && MG.kind === 'capture' ? mgBright() : null,
nucCenter: () => MG && MG.kind === 'nucleus' ? { x: MG.cx, y: MG.cy } : null,
pause: () => miniPause(), resume: () => miniResume()
};
var QZ_DATA = {"timeline":[{"id":"t1","label":"档案 BL-01 首次登记","quote":"档案 NO.112：三次独立目击，高度与亮度曲线吻合，单次记录时长 41 秒。","page":112},{"id":"t2","label":"雷暴夜的山脊观测","quote":"档案 NO.113：球形发光体自观测点北侧掠过，地面未留下焦痕。","page":113},{"id":"t3","label":"早期放电试验","quote":"档案 NO.130：七次放电激发，仅一次出现肉眼可见的光球。","page":130},{"id":"t4","label":"三十年里的二十七个","quote":"档案 NO.161：三十年间记录二十七个，其中三个造成了伤亡。","page":161},{"id":"t5","label":"首次在实验中激发","quote":"档案 NO.162：光球在空中停留约一分钟，随后无声消失。","page":162},{"id":"t6","label":"被称作「能量单元」","quote":"档案 NO.170：把这类结构统一称作能量单元，是后来才形成的说法。","page":170},{"id":"t7","label":"观察者与命中率","quote":"档案 NO.176：移除观察者之后，命中率降到原来的十分之一。","page":176},{"id":"t8","label":"摄像机算不算观察者","quote":"档案 NO.177：靶场的结论是算 —— 测量不需要有意识。","page":177},{"id":"t9","label":"共振爆发","quote":"档案 NO.251：全过程看上去就是一轮蓝色太阳的升起与落下。","page":251},{"id":"t10","label":"只能被概率描述的东西","quote":"档案 NO.283：有些结构无法用一条轨迹描述，只能用概率。","page":283}],"speaker":[{"quote":"这份记录我没给第二个人看。他们只会说是我记错了。","speaker":"观测导师","page":113,"context":"观测导师翻开那本半焦的笔记本"},{"quote":"你觉得它可怕，不是因为它大，是因为它不讲道理。","speaker":"观测导师","page":130,"context":"看完第七次失败的放电记录之后"},{"quote":"在雷暴里待久了，人会安静下来。那种安静不太像人间的。","speaker":"项目负责人","page":113,"context":"山脊观测点，等第二颗光球"},{"quote":"你被一件事占住之后，其他事就都成了背景。","speaker":"项目负责人","page":161,"context":"档案室里翻三十年的旧卷"},{"quote":"三十年，我记下的每个数字都还在，只有解释一直没定下来。","speaker":"档案管理员","page":161,"context":"把最后一册档案推过来"},{"quote":"发光体不是闪电做出来的，闪电只是把它点亮了。","speaker":"野外观测员","page":170,"context":"在记录背面补的一行批注"},{"quote":"所以你的意思是，它本来就在那儿，只是我们把它照出来了？","speaker":"项目负责人","page":170,"context":"读完那行批注之后"},{"quote":"模型能对上亮度，但对不上它为什么停得住。","speaker":"建模导师","page":251,"context":"对着拟合曲线发呆的下午"},{"quote":"把头伸进去也没关系，里面没有你想象的那层壳。","speaker":"理论顾问","page":162,"context":"第一次让人把手伸进空泡"},{"quote":"观察者不需要有意识，摄像机会替你完成测量。","speaker":"理论顾问","page":176,"context":"靶场之争的结论"},{"quote":"我们可以把赌注押上去，但得知道押的是什么。","speaker":"上级","page":176,"context":"批准第三次空中扫描之前"},{"quote":"你带回来的不是答案，是一张还没画完的图。","speaker":"伴侣","page":283,"context":"深夜，摊开的观测记录"}],"realfake":[{"text":"它有篮球大小，发着朦胧的红光。","real":true,"page":112,"note":"真：与 NO.112 的亮度曲线吻合"},{"text":"地面只剩一层薄薄的白灰，家具和地板都不见了。","real":true,"page":112,"note":"真：NO.112 附页的现场记录"},{"text":"看上去像肥皂泡，但表面没有肥皂泡那种衍射彩纹。","real":true,"page":142,"note":"真：NO.142 对空泡的描述"},{"text":"这是第一次从内部看外面的世界。","real":true,"page":157,"note":"真：NO.157 的观测笔记"},{"text":"处于量子态的结构有可能出现在仙女座，只是概率极小。","real":true,"page":177,"note":"真：NO.177 的概率说明"},{"text":"那是一个冷太阳，站得再近也感觉不到热。","real":true,"page":251,"note":"真：NO.251 的现场测量"},{"text":"摄像机也算观察者，会让量子态交出确定结果。","real":true,"page":176,"note":"真：NO.176 的靶场结论"},{"text":"它的内部一万多度，表面却是滚烫的。","real":false,"page":112,"note":"假：档案写的是「表面冷凉」"},{"text":"三十年里共产生二十七个发光体，没有杀死过任何人。","real":false,"page":161,"note":"假：档案记载其中三个造成伤亡"},{"text":"档案管理员的儿子死于基地的第一个发光体。","real":false,"page":161,"note":"假：档案写的是「最后一个」"},{"text":"命中率在移除观察者之后只降到一半。","real":false,"page":176,"note":"假：档案写的是「十分之一」"},{"text":"蓝太阳停止膨胀时，半径达到两千米。","real":false,"page":251,"note":"假：档案写的是「二百米」"},{"text":"球形发光体是闪电直接产生的。","real":false,"page":170,"note":"假：档案倾向「闪电只是把它点亮」"},{"text":"光球在空中停留了大约十分钟才消失。","real":false,"page":162,"note":"假：档案写的是「约一分钟」"}],"cloze":[{"before":"在雷暴里守一整夜，人会明白自然并不针对谁，它只是","answer":"不停","after":"。","page":113,"decoys":["安静","等待","发亮"]},{"before":"解释一个现象的关键，往往在于你愿意","answer":"重看","after":"几次同样的记录。","page":130,"decoys":["相信","放弃","预测"]},{"before":"档案里最有用的一句话是：先写清","answer":"条件","after":"，再写结论。","page":161,"decoys":["页码","结论","猜想"]},{"before":"就像电流点亮了灯，但","answer":"灯","after":"本身早就在那儿。","page":170,"decoys":["光","电","开关"]},{"before":"球体本身几乎透明，它靠","answer":"弯曲","after":"光线才显出边界。","page":142,"decoys":["吸收","散射","压缩"]},{"before":"摄像机不需要有意识，它照样会让量子态","answer":"坍缩","after":"。","page":176,"decoys":["叠加","膨胀","跃迁"]},{"before":"观测者的注视像一把无形的","answer":"筛子","after":"，把叠加的可能筛成一个结果。","page":177,"decoys":["镰刀","扫帚","绳索"]},{"before":"概率再小，只要不是","answer":"零","after":"，就有发生的可能。","page":251,"decoys":["一","负","无限"]},{"before":"这朵花不在任何相册里，它只在你","answer":"观测","after":"的那一刻开。","page":283,"decoys":["回忆","梦见","拍下"]},{"before":"三屏站点把「现象、概念、实验」放在同一条","answer":"动线","after":"上，而不是三段彼此孤立的说明。","page":283,"decoys":["目录","注释","附录"]}]};
var QZ_ORDER = ['q-real', 'q-time', 'q-who', 'q-fill'];
var QZ_META = {
'q-real': { icon: '◐', name: '真假摘录', n: 10, intro: '一句话，判断它是不是本设定摘录。有一半是我们改过一个字眼的假句。',
how: ['看完句子，点「摘录」或「改写」（键盘 ← / →）', '每题 12 秒，答得快有加分，连对有倍数', '答错或超时扣一颗心，三颗心'] },
'q-time': { icon: '⟲', name: '回到那一夜', n: 10, intro: '十个情节被打乱了。按本设定里发生的先后，一张一张点出来。',
how: ['从最早发生的那件事开始点', '点对了，它落进时间线，并展开那一页的摘录', '点错扣分，不扣心'] },
'q-who': { icon: '❝', name: '谁说的', n: 10, intro: '一句台词，四个人。猜是谁说的。',
how: ['点头像，或按 1–4', '每题 12 秒，答得快有加分，连对有倍数', '答错或超时扣一颗心，三颗心'] },
'q-fill': { icon: '▢', name: '补全原句', n: 10, intro: '一句摘录挖掉一个词，四个选项只有一个是记录者写的。',
how: ['点选项，或按 1–4', '每题 12 秒，答得快有加分，连对有倍数', '答错或超时扣一颗心，三颗心'] }
};
var QZ = null, qzWrap = null, qzTimer = null, qzWrongT = null;
var QZ_LIMIT = 12;
function qShuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function qBest(id, v) {
const k = 'bl-quiz-' + id;
try { if (v != null) localStorage.setItem(k, String(v)); return +localStorage.getItem(k) || 0; } catch (_) { return 0; }
}
function qzBuildDom() {
if (qzWrap) return;
const host = root.querySelector('.lab-canvas');
if (!host) return;
qzWrap = document.createElement('div');
qzWrap.className = 'lab-quiz';
qzWrap.id = 'labQuiz';
host.appendChild(qzWrap);
qzWrap.addEventListener('click', e => {
const b = e.target.closest('[data-q]');
if (!b || b.disabled) return;
const a = b.dataset.q;
if (a === 'start') quizStart();
else if (a === 'next') quizNext();
else if (a === 'pick') quizPick(b.dataset.v);
else if (a === 'card') quizPlace(+b.dataset.v);
renderConsole();
});
addEventListener('keydown', e => {
if (!QZ || !state.on || !QZ_META[state.task] || !labVisible()) return;
if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
let used = true;
if (e.key === 'Enter') { if (QZ.phase === 'intro' || QZ.phase === 'end') quizStart(); else if (QZ.phase === 'reveal') quizNext(); else used = false; }
else if (QZ.phase === 'ask' && QZ.mode === 'q-real' && e.key === 'ArrowLeft') quizPick('1');
else if (QZ.phase === 'ask' && QZ.mode === 'q-real' && e.key === 'ArrowRight') quizPick('0');
else if (QZ.phase === 'ask' && /^[1-4]$/.test(e.key) && (QZ.mode === 'q-who' || QZ.mode === 'q-fill')) {
const it = QZ.items[QZ.i]; const v = it.opts[+e.key - 1]; if (v != null) quizPick(v);
} else used = false;
if (used) { e.preventDefault(); e.stopImmediatePropagation(); }
}, true);
}
function quizMode(id) {
qzBuildDom();
if (!qzWrap) return;
root.classList.add('game-on', 'quiz-on');
QZ = { mode: id, phase: 'intro' };
qzRender();
}
function quizExit() {
quizTimerStop();
root.classList.remove('quiz-on');
QZ = null;
if (qzWrap) qzWrap.innerHTML = '';
}
function qzItems(id) {
if (id === 'q-real') return qShuffle(QZ_DATA.realfake).slice(0, QZ_META[id].n);
if (id === 'q-time') return QZ_DATA.timeline.slice();
if (id === 'q-who') {
const names = Array.from(new Set(QZ_DATA.speaker.map(x => x.speaker)));
return qShuffle(QZ_DATA.speaker).slice(0, QZ_META[id].n).map(x => {
const others = qShuffle(names.filter(n => n !== x.speaker)).slice(0, 3);
return Object.assign({}, x, { opts: qShuffle([x.speaker].concat(others)) });
});
}
return qShuffle(QZ_DATA.cloze).slice(0, QZ_META[id].n).map(x => Object.assign({}, x, { opts: qShuffle([x.answer].concat(x.decoys)) }));
}
function quizStart() {
if (!QZ) return;
quizTimerStop();
const id = QZ.mode;
QZ = { mode: id, phase: id === 'q-time' ? 'sort' : 'ask', items: qzItems(id), i: 0, score: 0, lives: 3,
streak: 0, bestStreak: 0, right: 0, wrong: 0, review: [], picked: null, ok: null, left: QZ_LIMIT,
pool: null, placed: [], wrongTap: null, lastPlaced: null };
if (id === 'q-time') QZ.pool = qShuffle(QZ.items.map((_, k) => k));
else quizTimerStart();
qzRender();
}
function quizPick(v) {
if (!QZ || QZ.phase !== 'ask') return;
quizTimerStop();
const it = QZ.items[QZ.i];
const ok = QZ.mode === 'q-real' ? (v === '1') === !!it.real : QZ.mode === 'q-who' ? v === it.speaker : v === it.answer;
QZ.picked = v; QZ.ok = ok;
if (ok) {
QZ.streak++; QZ.bestStreak = Math.max(QZ.bestStreak, QZ.streak); QZ.right++;
const pts = Math.round((100 + Math.round(QZ.left / QZ_LIMIT * 50)) * Math.min(1.5, 1 + (QZ.streak - 1) * 0.1));
QZ.gain = pts; QZ.score += pts;
} else {
QZ.streak = 0; QZ.lives--; QZ.wrong++; QZ.gain = 0;
QZ.review.push(it);
}
QZ.phase = 'reveal';
qzRender();
}
function quizTimeout() {
if (!QZ || QZ.phase !== 'ask') return;
quizTimerStop();
QZ.picked = null; QZ.ok = false; QZ.gain = 0;
QZ.streak = 0; QZ.lives--; QZ.wrong++;
QZ.review.push(QZ.items[QZ.i]);
QZ.phase = 'reveal'; QZ.timedOut = true;
qzRender();
}
function quizNext() {
if (!QZ || QZ.phase !== 'reveal') return;
if (QZ.lives <= 0 || QZ.i >= QZ.items.length - 1) { quizEnd(); return; }
QZ.i++; QZ.phase = 'ask'; QZ.picked = null; QZ.ok = null; QZ.timedOut = false;
quizTimerStart();
qzRender();
}
function quizPlace(k) {
if (!QZ || QZ.phase !== 'sort') return;
const want = QZ.placed.length;
if (k === want) {
QZ.placed.push(k);
QZ.pool = QZ.pool.filter(x => x !== k);
QZ.lastPlaced = k; QZ.wrongTap = null;
QZ.streak++; QZ.bestStreak = Math.max(QZ.bestStreak, QZ.streak); QZ.right++;
QZ.score += 100 + Math.min(5, QZ.streak - 1) * 10;
if (!QZ.pool.length) { quizEnd(); return; }
} else {
QZ.score = Math.max(0, QZ.score - 30);
QZ.streak = 0; QZ.wrong++;
QZ.wrongTap = k;
if (QZ.review.indexOf(QZ.items[want]) < 0) QZ.review.push(QZ.items[want]);
clearTimeout(qzWrongT);
qzWrongT = setTimeout(() => { if (QZ && QZ.wrongTap === k) { QZ.wrongTap = null; qzRender(); } }, 700);
}
qzRender();
}
function quizEnd() {
quizTimerStop();
QZ.phase = 'end';
const prev = qBest(QZ.mode);
QZ.newBest = QZ.score > prev;
QZ.best = QZ.newBest ? qBest(QZ.mode, QZ.score) : prev;
state.runs[QZ.mode] = (state.runs[QZ.mode] || 0) + 1;
qzRender();
}
function quizTimerStart() {
quizTimerStop();
QZ.left = QZ_LIMIT;
const t0 = performance.now();
qzTimer = setInterval(() => {
if (!QZ || QZ.phase !== 'ask') { quizTimerStop(); return; }
if (!labVisible() || document.hidden) return;
QZ.left = Math.max(0, QZ_LIMIT - (performance.now() - t0) / 1000);
const bar = qzWrap && qzWrap.querySelector('.qz-bar i');
if (bar) { bar.style.width = (QZ.left / QZ_LIMIT * 100) + '%'; bar.classList.toggle('low', QZ.left < 4); }
if (QZ.left <= 0) quizTimeout();
}, 100);
}
function quizTimerStop() { if (qzTimer) { clearInterval(qzTimer); qzTimer = null; } }
function qHud() {
const hearts = QZ.mode === 'q-time' ? '' :
'<span class="qz-lives">' + '♥♥♥'.slice(0, Math.max(0, QZ.lives)) + '<s>' + '♥♥♥'.slice(0, 3 - Math.max(0, QZ.lives)) + '</s></span>';
const prog = QZ.mode === 'q-time' ? QZ.placed.length + ' / ' + QZ.items.length : (QZ.i + 1) + ' / ' + QZ.items.length;
return '<div class="qz-hud"><span class="qz-score"><b>' + QZ.score + '</b>分</span>' +
(QZ.streak > 1 ? '<span class="qz-streak">连对 ×' + QZ.streak + '</span>' : '') +
'<span class="qz-prog">' + prog + '</span>' + hearts + '</div>';
}
const pg = p => '<i class="qz-pg">档案 · 第 ' + p + ' 页</i>';
function qzPlace() {
if (!qzWrap) return;
if (getComputedStyle(qzWrap).position !== 'absolute') { qzWrap.style.top = ''; return; }
const host = qzWrap.parentElement.getBoundingClientRect();
const tb = taskBar ? taskBar.getBoundingClientRect() : null;
qzWrap.style.top = (tb && tb.height ? Math.max(12, Math.round(tb.bottom - host.top + 10)) : 64) + 'px';
}
function qzRender() {
if (!qzWrap || !QZ) return;
requestAnimationFrame(qzPlace);
const m = QZ_META[QZ.mode];
let h = '';
if (QZ.phase === 'intro') {
const best = qBest(QZ.mode);
h = '<div class="qz-card qz-intro"><p class="qz-k">' + m.icon + ' 摘录游戏</p><h3>' + esc(m.name) + '</h3>' +
'<p class="qz-lead">' + esc(m.intro) + '</p><ul class="qz-how">' + m.how.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
'<p class="qz-src">题目全部来自球形发光体摘录，每一条都按档案编号核对过。' +
(QZ.mode === 'q-real' ? '"改写"的那一半是我们故意改错的，答完会告诉你摘录到底怎么写。' : '') + '</p>' +
'<div class="qz-go"><button data-q="start">开始</button>' + (best ? '<span>最高分 ' + best + '</span>' : '') + '</div></div>';
} else if (QZ.phase === 'end') {
h = qzEndHtml();
} else if (QZ.mode === 'q-time') {
h = qHud() + '<div class="qz-time">' +
'<ol class="qz-line">' + QZ.items.map((it, k) => {
const done = QZ.placed.indexOf(k) >= 0;
return '<li class="' + (done ? 'done' : '') + (k === QZ.lastPlaced ? ' fresh' : '') + '"><b>' + (k + 1) + '</b>' +
(done ? '<span>' + esc(it.label) + '</span>' : '<span class="ph">？</span>') + '</li>';
}).join('') + '</ol>' +
(QZ.lastPlaced != null ? '<blockquote class="qz-quote">“' + esc(QZ.items[QZ.lastPlaced].quote) + '”' + pg(QZ.items[QZ.lastPlaced].page) + '</blockquote>' :
'<p class="qz-ask">第 1 件发生的是哪一件？</p>') +
'<div class="qz-pool">' + QZ.pool.map(k => '<button data-q="card" data-v="' + k + '" class="' + (QZ.wrongTap === k ? 'wrong' : '') + '">' + esc(QZ.items[k].label) + '</button>').join('') + '</div>' +
'</div>';
} else {
const it = QZ.items[QZ.i], rv = QZ.phase === 'reveal';
h = qHud() + '<div class="qz-bar"><i style="width:' + (rv ? 0 : QZ.left / QZ_LIMIT * 100) + '%"></i></div>';
if (QZ.mode === 'q-real') {
h += '<div class="qz-card qz-q"><p class="qz-ask">这句话是本设定摘录吗？</p><blockquote class="qz-big">“' + esc(it.text) + '”</blockquote>' +
'<div class="qz-opts two">' +
['1', '0'].map(v => {
const lab = v === '1' ? '← 摘录' : '改写 →';
let cls = '';
if (rv) { if ((v === '1') === !!it.real) cls = 'right'; else if (QZ.picked === v) cls = 'wrong'; }
return '<button data-q="pick" data-v="' + v + '" class="' + cls + '"' + (rv ? ' disabled' : '') + '>' + lab + '</button>';
}).join('') + '</div>' +
(rv ? '<p class="qz-note ' + (QZ.ok ? 'ok' : 'bad') + '">' + (QZ.ok ? '✓ 答对 +' + QZ.gain : (QZ.timedOut ? '⌛ 超时' : '✗ 答错')) + ' · ' + esc(it.note) + '</p>' : '') + '</div>';
} else if (QZ.mode === 'q-who') {
h += '<div class="qz-card qz-q"><p class="qz-ask">' + esc(it.context) + '——这句话是谁说的？</p>' +
'<blockquote class="qz-big qz-bubble">“' + esc(it.quote) + '”</blockquote><div class="qz-opts who">' +
it.opts.map((n, k) => {
let cls = '';
if (rv) { if (n === it.speaker) cls = 'right'; else if (QZ.picked === n) cls = 'wrong'; }
return '<button data-q="pick" data-v="' + esc(n) + '" class="' + cls + '"' + (rv ? ' disabled' : '') + '><em>' + esc(n.slice(0, 1)) + '</em><span>' + esc(n) + '</span><kbd>' + (k + 1) + '</kbd></button>';
}).join('') + '</div>' +
(rv ? '<p class="qz-note ' + (QZ.ok ? 'ok' : 'bad') + '">' + (QZ.ok ? '✓ 答对 +' + QZ.gain : (QZ.timedOut ? '⌛ 超时' : '✗ 答错')) + ' · 是' + esc(it.speaker) + '说的 · 第 ' + it.page + ' 页</p>' : '') + '</div>';
} else {
const blank = rv ? '<mark class="' + (QZ.ok ? 'ok' : 'bad') + '">' + esc(it.answer) + '</mark>' : '<mark class="hole">' + '＿'.repeat(it.answer.length) + '</mark>';
h += '<div class="qz-card qz-q"><p class="qz-ask">挖掉的词是哪一个？</p>' +
'<blockquote class="qz-big">“' + esc(it.before) + blank + esc(it.after) + '”</blockquote><div class="qz-opts four">' +
it.opts.map((o, k) => {
let cls = '';
if (rv) { if (o === it.answer) cls = 'right'; else if (QZ.picked === o) cls = 'wrong'; }
return '<button data-q="pick" data-v="' + esc(o) + '" class="' + cls + '"' + (rv ? ' disabled' : '') + '><kbd>' + (k + 1) + '</kbd>' + esc(o) + '</button>';
}).join('') + '</div>' +
(rv ? '<p class="qz-note ' + (QZ.ok ? 'ok' : 'bad') + '">' + (QZ.ok ? '✓ 答对 +' + QZ.gain : (QZ.timedOut ? '⌛ 超时' : '✗ 答错')) + ' · 摘录第 ' + it.page + ' 页</p>' : '') + '</div>';
}
if (rv) h += '<div class="qz-go"><button data-q="next">' + (QZ.lives <= 0 || QZ.i >= QZ.items.length - 1 ? '看结果' : '下一题') + ' ↵</button></div>';
}
qzWrap.innerHTML = h;
if (QZ.phase === 'reveal') {
const nb = qzWrap.querySelector('[data-q="next"]');
if (nb) requestAnimationFrame(() => nb.scrollIntoView({ block: 'nearest' }));
} else if (QZ.phase === 'ask' || QZ.phase === 'intro' || QZ.phase === 'end') qzWrap.scrollTop = 0;
}
function qzEndHtml() {
const m = QZ_META[QZ.mode], tot = QZ.right + QZ.wrong;
const acc = tot ? Math.round(QZ.right / tot * 100) : 0;
const max = QZ.mode === 'q-time' ? QZ.items.length * 140 : QZ.items.length * 190;
const r = QZ.score / max;
const rank = r > 0.75 ? '档案考据家' : r > 0.5 ? '档案常客' : r > 0.25 ? '翻过半档' : '该重读了';
const head = QZ.mode === 'q-time' ? '时间线复原了' : (QZ.lives <= 0 ? '三颗心用完了' : '全部答完');
const rev = QZ.review.slice(0, 6).map(it => {
if (QZ.mode === 'q-real') return '<li><b>' + (it.real ? '摘录' : '改写') + '</b>“' + esc(it.text) + '”<span>' + esc(it.note) + '</span></li>';
if (QZ.mode === 'q-who') return '<li><b>' + esc(it.speaker) + '</b>“' + esc(it.quote) + '”<span>档案 NO.' + it.page + '</span></li>';
if (QZ.mode === 'q-fill') return '<li><b>' + esc(it.answer) + '</b>“' + esc(it.before + it.answer + it.after) + '”<span>档案 NO.' + it.page + '</span></li>';
return '<li><b>' + esc(it.label) + '</b>“' + esc(it.quote) + '”<span>档案 NO.' + it.page + '</span></li>';
}).join('');
return '<div class="qz-card qz-end"><p class="qz-k">' + m.icon + ' ' + esc(m.name) + ' · ' + head + '</p>' +
'<h3>' + esc(rank) + (QZ.newBest ? ' <em>新纪录！</em>' : '') + '</h3>' +
'<div class="qz-stats"><div><b>' + QZ.score + '</b><span>分数</span></div><div><b>' + acc + '%</b><span>正确率</span></div>' +
'<div><b>' + QZ.bestStreak + '</b><span>最长连对</span></div><div><b>' + QZ.best + '</b><span>最高分</span></div></div>' +
(rev ? '<p class="qz-k qz-rk">' + (QZ.mode === 'q-time' ? '容易排错的几件事' : '答错的，摘录是这样写的') + '</p><ul class="qz-review">' + rev + '</ul>' : '<p class="qz-src">一题没错。</p>') +
'<div class="qz-go"><button data-q="start">再来一局</button><span>题目每局重新抽、选项重新洗</span></div></div>';
}
window.__quiz = {
state: () => QZ,
pick: v => quizPick(v),
next: () => quizNext(),
place: k => quizPlace(k),
start: () => quizStart(),
data: QZ_DATA
};
if (taskBar) {
taskBar.innerHTML = '<button data-task="game" class="game-chip">⚡ 雷雨夜 · 抓球闪</button>' +
'<button data-task="line" class="line-chip">任务线 · 一口气走完</button>' +
'<button data-arsenal="1" class="arsenal-chip">🔧 试验台 · 能量单元武器</button>' +
'<button class="legacy-toggle" data-legacy aria-expanded="false">摘录小测 ▾</button>' +
QZ_ORDER.map(id => '<button data-task="' + id + '" class="quiz-chip legacy">' + QZ_META[id].icon + ' ' + QZ_META[id].name + '</button>').join('');
taskBar.addEventListener('click', e => {
const lg = e.target.closest('[data-legacy]');
if (lg) {
const open = taskBar.classList.toggle('show-legacy');
lg.setAttribute('aria-expanded', String(open));
lg.textContent = open ? '摘录小测 ▴' : '摘录小测 ▾';
return;
}
const ar = e.target.closest('[data-arsenal]');
if (ar) { window.location.href = entryHref(); return; }
const b = e.target.closest('[data-task]');
if (b) setTask(b.dataset.task);
});
}
function setTask(id) {
state.task = id;
quizExit();
miniStop();
if (QZ_META[id]) {
if (taskBar) taskBar.querySelectorAll('[data-task]').forEach(b => b.setAttribute('aria-current', String(b.dataset.task === id)));
stopAnim();
state.nodes = []; state.links = []; state.sel = null; state.linkFrom = null; state.mark = null; state.sig = null;
gameMode(false);
draw(); renderPalette(); renderPanel(); showResult(null); renderQuest();
quizMode(id);
renderConsole();
return;
}
if (id === 'game') {
if (taskBar) taskBar.querySelectorAll('[data-task]').forEach(b => b.setAttribute('aria-current', String(b.dataset.task === 'game')));
stopAnim();
state.nodes = []; state.links = []; state.sel = null; state.linkFrom = null; state.mark = null; state.sig = null;
draw(); renderPalette(); renderPanel(); showResult(null); renderQuest();
gameMode(true);
renderConsole();
return;
}
gameMode(false);
if (id === 'line') { startLine(); return; }
if (taskBar) taskBar.querySelectorAll('[data-task]').forEach(b => b.setAttribute('aria-current', String(b.dataset.task === id)));
stopAnim();
state.nodes = []; state.links = []; state.sel = null; state.linkFrom = null; state.mark = null;
state.scanState = 'idle'; state.scanR = 0.45; if (id !== 'search') state.found = false;
const t = D.tasks.find(x => x.id === id);
if (MINI_TASK[id]) setTimeout(() => { if (state.task === id && state.on) miniStartTask(id); }, 0);
if (id === 'search' || id === 'line') initSignal();
(t ? t.elements : []).forEach((eid, i) => {
const s = size();
place(eid, s.w * 0.26 + (i % 3) * 120, s.h * 0.28 + Math.floor(i / 3) * 100);
});
autoLinks();
draw(); renderPalette(); renderPanel(); renderConsole(); showResult(null); renderQuest();
}
const LAB_VERSION = 'v3';
function quizFrame() { return document.getElementById('labQuizFrame'); }
function openQuiz() {
const f = quizFrame(), box = document.getElementById('labQuiz');
if (!f || !box) return;
try { if (!f.getAttribute('src')) f.src = labBase() + 'quiz.html'; } catch (err) {}
box.hidden = false;
const con = document.getElementById('concepts');
if (con) con.classList.add('quiz-on');
}
function closeQuiz() {
const box = document.getElementById('labQuiz');
if (box) box.hidden = true;
const con = document.getElementById('concepts');
if (con) con.classList.remove('quiz-on');
requestAnimationFrame(() => { try { fxResize(); draw(); } catch (err) {} });
}
addEventListener('message', e => {
const d = e.data;
if (!d || typeof d !== 'object' || !d.type) return;
if (d.type === 'bl:quiz:done') {
const skip = document.getElementById('labQuizSkip');
if (skip) skip.textContent = '进 3D 试验台 →';
} else if (d.type === 'bl:quiz:enter') {
closeQuiz();
}
});
(function () {
const skip = document.getElementById('labQuizSkip');
if (skip) skip.addEventListener('click', closeQuiz);
const back = document.getElementById('labQuizBack');
if (back) back.addEventListener('click', closeQuiz);
addEventListener('keydown', e => {
if (e.key !== 'Escape') return;
const box = document.getElementById('labQuiz');
if (box && !box.hidden) { closeQuiz(); return; }
if (state.on) setMode(false);
}, true);
})();
function setMode(on) {
if (!on) { closeQuiz(); fxStop(); gamePause(); quizTimerStop(); miniPause(); }
const ver = document.getElementById('labVer');
if (ver) ver.textContent = LAB_VERSION;
state.on = on;
root.dataset.on = String(on);
const con = document.getElementById('concepts');
if (con) con.classList.toggle('lab-on', on);
if (switchEl) {
switchEl.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-current', String((b.dataset.mode === 'lab') === on)));
}
if (on) {
renderPalette(); renderConsole(); renderLog(); renderQuest();
if (!state.nodes.length) setTask(state.task);
openQuiz();
requestAnimationFrame(() => { draw(); fxResize(); fxStart(); gameResume(); });
}
}
if (switchEl) switchEl.addEventListener('click', e => {
const b = e.target.closest('[data-mode]');
if (!b) return;
setMode(b.dataset.mode === 'lab');
});
['labTasks', 'lab', 'labEntries'].forEach(id => {
const el = document.getElementById(id);
if (el) { el.style.display = 'none'; el.setAttribute('hidden', ''); }
});
(function labFlow(){
const con = document.getElementById('concepts');
if (!con || !switchEl) return;
const pills = document.getElementById('arenaPills');
const entries = document.getElementById('labEntries');
let flow = document.getElementById('labFlow');
if (!flow) {
flow = document.createElement('div');
flow.id = 'labFlow';
flow.className = 'lab-flow';
con.insertBefore(flow, switchEl);
flow.appendChild(switchEl);
if (pills) flow.appendChild(pills);
}
if (entries) entries.hidden = true;   /* 旧的重复入口不再出现 */
if (pills) {
const STEP = { 'quiz.html': '①', 'showcase.html': '②', 'arena.html': '③' };
pills.querySelectorAll('a[data-lab]').forEach(a => {
const s = STEP[a.getAttribute('data-lab')];
if (s) a.setAttribute('data-step', s);
});
}
(function handsPill(){
if (!flow) return;
const btn = document.createElement('button');
btn.id = 'handsPill';
btn.className = 'hands-pill';
btn.type = 'button';
btn.setAttribute('aria-pressed', 'false');
btn.innerHTML = '<i></i><span>手势</span>';
flow.appendChild(btn);
btn.addEventListener('click', () => {
const t = document.getElementById('handsToggle');
if (t) t.click();
});
const sync = () => {
const out = document.getElementById('handsOut');
const st = (out && out.textContent || '').trim();
const live = /就绪|live/i.test(st);
const fallback = /降级|fallback/i.test(st);
btn.setAttribute('data-state', live ? 'live' : fallback ? 'fallback' : 'off');
btn.setAttribute('aria-pressed', live || fallback ? 'true' : 'false');
};
const host = document.getElementById('tune');
if (host) new MutationObserver(sync).observe(host, { subtree: true, childList: true, characterData: true });
setInterval(sync, 600);
sync();
})();
const map = { 'quiz.html': 'quiz.html', 'showcase.html': 'showcase.html', 'arena.html': 'arena.html' };
const QUIZ_PORTRAIT = { dingyi: 'ding', linyun: 'lin', zhangbin: 'zhang', observer: 'main' };
function sendPortraits(){
const f = quizFrame();
if (!f || !f.contentWindow || typeof PORTRAITS === 'undefined') return;
const map = {};
Object.keys(QUIZ_PORTRAIT).forEach(k => {
const src = PORTRAITS[QUIZ_PORTRAIT[k]];
if (src) map[k] = src;
});
try { f.contentWindow.postMessage({ type: 'bl:portraits', map: map }, '*'); } catch (err) {}
}
addEventListener('message', ev => {
if (ev.data && ev.data.type === 'bl:quiz:ready') sendPortraits();
});
(function hookQuizLoad(){
const f = quizFrame();
if (!f) return;
f.addEventListener('load', () => setTimeout(sendPortraits, 120));
if (f.getAttribute('src')) setTimeout(sendPortraits, 400);
})();
function openLabPage(file){
const f = quizFrame(), box = document.getElementById('labQuiz');
if (!f || !box) return;
try { f.src = labBase() + file; } catch (err) {}
box.hidden = false;
con.classList.add('quiz-on');
if (/^quiz\.html/.test(file)) setTimeout(sendPortraits, 700);
}
function enter(file){
setMode(true);
openLabPage(file || 'quiz.html');
}
let quizBranch = '';
let quizWent = false;
function toArmory(branch) {
if (branch) quizBranch = branch;
if (quizWent) return;
quizWent = true;
markStep('showcase.html');
openLabPage('showcase.html' + (quizBranch ? '?b=' + quizBranch : ''));
}
function markStep(lab) {
if (!pills) return;
pills.querySelectorAll('a[data-lab]').forEach(x => x.classList.toggle('on', x.getAttribute('data-lab') === lab));
}
addEventListener('message', ev => {
const d = ev.data;
if (!d || typeof d !== 'object') return;
if (d.type === 'bl:quiz:enter') { toArmory(d.branch); }
else if (d.type === 'bl:quiz:done') {
quizBranch = d.branch || '';
setTimeout(() => toArmory(quizBranch), 2600);
}
});
if (pills) pills.addEventListener('click', e => {
const a = e.target.closest('a[data-lab]');
if (!a) return;
e.preventDefault();
const file = map[a.getAttribute('data-lab')] || 'quiz.html';
if (file === 'quiz.html') quizWent = false;
enter(file);
pills.querySelectorAll('a[data-lab]').forEach(x => x.classList.toggle('on', x === a));
});
new MutationObserver(() => {
if (!con.classList.contains('on') && state.on) setMode(false);
}).observe(con, { attributes: true, attributeFilter: ['class'] });
function audit() {
const bad = [];
const flowEl = document.getElementById('labFlow');
const pillsEl = document.getElementById('arenaPills');
const swEl = document.getElementById('labSwitch');
if (!flowEl) bad.push('缺 #labFlow');
if (!pillsEl) bad.push('缺 #arenaPills');
if (!swEl) bad.push('缺 #labSwitch');
if (flowEl && pillsEl && !flowEl.contains(pillsEl)) bad.push('#arenaPills 不在 #labFlow 里');
if (swEl) {
const modes = Array.from(swEl.querySelectorAll('[data-mode]')).map(b => b.dataset.mode);
if (modes.join(',') !== 'rel,lab') bad.push('模式开关不是 rel,lab');
}
if (pillsEl) {
const steps = Array.from(pillsEl.querySelectorAll('a[data-lab]')).map(a2 => a2.dataset.step);
if (steps.join('') !== '①②③') bad.push('三个入口没有 ①②③ 序号');
}
const relMode = !con.classList.contains('lab-on');
if (relMode && flowEl && getComputedStyle(flowEl).display === 'none') bad.push('关系模式下工作流条被隐藏（入口会消失）');
if (relMode && pillsEl && getComputedStyle(pillsEl).display !== 'none') bad.push('关系模式下三个入口不该出现');
const ok = bad.length === 0;
if (!ok) console.error('[02 contract] 实验模式工作流被改坏了：' + bad.join('；') + '（见 docs/02-实验模式工作流.md）');
return { ok: ok, problems: bad, mode: relMode ? 'rel' : 'lab' };
}
window.__labFlowAudit = audit;
setTimeout(audit, 600);
})();
(function comboGlow(){
const box = document.getElementById('combo');
if (!box) return;
const slots = box.querySelectorAll('.slot');
const sync = () => {
let full = 0;
slots.forEach(s => { if (s.classList.contains('full')) full++; });
box.dataset.full = full >= 2 ? '1' : '0';
};
const mo = new MutationObserver(sync);
slots.forEach(s => mo.observe(s, { attributes: true, attributeFilter: ['class'] }));
sync();
})();
addEventListener('resize', () => { if (state.on) { draw(); fxResize(); } });
document.addEventListener('visibilitychange', () => {
if (document.hidden) { fxStop(); gamePause(); } else { fxStart(); gameResume(); }
});
const fxCanvas = document.getElementById('labFx');
const fxCtx = fxCanvas ? fxCanvas.getContext('2d') : null;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fx = { effects: [], parts: [], flash: 0, raf: null, last: 0, t: 0 };
function fxResize() {
if (!fxCanvas) return;
const s0 = size(), dpr = Math.min(2, devicePixelRatio || 1);
fxCanvas.width = Math.round(s0.w * dpr);
fxCanvas.height = Math.round(s0.h * dpr);
fxCanvas.style.width = s0.w + 'px';
fxCanvas.style.height = s0.h + 'px';
if (fxCtx) fxCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function boltPath(x1, y1, x2, y2, jitter, depth) {
let pts = [{ x: x1, y: y1 }, { x: x2, y: y2 }];
for (let d = 0; d < (depth || 5); d++) {
const out = [];
for (let i = 0; i < pts.length - 1; i++) {
const a = pts[i], b = pts[i + 1];
const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
const nx = -(b.y - a.y), ny = b.x - a.x;
const L = Math.hypot(nx, ny) || 1;
const amp = (jitter / (d + 1)) * (Math.random() - 0.5) * 2;
out.push(a, { x: mx + (nx / L) * amp, y: my + (ny / L) * amp });
}
out.push(pts[pts.length - 1]);
pts = out;
}
return pts;
}
function spawnParts(x, y, n, opt) {
const o = opt || {};
for (let i = 0; i < n; i++) {
const a = o.angle == null ? Math.random() * Math.PI * 2 : o.angle + (Math.random() - 0.5) * (o.spread || 1);
const sp = (o.speed || 60) * (0.35 + Math.random() * 0.9);
fx.parts.push({
x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
life: 0, max: (o.life || 0.9) * (0.6 + Math.random() * 0.7),
r: (o.r || 2) * (0.5 + Math.random()), c: o.c || '255,225,150',
g: o.gravity == null ? 18 : o.gravity, shape: o.shape || 'dot'
});
}
}
function fxAdd(kind, data) {
if (REDUCED) return;
fx.effects.push(Object.assign({ kind: kind, t: 0, dur: 1 }, data || {}));
fxStart();
}
function labVisible() {
return !!(root && root.closest('.screen') && root.closest('.screen').classList.contains('on'));
}
function fxStart() {
if (!fxCtx || fx.raf != null) return;
if (!state.on || !labVisible()) return;   /* 不在 03 屏就别占着帧 */
fx.last = performance.now();
fx.raf = requestAnimationFrame(fxTick);
}
function fxStop() {
if (fx.raf != null) { cancelAnimationFrame(fx.raf); fx.raf = null; }
if (fxCtx) fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
}
const easeOut = t => 1 - Math.pow(1 - t, 3);
function fxTick(now) {
fx.raf = null;
if (!fxCtx || !state.on || !labVisible() || document.hidden) { fxStop(); return; }
const dt = Math.min(0.05, (now - fx.last) / 1000);
fx.last = now; fx.t += dt;
const s0 = size();
fxCtx.clearRect(0, 0, s0.w, s0.h);
const sig = state.sig;
if (sig && sig.state !== 'gone') {
if (sig.state === 'unknown' || sig.state === 'excited') {
sig.px = sig.px == null ? sig.x : sig.px;
sig.py = sig.py == null ? sig.y : sig.py;
const amp = sig.state === 'excited' ? 16 : 9;
sig.x = sig.px + Math.sin(fx.t * (sig.state === 'excited' ? 2.3 : 1.1)) * amp +
Math.sin(fx.t * 0.7 + 1.3) * amp * 0.5;
sig.y = sig.py + Math.cos(fx.t * (sig.state === 'excited' ? 1.9 : 0.9)) * amp * 0.7;
}
const hot = sig.state === 'excited';
const col = sig.state === 'ready' ? '140,230,180'
: sig.state === 'collapsed' ? '159,216,255'
: hot ? '255,220,140' : '150,200,255';
const breathe = 1 + Math.sin(fx.t * (hot ? 7 : 2.4)) * (hot ? 0.16 : 0.07);
const R = (hot ? 25 : 19) * breathe;
const grd = fxCtx.createRadialGradient(sig.x, sig.y, 0, sig.x, sig.y, R * 4.2);
grd.addColorStop(0, 'rgba(' + col + ',' + (hot ? 0.62 : 0.40) + ')');
grd.addColorStop(0.45, 'rgba(' + col + ',0.10)');
grd.addColorStop(1, 'rgba(' + col + ',0)');
fxCtx.fillStyle = grd;
fxCtx.beginPath(); fxCtx.arc(sig.x, sig.y, Math.max(0, R * 4.2), 0, 7); fxCtx.fill();
fxCtx.fillStyle = 'rgba(' + col + ',0.95)';
fxCtx.beginPath(); fxCtx.arc(sig.x, sig.y, Math.max(0, R * 0.52), 0, 7); fxCtx.fill();
fxCtx.fillStyle = 'rgba(255,255,255,' + (hot ? 0.95 : 0.7) + ')';
fxCtx.beginPath(); fxCtx.arc(sig.x, sig.y, Math.max(0, R * 0.24), 0, 7); fxCtx.fill();
const rings = sig.state === 'ready' ? 2 : 1;
for (let i = 0; i < rings; i++) {
const rr = R * (1.85 + i * 0.85);
fxCtx.save();
fxCtx.translate(sig.x, sig.y);
fxCtx.rotate(fx.t * (i % 2 ? -0.8 : 1.1) + i);
fxCtx.strokeStyle = 'rgba(' + col + ',' + (sig.state === 'ready' ? 0.7 : 0.4) + ')';
fxCtx.lineWidth = sig.state === 'ready' ? 1.6 : 1;
if (sig.state !== 'ready') fxCtx.setLineDash([3, 7]);
fxCtx.beginPath(); fxCtx.ellipse(0, 0, Math.max(0, rr), Math.max(0, rr * (sig.state === 'ready' ? 1 : 0.68)), 0, 0, 7); fxCtx.stroke();
fxCtx.restore();
fxCtx.setLineDash([]);
}
if (hot && Math.random() < 0.55) spawnParts(sig.x, sig.y, 1, { speed: 52, r: 1.6, c: '255,220,150', life: 0.6, gravity: 6 });
if (sig.state === 'unknown' && Math.random() < 0.06) spawnParts(sig.x, sig.y, 2, { speed: 34, r: 1.2, c: '150,200,255', life: 0.5, gravity: 0 });
}
for (let i = fx.effects.length - 1; i >= 0; i--) {
const ef = fx.effects[i];
ef.t += dt;
const p = Math.min(1, ef.t / ef.dur);
if (ef.kind === 'bolt') {
const alpha = p < 0.18 ? 1 : Math.max(0, 1 - (p - 0.18) / 0.82);
if (!ef.paths || p < 0.5 && Math.random() < 0.3) {
ef.paths = [
boltPath(ef.x1, ef.y1, ef.x2, ef.y2, 54, 5),
boltPath(ef.x1, ef.y1, ef.x2, ef.y2, 30, 4)
];
}
fxCtx.save();
fxCtx.globalCompositeOperation = 'lighter';
ef.paths.forEach((pts, k) => {
[[16, 0.09 * alpha, '140,190,255'], [6, 0.34 * alpha, '190,225,255'], [2.1, alpha, '255,255,255']].forEach(w => {
fxCtx.strokeStyle = 'rgba(' + w[2] + ',' + w[1] + ')';
fxCtx.lineWidth = w[0] * (k ? 0.6 : 1);
fxCtx.lineJoin = 'round'; fxCtx.lineCap = 'round';
fxCtx.beginPath();
pts.forEach((pt, j) => j ? fxCtx.lineTo(pt.x, pt.y) : fxCtx.moveTo(pt.x, pt.y));
fxCtx.stroke();
});
});
fxCtx.restore();
}
if (ef.kind === 'shock') {
const r = easeOut(p) * ef.r;
fxCtx.strokeStyle = 'rgba(' + (ef.c || '255,230,170') + ',' + (1 - p) * 0.8 + ')';
fxCtx.lineWidth = 4.5 * (1 - p) + 0.7;
fxCtx.beginPath(); fxCtx.arc(ef.x, ef.y, Math.max(0, r), 0, 7); fxCtx.stroke();
}
if (ef.kind === 'ghosts') {
const k = easeOut(p);
ef.pts.forEach((gp, j) => {
const x = gp.x + (ef.x - gp.x) * k, y = gp.y + (ef.y - gp.y) * k;
const a = (1 - p) * 0.75;
fxCtx.fillStyle = 'rgba(159,216,255,' + a + ')';
fxCtx.beginPath(); fxCtx.arc(x, y, Math.max(0, 15 * (1 - p * 0.55)), 0, 7); fxCtx.fill();
fxCtx.strokeStyle = 'rgba(159,216,255,' + a * 0.5 + ')';
fxCtx.lineWidth = 0.8;
fxCtx.beginPath(); fxCtx.moveTo(gp.x, gp.y); fxCtx.lineTo(x, y); fxCtx.stroke();
});
const gap = (1 - k) * 92 + 22;
fxCtx.strokeStyle = 'rgba(210,240,255,' + (p < 0.85 ? 0.85 : (1 - p) / 0.15 * 0.85) + ')';
fxCtx.lineWidth = 1.3;
[[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(d => {
fxCtx.beginPath();
fxCtx.moveTo(ef.x + d[0] * gap, ef.y + d[1] * gap);
fxCtx.lineTo(ef.x + d[0] * (gap + 13), ef.y + d[1] * (gap + 13));
fxCtx.stroke();
});
}
if (ef.kind === 'bubble') {
const k = easeOut(p);
const R = 26 + k * (ef.r - 26);
const wob = (1 - k) * 7 + Math.sin(fx.t * 9) * (1 - p) * 3.2;
fxCtx.strokeStyle = 'rgba(140,230,180,' + (0.35 + 0.5 * (1 - Math.abs(0.5 - p) * 2)) + ')';
fxCtx.lineWidth = 1.8;
fxCtx.beginPath();
for (let a = 0; a <= 48; a++) {
const th = (a / 48) * Math.PI * 2;
const rr = Math.max(1, R + Math.sin(th * 3 + fx.t * 6) * wob);
const x = ef.x + Math.cos(th) * rr, y = ef.y + Math.sin(th) * rr;
a ? fxCtx.lineTo(x, y) : fxCtx.moveTo(x, y);
}
fxCtx.closePath(); fxCtx.stroke();
fxCtx.strokeStyle = 'rgba(255,255,255,' + (1 - p) * 0.5 + ')';
fxCtx.lineWidth = 1;
fxCtx.beginPath(); fxCtx.arc(ef.x - R * 0.3, ef.y - R * 0.35, Math.max(0, R * 0.42), 2.6, 4.6); fxCtx.stroke();
}
if (ef.kind === 'pop') {
const k = p < 0.55 ? easeOut(p / 0.55) : 1;
const R = (26 + k * 56) * (p < 0.55 ? 1 : 1 + (p - 0.55) * 0.6);
if (p < 0.6) {
fxCtx.strokeStyle = 'rgba(255,150,150,' + (0.8 - p) + ')';
fxCtx.lineWidth = 2;
fxCtx.beginPath();
for (let a = 0; a <= 40; a++) {
const th = (a / 40) * Math.PI * 2;
const rr = Math.max(1, R + Math.sin(th * 4 + fx.t * 14) * (2 + p * 9));
const x = ef.x + Math.cos(th) * rr, y = ef.y + Math.sin(th) * rr;
a ? fxCtx.lineTo(x, y) : fxCtx.moveTo(x, y);
}
fxCtx.closePath(); fxCtx.stroke();
}
if (!ef.burst && p >= 0.55) {
ef.burst = 1;
spawnParts(ef.x, ef.y, 40, { speed: 330, r: 2.6, c: '255,160,160', life: 1.0, gravity: 150, shape: 'shard' });
fxAdd('shock', { x: ef.x, y: ef.y, r: 150, dur: 0.6, c: '255,150,150' });
}
}
if (ef.kind === 'petal') {
if (!ef.seeded) {
ef.seeded = 1;
for (let j = 0; j < 26; j++) {
const a = (j / 26) * Math.PI * 2;
fx.parts.push({
x: ef.x, y: ef.y, vx: Math.cos(a) * 78, vy: Math.sin(a) * 78 - 26,
life: 0, max: 1.9 + Math.random(), r: 4.2, c: '255,168,205', g: -8, shape: 'petal', rot: a
});
}
fxAdd('shock', { x: ef.x, y: ef.y, r: 132, dur: 0.8, c: '255,170,205' });
}
}
if (p >= 1) fx.effects.splice(i, 1);
}
for (let i = fx.parts.length - 1; i >= 0; i--) {
const q = fx.parts[i];
q.life += dt;
if (q.life >= q.max) { fx.parts.splice(i, 1); continue; }
q.vy += q.g * dt;
q.x += q.vx * dt; q.y += q.vy * dt;
q.vx *= 0.985; q.vy *= 0.985;
const a = 1 - q.life / q.max;
if (q.shape === 'petal') {
fxCtx.save();
fxCtx.translate(q.x, q.y);
fxCtx.rotate((q.rot || 0) + q.life * 1.6);
fxCtx.fillStyle = 'rgba(' + q.c + ',' + a * 0.85 + ')';
fxCtx.beginPath(); fxCtx.ellipse(0, 0, Math.max(0, q.r * 2.1), Math.max(0, q.r * 0.9), 0, 0, 7); fxCtx.fill();
fxCtx.restore();
} else if (q.shape === 'shard') {
fxCtx.strokeStyle = 'rgba(' + q.c + ',' + a + ')';
fxCtx.lineWidth = 1.4;
fxCtx.beginPath();
fxCtx.moveTo(q.x, q.y);
fxCtx.lineTo(q.x - q.vx * 0.035, q.y - q.vy * 0.035);
fxCtx.stroke();
} else {
fxCtx.fillStyle = 'rgba(' + q.c + ',' + a + ')';
fxCtx.beginPath(); fxCtx.arc(q.x, q.y, Math.max(0, q.r * (0.4 + a * 0.8)), 0, 7); fxCtx.fill();
}
}
if (fx.flash > 0) {
fx.flash = Math.max(0, fx.flash - dt * 6.2);
fxCtx.fillStyle = 'rgba(190,215,255,' + fx.flash * fx.flash * 0.17 + ')';
fxCtx.fillRect(0, 0, s0.w, s0.h);
}
if (sig && (sig.state === 'unknown' || sig.state === 'excited')) {
const lb = svg.querySelector('.sig-label text');
if (lb) { lb.setAttribute('x', (sig.x + 30).toFixed(1)); lb.setAttribute('y', (sig.y + 4).toFixed(1)); }
}
const alive = fx.effects.length || fx.parts.length || fx.flash > 0 ||
(sig && sig.state !== 'gone');
if (alive && state.on && labVisible()) fx.raf = requestAnimationFrame(fxTick);
else fxStop();
}
function playReaction(kind, fromId) {
const sig = state.sig;
if (!sig || REDUCED) return;
const from = state.nodes.find(n => n.id === fromId);
fxResize();
if (kind === 'excite') {
const x1 = from ? from.x : sig.x, y1 = from ? from.y - 30 : sig.y - 140;
fxAdd('bolt', { x1: x1, y1: y1, x2: sig.x, y2: sig.y, dur: 0.62 });
fx.flash = 1;
fxAdd('shock', { x: sig.x, y: sig.y, r: 190, dur: 0.72, c: '255,230,170' });
fxAdd('shock', { x: sig.x, y: sig.y, r: 108, dur: 0.46, c: '255,255,255' });
spawnParts(sig.x, sig.y, 46, { speed: 320, r: 2.8, c: '255,225,150', life: 1.05, gravity: 60 });
fxStart();
return;
}
if (kind === 'collapse') {
const pts = [];
for (let i = 0; i < 6; i++) {
const a = (i / 6) * Math.PI * 2 + 0.4;
pts.push({ x: sig.x + Math.cos(a) * (96 + Math.random() * 54), y: sig.y + Math.sin(a) * (82 + Math.random() * 46) });
}
fxAdd('ghosts', { x: sig.x, y: sig.y, pts: pts, dur: 0.85 });
fxAdd('shock', { x: sig.x, y: sig.y, r: 128, dur: 0.6, c: '170,220,255' });
fxStart();
return;
}
if (kind === 'contain') {
fxAdd('bubble', { x: sig.x, y: sig.y, r: 76, dur: 1.15 });
spawnParts(sig.x, sig.y, 26, { speed: 112, r: 2.1, c: '150,235,190', life: 1.1, gravity: -14 });
fxStart();
return;
}
if (kind === 'pop') {
fxAdd('pop', { x: sig.x, y: sig.y, dur: 1.0 });
fxStart();
return;
}
if (kind === 'petal') {
fxAdd('petal', { x: sig.x, y: sig.y, dur: 1.2 });
fxStart();
return;
}
}
const SIG_LABEL = { unknown: '信号 · 未知', excited: '信号 · 被激发', collapsed: '信号 · 已坍缩', ready: '信号 · 可捕获', gone: '消失了' };
const OBSERVE_IDS = ['observer', 'quantum'];
const EXCITE_IDS = ['storm'];
function initSignal() {
const s0 = size();
state.sig = { x: s0.w * 0.62, y: s0.h * 0.42, px: s0.w * 0.62, py: s0.h * 0.42, state: 'unknown', steps: [], energy: 0 };
draw(); fxResize(); fxStart();
}
function applyToSignal(id) {
const g = state.sig;
if (!g || g.state === 'gone') { draw(); return; }
const e = elOf(id);
const name = e ? e.name : id;
const st = g.state;
g.steps.push(name);
if (id === 'rose') {
playReaction('petal', id); g.state = 'gone'; draw(); animNode(id, 'excite');
showResult({
level: 'canon', title: '它消失了',
plain: '你把量子花拖过去，信号就没了。',
carry: ['操作序列：' + g.steps.join(' → ')],
why: ['摘录里那朵玫瑰只能在注意力移开时出现——你不能"抓"它。'],
next: ['重置信号再来一次'],
ev: '档案 NO.283：它只在你观测的那一刻开。'
});
return;
}
if (EXCITE_IDS.includes(id)) {
if (st === 'unknown' || st === 'collapsed') {
g.state = 'excited'; g.energy = 1; draw(); playReaction('excite', id); animNode(id, 'excite');
showResult({
level: 'canon', title: '亮了：它被激发起来',
plain: '雷暴的能量把它点着了，现在它在发亮、也在乱动。',
carry: ['状态：被激发', '能量：高', '操作序列：' + g.steps.join(' → ')],
why: ['本设定原话是"闪电只是点燃或激发了它"——点着的是早就在那儿的结构。',
'被激发过的信号能量更高，后面武器化的推演里底子更厚。'],
next: ['趁它亮着，再拖「观察者与坍缩」过去把它定住'],
ev: '档案 NO.113：闪电只是点燃或激发了它？'
});
afterApply();
return;
}
showResult({ level: 'sim', title: '已经点着了，再劈也不会更亮', plain: '它现在是激发态。', next: ['换个元素试试'] });
afterApply(); return;
}
if (OBSERVE_IDS.includes(id)) {
g.state = 'collapsed'; g.px = g.x; g.py = g.y; draw(); playReaction('collapse', id); animNode(id, 'fail');
showResult({
level: 'canon', title: '定住了：位置锁死',
plain: '你一观察，它就从"哪儿都可能是"变成"就在这儿"。',
carry: ['状态：已坍缩', '操作序列：' + g.steps.join(' → ')],
why: ['摘录写得比想象中硬：摄像机也算观察者，观察者不需要有意识。',
st === 'excited' ? '先激发再观察，得到的能量更高。' : '没激发就观察，位置定了但能量低。'],
next: ['再拖「空泡」过去，把它关起来'],
ev: '档案 NO.176：摄像机也是观察者……观察者并不需要有意识。'
});
afterApply(); return;
}
if (id === 'bubble') {
if (st === 'collapsed') {
g.state = 'ready'; draw(); playReaction('contain', 'bubble'); animNode('bubble', 'excite');
showResult({
level: 'infer', title: '成了：关进空泡，能拿走了',
plain: '位置锁定之后再套空泡，它稳定下来了。',
carry: ['状态：可捕获', '用了 ' + g.steps.length + ' 步', '能量：' + (g.energy ? '高' : '低'), '操作序列：' + g.steps.join(' → ')],
why: ['这条路走通了。你也可以不先激发（2 步），但那样拿到的能量更低。',
'空泡能兜住它，是因为它已经被观察定住——摘录里捕获用的正是这一层。'],
next: ['继续任务线，或者换个顺序再走一遍'],
ev: '档案 NO.161：我们所捕获到的那个空泡，哦，那个载流子……'
});
if (state.task === 'line') { state.line.q.capture = 1; state.line.captured = true; state.line.step = 2; renderConsole(); renderQuest(); }
else { state.runs.search = (state.runs.search || 0) + 1; }
afterApply(); return;
}
playReaction('pop', 'bubble');
showResult({
level: 'sim', title: '兜不住：它还没被定住',
plain: st === 'excited' ? '它太热又没锁定，空泡一碰就破。' : '你还没观察过它，位置是弥散的。',
carry: ['操作序列：' + g.steps.join(' → ')],
why: ['空泡需要先有一个确定的位置才套得住。'],
next: ['先拖「观察者与坍缩」过去，再套空泡']
});
afterApply(); return;
}
showResult({
level: 'sim', title: '没反应：' + name + '对它不起作用',
plain: '这一关用不上这个元素。',
carry: ['操作序列：' + g.steps.join(' → ')],
why: ['能对它动手的只有三类：激发（雷暴）、观察（观察者／量子态）、约束（空泡）。'],
next: ['换一个元素拖到信号上']
});
afterApply();
}
function afterApply() {
renderPalette();
if (state.task === 'line') renderQuest();
}
const LINE_STEPS = [
{ id: 'l1', name: '找到信号', why: '从零散的目击到一个可复现的信号' },
{ id: 'l2', name: '激发它', why: '把低能态的结构点成球形发光体' },
{ id: 'l3', name: '捕获它', why: '在它最稳的一刻约束住' },
{ id: 'l4', name: '推断结构', why: '从轨迹推断有没有一个核' },
{ id: 'l5', name: '决定怎么用', why: '观察方式决定命中率，也决定谁在看' }
];
function startLine() {
miniStop();
state.line = { step: 0, q: {}, obs: null, decision: null, done: false,
trail: [], found: false, captured: false, nucleus: false };
state.nodes = []; state.links = []; state.sel = null; state.mark = null;
state.scanState = 'idle'; state.scanR = 0.45;
if (taskBar) taskBar.querySelectorAll('[data-task]').forEach(b => b.setAttribute('aria-current', String(b.dataset.task === 'line')));
place('storm', null, null);
draw(); renderPalette(); renderPanel(); renderConsole(); showResult(null); renderQuest();
}
function lineControls() {
const L = state.line;
if (L.done) {
return '<button class="lc-run" data-act="linerestart">换一组选择，再来一次</button>';
}
if (L.step === 5) {
return '<button class="lc-run" data-act="lineweapon">继续武器化</button>' +
'<button class="lc-reset" data-act="linepeace">到此为止，封存数据</button>';
}
if (L.step === 0) {
return '<span class="lc-drag-hint">把概念拖到信号上：先定住它，再套空泡</span>' +
'<button class="lc-run" data-act="linerun">看看现在该怎么走</button></div>' + '<div hidden><select id="lnArea">' + D.scenarios.searchAreas.map(a => '<option value="' + a.id + '">' + esc(a.name) + '</option>').join('') + '</select></label>' +
'<label>扫描范围<input id="lnRadius" type="range" min="20" max="100" value="45"><output id="lnRadiusOut">45</output></label>' +
'<button class="lc-run" data-act="linerun">第 1 步：开始扫描</button>';
}
if (L.step >= 1 && L.step <= 4) return miniControls(['state', 'capture', 'nucleus', 'observer'][L.step - 1], '第 ' + (L.step + 1) + ' 步：' + ['点着它', '抓住它', '找原子核', '看与不看'][L.step - 1]);
if (L.step === 1) {
return '<label>怎么激发<select id="lnEx">' + D.scenarios.excitation.map(a => '<option value="' + a.id + '">' + esc(a.name) + '</option>').join('') + '</select></label>' +
'<label>给多少能量<input id="lnPower" type="range" min="0" max="100" value="60"><output id="lnPowerOut">60</output></label>' +
'<button class="lc-run" data-act="linerun">第 2 步：施加激发</button>';
}
if (L.step === 2) {
return '<label>等多久再出手<input id="lnWait" type="range" min="0" max="100" value="50"><output id="lnWaitOut">50</output></label>' +
'<button class="lc-run" data-act="linerun">第 3 步：按下捕获</button>';
}
if (L.step === 3) {
return '<label>采几个点<input id="lnSamples" type="range" min="3" max="24" value="10"><output id="lnSamplesOut">10</output></label>' +
'<button class="lc-run" data-act="linerun">第 4 步：推断结构</button>';
}
return '<label>谁来观察<select id="lnObs">' + D.scenarios.observers.slice(0, 3).map(o => '<option value="' + o.id + '">' + esc(o.name) + '</option>').join('') + '</select></label>' +
'<button class="lc-run" data-act="linerun">第 5 步：做观测实验</button>';
}
const clamp01 = v => Math.max(0, Math.min(1, v));
function runLineStep() {
const L = state.line;
const val = id => { if (LINE_FORCE && id in LINE_FORCE) return +LINE_FORCE[id]; const el = document.getElementById(id); return el ? +el.value : 0; };
const pick = id => { if (LINE_FORCE && id in LINE_FORCE) return String(LINE_FORCE[id]); const el = document.getElementById(id); return el ? el.value : ''; };
if (L.step === 0) {
const area = D.scenarios.searchAreas.find(a => a.id === pick('lnArea')) || D.scenarios.searchAreas[0];
const r = (val('lnRadius') || 45) / 100;
const t = searchTarget(area);
const dx = Math.abs(r - t.dist);
if (dx > 0.07) {
showResult({
level: 'sim', title: '这一关没过：环带没扫到它',
plain: '环带在' + (r < t.dist ? '里圈' : '外圈') + '，信号还留在盲区里。',
why: ['任务线不往前走：先把它扫出来，后面才谈得上激发。'],
next: ['调「扫描范围」再按一次']
});
return;
}
L.q.scan = clamp01(1 - dx / 0.07);
L.found = true;
state.scanState = 'hit'; state.mark = { x: t.x, y: t.y }; state.scanR = r;
place('macro', null, null); autoLinks(); draw(); animNode('macro', 'excite');
L.step = 1; L.trail.push('在 ' + area.name + ' 扫到信号（环带 ' + Math.round(r * 100) + '）');
showResult({
level: 'infer', title: '第 1 关过了：拿到一个可复查的信号',
plain: '环带正好扫过它，位置记下来了。',
carry: ['信号坐标', '把握度 ' + Math.round(L.q.scan * 100) + '%'],
why: ['本设定里的起点就是这样：先有目击与回波，才有后面的实验室。',
'把握度越高，后面武器化的推演里"打准"的基础越好。'],
next: ['第 2 步：把它激发起来'],
ev: '档案 NO.113：球形发光体并不是由闪电产生的，而是自然界早已存在的一种结构。'
});
renderConsole(); renderQuest();
return;
}
if (L.step === 1) {
const ex = D.scenarios.excitation.find(x => x.id === pick('lnEx')) || D.scenarios.excitation[0];
const power = val('lnPower') || 0;
const eff = power / 100 * ex.power;
if (!eff || eff < 0.45) {
showResult({
level: 'sim', title: '这一步没过：能量不够',
plain: '等效能量 ' + Math.round(eff * 100) + '%，点不着它。',
why: ['摘录只写了"被激发"，没给阈值：45% 是我们定的模拟值。'],
next: ['把能量拉高，或换自然雷击']
});
return;
}
L.q.energy = clamp01(1 - Math.abs(eff - 0.62) / 0.38);
place('ball', null, null); autoLinks(); draw(); animNode('macro', 'excite');
L.step = 2; L.trail.push('用' + ex.name + '、能量 ' + power + '% 点着了');
showResult({
level: 'canon', title: '第 2 关过了：空泡被点成球形发光体',
plain: '低能态跳到高能态，它就是本设定里那种会飘的发光球。',
carry: ['激发方式：' + ex.name, '稳定度 ' + Math.round(L.q.energy * 100) + '%'],
why: ['摘录的说法是"闪电只是点燃或激发了它"——不是造出来，是点着早就在那儿的结构。'],
next: ['第 3 步：趁它亮着，抓住它'],
ev: '档案 NO.113：闪电只是点燃或激发了它？'
});
renderConsole(); renderQuest();
return;
}
if (L.step === 2) {
const wait = val('lnWait') || 50;
if (wait < 38 || wait > 62) {
showResult({
level: 'sim', title: '这一步没过：时机不对',
plain: '你在 ' + wait + '%，它要么还没稳，要么已经暗下去了。',
why: ['窗口 38–62% 是模拟参数；摘录没有可照着按的秒数。'],
next: ['把滑块调到 50 附近']
});
return;
}
L.q.capture = clamp01(1 - Math.abs(wait - 50) / 12);
L.captured = true;
place('bubble', null, null); autoLinks(); draw();
L.step = 3; L.trail.push('在 ' + wait + '% 出手，捕获成功');
showResult({
level: 'canon', title: '第 3 关过了：关进空泡里',
plain: '它被约束住了，现在是一颗能拿走的空泡。',
carry: ['捕获质量 ' + Math.round(L.q.capture * 100) + '%'],
why: ['本设定里这一步是直升机拉电弧兜住它，后期改用氦气飞艇。',
'捕获质量影响后面推演里"能不能稳住当武器"。'],
next: ['第 4 步：看它里面有没有核'],
ev: '档案 NO.161：我们所捕获到的那个空泡；档案 NO.164：捕获改用氦气飞艇。'
});
renderConsole(); renderQuest();
return;
}
if (L.step === 3) {
const n = val('lnSamples') || 8;
if (n < 8) {
showResult({
level: 'sim', title: '这一步没过：点太少',
plain: '只有 ' + n + ' 个点，看不出轨迹是弯是直。',
why: ['研究者也是先攒数据，再谈结构。'],
next: ['把采样拉到 10 以上']
});
return;
}
L.q.nucleus = clamp01(n / 16);
L.nucleus = true;
place('nucleus', null, null); autoLinks(); draw();
L.step = 4; L.trail.push('用 ' + n + ' 个采样点推断出中心有核');
showResult({
level: 'infer', title: '第 4 关过了：推断中间有个核',
plain: '轨迹反复弯向同一处，说明那儿有东西在拉住它。',
carry: ['数据充分度 ' + Math.round(L.q.nucleus * 100) + '%', '能量节点：推断存在'],
why: ['这是"推"出来的，不是直接看到的。摘录里研究者也是这么问的。',
'有了核，"共振爆发"才谈得上——那是本设定后半段的军事后果。'],
next: ['第 5 步：决定用谁来观察它'],
ev: '档案 NO.161：那这个能量单元的原子核在哪里呢？'
});
renderConsole(); renderQuest();
return;
}
if (L.step === 4) {
const id = pick('lnObs') || 'direct';
const o = D.scenarios.observers.find(x => x.id === id) || D.scenarios.observers[0];
L.obs = id;
place('observer', null, null); place('quantum', null, null); autoLinks(); draw();
L.step = 5;
const collapsed = o.collapses !== false;
L.trail.push(collapsed ? '用「' + o.name + '」观察：态坍缩，可瞄准' : '关掉所有观测：结果发散');
showResult({
level: 'canon', title: collapsed ? '第 5 关：你看它，它就定住' : '第 5 关：没人看，它就散开',
plain: collapsed ? '观察让概率云坍缩成确定位置——这就是能瞄准的前提。' : '关掉所有观测后，落点发散，命中率只剩十分之一。',
carry: [collapsed ? '命中率：接近 100%（有观察者）' : '命中率：约 10%（无观察者）'],
why: ['摘录写得很直接：摄像机也算观察者，观察者不需要有意识。',
'接下来是这个推演真正的分岔：你要不要把它变成武器。'],
next: ['在下面选：继续武器化 / 到此为止'],
ev: '档案 NO.176–177：摄像机也是观察者……命中率只及存在观察者时的十分之一。'
});
renderConsole(); renderQuest();
return;
}
}
function lineDecision(kind) {
const L = state.line;
L.decision = kind;
L.done = true;
const q = L.q;
const avg = ((q.scan || 0) + (q.energy || 0) + (q.capture || 0) + (q.nucleus || 0)) / 4;
const ready = Math.round(avg * 100);
const noEye = L.obs === 'off';
if (kind === 'peace') {
L.trail.push('选择到此为止');
showResult({
level: 'infer', title: '结局：你把数据封存了',
plain: '信号、激发、捕获、结构，全都留在档案里，没有再往下走。',
carry: ['就绪度 ' + ready + '%（本可继续）', '最终选择：停手'],
why: ['本设定里这条路的尽头是共振爆发武器，以及"文明退回低技术状态"的后果。',
'停手不是失败：它只是把"能不能"和"该不该"分开了。'],
next: ['换一组选择再来一次', '回到第 5 关，改看观察方式'],
ev: '档案 NO.251 起：共振爆发被军事系统吸收；结局的代价在尾声里。'
});
renderConsole(); renderQuest();
return;
}
let title, plain, why2;
if (noEye) {
title = '结局：造出来了，但打不准';
plain = '没有观察者时命中率只有十分之一，武器化没有意义。';
why2 = ['这是摘录给出的数字，不是我们编的：去掉观察者，结果就发散。',
'于是你又把观察者请回来——而这就回到了"谁在看"的问题。'];
} else if (ready >= 70) {
title = '结局：武器化成功，代价也来了';
plain = '轨迹算得准、能量给得稳，共振爆发被做成了可用的东西。';
why2 = ['本设定里这条路的终点是：一处引爆，大范围电子设备失效，文明退回低技术状态。',
'你这一路的每一步都"做对了"，所以后果也最完整。'];
} else {
title = '结局：勉强能用，但很不稳';
plain = '就绪度只有 ' + ready + '%，打出去更像碰运气。';
why2 = ['信号把握、激发稳定度、捕获质量、数据充分度里有一项拖了后腿。',
'在本设定里，这种"大概能行"的东西照样会被推上前线。'];
}
L.trail.push(kind === 'weapon' ? '选择继续武器化' : '');
showResult({
level: ready >= 70 ? 'canon' : 'sim',
title: title,
plain: plain,
carry: ['就绪度 ' + Math.round(ready) + '%', L.obs === 'off' ? '命中率约 10%' : '命中率接近 100%'],
why: why2,
next: ['换一组选择再来一次'],
ev: '档案 NO.251：达到临界速度的相撞肯定会引发核聚变。尾声：代价。'
});
renderConsole(); renderQuest();
}
var gameWrap = null, gCv = null, gx = null, gHud = null, gCard = null, gToast = null;
var G = null;
var G_DUR = 60;
var G_CARDS = Object.keys(D.elements).map(function (id) { return D.elements[id]; })
.filter(function (e) { return e && e.evidence; });
var G_BEST_KEY = 'bl-storm-best';
function gBuildDom() {
if (gameWrap) return;
const host = root.querySelector('.lab-canvas');
if (!host) return;
gameWrap = document.createElement('div');
gameWrap.className = 'lab-game';
gameWrap.id = 'labGame';
gameWrap.innerHTML =
'<canvas class="lg-cv" aria-label="雷雨夜小游戏画面"></canvas>' +
'<div class="lg-hud"></div>' +
'<div class="lg-card"></div>' +
'<div class="lg-toast" role="status" aria-live="polite"></div>';
host.appendChild(gameWrap);
gCv = gameWrap.querySelector('.lg-cv');
gx = gCv.getContext('2d');
gHud = gameWrap.querySelector('.lg-hud');
gCard = gameWrap.querySelector('.lg-card');
gToast = gameWrap.querySelector('.lg-toast');
gCv.addEventListener('pointerdown', function (e) {
if (!G || G.phase !== 'play') return;
const r = gCv.getBoundingClientRect();
gameHit(e.clientX - r.left, e.clientY - r.top);
});
gCard.addEventListener('click', function (e) {
const b = e.target.closest('[data-g]');
if (!b) return;
if (b.dataset.g === 'start') { gameStart(); renderConsole(); }
});
}
function gNew(old) {
return {
phase: 'intro', t: 0, left: G_DUR, score: 0, combo: 0, bestCombo: 0, lives: 3,
caught: 0, missed: 0, burned: 0, nextSpawn: 0.6, nextAmb: 1.2,
balls: [], bolts: [], rings: [], parts: [], texts: [],
flash: 0, redFlash: 0, shake: 0, cards: [], deck: G_CARDS.slice().sort(function () { return Math.random() - 0.5; }),
raf: null, last: 0, hudKey: '',
w: old ? old.w : 0, h: old ? old.h : 0, dpr: old ? old.dpr : 1, rain: old ? old.rain : []
};
}
function gPlace() {
if (!gameWrap || getComputedStyle(gameWrap).position !== 'absolute') { if (gameWrap) gameWrap.style.top = ''; return; }
const host = gameWrap.parentElement.getBoundingClientRect();
const tb = taskBar ? taskBar.getBoundingClientRect() : null;
const top = tb && tb.height ? Math.max(12, Math.round(tb.bottom - host.top + 10)) : 64;
if (gameWrap.style.top !== top + 'px') gameWrap.style.top = top + 'px';
}
function gResize() {
if (!gameWrap || !G) return;
gPlace();
const r = gameWrap.getBoundingClientRect();
const w = Math.max(280, Math.round(r.width)), h = Math.max(220, Math.round(r.height));
const dpr = Math.min(2, devicePixelRatio || 1);
if (w === G.w && h === G.h && dpr === G.dpr) return;
G.w = w; G.h = h; G.dpr = dpr;
gCv.width = Math.round(w * dpr); gCv.height = Math.round(h * dpr);
gCv.style.width = w + 'px'; gCv.style.height = h + 'px';
gx.setTransform(dpr, 0, 0, dpr, 0, 0);
G.rain = [];
const count = Math.round(w * h / 5200);
for (let i = 0; i < count; i++) G.rain.push({ x: Math.random() * w, y: Math.random() * h, v: 520 + Math.random() * 420, l: 8 + Math.random() * 14 });
}
function gameMode(on) {
gBuildDom();
if (!gameWrap) return;
root.classList.toggle('game-on', on);
if (on) {
gamePause();
G = gNew(G);
showIntro();
renderHud(true);
requestAnimationFrame(function () { gResize(); gameResume(); });
} else {
gamePause();
}
}
function gameStart() {
gBuildDom();
if (!gameWrap) return;
gamePause();
G = gNew(G);
G.phase = 'play';
gCard.classList.remove('on'); gCard.innerHTML = '';
gToast.classList.remove('on');
gResize();
renderHud(true);
gameResume();
}
function gamePause() {
if (G && G.raf != null) { cancelAnimationFrame(G.raf); G.raf = null; }
}
function gameResume() {
if (!G || G.raf != null) return;
if (!state.on || state.task !== 'game' || !labVisible() || document.hidden) return;
G.last = performance.now();
G.raf = requestAnimationFrame(gTick);
}
function gTick(now) {
G.raf = null;
if (!state.on || state.task !== 'game' || !labVisible() || document.hidden) return;
const dt = Math.min(0.05, (now - G.last) / 1000);
G.last = now;
gResize();
gStep(dt);
gDraw();
renderHud(false);
G.raf = requestAnimationFrame(gTick);
}
function gStep(dt) {
G.t += dt;
G.rain.forEach(function (d) {
d.y += d.v * dt; d.x -= d.v * dt * 0.18;
if (d.y > G.h) { d.y = -d.l; d.x = Math.random() * (G.w + 80); }
if (d.x < -20) d.x += G.w + 40;
});
G.nextAmb -= dt;
if (G.nextAmb <= 0) {
G.nextAmb = 2.2 + Math.random() * 3.8;
gBolt(Math.random() * G.w, G.h * (0.25 + Math.random() * 0.25), true, false);
}
if (G.phase === 'play') {
G.left -= dt;
if (G.left <= 0) { G.left = 0; gameEnd(); }
const prog = 1 - G.left / G_DUR;
G.nextSpawn -= dt;
const alive = G.balls.filter(function (b) { return b.st !== 'dead'; }).length;
if (G.nextSpawn <= 0 && alive < 2 + Math.floor(prog * 3)) {
gSpawn(prog);
G.nextSpawn = Math.max(0.55, 1.6 - prog * 1.05) * (0.7 + Math.random() * 0.6);
}
}
for (let i = G.balls.length - 1; i >= 0; i--) {
const b = G.balls[i];
b.age += dt;
if (b.age < 0) continue;            /* 闪电还没劈到 */
if (b.st === 'free') {
b.vx += (Math.random() - 0.5) * b.jit * dt;
b.vy += (Math.random() - 0.5) * b.jit * dt;
const sp = Math.hypot(b.vx, b.vy), max = b.speed;
if (sp > max) { b.vx *= max / sp; b.vy *= max / sp; }
b.x += b.vx * dt; b.y += b.vy * dt;
if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx); }
if (b.x > G.w - b.r) { b.x = G.w - b.r; b.vx = -Math.abs(b.vx); }
if (b.y < 60 + b.r) { b.y = 60 + b.r; b.vy = Math.abs(b.vy); }
if (b.y > G.h - 30 - b.r) { b.y = G.h - 30 - b.r; b.vy = -Math.abs(b.vy); }
if (b.age > b.life) {
b.st = 'dead';
if (!b.red) { G.missed++; G.combo = 0; gText(b.x, b.y, '跑了', '170,180,200'); }
gPuff(b.x, b.y, b.red ? '255,110,110' : '170,180,200', 10);
}
} else if (b.st === 'held') {
b.hold -= dt;
if (b.hold <= 0) {
b.st = 'free'; b.age = Math.min(b.age, b.life - 1.2);
G.combo = 0;
gText(b.x, b.y, '没抓住，又跑了', '200,210,230');
}
}
if (b.st === 'dead') G.balls.splice(i, 1);
}
for (let i = G.bolts.length - 1; i >= 0; i--) {
const z = G.bolts[i]; z.t += dt;
if (z.t > z.dur) G.bolts.splice(i, 1);
}
for (let i = G.rings.length - 1; i >= 0; i--) {
const z = G.rings[i]; z.t += dt;
if (z.t > z.dur) G.rings.splice(i, 1);
}
for (let i = G.parts.length - 1; i >= 0; i--) {
const q = G.parts[i]; q.t += dt;
if (q.t > q.max) { G.parts.splice(i, 1); continue; }
if (q.tx != null) {           /* 被吸向计分板 */
const k = Math.min(1, dt * 6);
q.x += (q.tx - q.x) * k; q.y += (q.ty - q.y) * k;
} else {
q.vy += q.g * dt; q.x += q.vx * dt; q.y += q.vy * dt;
q.vx *= 0.97; q.vy *= 0.97;
}
}
for (let i = G.texts.length - 1; i >= 0; i--) {
const z = G.texts[i]; z.t += dt; z.y -= 34 * dt;
if (z.t > 1.1) G.texts.splice(i, 1);
}
G.flash = Math.max(0, G.flash - dt * 4.5);
G.redFlash = Math.max(0, G.redFlash - dt * 3);
G.shake = Math.max(0, G.shake - dt * 2.6);
}
function gSpawn(prog) {
const red = prog > 0.15 && Math.random() < 0.12 + prog * 0.18;
const x = 60 + Math.random() * (G.w - 120);
const y = 110 + Math.random() * Math.max(40, G.h - 200);
const r = red ? 19 : 17 + Math.random() * 5;
G.balls.push({
x: x, y: y, r: r, red: red, st: 'free', age: -0.16, hold: 0, holdMax: 0,
life: (red ? 3.6 : 4.4 - prog * 1.7) + Math.random() * 0.8,
speed: 46 + prog * 70 + Math.random() * 26, jit: 220 + prog * 260,
vx: (Math.random() - 0.5) * 60, vy: (Math.random() - 0.5) * 60, seed: Math.random() * 10
});
gBolt(x, y, false, red);
}
function gBolt(x, y, amb, red) {
const x0 = x + (Math.random() - 0.5) * 160;
G.bolts.push({ x0: x0, y0: -10, x1: x, y1: y, t: 0, dur: amb ? 0.42 : 0.5, amb: amb, red: red, path: null, next: 0 });
G.flash = Math.max(G.flash, amb ? 0.35 : 0.8);
if (!amb) G.rings.push({ x: x, y: y, t: 0, dur: 0.5, r: 70, c: red ? '255,120,120' : '255,220,160' });
}
function gameHit(x, y) {
let best = null, bd = 1e9;
G.balls.forEach(function (b) {
if (b.st === 'dead' || b.age < 0) return;
const d = Math.hypot(b.x - x, b.y - y);
if (d < b.r + 26 && d < bd) { bd = d; best = b; }
});
if (!best) { gText(x, y, '空的', '140,150,170'); return; }
const b = best;
if (b.red) {
b.st = 'dead';
G.lives--; G.burned++; G.combo = 0;
G.redFlash = 1; G.shake = 1;
gPuff(b.x, b.y, '255,110,110', 30);
G.rings.push({ x: b.x, y: b.y, t: 0, dur: 0.55, r: 120, c: '255,110,110' });
gText(b.x, b.y, '过载！-1 命', '255,140,140');
if (G.lives <= 0) gameEnd();
return;
}
if (b.st === 'free') {
const prog = 1 - G.left / G_DUR;
b.st = 'held'; b.holdMax = b.hold = Math.max(0.75, 1.25 - prog * 0.45);
b.heldAt = G.t;
G.rings.push({ x: b.x, y: b.y, t: 0, dur: 0.35, r: 56, c: '160,215,255', inward: true });
gText(b.x, b.y - 26, '定住！', '170,220,255');
return;
}
if (b.st === 'held') {
b.st = 'dead';
G.combo++; G.bestCombo = Math.max(G.bestCombo, G.combo);
const mult = Math.min(5, G.combo);
const quick = (G.t - b.heldAt) < 0.45;
const pts = 10 * mult + (quick ? 5 : 0);
G.score += pts; G.caught++;
G.rings.push({ x: b.x, y: b.y, t: 0, dur: 0.5, r: 90, c: '150,240,190' });
for (let i = 0; i < 16; i++) {
const a = Math.random() * Math.PI * 2, sp = 60 + Math.random() * 140;
G.parts.push({ x: b.x, y: b.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 0, t: 0, max: 0.5 + Math.random() * 0.3, r: 2.2, c: '160,240,200' });
}
for (let i = 0; i < 8; i++) {
G.parts.push({ x: b.x + (Math.random() - 0.5) * 20, y: b.y + (Math.random() - 0.5) * 20, t: 0, max: 0.75, r: 2.4, c: '255,230,160', tx: 40, ty: 24 });
}
gText(b.x, b.y - 22, '+' + pts + (mult > 1 ? ' ×' + mult : '') + (quick ? ' 快！' : ''), '190,255,210');
unlockCard();
}
}
function gText(x, y, txt, c) { G.texts.push({ x: x, y: y, txt: txt, c: c, t: 0 }); }
function gPuff(x, y, c, k) {
for (let i = 0; i < k; i++) {
const a = Math.random() * Math.PI * 2, sp = 40 + Math.random() * 170;
G.parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 90, t: 0, max: 0.5 + Math.random() * 0.5, r: 2, c: c });
}
}
var gToastTimer = null;
function unlockCard() {
if (!G.deck.length) return;
const e = G.deck.shift();
G.cards.push(e);
const lv = LV[e.evidenceLevel] ? LV[e.evidenceLevel].label : '';
const quote = String(e.evidence || '').length > 64 ? String(e.evidence).slice(0, 62) + '…' : String(e.evidence || '');
gToast.innerHTML = '<b>摘录碎片 ' + G.cards.length + '/' + G_CARDS.length + ' · ' + esc(e.name) + '</b>' +
'<p>' + esc(quote) + '</p><i>' + esc(e.page || '') + (lv ? ' · ' + esc(lv) : '') + '</i>';
gToast.classList.add('on');
clearTimeout(gToastTimer);
gToastTimer = setTimeout(function () { if (gToast) gToast.classList.remove('on'); }, 2600);
}
function gameEnd() {
if (G.phase !== 'play') return;
G.phase = 'end';
G.balls.forEach(function (b) { gPuff(b.x, b.y, '170,180,200', 6); });
G.balls = [];
let best = 0;
try { best = +localStorage.getItem(G_BEST_KEY) || 0; } catch (_) {}
G.newBest = G.score > best;
G.best = Math.max(best, G.score);
try { if (G.newBest) localStorage.setItem(G_BEST_KEY, String(G.score)); } catch (_) {}
state.runs.game = (state.runs.game || 0) + 1;
showEnd();
renderHud(true);
renderConsole();
}
function showIntro() {
let best = 0;
try { best = +localStorage.getItem(G_BEST_KEY) || 0; } catch (_) {}
gCard.innerHTML =
'<p class="lg-k">⚡ 雷雨夜 · 抓球闪</p>' +
'<h3>闪电劈下来，会留下一颗乱飘的球</h3>' +
'<ul class="lg-rules">' +
'<li><i class="d o"></i><span><b>点一下</b>橘色的球 → 它被你"看见"，定住、变蓝</span></li>' +
'<li><i class="d b"></i><span>蓝圈缩完之前<b>再点一下</b> → 抓到，连着抓分数翻倍</span></li>' +
'<li><i class="d r"></i><span><b>红色带刺</b>的是过载球，碰一下扣一条命</span></li>' +
'</ul>' +
'<p class="lg-note">为什么要"先看再抓"：本设定里写过"摄像机也是观察者"，被观察的球闪才停得住（档案 NO.176）。' +
'游戏把它简化成两下点击——计时、分数、红球都是我们设计的玩法，不是本记录。</p>' +
'<div class="lg-go"><button data-g="start">开始（60 秒）</button>' +
(best ? '<span>最高分 ' + best + '</span>' : '') + '</div>';
gCard.classList.add('on');
}
function showEnd() {
const sc = G.score;
const rank = sc >= 400 ? '球闪猎手' : sc >= 220 ? '熟练观测员' : sc >= 90 ? '见习观测员' : '刚进雷区';
let tip;
if (G.burned >= 2) tip = '红刺球碰太多了：先看清颜色再点。';
else if (G.missed > G.caught) tip = '跑掉的比抓到的多：点完第一下，马上点第二下。';
else if (G.bestCombo < 4) tip = '连击能让分数翻倍：别让球跑掉，就不会断。';
else tip = '已经很稳了。试试只用最快的速度抓（定住后 0.45 秒内再点有加分）。';
gCard.innerHTML =
'<p class="lg-k">' + (G.lives <= 0 ? '三条命用完了' : '时间到') + '</p>' +
'<h3>' + esc(rank) + (G.newBest ? ' <em>新纪录！</em>' : '') + '</h3>' +
'<div class="lg-stats">' +
stat('分数', sc) + stat('抓到', G.caught) + stat('跑掉', G.missed) +
stat('最高连击', G.bestCombo) + stat('摘录碎片', G.cards.length + '/' + G_CARDS.length) + stat('最高分', G.best) +
'</div>' +
'<p class="lg-note">' + esc(tip) + '</p>' +
(G.cards.length ? '<div class="lg-got">' + G.cards.map(function (e) {
return '<span title="' + esc(e.evidence) + '">' + esc(e.name) + '</span>';
}).join('') + '</div>' : '') +
'<div class="lg-go"><button data-g="start">再来一局</button></div>';
gCard.classList.add('on');
}
function stat(k, v) { return '<div><b>' + esc(String(v)) + '</b><span>' + esc(k) + '</span></div>'; }
function renderHud(force) {
if (!gHud || !G) return;
const key = G.phase + '|' + Math.ceil(G.left) + '|' + G.score + '|' + G.combo + '|' + G.lives;
if (!force && key === G.hudKey) return;
G.hudKey = key;
const hearts = '♥♥♥'.slice(0, Math.max(0, G.lives)) + '<s>' + '♥♥♥'.slice(0, 3 - Math.max(0, G.lives)) + '</s>';
gHud.innerHTML =
'<span class="lg-score"><b>' + G.score + '</b>分</span>' +
(G.combo > 1 ? '<span class="lg-combo">连击 ×' + Math.min(5, G.combo) + '</span>' : '') +
'<span class="lg-time' + (G.left < 10 && G.phase === 'play' ? ' low' : '') + '">' + Math.ceil(G.left) + 's</span>' +
'<span class="lg-lives">' + hearts + '</span>';
}
function gDraw() {
const w = G.w, h = G.h, c = gx;
c.save();
c.clearRect(0, 0, w, h);
if (G.shake > 0 && !REDUCED) c.translate((Math.random() - 0.5) * 9 * G.shake, (Math.random() - 0.5) * 9 * G.shake);
const sky = c.createLinearGradient(0, 0, 0, h);
sky.addColorStop(0, 'rgb(' + (8 + G.flash * 40) + ',' + (11 + G.flash * 46) + ',' + (24 + G.flash * 70) + ')');
sky.addColorStop(1, '#04050b');
c.fillStyle = sky; c.fillRect(-12, -12, w + 24, h + 24);
c.strokeStyle = 'rgba(150,175,220,' + (0.16 + G.flash * 0.25) + ')';
c.lineWidth = 1;
c.beginPath();
G.rain.forEach(function (d) { c.moveTo(d.x, d.y); c.lineTo(d.x + d.l * 0.18, d.y - d.l); });
c.stroke();
c.fillStyle = 'rgba(' + (6 + G.flash * 30) + ',' + (8 + G.flash * 34) + ',' + (14 + G.flash * 50) + ',1)';
c.beginPath(); c.moveTo(0, h);
for (let x = 0; x <= w; x += 40) c.lineTo(x, h - 22 - Math.sin(x * 0.013) * 9 - Math.sin(x * 0.041) * 5);
c.lineTo(w, h); c.closePath(); c.fill();
c.globalCompositeOperation = 'lighter';
G.bolts.forEach(function (z) {
if (!z.path || z.t > z.next) { z.path = boltPath(z.x0, z.y0, z.x1, z.y1, z.amb ? 70 : 90, 6); z.next = z.t + 0.07; }
const p = z.t / z.dur;
const a = (p < 0.15 ? 1 : p < 0.3 ? 0.45 : p < 0.42 ? 0.95 : Math.max(0, 1 - (p - 0.42) / 0.58)) * (z.amb ? 0.5 : 1);
const col = z.red ? '255,140,140' : '170,205,255';
[[14, 0.08], [5, 0.3], [1.8, 1]].forEach(function (lw) {
c.strokeStyle = lw[0] < 2 ? 'rgba(255,255,255,' + a + ')' : 'rgba(' + col + ',' + a * lw[1] + ')';
c.lineWidth = lw[0]; c.lineJoin = 'round'; c.lineCap = 'round';
c.beginPath();
z.path.forEach(function (pt, j) { j ? c.lineTo(pt.x, pt.y) : c.moveTo(pt.x, pt.y); });
c.stroke();
});
});
G.rings.forEach(function (z) {
const p = z.t / z.dur, k = 1 - Math.pow(1 - p, 3);
const r = z.inward ? z.r * (1 - k) + 18 : z.r * k;
c.strokeStyle = 'rgba(' + z.c + ',' + (1 - p) * 0.85 + ')';
c.lineWidth = 3 * (1 - p) + 0.8;
c.beginPath(); c.arc(z.x, z.y, Math.max(0, r), 0, 7); c.stroke();
});
G.balls.forEach(function (b) {
if (b.age < 0) return;
const appear = Math.min(1, b.age / 0.25);
const held = b.st === 'held';
const warn = b.st === 'free' && !b.red && b.life - b.age < 1.1;
const blink = warn ? (Math.sin(G.t * 26) > 0 ? 1 : 0.35) : 1;
const col = b.red ? '255,95,95' : held ? '150,210,255' : '255,180,90';
const R = b.r * appear * (1 + Math.sin(G.t * 8 + b.seed) * 0.08);
const halo = c.createRadialGradient(b.x, b.y, 0, b.x, b.y, R * 3.2);
halo.addColorStop(0, 'rgba(' + col + ',' + 0.55 * blink + ')');
halo.addColorStop(1, 'rgba(' + col + ',0)');
c.fillStyle = halo;
c.beginPath(); c.arc(b.x, b.y, Math.max(0, R * 3.2), 0, 7); c.fill();
c.fillStyle = 'rgba(' + col + ',' + 0.95 * blink + ')';
c.beginPath(); c.arc(b.x, b.y, Math.max(0, R * 0.62), 0, 7); c.fill();
c.fillStyle = 'rgba(255,255,255,' + 0.85 * blink + ')';
c.beginPath(); c.arc(b.x, b.y, Math.max(0, R * 0.28), 0, 7); c.fill();
if (b.red) {
c.strokeStyle = 'rgba(255,130,130,' + 0.9 * blink + ')';
c.lineWidth = 2;
c.beginPath();
for (let i = 0; i < 9; i++) {
const a = i / 9 * Math.PI * 2 + G.t * 1.6;
c.moveTo(b.x + Math.cos(a) * R * 0.7, b.y + Math.sin(a) * R * 0.7);
c.lineTo(b.x + Math.cos(a) * R * 1.45, b.y + Math.sin(a) * R * 1.45);
}
c.stroke();
}
if (held) {
const k = b.hold / b.holdMax;
c.strokeStyle = 'rgba(190,230,255,0.95)';
c.lineWidth = 3;
c.beginPath(); c.arc(b.x, b.y, R + 10 + k * 26, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k); c.stroke();
c.strokeStyle = 'rgba(190,230,255,0.25)';
c.lineWidth = 1;
c.beginPath(); c.arc(b.x, b.y, R + 10, 0, 7); c.stroke();
}
});
G.parts.forEach(function (q) {
const a = 1 - q.t / q.max;
c.fillStyle = 'rgba(' + q.c + ',' + a + ')';
c.beginPath(); c.arc(q.x, q.y, Math.max(0, q.r * (0.4 + a * 0.8)), 0, 7); c.fill();
});
c.globalCompositeOperation = 'source-over';
c.font = '600 13px system-ui, sans-serif';
c.textAlign = 'center';
G.texts.forEach(function (z) {
const a = 1 - z.t / 1.1;
c.fillStyle = 'rgba(' + z.c + ',' + a + ')';
c.fillText(z.txt, z.x, z.y);
});
if (G.flash > 0) { c.fillStyle = 'rgba(200,220,255,' + G.flash * G.flash * 0.14 + ')'; c.fillRect(-12, -12, w + 24, h + 24); }
if (G.redFlash > 0) { c.fillStyle = 'rgba(255,60,60,' + G.redFlash * 0.22 + ')'; c.fillRect(-12, -12, w + 24, h + 24); }
c.restore();
}
window.__labGame = {
start: function () { gameStart(); renderConsole(); },
pause: function () { gamePause(); },
resume: function () { gameResume(); },
hit: function (x, y) { if (G && G.phase === 'play') gameHit(x, y); },
end: function () { if (G && G.phase === 'play') { G.left = 0; gameEnd(); } },
state: function () { return G; }
};
window.__labFx = { start: fxStart, stop: fxStop, resize: fxResize };
window.__lab = {
fx: fx, playReaction: playReaction,
on: () => state.on, setMode, setTask, state,
run: act => {
const b = consoleEl.querySelector('[data-act="' + act + '"]');
if (b) b.click();
}
};
})();
(function coverLightning(){
const crt = document.getElementById('crt');
const cover = document.getElementById('cover');
if (!crt || !cover) return;
const cv = document.createElement('canvas');
cv.className = 'cover-bolt';
cv.setAttribute('aria-hidden', 'true');
const gl = document.getElementById('crtGL');
if (gl && gl.parentNode) gl.parentNode.insertBefore(cv, gl.nextSibling); else crt.appendChild(cv);
const ctx = cv.getContext('2d');
const title = document.querySelector('#cover .cover-title');
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const S = { strikes: [], orbs: [], flash: 0, raf: null, last: 0, timer: null, w: 0, h: 0, count: 0, lastTap: 0 };
const visible = () => cover.classList.contains('on') && !document.hidden;
function resize() {
const r = crt.getBoundingClientRect();
const dpr = Math.min(2, devicePixelRatio || 1);
const w = Math.max(200, Math.round(r.width)), h = Math.max(200, Math.round(r.height));
if (w === S.w && h === S.h) return;
S.w = w; S.h = h;
cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
cv.style.width = w + 'px'; cv.style.height = h + 'px';
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function jag(x1, y1, x2, y2, amp, depth) {
let pts = [{ x: x1, y: y1 }, { x: x2, y: y2 }];
for (let d = 0; d < depth; d++) {
const out = [];
for (let i = 0; i < pts.length - 1; i++) {
const a = pts[i], b = pts[i + 1];
const nx = -(b.y - a.y), ny = b.x - a.x, L = Math.hypot(nx, ny) || 1;
const off = (amp / (d + 1)) * (Math.random() - 0.5) * 2;
out.push(a, { x: (a.x + b.x) / 2 + nx / L * off, y: (a.y + b.y) / 2 + ny / L * off });
}
out.push(pts[pts.length - 1]);
pts = out;
}
return pts;
}
function makeBolt(x, y) {
const x0 = x + (Math.random() - 0.5) * S.w * 0.25;
const main = jag(x0, -20, x, y, 110, 7);
const branches = [];
const nb = 2 + Math.floor(Math.random() * 3);
for (let i = 0; i < nb; i++) {
const p = main[Math.floor(main.length * (0.2 + Math.random() * 0.5))];
const ang = Math.PI / 2 + (Math.random() < 0.5 ? -1 : 1) * (0.4 + Math.random() * 0.6);
const len = 60 + Math.random() * 160;
branches.push(jag(p.x, p.y, p.x + Math.cos(ang) * len, p.y + Math.sin(ang) * len, 40, 5));
}
return { main: main, branches: branches };
}
function strike(x, y) {
resize();
if (x == null) {
const narrow = S.w < 760;
x = narrow ? S.w * (0.15 + Math.random() * 0.7) : S.w * (0.5 + Math.random() * 0.42);
y = S.h * (0.55 + Math.random() * 0.3);
}
S.strikes.push({ x: x, y: y, t: 0, dur: 0.75, bolt: makeBolt(x, y), re: false });
S.orbs.push({ x: x, y: y - 8, vx: (Math.random() - 0.5) * 24, vy: -8 - Math.random() * 10, t: 0, max: 3.4 + Math.random() * 1.6, r: 9 + Math.random() * 5, seed: Math.random() * 10 });
if (S.orbs.length > 4) S.orbs.shift();
S.flash = 1;
S.count++;
if (title) {
title.classList.add('zap');
setTimeout(function () { title.classList.remove('zap'); }, 160);
}
start();
}
function start() {
if (S.raf != null || !visible()) return;
S.last = performance.now();
S.raf = requestAnimationFrame(tick);
}
function drawPath(pts) {
ctx.beginPath();
pts.forEach(function (p, i) { i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); });
ctx.stroke();
}
function tick(now) {
S.raf = null;
const dt = Math.min(0.05, (now - S.last) / 1000);
S.last = now;
ctx.clearRect(0, 0, S.w, S.h);
if (!visible()) return;
ctx.globalCompositeOperation = 'lighter';
for (let i = S.strikes.length - 1; i >= 0; i--) {
const z = S.strikes[i];
z.t += dt;
const p = z.t / z.dur;
if (p >= 1) { S.strikes.splice(i, 1); continue; }
if (!z.re && p > 0.3) { z.re = true; z.bolt = makeBolt(z.x, z.y); S.flash = Math.max(S.flash, 0.7); }
const a = p < 0.12 ? 1 : p < 0.28 ? 0.35 : p < 0.4 ? 0.95 : Math.max(0, 1 - (p - 0.4) / 0.6);
[[22, 0.07, '120,160,255'], [9, 0.22, '160,195,255'], [3.4, 0.6, '215,232,255'], [1.6, 1, '255,255,255']].forEach(function (L) {
ctx.strokeStyle = 'rgba(' + L[2] + ',' + a * L[1] + ')';
ctx.lineWidth = L[0]; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
drawPath(z.bolt.main);
ctx.lineWidth = L[0] * 0.5;
z.bolt.branches.forEach(drawPath);
});
const g = ctx.createRadialGradient(z.x, z.y, 0, z.x, z.y, 140);
g.addColorStop(0, 'rgba(190,215,255,' + 0.5 * a + ')');
g.addColorStop(1, 'rgba(190,215,255,0)');
ctx.fillStyle = g;
ctx.beginPath(); ctx.arc(z.x, z.y, 140, 0, 7); ctx.fill();
}
for (let i = S.orbs.length - 1; i >= 0; i--) {
const o = S.orbs[i];
o.t += dt;
if (o.t >= o.max) { S.orbs.splice(i, 1); continue; }
o.vx += (Math.random() - 0.5) * 50 * dt; o.vy += (Math.random() - 0.5) * 30 * dt;
o.x += o.vx * dt; o.y += o.vy * dt;
const life = o.t / o.max;
const a = (o.t < 0.3 ? o.t / 0.3 : 1) * (1 - life) * (0.75 + Math.sin(o.t * 22 + o.seed) * 0.25);
const R = o.r * (1 + Math.sin(o.t * 6) * 0.1);
const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, R * 4);
g.addColorStop(0, 'rgba(255,200,120,' + 0.6 * a + ')');
g.addColorStop(0.4, 'rgba(255,150,80,' + 0.18 * a + ')');
g.addColorStop(1, 'rgba(255,150,80,0)');
ctx.fillStyle = g;
ctx.beginPath(); ctx.arc(o.x, o.y, Math.max(0, R * 4), 0, 7); ctx.fill();
ctx.fillStyle = 'rgba(255,245,220,' + a + ')';
ctx.beginPath(); ctx.arc(o.x, o.y, Math.max(0, R * 0.45), 0, 7); ctx.fill();
}
ctx.globalCompositeOperation = 'source-over';
if (S.flash > 0) {
S.flash = Math.max(0, S.flash - dt * 5);
ctx.fillStyle = 'rgba(190,210,255,' + S.flash * S.flash * 0.22 + ')';
ctx.fillRect(0, 0, S.w, S.h);
}
if (S.strikes.length || S.orbs.length || S.flash > 0) S.raf = requestAnimationFrame(tick);
}
function schedule(first) {
clearTimeout(S.timer);
if (REDUCED) return;
S.timer = setTimeout(function () {
if (visible()) {
strike();
if (Math.random() < 0.3) setTimeout(function () { if (visible()) strike(); }, 180 + Math.random() * 220);
}
schedule(false);
}, first ? 900 : 3200 + Math.random() * 3600);
}
crt.addEventListener('pointerdown', function (e) {
if (e.target.closest('button, a')) return;
const now = performance.now();
if (now - S.lastTap < 220) return;
S.lastTap = now;
const r = crt.getBoundingClientRect();
strike(e.clientX - r.left, e.clientY - r.top);
});
addEventListener('resize', function () { if (visible()) resize(); });
document.addEventListener('visibilitychange', function () { if (!document.hidden) start(); });
window.__coverBolt = { strike: function (x, y) { strike(x, y); }, count: function () { return S.count; }, busy: function () { return S.raf != null; } };
resize();
schedule(true);
})();
(function stageParticles(){
const stage = document.getElementById('stage');
const center = stage && stage.querySelector('.stage-center');
const concepts = document.getElementById('concepts');
if (!stage || !center || !concepts) return;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MAX = 64000;
let N = REDUCED ? 8000 : (innerWidth <= 1000 ? 20000 : 58000);
const cv = document.createElement('canvas');
cv.className = 'stage-pfx';
cv.setAttribute('aria-hidden', 'true');
const grid = stage.querySelector('.stage-grid');
stage.insertBefore(cv, grid ? grid.nextSibling : stage.firstChild);
stage.classList.add('pfx');
const hint = document.createElement('div');
hint.className = 'stage-pfx-hint';
stage.appendChild(hint);
let gl = null;
try { gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: true }); } catch (_) {}
const c2 = gl ? null : cv.getContext('2d');
if (!gl) N = Math.min(N, 5000);
const F = n => new Float32Array(n);
const FG = 33, FGS = (FG - 1) / 600, FL = F(FG * FG * 2);
let flowT = -9, flowOn = false;
function buildFlow(t) {
if (t - flowT < 1 / 40) return;
flowT = t;
for (let j = 0; j < FG; j++) {
const y = j / (FG - 1) * 600;
for (let i = 0; i < FG; i++) {
const x = i / (FG - 1) * 600;
let vx = 0, vy = 0, ph;
ph = 0.0052 * x + 0.0031 * y + 0.55 * t;              vx += 1.00 * 0.0031 * cos(ph); vy -= 1.00 * 0.0052 * cos(ph);
ph = -0.0034 * x + 0.0072 * y - 0.41 * t + 2.1;       vx += 0.62 * 0.0072 * cos(ph); vy += 0.62 * 0.0034 * cos(ph);
ph = 0.0091 * x - 0.0084 * y + 0.83 * t + 4.7;        vx -= 0.35 * 0.0084 * cos(ph); vy -= 0.35 * 0.0091 * cos(ph);
const o = (j * FG + i) * 2;
FL[o] = vx * 5200; FL[o + 1] = vy * 5200;
}
}
}
function flowAt(x, y, out) {
let fx = x * FGS, fy = y * FGS;
if (fx < 0) fx = 0; else if (fx > FG - 1.001) fx = FG - 1.001;
if (fy < 0) fy = 0; else if (fy > FG - 1.001) fy = FG - 1.001;
const i0 = fx | 0, j0 = fy | 0, ux = fx - i0, uy = fy - j0;
const o00 = (j0 * FG + i0) * 2, o10 = o00 + 2, o01 = o00 + FG * 2, o11 = o01 + 2;
const w00 = (1 - ux) * (1 - uy), w10 = ux * (1 - uy), w01 = (1 - ux) * uy, w11 = ux * uy;
out[0] = FL[o00] * w00 + FL[o10] * w10 + FL[o01] * w01 + FL[o11] * w11;
out[1] = FL[o00 + 1] * w00 + FL[o10 + 1] * w10 + FL[o01 + 1] * w01 + FL[o11 + 1] * w11;
}
const flowOut = [0, 0];
const X = F(MAX), Y = F(MAX), SA = F(MAX), SB = F(MAX), SC = F(MAX), GX = F(MAX), GY = F(MAX);
const TX = F(MAX), TY = F(MAX), TS = F(MAX), TR = F(MAX), TG = F(MAX), TB = F(MAX), TA = F(MAX);
const EN = F(MAX);
const TF = F(MAX).fill(1);
const BUF = F(MAX * 7), LBUF = F(MAX * 14);
for (let i = 0; i < MAX; i++) {
SA[i] = Math.random(); SB[i] = Math.random(); SC[i] = Math.random();
const r = Math.sqrt(-2 * Math.log(Math.random() + 1e-9)), a = Math.random() * Math.PI * 2;
GX[i] = r * Math.cos(a); GY[i] = r * Math.sin(a);
X[i] = 300 + GX[i] * 160; Y[i] = 300 + GY[i] * 160;
}
const TAU = Math.PI * 2, sin = Math.sin, cos = Math.cos, sqrt = Math.sqrt, abs = Math.abs;
const hash = (i, k) => { const v = sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
function put(i, x, y, sz, r, g, b, a, tf) {
TX[i] = x; TY[i] = y; TS[i] = sz; TR[i] = r / 255; TG[i] = g / 255; TB[i] = b / 255; TA[i] = a;
if (tf !== undefined) TF[i] = tf;
}
const IQP = [
[[0.66, 0.52, 0.40], [0.34, 0.36, 0.30], [0.62, 0.58, 0.52], [0.00, 0.10, 0.22]],
[[0.48, 0.60, 0.72], [0.34, 0.30, 0.24], [0.55, 0.62, 0.68], [0.02, 0.18, 0.34]],
[[0.40, 0.56, 0.70], [0.30, 0.34, 0.30], [0.72, 0.66, 0.58], [0.10, 0.26, 0.42]]
];
const IQT = [0, 0, 0];
function iqCol(u, pal) {
const P = IQP[pal || 0], t = u < 0 ? 0 : u > 1 ? 1 : u;
for (let k = 0; k < 3; k++) {
const p = P[k];
IQT[k] = 255 * (p[0] + p[1] * cos(TAU * (p[2] * t + p[3])));
}
return IQT;
}
function put3D(i, x3, y3, z3, rx, ry, sz, r, g, b, a, tf) {
const cy = cos(ry), sy = sin(ry), cx = cos(rx), sx = sin(rx);
const x1 = x3 * cy + z3 * sy, z1 = -x3 * sy + z3 * cy;
const y2 = y3 * cx - z1 * sx, z2 = y3 * sx + z1 * cx;
const persp = 540 / Math.max(180, 540 - z2);
const dep = Math.max(0.32, Math.min(1.5, (z2 + 240) / 360));
const halo = (i % 21) === 0, mid = (i % 6) === 0;
const s2 = (halo ? 2.35 : (mid ? 1.18 : 0.60)) * sz * PSC;
const a2 = Math.min(1, (halo ? a * 0.085 : a * 0.92) * dep);
put(i, 300 + x1 * persp, 300 + y2 * persp, s2 * persp, r, g, b, a2, tf);
}
const S = { t: 0, px: null, py: null, near: 0, obs: 0, look: 0, lobe: 268, bolt: null, branch: null, boltK: -1, sceneT: 0 };
function jag(x1, y1, x2, y2, amp, depth) {
let pts = [[x1, y1], [x2, y2]];
for (let d = 0; d < depth; d++) {
const out = [];
for (let i = 0; i < pts.length - 1; i++) {
const a = pts[i], b = pts[i + 1];
const nx = -(b[1] - a[1]), ny = b[0] - a[0], L = Math.hypot(nx, ny) || 1;
const off = (amp / (d + 1)) * (Math.random() - 0.5) * 2;
out.push(a, [(a[0] + b[0]) / 2 + nx / L * off, (a[1] + b[1]) / 2 + ny / L * off]);
}
out.push(pts[pts.length - 1]);
pts = out;
}
return pts;
}
function along(pts, f) {
const k = f * (pts.length - 1), j = Math.min(pts.length - 2, Math.floor(k)), u = k - j;
return [pts[j][0] + (pts[j + 1][0] - pts[j][0]) * u, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * u];
}
function nearness(r) {
if (S.px == null) return 0;
const d = Math.hypot(S.px - 300, S.py - 300);
return d < r ? 1 : 0;
}
const SCN = {
storm: { follow: 0.3, repel: true, hint: '负电荷层与正电荷层不断积累，然后一次放电。移动鼠标可以拨开粒子。', trail: 0.5, f(t) {
const cyc = 2.6, k = Math.floor(t / cyc), ph = t - k * cyc;
const strike = ph < 0.16 ? Math.pow(1 - ph / 0.16, 2) : 0;
const rx = 0.16 + sin(t * 0.5) * 0.04, ry = t * 0.14;
for (let i = 0; i < N; i++) {
const a = SA[i], b = SB[i], c = SC[i], role = i % 20;
if (role < 12) {
const lay = b * b, R = (30 + (1 - lay) * 118) * (0.86 + c * 0.22);
const ang = a * TAU + t * (0.4 + lay * 0.9);
const x3 = cos(ang) * R, z3 = sin(ang) * R;
const y3 = -196 + lay * 132 - sin(ang * 3 + t) * 9;
put3D(i, x3, y3, z3, rx, ry, 1.00 + c * 1.30,
96 + strike * 150, 148 + c * 46 + strike * 95, 226 + strike * 26,
0.17 + lay * 0.26 + strike * 0.46, 0.55);
} else if (role < 17) {
const br = role - 12, u = b;
const jitter = sin(u * 26 + k * 4.1 + br * 2.3) * (10 + u * 26) + cos(u * 51 + k) * 5;
const fork = br === 0 ? 0 : (br % 2 ? 1 : -1) * Math.max(0, u - 0.3) * (95 + br * 22);
const alive = strike > 0.02 ? 0.70 + strike * 1.1 : 0.20 + 0.10 * sin(t * 7 + i);
put3D(i, jitter + fork + (c - 0.5) * 4, -86 + u * 232, sin(u * 12 + k) * 18 + (a - 0.5) * 6,
rx, ry, br === 0 ? 1.5 : 0.95,
226 + strike * 29, 240 + strike * 15, 255,
alive * (br === 0 ? 1.25 : 0.80), 0.06);
} else {
const wave = (t * 0.55) % 1, R = (18 + wave * 150) * (0.94 + b * 0.12), ang = a * TAU - t * 0.3;
put3D(i, cos(ang) * R, 148 + (c - 0.5) * 3, sin(ang) * R,
rx, ry, 0.8 + (1 - wave) * 1.2,
150 + strike * 90, 212 + strike * 38, 255,
(1 - wave) * (0.34 + strike * 0.52), 0.18);
}
}
} },
ball: { follow: 0.16, repel: true, hint: '高温发光的核心、旋转的外壳、不断甩出的火花。移动鼠标可以拨开粒子。', trail: 0.52, f(t, dt) {
const breathe = 1 + sin(t * 1.7) * 0.028;
const rx = 0.30 + sin(t * 0.42) * 0.30, ry = t * 0.26;
const HB = window.__conceptHands;
const rb = HB && HB.bridge > 0.06 && HB.bp;
const RB_N = 7 * 256;
let bx = 0, by = 0, bvx = 0, bvy = 0, bL = 1, bS = 0, bnx = 0, bny = 0, bux = 0, buy = 0;
if (rb) {
bx = HB.bp.x1; by = HB.bp.y1; bvx = HB.bp.x2 - bx; bvy = HB.bp.y2 - by;
bL = sqrt(bvx * bvx + bvy * bvy) || 1;
bux = bvx / bL; buy = bvy / bL; bnx = -buy; bny = bux;
bS = Math.min(1, (HB.bridge - 0.05) / 0.6);
}
for (let i = 0; i < N; i++) {
if (rb && i < RB_N) {
const band = (i / 256) | 0, u = (i % 256) / 256;
const bell = sin(u * Math.PI), ph = u * 5.6 + t * (1.2 + band * 0.15) + band * TAU / 7;
const rr = (15 + 18 * bell) * (0.75 + 0.45 * bS);
const cxu = bx + bvx * u, cyu = by + bvy * u, dep = sin(ph) * rr * 0.55, face = abs(cos(ph));
put(i, cxu + bnx * cos(ph) * rr + bux * dep, cyu + bny * cos(ph) * rr + buy * dep,
1.0 + face * 1.8, 185 + face * 55, 228 + face * 25, 255,
(0.20 + face * 0.72) * bell * bS, 0.10);
continue;
}
const a = SA[i], b = SB[i], c = SC[i], role = i % 30;
if (role < 8) {
const r = (15 + 38 * Math.pow(b, 0.6)) * breathe;
const th = a * TAU + t * (1.8 / (0.35 + b)), ph2 = Math.acos(2 * c - 1), hot = 1 - b;
put3D(i, r * sin(ph2) * cos(th), r * cos(ph2), r * sin(ph2) * sin(th), rx, ry,
0.72 + hot * 1.1, 255, 214 - hot * 30, 168 + hot * 66, 0.13 + hot * 0.26, 0.04);
} else if (role < 20) {
const sid = i & 63;
const sA = (sid * 0.6180339887) % 1;
const sB = ((sid * 0.3819660113) + (i % 7) * 0.1428) % 1;
const pr = (b + t * (0.24 + (sid % 5) * 0.035)) % 1;
const fade = sin(pr * Math.PI);
const R = (62 + 52 * sin(pr * Math.PI * 1.3 + sA * TAU)) * breathe;
const th = sA * TAU + pr * 2.7 + sin(t * 0.8 + sB * TAU) * 0.5 + (c - 0.5) * 0.06;
const ph2 = Math.acos(2 * sB - 1) + cos(pr * 4.2 + t * 0.65 + sA * TAU) * 0.40;
const warm = Math.max(0, 1 - pr * 1.25);
const QC = [110 + 145 * pr, 225 - 75 * pr, 255 - 45 * pr];
put3D(i, R * sin(ph2) * cos(th), R * cos(ph2), R * sin(ph2) * sin(th), rx, ry,
0.8 + fade * 1.1, QC[0], QC[1], QC[2],
fade * (0.16 + 0.26 * (1 - c * 0.5)), 0.85);
} else if (role < 26) {
const k3 = (role - 20) % 3;
const R = [120, 166, 210][k3] * breathe + (b - 0.5) * 4;
const tilt = [0.48, 1.12, 1.68][k3], spd = [0.62, -0.44, 0.30][k3];
const th = a * TAU + t * spd;
const head = Math.pow(0.5 + 0.5 * sin(th * 2 - t * 2.1 + k3), 2);
const RC3 = [[122, 228, 255], [172, 146, 255], [255, 138, 200]][k3];
put3D(i, cos(th) * R, sin(th) * R * sin(tilt), sin(th) * R * cos(tilt), rx, ry,
0.78 + head * 1.1, RC3[0] + head * 34, RC3[1] + head * 26, RC3[2] + head * 22, 0.14 + head * 0.36, 0.02);
} else if ((i & 1) === 0) {
const GA = 2.399963229728653;
const u2 = (i * 0.6180339887) % 1;
const th2 = i * GA + t * 0.14;
const ph2 = Math.acos(2 * u2 - 1);
const R2 = (101 + 8 * sin(t * 0.9 + u2 * 12.566)) * breathe;
const cx2 = sin(ph2) * cos(th2), sz2 = sin(ph2) * sin(th2), cy2 = cos(ph2);
const graze = 1 - Math.min(1, Math.abs(sz2));      /* 1 = 轮廓，0 = 正对视线的圆心 */
const heat = Math.max(0, 1 - Math.hypot(cx2, cy2) * 1.2);
put3D(i, R2 * cx2, R2 * cy2, R2 * sz2, rx, ry,
0.58 + graze * 1.25,
148 + graze * 96 + heat * 70,
216 + graze * 34 - heat * 46,
255 - graze * 34 + heat * 6,
(0.045 + graze * 0.30) * (1 + heat * 0.55), 0.10);
} else {
const cth = a * TAU + t * (0.22 + (i % 5) * 0.05) + sin(t * 0.6 + c * 6.28) * 0.18;
const cph = Math.acos(2 * c - 1) + cos(t * 0.5 + a * TAU) * 0.20;
const cd = (118 + 92 * Math.pow(b, 0.7) + 12 * sin(t * 1.1 + a * 9)) * breathe;
const glow = 0.5 + 0.5 * sin(t * 1.3 + b * 10 + c * 6);
put3D(i, cd * sin(cph) * cos(cth), cd * cos(cph), cd * sin(cph) * sin(cth), rx, ry,
0.44 + glow * 0.54, 255, 166 + glow * 46, 208 + glow * 34, (0.032 + glow * 0.088) * (1 - b * 0.42), 0.55);
}
}
} },
macro: { follow: 0.20, repel: true, hint: '电场把空气一段一段击穿：先导每落一步，才探得下一步。', trail: 0.44, f(t) {
const rx = 0.10, ry = sin(t * 0.20) * 0.10;
const cyc = 4.6, ph = (t % cyc) / cyc;
const front = ph < 0.55 ? ph / 0.55 : 1;          /* 一次周期里向下推进到底 */
for (let i = 0; i < N; i++) {
const a = SA[i], b = SB[i], c = SC[i], role = i % 16;
const u = b;
if (role < 10) {
const stepI = Math.floor(u * 11);
const jag = sin(stepI * 3.7 + 1.3) * 30 + cos(stepI * 1.9) * 9;
const jog = u * 11 - stepI;
const x3 = jag + sin(jog * 3.1 + stepI) * 5 + (a - 0.5) * 6;
const z3 = cos(stepI * 2.3) * 22 + (c - 0.5) * 8;
const y3 = -168 + u * 320;
const live = u <= front ? 1 : 0.22;           /* 还没探到的地方也留一条暗通道 */
const tip = u <= front && u > front - 0.03 ? 1 : 0;
put3D(i, x3, y3, z3, rx, ry, 1.10 + tip * 1.5,
148 + live * 72 + tip * 35, 216 + live * 30, 255,
(0.22 + tip * 0.80) * live + 0.06, 0.05);
} else {
const stepI = Math.floor(u * 11);
const R = 16 + c * 26, ang = a * TAU + t * 0.5;
const base = sin(stepI * 3.7 + 1.3) * 30;
put3D(i, base + cos(ang) * R, -168 + u * 320 + sin(ang * 2) * R * 0.4,
cos(stepI * 2.3) * 22 + sin(ang) * R, rx, ry, 0.7,
120, 180, 255, (u <= front ? 0.13 : 0.04) * (1 - c * 0.5), 0.40);
}
}
} },
stroke: { follow: 0.18, repel: true, hint: '先导接通地面的那一瞬，电荷沿通道猛回流，通道被烧到上万度。', trail: 0.50, f(t) {
const rx = 0.10, ry = sin(t * 0.22) * 0.14;
const cyc = 2.4, ph = (t % cyc) / cyc;
const burn = Math.exp(-ph * 7);                   /* 放电那一帧最亮，随后迅速退烧 */
const wave = Math.min(1, ph * 1.6);
for (let i = 0; i < N; i++) {
const a = SA[i], b = SB[i], c = SC[i], role = i % 18;
if (role < 9) {
const u = b;
const x3 = sin(u * 15 + t * 3) * 4 + (a - 0.5) * 7;
const z3 = cos(u * 12 - t * 2) * 5 + (c - 0.5) * 7;
const head = 0.35 + 0.65 * u;
put3D(i, x3, 150 - u * 318, z3, rx, ry, 0.85 + burn * 1.5 * head,
255, 236 + burn * 19, 214 + burn * 41, (0.12 + burn * 0.80) * head, 0.03);
} else if (role < 14) {
const u = (b + (i % 3) * 0.11) % 1, side = (i & 1) ? 1 : -1;
const reach = Math.max(0, u - 0.25) * 120 * side;
put3D(i, reach + (a - 0.5) * 10, 150 - u * 300, (c - 0.5) * 40, rx, ry, 0.7,
220, 226, 255, burn * 0.28 * (1 - u * 0.6), 0.10);
} else {
const R = 24 + wave * 190, ang = a * TAU, fin = Math.min(1, ph * 8);
put3D(i, cos(ang) * R, 148 + (c - 0.5) * 4, sin(ang) * R, rx, ry,
0.75 + (1 - wave) * 1.3, 176, 222, 255, (1 - wave) * 0.40 * fin, 0.25);
}
}
} },
bubble: { follow: 0.16, repel: true, hint: '雷击土壤蒸出的硅，冷凝成一粒粒纳米球，在空气里慢慢氧化发光。', trail: 0.28, f(t) {
const rx = 0.30, ry = t * 0.10;
const GRAINS = 46;
for (let i = 0; i < N; i++) {
const a = SA[i], b = SB[i], c = SC[i];
const g = i % GRAINS;
const ga = g * 0.6180339887 * TAU, gr = 40 + (g % 7) * 22;
const orbit = t * (0.10 + (g % 5) * 0.03);
const cx3 = cos(ga + orbit) * gr + sin(t * 0.5 + g) * 8;
const cy3 = sin(ga * 1.3 + orbit * 0.8) * gr * 0.70;
const cz3 = sin(ga + orbit) * gr;
const th = a * TAU, ph2 = Math.acos(2 * c - 1), rr = (5.5 + 3.0) * Math.pow(b, 0.34);
const rim = 0.40 + 0.60 * abs(sin(th * 2 + t));   /* 表面氧化层的亮度 */
put3D(i, cx3 + rr * sin(ph2) * cos(th), cy3 + rr * cos(ph2), cz3 + rr * sin(ph2) * sin(th),
rx, ry, 0.70 + rim * 0.80,
196 + rim * 40, 214 + rim * 22, 246 - rim * 30, 0.20 + rim * 0.44, 0.25);
}
} },
quantum: { follow: 0.16, repel: false, hint: '一段电磁能量被自身的非线性困住：不吃掉它，它就散不掉。', trail: 0.42, f(t) {
const rx = 0.62 + sin(t * 0.20) * 0.08, ry = t * 0.26;
const R0 = 92 + sin(t * 0.9) * 5;
for (let i = 0; i < N; i++) {
const a = SA[i], b = SB[i], c = SC[i];
const th = a * TAU + t * 0.55;          /* 大环绕行 */
const ph = c * TAU;                     /* 小环截面 → 环面 */
const Rm = 38 + 8 * sin(t * 1.1 + th * 0.5);
const mode = 6 + (i % 3);               /* 固定的模数：稳定的驻波包 */
const ripple = 0.5 + 0.5 * cos(mode * th + t * 2.4);
const knot = Math.pow(ripple, 3);
const R = R0 + Rm * cos(ph);
put3D(i, cos(th) * R, Rm * sin(ph) + (b - 0.5) * 6,
sin(th) * R, rx, ry, 0.62 + knot * 1.5,
120 + knot * 105, 206 + knot * 34, 255, 0.10 + knot * 0.42, 0.10);
}
} },
transition: { follow: 0.18, repel: true, hint: '电子被剥掉之后，气体变成导电的第四态，会自己拉出一条条电流丝。', trail: 0.46, f(t) {
const rx = 0.36, ry = t * 0.16;
for (let i = 0; i < N; i++) {
const a = SA[i], b = SB[i], c = SC[i], role = i % 22;
if (role < 14) {
const lane = i % 18, seed = lane * 2.3999632;
const u = b;
const arc = sin(u * 7 + seed + t * 0.9) * 70 * (0.4 + (lane % 3) * 0.3);
const flick = 0.35 + 0.65 * Math.pow(0.5 + 0.5 * sin(t * 5 + lane), 6);
put3D(i, sin(seed) * 150 + arc + (a - 0.5) * 12,
-140 + u * 280 + cos(u * 5 + seed) * 30,
cos(seed) * 150 + sin(u * 6 + seed * 2) * 60,
rx, ry, 0.70 + flick * 1.1,
140 + flick * 90, 200 + flick * 50, 255, 0.08 + flick * 0.34, 0.20);
} else {
const sp = sin(t * 3 + i) * 0.5 + 0.5;
put3D(i, (a - 0.5) * 380, (b - 0.5) * 300, (c - 0.5) * 320, rx, ry,
0.40 + sp * 0.5, 232, 244, 255, 0.10 + sp * 0.22, 0.60);
}
}
} },
fusion: { follow: 0.16, repel: true, hint: '同样大小的体积里能塞进多少焦耳：争议就卡在这个数字上。', trail: 0.44, f(t) {
const rx = 0.40 + sin(t * 0.20) * 0.05, ry = t * 0.12;
const SHELLS = [46, 82, 120, 162];
for (let i = 0; i < N; i++) {
const a = SA[i], b = SB[i], c = SC[i], role = i % 10;
const th = a * TAU + t * 0.30, ph2 = Math.acos(2 * c - 1);
if (role < 6) {
const r = 16 + 170 * Math.pow(b, 1.8);
const heat = Math.max(0, 1 - r / 190);
put3D(i, r * sin(ph2) * cos(th), r * cos(ph2) * 0.92, r * sin(ph2) * sin(th),
rx, ry, 0.70 + heat * 1.5,
232 + heat * 23, 176 + heat * 66, 108 + heat * 118, 0.09 + heat * 0.46, 0.15);
} else {
const k = role - 6, r = SHELLS[k] + (b - 0.5) * 2;
const br = 0.5 + 0.5 * cos(r * 0.05 - t * 1.6);
put3D(i, r * sin(ph2) * cos(th), r * cos(ph2) * 0.92, r * sin(ph2) * sin(th),
rx, ry, 0.62, 150 + br * 70, 216 + br * 20, 255, 0.08 + br * 0.24, 0.0);
}
}
} },
nucleus: { follow: 0.14, repel: true, hint: '能量不能连续变，只能一格一格地跳：能级之间是空的。', trail: 0.34, f(t) {
const rx = 0.22 + sin(t * 0.20) * 0.06, ry = t * 0.16;
const LV = [40, 70, 104, 142, 184];
const hop = (t * 0.55) % 1;                       /* 一次跃迁的周期 */
for (let i = 0; i < N; i++) {
const a = SA[i], b = SB[i], c = SC[i], lv = i % 5;
const th = a * TAU + t * (0.90 - lv * 0.12);
const ph2 = Math.acos(2 * c - 1);
const r = LV[lv] + (b - 0.5) * 2.4;             /* 壳极薄：能级必须是锐的 */
const QC = [[142, 226, 255], [126, 208, 255], [148, 186, 255], [176, 168, 255], [212, 158, 246]][lv];
put3D(i, r * sin(ph2) * cos(th), r * cos(ph2) * 0.90, r * sin(ph2) * sin(th),
rx, ry, 0.90 + (4 - lv) * 0.07, QC[0], QC[1], QC[2], 0.22 + (4 - lv) * 0.06, 0.0);
}
if (hop < 0.5) {
const u = hop / 0.5;
for (let k = 0, i = N - 1; k < 220 && i >= 0; k++, i--) {
const ang = SA[i] * TAU, r = LV[1] + (LV[3] - LV[1]) * u;
put3D(i, cos(ang) * r, sin(ang) * r * 0.90, 0, 0.22, 0,
1.5, 255, 236, 208, 0.5 * sin(u * Math.PI), 0.05);
}
}
} },
observer: { follow: 0.12, repel: false, hint: '三个态同时存在，彼此干涉：这是「真的同时」，不是「我们还不知道」。', trail: 0.36, f(t) {
const rx = 0.44, ry = sin(t * 0.18) * 0.16;
const CEN = [[-62, 18, 0], [58, -12, 26], [4, 54, -30]];
for (let i = 0; i < N; i++) {
const a = SA[i], b = SB[i], c = SC[i], w = i % 3;
const cen = CEN[w];
const th = a * TAU, ph2 = Math.acos(2 * c - 1);
const g = Math.pow(b, 0.5);
const rr = 62 * g * (0.70 + 0.50 * sin(t * 0.6 + w * 2));
const x3 = cen[0] + rr * sin(ph2) * cos(th);
const y3 = cen[1] + rr * cos(ph2);
const z3 = cen[2] + rr * sin(ph2) * sin(th);
const fr = 0.5 + 0.5 * cos((x3 * 0.09 + y3 * 0.07) * 4.4 + t * 0.8);
const QC = [[132, 224, 255], [186, 162, 255], [255, 196, 170]][w];
put3D(i, x3, y3, z3, rx, ry, 0.80 + fr * 1.15,
QC[0], QC[1], QC[2], (0.16 + fr * 0.55) * (0.35 + g * 0.65), 0.20);
}
} },
rose: { follow: 0.12, repel: false, hint: '波铺满空间；目光落下去的那一点，它才变成「一个样子」。', trail: 0.40, f(t) {
const has = S.px != null;
const gx = has ? S.px - 300 : 0, gy = has ? S.py - 300 : 0;
const obs = has ? nearness(200) : 0;
const rx = 0.50 + sin(t * 0.22) * 0.06, ry = t * 0.20;
for (let i = 0; i < N; i++) {
const a = SA[i], b = SB[i], c = SC[i];
const th = a * TAU, ph2 = Math.acos(2 * c - 1);
const r = 44 + 150 * Math.pow(b, 0.60);
const wob = sin(t * 1.8 + b * 12 + a * 6) * 14;
let x0 = r * sin(ph2) * cos(th) + wob * cos(th);
let y0 = r * cos(ph2) * 0.90;
let z0 = r * sin(ph2) * sin(th) + wob * sin(th);
const d = obs ? Math.hypot(x0 - gx, y0 - gy) : 1e6;
const k = d < 90 ? Math.pow(1 - d / 90, 1.7) * 0.92 : 0;
const x = x0 + (gx - x0) * k;
const y = y0 + (gy - y0) * k;
const z = z0 * (1 - k * 0.88);
const hot = Math.max(0, k * 1.15 - (1 - b) * 0.18);
put3D(i, x, y, z, rx, ry,
1.05 + hot * 1.6 - k * 0.14,
150 + hot * 105, 214 + hot * 30, 255 - hot * 40,
0.30 + hot * 0.60, 0.12);
}
} },
};
const TURB = { storm: 0.42, macro: 0.30, stroke: 0.55, ball: 0.45, bubble: 0.22, quantum: 0.20, transition: 0.50, fusion: 0.26, nucleus: 0.14, observer: 0.18, rose: 0.12 };
Object.keys(TURB).forEach(k => { if (SCN[k]) SCN[k].turb = TURB[k]; });
let cur = 'ball';
function setScene(k) {
if (!SCN[k]) k = 'ball';
if (k === cur && S.sceneT) return;
cur = k; S.sceneT = S.t; S.obs = 0; S.look = 0; S.boltK = -1;
hint.textContent = SCN[k].hint;
kick();
}
let prog = null, vbo = null, lvbo = null, loc = {};
if (gl) {
const vs = 'attribute vec2 aP;attribute float aS;attribute vec4 aC;uniform vec2 uR;uniform float uH;varying vec4 vC;' +
'vec3 hue(vec3 c,float a){const vec3 k=vec3(0.57735);float ca=cos(a);return c*ca+cross(k,c)*sin(a)+k*dot(k,c)*(1.0-ca);}' +
'void main(){vec2 p=aP/uR*2.0-1.0;gl_Position=vec4(p.x,-p.y,0.0,1.0);gl_PointSize=aS;vC=vec4(clamp(hue(aC.rgb,uH),0.0,1.0),aC.a);}';
const fs = 'precision mediump float;varying vec4 vC;uniform float uG;' +
'void main(){vec2 q=gl_PointCoord-0.5;float d=length(q)*2.0;if(d>1.0)discard;' +
'float a=smoothstep(1.0,0.92,d)*(1.0+0.25*uG)*vC.a*0.34;gl_FragColor=vec4(vC.rgb*a,a);}';
const sh = (type, src) => { const o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return o; };
prog = gl.createProgram();
gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
gl.linkProgram(prog);
if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { gl = null; }
else {
gl.useProgram(prog);
vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, BUF.byteLength, gl.DYNAMIC_DRAW);
lvbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, lvbo);
gl.bufferData(gl.ARRAY_BUFFER, LBUF.byteLength, gl.DYNAMIC_DRAW);
loc = { P: gl.getAttribLocation(prog, 'aP'), S: gl.getAttribLocation(prog, 'aS'), C: gl.getAttribLocation(prog, 'aC'),
R: gl.getUniformLocation(prog, 'uR'), H: gl.getUniformLocation(prog, 'uH'), G: gl.getUniformLocation(prog, 'uG') };
gl.enableVertexAttribArray(loc.P); gl.vertexAttribPointer(loc.P, 2, gl.FLOAT, false, 28, 0);
gl.enableVertexAttribArray(loc.S); gl.vertexAttribPointer(loc.S, 1, gl.FLOAT, false, 28, 8);
gl.enableVertexAttribArray(loc.C); gl.vertexAttribPointer(loc.C, 4, gl.FLOAT, false, 28, 12);
gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
}
}
let qProg = null, tProg = null, bProg = null, quadBuf = null, fb = null, fbTex = null, fbW = 0, fbH = 0, fbQ = null, fbQTex = null;
if (gl) {
const qvs = 'attribute vec2 aQ;varying vec2 vUv;void main(){vUv=aQ*0.5+0.5;gl_Position=vec4(aQ,0.0,1.0);}';
const mkProg = fs => {
const p = gl.createProgram();
const sh = (type, src) => { const o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return o; };
gl.attachShader(p, sh(gl.VERTEX_SHADER, qvs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
gl.bindAttribLocation(p, 0, 'aQ');
gl.linkProgram(p);
return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
};
qProg = mkProg('precision mediump float;void main(){gl_FragColor=vec4(0.0);}');
tProg = mkProg('precision mediump float;varying vec2 vUv;uniform sampler2D uT;uniform sampler2D uB;uniform float uK;uniform vec2 uPx;' +
'void main(){vec4 c=texture2D(uT,vUv);' +
'vec3 bl=texture2D(uB,vUv).rgb;bl*=bl;' +
'vec3 x=pow(min(c.rgb+bl*uK,vec3(1.0)),vec3(0.95));' +
'vec2 q=vUv-0.5;float vg=1.0-0.20*dot(q,q)*2.2;' +
'gl_FragColor=vec4(x*vg,c.a);}');
bProg = mkProg('precision mediump float;varying vec2 vUv;uniform sampler2D uT;uniform vec2 uP;' +
'void main(){vec3 s=vec3(0.0);' +
's+=texture2D(uT,vUv+vec2(-1.0,-1.0)*uP).rgb;' +
's+=texture2D(uT,vUv+vec2( 0.0,-1.0)*uP).rgb*2.0;' +
's+=texture2D(uT,vUv+vec2( 1.0,-1.0)*uP).rgb;' +
's+=texture2D(uT,vUv+vec2(-1.0, 0.0)*uP).rgb*2.0;' +
's+=texture2D(uT,vUv).rgb*4.0;' +
's+=texture2D(uT,vUv+vec2( 1.0, 0.0)*uP).rgb*2.0;' +
's+=texture2D(uT,vUv+vec2(-1.0, 1.0)*uP).rgb;' +
's+=texture2D(uT,vUv+vec2( 0.0, 1.0)*uP).rgb*2.0;' +
's+=texture2D(uT,vUv+vec2( 1.0, 1.0)*uP).rgb;' +
'gl_FragColor=vec4(s/16.0,1.0);}');
if (qProg && tProg && bProg) {
quadBuf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
} else { qProg = tProg = bProg = null; }
}
function ensureFbo() {
if (!gl || !qProg) return false;
if (fb && fbW === W && fbH === H) return true;
if (!fb) { fb = gl.createFramebuffer(); fbTex = gl.createTexture(); }
const qw = Math.max(1, W >> 2), qh = Math.max(1, H >> 2);
if (!fbQ) { fbQ = gl.createFramebuffer(); fbQTex = gl.createTexture(); }
gl.bindTexture(gl.TEXTURE_2D, fbQTex);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, qw, qh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.bindFramebuffer(gl.FRAMEBUFFER, fbQ);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbQTex, 0);
const okQ = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
gl.bindFramebuffer(gl.FRAMEBUFFER, null);
if (!okQ) { fbQ = null; fbQTex = null; }
gl.bindTexture(gl.TEXTURE_2D, fbTex);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbTex, 0);
const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
gl.bindFramebuffer(gl.FRAMEBUFFER, null);
fbW = W; fbH = H;
if (!ok) { fb = null; fbTex = null; qProg = tProg = null; }
return ok;
}
let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, u = 1, lastHx = 0, lastHy = 0, lastHsc = 1, PSC = 1;
function layout() {
const r = stage.getBoundingClientRect();
dpr = Math.min(2.5, Math.max(1.5, devicePixelRatio || 1));
const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
if (w !== W || h !== H) { W = w; H = h; cv.width = w; cv.height = h; if (gl) gl.viewport(0, 0, w, h); }
const c = center.getBoundingClientRect();
const z = typeof zScale === 'number' ? zScale : 1;
cx = (c.left - r.left + c.width / 2) * dpr; cy = (c.top - r.top + c.height / 2) * dpr;
u = c.width / 600 * z * dpr;
PSC = 1.0;
}
stage.addEventListener('pointermove', e => {
const r = stage.getBoundingClientRect();
S.px = ((e.clientX - r.left) * dpr - cx) / u + 300;
S.py = ((e.clientY - r.top) * dpr - cy) / u + 300;
});
stage.addEventListener('pointerleave', () => { S.px = S.py = null; });
const CB_N = 6144;                       /* 参与变形的点数，其余粒子保持当前形态 */
const MORPH = { snap: null, t0: -9, dur: 1, mode: 'bloom' };
window.__stageMorph = function (from, to, mode) {
MORPH.mode = mode || 'bloom';
MORPH.dur = mode === 'flash' ? 0.72 : (mode === 'collapse' ? 1.15 : 1.0);
MORPH.t0 = S.t;
if (!MORPH.snap) MORPH.snap = new Float32Array(CB_N * 2);
const cnt = Math.min(CB_N, N);
for (let i = 0; i < cnt; i++) { MORPH.snap[i * 2] = BUF[i * 7]; MORPH.snap[i * 2 + 1] = BUF[i * 7 + 1]; }
S.sceneT = S.t - 0.30;
kick();
};
let raf = null, last = 0, frames = 0, ema = 16, sinceAdapt = 0;
const running = () => concepts.classList.contains('on') && !concepts.classList.contains('lab-on') && !document.hidden;
function kick() { if (raf == null && running()) { last = performance.now(); raf = requestAnimationFrame(frame); } }
function frame(now) {
raf = null;
if (!running()) { if (gl) { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); } return; }
const real = Math.min(0.1, (now - last) / 1000 || 0.016);
last = now;
const dt = Math.min(0.05, real) * (REDUCED ? 0.35 : 1);
S.t += dt * 0.62;
ema = ema * 0.94 + real * 1000 * 0.06;
if (++sinceAdapt > 150 && ema > 42 && N > 12000) { N = Math.max(12000, Math.floor(N * 0.8)); sinceAdapt = 0; }
layout();
const sc = SCN[cur];
sc.f(S.t, dt);
if (MORPH.snap) {
const u = Math.min(1, (S.t - MORPH.t0) / MORPH.dur);
if (u >= 1) { MORPH.snap = null; }
else {
const e = 1 - Math.pow(1 - u, 3);                 /* easeOutCubic */
const pinch = Math.sin(u * Math.PI);
const sx0 = MORPH.mode === 'flash' ? 1 - 0.62 * pinch : (MORPH.mode === 'collapse' ? 1 - 0.50 * pinch : 1);
const sy0 = MORPH.mode === 'flash' ? 1 : (MORPH.mode === 'collapse' ? 1 - 0.50 * pinch : 1 + 0.16 * pinch);
const lift = Math.sin(u * Math.PI) * 0.55;          /* 过场那一下整体提亮 */
const cnt = Math.min(CB_N, N);
for (let i = 0; i < cnt; i++) {
const o = i * 7;
const sx = MORPH.snap[i * 2], sy = MORPH.snap[i * 2 + 1];
BUF[o] = (sx + (BUF[o] - sx) * e) * sx0;
BUF[o + 1] = (sy + (BUF[o + 1] - sy) * e) * sy0;
BUF[o + 6] = Math.min(1, BUF[o + 6] * (1 + lift));
}
}
}
const turb = REDUCED ? 0 : (sc.turb || 0);
if (turb > 0) buildFlow(S.t);
let fwx = 0, fwy = 0;
if (cur === 'ball' && !REDUCED && turb > 0) {
flowAt(300, 300, flowOut);
fwx = flowOut[0] * 0.0008; fwy = flowOut[1] * 0.0008;
}
const enDec = Math.exp(-4.5 * dt);
const trailK = REDUCED ? 0 : (sc.trail != null ? sc.trail : 0.34);
const mt = Math.min(1, (S.t - S.sceneT) / 1.1);
const fol = mt < 1 ? 0.035 + 0.12 * mt : sc.follow;
const T = window.TUNE || { bright: 100, size: 100, glow: 50, hue: 0 };
const sizeK = 1.05 * dpr * (T.size / 100) * Math.max(0.7, Math.min(1.6, u / dpr)) * (1 + T.glow / 100 * 0.6);
const brDim = (window.__conceptHands && window.__conceptHands.bridge > 0.05) ? 1 - 0.42 * Math.min(1, window.__conceptHands.bridge) : 1;
const alphaK = (T.bright / 100) * Math.min(1.6, sqrt(MAX / N)) * 0.9 * (trailK > 0.3 ? 0.78 : 1) * brDim;
const rep = sc.repel && S.px != null, rr = 70;
if (window.__handsTick) window.__handsTick(real);
const HD = window.__conceptHands;
const hAct = !!(HD && HD.active);
const hpin = hAct ? HD.pinch : 0, hbur = hAct ? HD.burst : 0;
const hfist = hAct ? HD.fist || 0 : 0, hsw = hAct ? HD.swirl || 0 : 0;
const hdep = hAct ? HD.depth || 0 : 0, hbr = hAct ? HD.bridge || 0 : 0;
const hPush = hbur * hbur * 7;
const hgath = hpin * 2.6 + hfist * 6;
const hswA = hsw * 0.085, hswC = hAct ? Math.cos(hswA) : 1, hswS = hAct ? Math.sin(hswA) : 0;
const dSc = (1 - hdep * 0.28) * (window.__obsZoom || 1);
const aSc = 1 - Math.max(0, hdep) * 0.55 - Math.min(0, hdep) * 0.35;
const bOn = hAct && hbr > 0.02 && HD.bp;
const b1x = bOn ? HD.bp.x1 : 0, b1y = bOn ? HD.bp.y1 : 0;
const bvx = bOn ? HD.bp.x2 - HD.bp.x1 : 0, bvy = bOn ? HD.bp.y2 - HD.bp.y1 : 0;
const blen2 = bOn ? Math.max(1, bvx * bvx + bvy * bvy) : 1;
const bPull = bOn ? 0.14 * hbr : 0;
const hk = HD ? (u / dpr) * 0.86 : 0;
const hxA = HD ? (HD.x - 300) * hk : 0, hyA = HD ? (HD.y - 300) * hk : 0;
const limX = (W / dpr) * 0.30, limY = (H / dpr) * 0.26;
const hxPx = Math.max(-limX, Math.min(limX, hxA)), hyPx = Math.max(-limY, Math.min(limY, hyA));
if (Math.abs(hxPx - lastHx) > 0.2 || Math.abs(hyPx - lastHy) > 0.2) {
lastHx = hxPx; lastHy = hyPx;
center.style.setProperty('--hx', hxPx.toFixed(1) + 'px');
center.style.setProperty('--hy', hyPx.toFixed(1) + 'px');
}
if (Math.abs(dSc - lastHsc) > 0.004) {
lastHsc = dSc;
center.style.setProperty('--hsc', dSc.toFixed(3));
}
for (let i = 0; i < N; i++) {
let x = X[i], y = Y[i];
let en = EN[i];
if (en > 0.002) en *= enDec;
const sx = TX[i] - x, sy = TY[i] - y;
if (mt >= 1 && sx * sx + sy * sy > 14400) { x = TX[i]; y = TY[i]; }
else { x += sx * fol; y += sy * fol; }
if (rep) {
const dx = x - S.px, dy = y - S.py, d2 = dx * dx + dy * dy;
if (d2 < rr * rr && d2 > 0.01) {
const d = sqrt(d2), k = (1 - d / rr);
x += dx / d * k * k * 18; y += dy / d * k * k * 18;
if (k > en) en = k;                       /* 被手指拨到的地方亮一下 */
}
}
if (hAct) {
if (hbur > en) en = hbur;                        /* 爆散：整团亮一下 */
if (hsw * hsw > 0.01) { const sv = abs(hsw) * 0.7; if (sv > en) en = sv; }
if (hgath > 0.02) {
const bx = x - 300, by = y - 300, cd = sqrt(bx * bx + by * by) || 1;
x -= bx / cd * hgath; y -= by / cd * hgath;
}
if (hPush > 0.01) {
const bx = x - 300, by = y - 300, bd = sqrt(bx * bx + by * by) || 1;
x += bx / bd * hPush; y += by / bd * hPush;
}
if (hswS) {                                        /* 旋涡：绕中心转一小步 */
const rx = x - 300, ry = y - 300;
x = 300 + rx * hswC - ry * hswS;
y = 300 + rx * hswS + ry * hswC;
}
if (bPull) {
const px0 = x - b1x, py0 = y - b1y;
let t = (px0 * bvx + py0 * bvy) / blen2;
t = t < 0 ? 0 : t > 1 ? 1 : t;
const qx = b1x + bvx * t, qy = b1y + bvy * t;
x += (qx - x) * bPull; y += (qy - y) * bPull;
}
}
if (turb > 0) {
flowAt(x, y, flowOut);
const tk = turb * TF[i] * (0.5 + 0.9 * SC[i]) * dt;
x += flowOut[0] * tk; y += flowOut[1] * tk;
}
if (fwx || fwy) {
const rdx = x - 300, rdy = y - 300;
const rl = sqrt(rdx * rdx + rdy * rdy) / 240;
const kb = rl > 1 ? 1 : rl * rl;
x += fwx * kb; y += fwy * kb;
}
const pvx = X[i], pvy = Y[i];
X[i] = x; Y[i] = y;
const o = i * 7;
BUF[o] = cx + (x - 300) * u * dSc; BUF[o + 1] = cy + (y - 300) * u * dSc;
BUF[o + 2] = TS[i] * sizeK * (1 - Math.max(0, hdep) * 0.22) * (1 + hfist * 0.25) * (1 + en * 1.1);
BUF[o + 3] = TR[i] + (1 - TR[i]) * en * 0.55;
BUF[o + 4] = TG[i] + (1 - TG[i]) * en * 0.45;
BUF[o + 5] = TB[i] + (1 - TB[i]) * en * 0.30;
BUF[o + 6] = Math.max(0, Math.min(1, TA[i] * alphaK * aSc * (1 + en * 0.85)));
EN[i] = en;
const lo = i * 14, la2 = Math.min(1, BUF[o + 6] * 0.95);
const spx = BUF[o] - (cx + (pvx - 300) * u * dSc), spy = BUF[o + 1] - (cy + (pvy - 300) * u * dSc);
const rawLen = sqrt(spx * spx + spy * spy);
const okStreak = false; /* 彻底停用硬线段：不再有跨屏飞线 */
const strK = okStreak ? 3.2 : 0;
LBUF[lo] = BUF[o] - spx * strK; LBUF[lo + 1] = BUF[o + 1] - spy * strK;
LBUF[lo + 2] = 1; LBUF[lo + 3] = BUF[o + 3]; LBUF[lo + 4] = BUF[o + 4]; LBUF[lo + 5] = BUF[o + 5]; LBUF[lo + 6] = la2;
LBUF[lo + 7] = BUF[o]; LBUF[lo + 8] = BUF[o + 1];
LBUF[lo + 9] = 1; LBUF[lo + 10] = BUF[o + 3]; LBUF[lo + 11] = BUF[o + 4]; LBUF[lo + 12] = BUF[o + 5]; LBUF[lo + 13] = la2;
}
if (gl && qProg && ensureFbo()) {
gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
gl.viewport(0, 0, W, H);
gl.disable(gl.BLEND);
gl.useProgram(qProg);
gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
if (trailK > 0.01) {
gl.enable(gl.BLEND);
gl.blendFunc(gl.ZERO, gl.CONSTANT_ALPHA);
gl.blendColor(0, 0, 0, trailK);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
} else {
gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
}
gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
gl.useProgram(prog);
gl.uniform2f(loc.R, W, H);
gl.uniform1f(loc.H, (T.hue + now * 0.0022) * Math.PI / 180);
gl.uniform1f(loc.G, T.glow / 50);
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferSubData(gl.ARRAY_BUFFER, 0, BUF.subarray(0, N * 7));
gl.enableVertexAttribArray(loc.P); gl.vertexAttribPointer(loc.P, 2, gl.FLOAT, false, 28, 0);
gl.enableVertexAttribArray(loc.S); gl.vertexAttribPointer(loc.S, 1, gl.FLOAT, false, 28, 8);
gl.enableVertexAttribArray(loc.C); gl.vertexAttribPointer(loc.C, 4, gl.FLOAT, false, 28, 12);
gl.drawArrays(gl.POINTS, 0, N);
gl.bindBuffer(gl.ARRAY_BUFFER, lvbo);
gl.bufferSubData(gl.ARRAY_BUFFER, 0, LBUF.subarray(0, N * 14));
gl.enableVertexAttribArray(loc.P); gl.vertexAttribPointer(loc.P, 2, gl.FLOAT, false, 28, 0);
gl.enableVertexAttribArray(loc.S); gl.vertexAttribPointer(loc.S, 1, gl.FLOAT, false, 28, 8);
gl.enableVertexAttribArray(loc.C); gl.vertexAttribPointer(loc.C, 4, gl.FLOAT, false, 28, 12);
gl.drawArrays(gl.LINES, 0, N * 2);
if (fbQ) {
gl.bindFramebuffer(gl.FRAMEBUFFER, fbQ);
gl.viewport(0, 0, Math.max(1, W >> 2), Math.max(1, H >> 2));
gl.disable(gl.BLEND);
gl.useProgram(bProg);
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, fbTex);
gl.uniform1i(gl.getUniformLocation(bProg, 'uT'), 0);
gl.uniform2f(gl.getUniformLocation(bProg, 'uP'), 1.2 / W, 1.2 / H);
gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
gl.bindFramebuffer(gl.FRAMEBUFFER, null);
gl.viewport(0, 0, W, H);
gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(tProg);
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, fbTex);
gl.uniform1i(tProg && gl.getUniformLocation(tProg, 'uT'), 0);
if (fbQ) {
gl.activeTexture(gl.TEXTURE1);
gl.bindTexture(gl.TEXTURE_2D, fbQTex);
gl.uniform1i(gl.getUniformLocation(tProg, 'uB'), 1);
gl.activeTexture(gl.TEXTURE0);
}
gl.uniform1f(gl.getUniformLocation(tProg, 'uK'), fbQ ? 0.5 : 0.0);
gl.uniform2f(gl.getUniformLocation(tProg, 'uPx'), 1 / W, 1 / H);
gl.uniform2f(tProg && gl.getUniformLocation(tProg, 'uPx'), 1 / W, 1 / H);
gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
} else if (gl) {
gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(prog);
gl.uniform2f(loc.R, W, H);
gl.uniform1f(loc.H, (T.hue + now * 0.0022) * Math.PI / 180);
gl.uniform1f(loc.G, T.glow / 50);
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferSubData(gl.ARRAY_BUFFER, 0, BUF.subarray(0, N * 7));
gl.enableVertexAttribArray(loc.P); gl.vertexAttribPointer(loc.P, 2, gl.FLOAT, false, 28, 0);
gl.enableVertexAttribArray(loc.S); gl.vertexAttribPointer(loc.S, 1, gl.FLOAT, false, 28, 8);
gl.enableVertexAttribArray(loc.C); gl.vertexAttribPointer(loc.C, 4, gl.FLOAT, false, 28, 12);
gl.drawArrays(gl.POINTS, 0, N);
} else if (c2) {
c2.clearRect(0, 0, W, H);
c2.globalCompositeOperation = 'lighter';
for (let i = 0; i < N; i++) {
const o = i * 7, a = BUF[o + 6];
if (a < 0.02) continue;
c2.fillStyle = 'rgba(' + (BUF[o + 3] * 255 | 0) + ',' + (BUF[o + 4] * 255 | 0) + ',' + (BUF[o + 5] * 255 | 0) + ',' + a + ')';
const z = BUF[o + 2] * 0.6;
c2.fillRect(BUF[o] - z / 2, BUF[o + 1] - z / 2, z, z);
}
c2.globalCompositeOperation = 'source-over';
}
frames++;
raf = requestAnimationFrame(frame);
}
new MutationObserver(kick).observe(concepts, { attributes: true, attributeFilter: ['class'] });
document.addEventListener('visibilitychange', kick);
addEventListener('resize', kick);
window.__stageFx = {
scene: setScene,
info: () => ({ n: N, scene: cur, frames, running: raf != null, gl: !!gl, ema: Math.round(ema) }),
sample: i => {
i = i | 0;
const o = i * 7;
return { x: X[i], y: Y[i], tx: TX[i], ty: TY[i], a: TA[i], size: BUF[o + 2], alpha: BUF[o + 6],
nan: !isFinite(X[i]) || !isFinite(Y[i]) || !isFinite(BUF[o]) };
}
};
const curBtn = document.querySelector('#cgList [aria-current="true"]');
setScene(curBtn ? curBtn.dataset.node : 'ball');
})();
if (/^#\d$/.test(location.hash)) {
try { history.replaceState(null, '', '#0'); } catch (_) { location.hash = '#0'; }
}
hashBooted = true;
addEventListener('hashchange', () => { if (location.hash) readHash(); });
if (window.MissionControl) {
window.MissionControl.subscribe(function (mcCfg, changed) {
if (changed.indexOf('visualTheme') !== -1 && mcCfg.visualTheme) {
document.documentElement.setAttribute('data-mc-theme', mcCfg.visualTheme);
}
if (changed.indexOf('bloomIntensity') !== -1 && window.TUNE && typeof applyTune === 'function') {
window.TUNE.glow = Math.round(50 * (mcCfg.bloomIntensity != null ? mcCfg.bloomIntensity : 1));
applyTune();
}
});
window.MissionControl.onCommand('jumpScreen', function (args) {
if (args && typeof args.index === 'number' && typeof go === 'function') {
go(args.index);
}
});
}
(function(){
var box=document.querySelector('#cover .intro');
if(!box) return;
try{ if(sessionStorage.getItem('bl-intro-played')){ box.classList.add('intro-done'); return; } }catch(e){}
try{ sessionStorage.setItem('bl-intro-played','1'); }catch(e){}
setTimeout(function(){ box.classList.add('intro-done'); },1500);
})();
(function(){
if(matchMedia('(pointer:coarse)').matches) return;
var cover=document.getElementById('cover'); if(!cover) return;
var dot=document.createElement('i'), ring=document.createElement('i');
dot.className='cur-dot'; ring.className='cur-ring';
cover.appendChild(dot); cover.appendChild(ring);
var mx=innerWidth/2,my=innerHeight/2,dx=mx,dy=my,rx=mx,ry=my,px=mx,py=my;
addEventListener('pointermove',function(e){ mx=e.clientX; my=e.clientY; },{passive:true});
(function loop(){
dx+=(mx-dx)*.55; dy+=(my-dy)*.55;
rx+=(mx-rx)*.14; ry+=(my-ry)*.14;
var d=Math.hypot(mx-px,my-py); px=mx; py=my;
var k=1+Math.min(.5,d/240);
dot.style.transform='translate('+dx+'px,'+dy+'px)';
ring.style.transform='translate('+rx+'px,'+ry+'px) scale('+k.toFixed(3)+')';
requestAnimationFrame(loop);
})();
})();
(function(){
if(!window.__bootGateFinish) return;
function check(){
var toc=document.querySelector('#toc');
if(!toc || !toc.children.length) return setTimeout(check,200);
var v=document.querySelector('#cover .cover-vid') || document.querySelector('.cover-vid');
if(!v || v.readyState>=2 || v.error) return window.__bootGateFinish();
setTimeout(check,200);
}
check();
})();
(function observations(){
const con = document.getElementById('concepts');
if (!con || document.getElementById('obsPanel')) return;
const panel = document.createElement('aside');
panel.className = 'obs-panel';
panel.id = 'obsPanel';
panel.dataset.on = '0';
panel.hidden = true;
panel.innerHTML = '<header><b>观测记录</b><span id="obsN">0</span></header>' +
'<ol class="obs-list" id="obsList"></ol>' +
'<p class="obs-scale"><span>视场</span><b id="obsScale">1.2 m</b></p>' +
'<button class="obs-save" id="obsSave" type="button">存下这份记录</button>';
con.appendChild(panel);
const listEl = panel.querySelector('#obsList');
const nEl = panel.querySelector('#obsN');
const scEl = panel.querySelector('#obsScale');
const LOG = [];
const MAX = 30;
function render(){
nEl.textContent = String(LOG.length);
listEl.innerHTML = LOG.slice(-5).reverse()
.map(e => '<li class="k-' + e.k + '"><i>' + e.k + '</i>' + e.text + '</li>').join('');
}
function push(kind, text){
LOG.push({ k: kind, text: text, at: Date.now() });
if (LOG.length > MAX) LOG.shift();
render();
}
const STOPS = [
{ k: 0.62, t: '12 m',  d: '云底到地面的一段' },
{ k: 0.82, t: '3 m',   d: '一间屋子的宽度' },
{ k: 1.00, t: '1.2 m', d: '一张桌子的宽度' },
{ k: 1.55, t: '20 cm', d: '一个球的直径' },
{ k: 2.30, t: '4 cm',  d: '发光区域的边缘' }
];
let stop = 2, stopAt = 0;
function applyStop(){
const s2 = STOPS[stop];
window.__obsZoom = s2.k;
scEl.textContent = s2.t;
panel.dataset.zoom = String(stop);
}
applyStop();
function grab(){
const k = (typeof nodeKey === 'string' && nodes[nodeKey]) ? nodeKey : 'ball';
const slot = !combo.a ? 'a' : (!combo.b ? 'b' : (combo.a === k ? 'a' : 'b'));
combo[slot] = k;
paintCombo();
push('夹取', '「' + nodes[k].n + '」→ 对撞台 ' + (slot === 'a' ? '①' : '②'));
}
function collide(){
if (!combo.a || !combo.b) { push('提示', '对撞台还缺一个概念：先夹一个过来'); return; }
const key = [combo.a, combo.b].sort().join('|');
const p = PAIRS[key];
let line = '';
if (p) line = p[2].replace(/^【[^】]*】/, '');
else {
const rp = (REALITY.pairs || {})[key];
line = (rp && rp.gap) ? rp.gap : '两者在本记录里没有直接关系，只能靠中介概念连接。';
}
line = line.split('——')[0].split('。')[0];
if (line.length > 30) line = line.slice(0, 30) + '…';
push('对撞', nodes[combo.a].n + ' × ' + nodes[combo.b].n + '：' + line);
}
let lastPin = false, lastFist = false, lastBridge = false, lastOpen = false;
const LAYERS = [
{ name: '电场层',   hue: 30,  bright: 200, size: 40, glow: 100, fluct: 100, decay: 160,
why: '常态长曝光：看得出磁流丝的走向' },
{ name: '高速摄影层', hue: 0,   bright: 240, size: 28, glow: 60,  fluct: 80,  decay: 110,
why: '冻结瞬间：颗粒更锐、拖尾更短，看的是位置' },
{ name: '量子层',   hue: 190, bright: 170, size: 52, glow: 130, fluct: 140, decay: 210,
why: '概率云：颗粒更大、边界更糊，看的是弥散范围' }
];
let layer = 0, layerAt = 0, swHold = 0, swLatched = false;
function applyLayer(i, quiet){
layer = ((i % LAYERS.length) + LAYERS.length) % LAYERS.length;
const L = LAYERS[layer];
TUNE.hue = L.hue; TUNE.bright = L.bright; TUNE.size = L.size;
TUNE.glow = L.glow; TUNE.fluct = L.fluct; TUNE.decay = L.decay;
if (typeof applyTune === 'function') applyTune();
['pBright', 'pSize', 'pGlow', 'pHue', 'pFluct', 'pDecay'].forEach(id => {
const el = document.getElementById(id);
if (!el) return;
const v = { pBright: L.bright, pSize: L.size, pGlow: L.glow, pHue: L.hue, pFluct: L.fluct, pDecay: L.decay }[id];
if (String(el.value) !== String(v)) el.value = v;
});
if (!quiet) push('换层', L.name + '：' + L.why);
}
function tick(){
const h = window.__conceptHands;
if (!h) return;
const on = !!h.active;
panel.dataset.on = on ? '1' : '0';
panel.hidden = !on && LOG.length === 0;
if (!on) { lastPin = lastFist = lastBridge = false; return; }
const now = performance.now();
const pin = h.pinchEdge > 0.85 || !!h.pinchHold;
if (pin && !lastPin) grab();
lastPin = pin;
const openNow = (h.fingers >= 4) && !pin && !((h.fist || 0) > 0.6);
if (openNow && !lastOpen) {
const nk = (typeof nodeKey === "string" && nodes[nodeKey]) ? nodeKey : "ball";
push("观测", "「" + nodes[nk].n + "」 · " + nodes[nk].bnd + " · 视场 " + STOPS[stop].t);
}
lastOpen = openNow;
const fistNow = (h.fist || 0) > 0.6;
if (fistNow && !lastFist) {
const r = (118 * (1 - 0.94 * Math.min(1, h.fist || 0))).toFixed(0);
push('收束', '波包定域化：半径 118 → ' + r);
}
lastFist = fistNow;
const br = (h.bridge || 0) > 0.55;
if (br && !lastBridge) collide();
lastBridge = br;
const rawSw = (h.swirlRaw || 0);
if (Math.abs(rawSw) < 0.35) swLatched = false;
if (Math.abs(rawSw) > 0.72) swHold++; else swHold = 0;
if (!swLatched && swHold >= 3) {
swLatched = true;
swHold = 0;
applyLayer(layer + (rawSw > 0 ? 1 : -1));
}
const dRaw = (h.depthRaw || 0), dSm = (h.depth || 0);
const d = Math.abs(dRaw) > Math.abs(dSm) ? dRaw : dSm;
if (now > stopAt) {
if (d < -0.60 && stop < STOPS.length - 1) {
stop++; stopAt = now + 900; applyStop();
push('尺度', '靠近：视场 ' + STOPS[stop].t + '（' + STOPS[stop].d + '）');
} else if (d > 0.60 && stop > 0) {
stop--; stopAt = now + 900; applyStop();
push('尺度', '退远：视场 ' + STOPS[stop].t + '（' + STOPS[stop].d + '）');
}
}
}
setInterval(tick, 90);
function exportPNG(){
const W = 1080, H = 1440, M = 84;
const c = document.createElement('canvas');
c.width = W; c.height = H;
const g = c.getContext('2d');
const SERIF = '"Songti SC","Noto Serif SC",serif';
const MONO = 'ui-monospace,Menlo,monospace';
g.fillStyle = '#05080e'; g.fillRect(0, 0, W, H);
for (let i = 0; i < 2400; i++){
const x = Math.random() * W, y = Math.random() * H;
g.fillStyle = 'rgba(180,200,230,' + (0.012 + Math.random() * 0.02).toFixed(3) + ')';
g.fillRect(x, y, 1 + Math.random() * 2, 0.7);
}
g.strokeStyle = 'rgba(212,224,240,.18)'; g.lineWidth = 1;
g.strokeRect(M - 24, M - 24, W - (M - 24) * 2, H - (M - 24) * 2);
g.fillStyle = 'rgba(226,236,250,.92)';
g.font = '600 46px ' + SERIF;
g.fillText('观测记录', M, M + 56);
g.fillStyle = 'rgba(190,205,226,.55)';
g.font = '13px ' + MONO;
g.fillText('OBSERVATION LOG  ·  ' + LOG.length + ' 条', M, M + 88);
g.save();
g.translate(W - M - 10, H - M - 24); g.rotate(-Math.PI / 2);
g.fillStyle = 'rgba(190,205,226,.38)';
g.font = '12px ' + MONO;
g.fillText('球形发光体 · 01 概念关系', 0, 0);
g.restore();
g.fillStyle = 'rgba(255,255,255,.12)';
g.fillRect(M, M + 116, W - M * 2, 1);
const maxW = W - M * 2 - 64;
let y = M + 158;
const rows = LOG.slice(-12);
if (!rows.length){
g.fillStyle = 'rgba(200,214,234,.5)';
g.font = '300 20px ' + SERIF;
g.fillText('还没有记录 —— 打开手势，张开手掌看它一眼。', M, y);
}
for (const e of rows){
g.fillStyle = 'rgba(255,206,140,.92)';
g.font = '14px ' + MONO;
g.fillText(e.k, M, y);
g.fillStyle = 'rgba(226,236,250,.88)';
g.font = '300 21px ' + SERIF;
let rest = e.text, row = 0;
while (rest.length && row < 3){
let cut = rest.length, acc = '';
for (let i = 0; i < rest.length; i++){
acc += rest[i];
if (g.measureText(acc).width > maxW){ cut = i; break; }
}
if (cut <= 0) cut = rest.length;
g.fillText(rest.slice(0, cut), M + 64, y + row * 30);
rest = rest.slice(cut); row++;
}
y += Math.max(1, row) * 30 + 22;
if (y > H - 200) break;
}
const L = LAYERS[layer];
const orbX = W * 0.70, orbY = H * 0.70, orbR = 168;
for (let ring = 0; ring < 3; ring++){
g.strokeStyle = 'rgba(120,190,255,' + (0.10 - ring * 0.026).toFixed(3) + ')';
g.lineWidth = 1;
g.beginPath();
g.ellipse(orbX, orbY, orbR - ring * 34, (orbR - ring * 34) * 0.94, 0, 0, Math.PI * 2);
g.stroke();
}
for (let i = 0; i < 220; i++){
const a = Math.random() * Math.PI * 2, r = Math.pow(Math.random(), 0.6) * orbR;
g.fillStyle = 'rgba(190,225,255,' + (0.06 + Math.random() * 0.16).toFixed(3) + ')';
g.fillRect(orbX + Math.cos(a) * r, orbY + Math.sin(a) * r * 0.94, 1.4, 1.4);
}
const NOTE = '你翻到的每一层，都是同一颗球的另一种解释。';
if (NOTE){
g.fillStyle = 'rgba(255,255,255,.10)';
g.fillRect(M, y + 6, 120, 1);
g.fillStyle = 'rgba(200,214,234,.62)';
g.font = '300 19px ' + SERIF;
let rest2 = NOTE, row2 = 0, maxW2 = W * 0.46;
while (rest2.length && row2 < 4){
let cut2 = rest2.length, acc2 = '';
for (let i = 0; i < rest2.length; i++){
acc2 += rest2[i];
if (g.measureText(acc2).width > maxW2){ cut2 = i; break; }
}
if (cut2 <= 0) cut2 = rest2.length;
g.fillText(rest2.slice(0, cut2), M, y + 44 + row2 * 26);
rest2 = rest2.slice(cut2); row2++;
}
}
const d = new Date();
const ds = d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0');
g.fillStyle = 'rgba(255,255,255,.12)';
g.fillRect(M, H - 150, W - M * 2, 1);
g.fillStyle = 'rgba(200,214,234,.62)';
g.font = '13px ' + MONO;
g.fillText('视场 ' + STOPS[stop].t + '   ·   观测层 ' + L.name, M, H - 112);
g.fillStyle = 'rgba(200,214,234,.4)';
g.fillText(ds + '   ·   球形发光体 · 三屏科普档案', M, H - 84);
push('导出', '存下一张 PNG（' + LOG.length + ' 条记录）');
return c.toDataURL('image/png');
}
document.getElementById('obsSave').addEventListener('click', function(){
const url = exportPNG();
const a = document.createElement('a');
const stamp = new Date().toISOString().slice(0, 10);
a.href = url; a.download = '观测记录-' + stamp + '.png';
a.click();
});
window.__obs = {
log: function(){ return LOG.slice(); },
clear: function(){ LOG.length = 0; render(); },
stop: function(){ return stop; },
setStop: function(i){ stop = Math.max(0, Math.min(STOPS.length - 1, i | 0)); applyStop(); return stop; },
export: function(){ return exportPNG(); },
layer: function(){ return layer; },
setLayer: function(i){ applyLayer(i, true); return layer; },
push: push
};
})();