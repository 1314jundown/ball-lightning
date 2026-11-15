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
['01','序曲：雷雨夜与研究动机','主角生日夜，球状闪电穿墙进入家中，父母在强光和能量作用下化为灰烬。主角从此把球状闪电视为必须面对的对象。','原文线索','小说虚构','创伤 → 追索','从自然目击到个人问题','序曲','正文 1–5 页'],
['02','异象之一 · 旧屋：两年后的夏天','大二暑假回老家收房：客厅里的薄灰、倒扣的玻璃杯、一幅画面朝下的水塔画，盥洗池边的几根半黑半白头发。它不属于“解释”，只属于“目击”。','原文线索','小说虚构','重返 → 目击','从纸面回到那间屋子','番外 异象一','正文 9–10 页','anomaly'],
['03','中篇 · 研究：国际线索与科研共同体','主角与林云等人通过网络和资料线索寻找球状闪电研究者，接触丁仪、高波、陈博士等人；研究从个人执念变为跨学科、跨机构协作。','报告归纳','小说虚构','合作 → 工程','从一个人的问题到一组人的任务','中篇 研究','正文 约 40–120 页'],
['04','军事化：从解释现象到设计武器','国家把球状闪电相关成果纳入新概念武器与战略项目。林云在系统评价和项目协作中承担重要职责，主角与丁仪的理论被改写为可部署的技术。','报告归纳','小说虚构','理论 → 武器','当知识进入制度接口','下篇 战争','正文 约 120–190 页'],
['05','战争：宏聚变与文明系统性崩溃','武器投入战争后，宏聚变造成大范围信息设备和芯片系统失效，社会退回低技术状态。主角在战场上经历行动、失散与死亡，林云牺牲。','原文线索','小说虚构','局部 → 系统','风险不再只属于实验室','下篇 战争','正文 约 190–270 页'],
['06','尾声：婚姻、记忆与量子玫瑰','战争结束后，主角与戴琳结婚，诺顿·帕克来访，把研究转向民用与“超级观察者”问题。量子玫瑰把科学概念重新连回婚姻、记忆与死亡体验。','原文线索','文学象征','解释 → 生活','最后留下的是不可替代的生活','尾声','正文 约 270–278 页'],
['07','后记：作者对科幻形象的自述','作者说明亲见球状闪电的经历，也说明作品并不声称解释真实机制，而是在现实灰色世界里创造一个想象的超现实对象。','报告归纳','小说虚构','想象 → 边界','科幻形象不是科学结论','后记','正文 279–281 页']
];
const lenses = {
reality: {
title:'球状闪电：现实中仍未完全解释的自然现象',
text:'现实研究有目击记录和少量仪器记录，但样本稀少、持续时间短、定义不一，至今没有被广泛接受的单一机制。',
src:'外部科学资料', bnd:'现实争议',
ev:[['可以说','雷暴、大气电学、等离子体和能量密度提供理解入口。'],['不能越界','现实球状闪电研究不等于小说的宏电子体系。']]
},
hypothesis: {
title:'把候选假说当作“解释工具”，而不是答案',
text:'等离子体、蒸发材料、化学发光、微波与电磁场等模型可以解释部分观测，但模型之间仍需证据比较。',
src:'外部科学资料', bnd:'候选假说',
ev:[['课堂动作','比较每个模型解释了什么、遗漏了什么。'],['证据等级','目击记录能提出问题，却不能单独完成验证。']]
},
fiction: {
title:'宏电子、空泡与宏聚变：小说内部的自洽系统',
text:'小说把球状闪电写成可收集、可激发、可武器化的宏观量子结构。这套框架服务于叙事和伦理推演，不是现实科学结论。',
src:'报告归纳', bnd:'小说虚构',
ev:[['设定链','球状闪电 → 宏电子 → 宏原子核 → 宏聚变。'],['回收点','量子玫瑰把宏观量子设定重新折返为情感象征。']]
}
};
const nodes = {
storm: {
n:'雷暴', sub:'现实入口', rel:'大气环境 → 目击', bnd:'现实知识',
fic:'序曲的雷雨夜是全家命运的起点。',
sci:'雷暴云中电荷分离与放电形成闪电，是现实大气电学。',
q:null
},
ball: {
n:'球状闪电', sub:'核心现象', rel:'自然目击 → 理论建模', bnd:'现实争议 + 小说设定',
fic:'可穿墙、漂浮、发光，内部能量密度极高，对不同物质有选择性作用。',
sci:'现实有大量目击与少量仪器记录，成因无统一解释。',
q:'“还有微波激射－孤立子理论，认为球状闪电是由体积约为若干立方米的大气微波激射所引起的。（……）比较受到注意的是新西兰坎特伯雷大学的亚伯拉罕森和迪尼斯的理论，认为球状闪电主要是由微型含硅颗粒组成的网络球体燃烧形成。”'
},
macro: {
n:'宏电子', sub:'小说虚构', rel:'现象 → 实验工程', bnd:'小说虚构',
fic:'宏观尺度的电子／带电结构，可被收集、储存或激发，是制造球状闪电的关键材料。',
sci:'现实没有已证实的“足球大小电子”，只能类比等离子体与集体激发。',
q:'“对于宏电子来说，波粒二象性中波的形态占很大比重，所以它的大小的意义与我们常识中的完全不同。（……）我们要先给这些大电子取一个名字，它们是宏观尺度的电子，就叫宏电子吧。”'
},
nucleus: {
n:'宏原子核', sub:'小说虚构', rel:'宏电子 → 宏观物质单元', bnd:'小说虚构',
fic:'与宏电子构成宏原子，能在宏观尺度保持类似原子结构的稳定性。',
sci:'现实原子核遵循量子规律，扩展到宏观尺度属于虚构。',
q:'“找不到宏原子核主要不是因为它们不能被激发，而是因为我们根本不知道它们是什么样子。”'
},
bubble: {
n:'空泡', sub:'小说虚构', rel:'稳定性 → 量子解释', bnd:'小说虚构',
fic:'包裹或隔离宏观量子结构的空间／场结构，使球状闪电能在通常物质中运动而不立即耗散。',
sci:'可类比真空腔、场局域化或拓扑缺陷的想象，不是已确认的实体。',
q:'“这是有可能的，它毕竟是一个透明的空泡，对于这样一个目标，空中的观察条件太不好了，我们现在能做的，只能是将它拿回来放到桌面上看。”'
},
quantum: {
n:'量子态', sub:'小说设定', rel:'空泡 → 观测问题', bnd:'现实讨论 + 小说设定',
fic:'未被观察时可处于叠加或概率状态，观察促使其呈现确定结果。',
sci:'量子态是现实量子力学的基本描述；宏观物体长期保持可观测叠加属于小说设定。',
q:'“当有观察者的时候，它们的状态坍缩为一个确定值，这个值与我们在宏观世界的经验相符（……）但没有观察者的情况下，它们呈量子态，它的一切都是不确定的，其位置只能用概率来描述。”'
},
transition: {
n:'量子跃迁', sub:'小说类比', rel:'状态改变 → 能量释放', bnd:'小说类比',
fic:'把宏观结构的状态改变、能量释放和位置变化与量子跃迁联系起来。',
sci:'原子与分子确有能级跃迁；直接扩大到宏观物体属于文学类比。',
q:'“宏电子或它被激发后形成的球状闪电那轨迹复杂的飘行，实际上是一种不断的量子跃迁，但在我们的视觉中它的运行是连续的。”'
},
fusion: {
n:'宏聚变', sub:'小说虚构', rel:'武器化 → 系统毁伤', bnd:'小说虚构',
fic:'宏原子核在特定条件下发生类似聚变的巨大能量释放，成为军事破坏力的来源。',
sci:'现实核聚变涉及轻原子核；“宏原子核聚变”是小说虚构。',
q:'“宏聚变——是这么叫的吧，它释放的能量是否与球状闪电一样，具有目标选择性呢？”'
},
observer: {
n:'观察者与坍缩', sub:'哲学化想象', rel:'量子态 → 观察问题', bnd:'现实讨论 + 小说想象',
fic:'观察者使量子态从概率描述变成确定结果，后期延伸为“超级观察者”。',
sci:'测量与量子态演化是现实讨论主题，“意识观察导致一切坍缩”并非共识。',
q:'“人的死亡过程就是由一个强观察者变为弱观察者再变为非观察者的过程，当我变成弱观察者时，玫瑰的概率云向毁灭态的坍缩速度就会慢一些。”'
},
rose: {
n:'量子玫瑰', sub:'文学象征', rel:'观察者 → 私人记忆', bnd:'文学象征',
fic:'蓝色玫瑰只在注意力转移时显现，成为记忆、情感与量子观察的诗性象征。',
sci:'完全是文学象征，不是物理实体。',
q:'“当我走到人生的尽头，当我在弥留之际最后一次睁开眼睛，那时我所有的知性和记忆都消失在过去的深渊中，又回到童年纯真的感觉和梦幻之中，那就是量子玫瑰向我微笑的时候。”'
}
};
const HYP = {
storm:    ['无需假说', '雷暴、电荷分离与放电是已被理解的物理过程，不属于待解释现象。', '现实知识'],
ball:     ['多个竞争模型', '硅纳米颗粒氧化（Abrahamson & Dinniss 2000）、微波激射—孤立子、相对论微波（Wu 2016）、等离子体模型等互相竞争，至今没有胜出者。', '现实争议'],
macro:    ['无对应候选', '现实没有“宏观尺度电子”的候选机制，只能类比等离子体、带电粒子与集体激发。', '小说虚构'],
nucleus:  ['无对应候选', '现实原子核遵循量子规律，但把结构放大到宏观尺度没有任何候选机制。', '小说虚构'],
bubble:   ['无对应候选', '只能类比真空腔、场局域化、拓扑缺陷等概念，现实中没有被确认的对应实体。', '小说虚构'],
quantum:  ['现实理论 + 小说外推', '量子态是现实量子力学的基本描述；争议点在于宏观物体能否长期保持可观测叠加，即退相干问题。', '现实讨论'],
transition:['现实理论 + 文学类比', '能级跃迁真实存在；把宏观物体的位置与能量变化称作“量子跃迁”属于文学类比。', '文学类比'],
fusion:   ['现实机制 + 尺度虚构', '核聚变是真实机制，能量量级远高于化学反应的十万倍；但“宏原子核聚变”没有对应物。', '小说虚构'],
observer: ['竞争解释', '测量问题真实存在（退相干、观测者效应），但“意识观察导致坍缩”不是物理学共识。', '现实讨论'],
rose:     ['无科学对应', '只对应“观察改变状态”这一隐喻，没有物理实体或候选机制。', '文学象征']
};
const CHAIN = {
storm:     ['自然现象', '主角的目击与创伤', '自然现象触发个人研究动机'],
ball:      ['雷暴', '宏电子', '球状闪电被重新解释为可操作对象'],
macro:     ['球状闪电', '宏原子核／宏原子', '从带电粒子到宏观物质单元'],
nucleus:   ['宏电子', '空泡', '从带电粒子到宏观物质单元，再由空泡维持稳定'],
bubble:    ['宏原子核', '量子态与量子跃迁', '空泡承担“保护壳／空间结构”的功能'],
quantum:   ['空泡', '观察、坍缩、状态改变', '把宏观现象接入量子解释'],
transition:['空泡', '观察、坍缩、状态改变', '把宏观现象接入量子解释'],
fusion:    ['宏原子核', '武器化与大范围毁伤', '科学模型进入军事工程'],
observer:  ['量子态', '量子玫瑰', '科学概念回到家庭与死亡经验'],
rose:      ['量子态与观察者', '私人记忆与情感隐喻', '科学概念回到家庭与死亡经验']
};
const CITE_PAGES = {"112":"我赶忙把烟拾起来在烟灰缸中捻灭，把两手放到膝盖上以小学生状端坐着。林云看到我这样儿笑了起来： “放松些，我爸是理工出身，跟搞技术的人很谈得来。他一开始就不赞成雷电武器的研究，现在看来他是对的，但后来我谈起球状闪电后，他却很感兴趣。”这时我的目光被墙上的一幅黑白照片吸引住，照片上是一位年轻的女性，同林云像极了，穿着以前的那种朴素的军装。林云站起来走到照片前，简单地说：“我妈妈，1981 年在边境战争中牺牲了……我们还是谈球状闪电吧，但愿你没把它忘光。 ”“你这一阵儿在干什么？ ”“用二炮一个研究所中的一台大型机计算我们最后做的那个模型，加上调试，运行了三十多次。 ”她轻轻的摇了摇头，我就知道结果是失败的了， “那是我回来后做的第一件事，但说实在的，只是不忍心让你的心血白流了。 ”“谢谢， 真的谢谢。 但以后我们别再搞数学模型了， 没有意义。 ”“我也看到这点了。回来后，我从别的渠道作了进一步的了解，在过去的几十年里，除了前苏联，西方也对球状闪电的研究做了巨大的投入，我们就不能从中得到些什么？”“可他们，包括格莫夫，没有向我们透露一点技术资料。 ”林云笑了起来： “你呀，太学院派了。”“或说太书呆子气。 ”“那倒不是，要真是，前一阵儿你就不会当逃兵了。不过这也说明你已经看到了最重要的东西，这本来可以成为我们的一个新起点，可你却把它当成终点了。 ”“我看到了什么？”“用传统的思维方式已经不可能解开球状闪电之迷了，这个结论可值几百个亿啊！ ”“确实，电磁能量以那种方式存在，简直不可思议，我们也许","113":"可以硬扭着方程式搞出一个牵强的数学模型，但直觉告诉我那不是真的。它能量施放的选择性和穿透性这类不可思议的特性，确实不是传统理论能解释的。”“所以我们应该放开自己的思想。你说过我们不是超人，但从现在起我们必须强迫自己以超人的方式思考。”“我已经这样思考了。 ”我激动地说， “球状闪电并不是由闪电产生的，而是自然界早已存在的一种结构。 ”“你是说……闪电只是点燃或激发了它？ ”林云紧接着说。“太对了，就像电流点亮了电灯，但电灯本身早已存在！ ”“好，我们把思路再整理一下……天啊，这想法居然能对西伯利亚基地的事情做出一些解释！ ”“是的，3141 基地产生的 27 个球状闪电与产生它们的人工闪电的参数根本就没有关系，只是因为那种结构正好在那儿，所以被激发了！ ”“那种结构能进入地下吗……为什么不能！在多次大地震前，人们都看到球状闪电从地上的裂缝中飞出！ ”我们俩兴奋得不能自已，来回走动着。“那么以前研究的误区就很明显了：不应试图‘产生’它，而是去‘找到’它！这就是说，在模拟雷电时，关键不在于闪电本身的性质和结构，更不在于磁场和微波之类的外加因素，而在于使闪电覆盖尽可能大的空间！”“正确！ ”“那我们下一步该干什么呢？”这时，林将军在后面招呼我们吃饭，我看到客厅的中央已摆上了一桌丰盛的饭菜。“小云要注意啦，我们可是请陈博士来做客的，吃饭的时候不谈工作。 ”林将军边给我倒酒边说。林云说： “我们这不叫工作，业余爱好罢了。 ”","114":"接下来，我们开始谈论一些轻松的话题。我得知，林将军是哈军工的高才生，他学的专业是电子学，但以后没有再接触技术工作，而是转到纯军事指挥领域，成为我军少有的理工出身的高级将领。“您学的那些东西，现在怕只记得欧姆定律了吧？ ”林云说。将军笑着说： “那你小看我了。不过我现在印象最深的不是电子学，而是计算机。那时我见过的第一台计算机是苏联老大哥的，主频我忘了，内存是 4K，那 4K 是用磁芯存储器实现的，装它的箱子比那个书架都高。但与现在差别最大的还是软件，小云成天向我吹嘘她是一个多么了不起的编程高手，但到了那台计算机上，编一个计算 3+2 的程序都会让她出一头汗。”“那时只有汇编语言吧？ ”“不，只有 0 和 1。机器不会编译，你要把程序写到纸上，然后一个指令一个指令地把它们翻译成机器码，就是一串 0 和 1，这个过程叫人工代真。 ”将军说着，转身从后面的办公桌上拿起一支铅笔和一张纸，写出了一长串 0 和 1 给我们看， “喏，这一串指令的意思是把两个寄存器中的数放到累加器中，再把计算结果送到另一个寄存器中。小云你用不着怀疑，这绝对正确，当时我用了一个月的时间，居然编成了一个计算圆周率的程序，那以后，我对各个指令和机器码之间的对应关系记得比乘法口诀都要熟。 ”我说： “现在的计算机同那时其实没有本质区别，最终被处理的仍是一串 0 和 1。”“是的，这很有意思。想想十八世纪或更早些的时候，那些想发明计算机器的科学家，他们肯定认为，自己之所以失败，是因为想得不够复杂，现在我们知道，是因为他们想得不够简单。”“球状闪电也是这样， ”林云若有所思地说， “刚才陈博士的一个伟大构想提醒了我，我们以前的失败真的是因为想得不够简单。 ”接着，她把我的最新想法告诉父亲。","160":"布，原子粒子就是布上微小的皱折。”“您这么说我有些明白了。 ”刘上尉若有所思地说。“不过，这与我们传统的宇宙图像真有很大差别。 ”林云说。“但这是最接近真实的图像。 ”丁仪说。“这就是说，电子像一个空泡？”“一个自封闭的弯曲空间。 ”丁仪郑重点点头。“可是，电子……怎么可能这么大？ ”“在宇宙大爆炸后极短的时间内，整个空间都是平滑的，后来，随着能量级别的降低，空间出现了皱折，这就诞生了各种基本粒子。一直让我们迷惑的是，这些皱折为什么都是微观尺度？难道没有宏观尺度的皱折吗？或者说没有宏观尺度的基本粒子吗？现在我们知道有的。 ”我这时第一个感觉是可以呼吸了，我的思想已被窒息了十几年，这期间，我像是潜行在浑浊的水中，到处是一片迷蒙。现在突然浮出了水面，呼吸到了第一口空气，看到了广阔的天空，盲人复明亦不过是这个感觉。“我们之所以能看到空泡，是因为这一处弯曲的空间使经过它的光线弯曲，这形成了它可见的边缘。 ”丁仪继续解释道。“那你为什么认为它是电子，而不是质子或中子呢？”许大校问。“问得好，其实答案也很简单：空泡被闪电激发成球状闪电再恢复成空泡的过程，实际就是电子由低能级被激发成高能级，再跌回低能级的过程。在三种粒子中，只有电子能够被这样激发。 ”“也正因为它是电子，才能够沿着超导线传输，并在超导电池中像循环电流一样永不停息地运行。 ”林云恍然大悟地说。“可很奇怪的，它的直径与那节电池差不多。 ”“对于宏电子来说，波粒二象性中波的形态占很大比重，所以它的大小的意义与我们常识中的完全不同。它还有很多令人难以置","161":"信的特性，我们以后会慢慢看到的，我相信这会改变大家对世界的看法。不过现在，我们要先给这些大电子取一个名字，它们是宏观尺度的电子，就叫宏电子吧。 ”“那么，像刚才说的，是否存在宏质子和宏中子呢？”“应该存在，不过由于它们不能被激发，我们很难发现它们。”“丁教授，你的梦实现了。 ”林云说，除了丁仪和我，别的人还不太明白她这话的意思。“是啊是啊，真有西瓜这么大的基本粒子摆上物理学家的桌面了，下一步我们肯定要研究它们的内部结构，那也是由弯曲的空间构成的结构，虽然也很难，但我相信比研究微观粒子的结构不知要容易多少倍。”“那也存在宏原子了？三种宏粒子应该是能够组成原子的啊！”“是的，应该有宏原子。”“我们所捕获到的那个空泡，哦，那个宏电子，是自由电子呢，还是一个宏原子中的电子？如果是后者，那这个宏原子的原子核在哪里呢？”“呵呵，你问住我了。不过，原子中的空间很大，如果一个原子有一个剧场大厅那么大，原子核只是大厅中央的一个核桃大小，所以，如果这个宏电子真的属于一个宏原子，那它的原子核距离我们是相当远的。 ”“天啊，还有一个问题：如果存在宏原子，那一定有宏物质，也有宏世界了？”“我们已经在进行宏伟的哲学思考了。 ”丁仪向提问者微笑着说。“您说到底有没有宏世界啊？”有人追问。这时，我们就像一群被故事强烈吸引的孩子了。“我相信存在宏世界，或者说宏宇宙，但它是什么样子，还是未知中的未知。也许与我们的世界完全不同，也许完全对应，像猜","162":"测中的正反物质宇宙那样，存在着宏地球和宏的你我他，要是那样的话，我在宏世界的脑袋一定大得能装下这个宇宙的银河系……这是不是平行宇宙的另一种表现形式呢？”这时，夜已降临，我们仰望夏夜灿烂的星空，每个人都极力使自己的目光横越广漠的星海，都想在银河之上，在宇宙天鹅绒般的深广虚空中，发现丁仪的脑袋那巨大的轮廓，我想像中的那个由宏原子组成的超级头颅应该是像水晶般透明的。我们都惊奇自己的思想竟一下子变得如此深邃。宴席散后，充满醉意的我们在草原上散步，我看到丁仪和林云走在一起，他们挨得很近，谈得也很亲密。丁仪那三面旗帜在夜风中潇洒地飘扬，我知道，这个瘦得像麻杆的家伙可以轻易地击败了充满男性魅力的航母舰长，还有我，这就是思想的力量。不知为什么，我的心中充满了一种难言的苦涩。苍穹中的星海像那个泰山之夜一样灿烂，在草原之上的夜空中，无数幽灵般的宏电子正在飘行。武 器自从对空泡的捕获取得成功后，研究的道路豁然开阔，进程也变得平滑起来，成果一个接着一个出现，真有种坐在过山车上的感觉。继我提出球状闪电激发猜想，丁仪从理论上描述了宏电子的存在后，林云的技术天才开始发挥关键性作用。研究的下一步自然是收集宏电子，丁仪的理论研究所需的数量并不多，但对于基地的武器研究来说则所需数量十分巨大。这本是一件很困难的事，因为传统的电弧采集方式危险性很大，几乎不可能再次进行。人们想出了各种解决方法，其中被考虑最多的是使用遥控飞行器，这虽然可以解决安全问题，但对于采集大量宏电子来说，则耗资巨大，效率很低。","175":"“怎么搞的？ ”康中校责问雷球武器后面的射手， “不是让你睁着眼瞄准好再闭上眼吗？”“我是那样做的，瞄准绝对正确！ ”那名上士说。“那……检查武器！ ”“不用了，武器和射手的操作没问题。 ”丁仪一摆手说，“不要忘了，球状闪电是一个电子。 ”“你是说，它呈现量子效应？ ”我问。丁仪肯定地点点头： “确实如此！当有观察者的时候，它们的状态坍缩为一个确定值，这个值与我们在宏观世界的经验相符，所以它们击中了目标；但没有观察者的情况下，它们呈量子态，它的一切都是不确定的，其位置只能用概率来描述，在这种情况下，这一排球状闪电实际上是以一团电子云的形态存在的，这是一团概率云，击中目标的位置只占很小的概率。 ”“您是说， 雷球打不中目标是因为我们没看它？ ” 中校难以置信地问。“正是这样，是奇观吧？ ”“这也太……唯心了。 ”林云迷惑地摇摇头。“看，哲学了吧，女人迫不得已也会哲学的。 ”丁仪冲我使个怪眼色，然后对林云说， “别在哲学上教训我。 ”“是，我没资格，要是每个人都有你那么终极的思想，那世界太可怕了。 ”林云耸耸肩说。“你不会不知道一点儿量子力学原理吧。 ”丁仪问。“是，我知道，还不是一点儿，但……”“但没想到在宏观世界看到它，是吗？”中校问： “这难道是说，如果雷球要击中目标，我们就必须自始至终看着它？”丁仪点点头说： “或敌人看着它也行，但必须有观察者。 ”“再试一次，让我们看看概率电子云是什么样子的吧！ ”林云","176":"兴奋起来。丁仪摇摇头： “不可能的，量子态只在无观察者的情况下呈现，观察者一出现它就坍缩为我们的经验现实，我们永远不可能见到概率云。 ”“装一台无人值守的摄像机不就行了吗？ ”中校说。“摄像机也是观察者，同样会引起量子态的坍缩。这也是我让所有监视装置都关闭的原因。 ”“可摄像机本身并没有意识啊。 ”林云说。“看看，是我唯心还是你唯心？观察者并不需要有意识。”丁仪对林云坏笑了一下。“这就不对了， ”我觉得自己终于抓住了丁仪的一个破绽， “那照你所说，球状闪电周围的什么东西不是观察者呢？就像在摄像机的感光系统上留下自己的影像一样，球状闪电同样在空气中留下了电离痕迹，它们发出的光会对周围的植物产生影响，它们发出的声音震动地面的沙砾……周围的环境总是或多或少地留下它们的痕迹，这与摄像机摄下图像并无本质的差别。 ”“是的， 但观察的强度是有极大区别的， 摄下影像是强观察，而地面的沙砾被震离原位只是弱观察，弱观察也能引起量子状态的坍缩，但很微小。 ”“这理论玄乎得让人难以相信。 ”“如果不是实验证据，真的没有人会相信它，但量子效应在上世纪初叶就在微观世界中被证实，只不过到现在我们才见到它的宏观表现……波尔要活着有多好，德布罗意要活着有多好，海森堡和狄拉克要活着有多好……”丁仪渐渐动起感情来，梦游似的来回走着，嘴里喃喃自语。“不过爱因斯坦幸亏死了。 ”林云说。我这时想起一件事：在基地进行宏电子激发的实验室，丁仪坚持要求安装了四套监视系统，我现在向他提起这件事。","177":"“是的，这是出于安全考虑，如果所有的监视系统都失效，球状闪电就会处于量子态，那时，基地的相当大一部分都会笼罩在概率电子云之中，球状闪电可能在其中的任何位置突然出现。”我现在明白了，为什么在历史上大多数目击案例中，球状闪电都是飘忽不定，踪影神秘，常常凭空突然出现，附近并没有可以激发它的闪电。这很可能是因为当时目击者处于一个宏电子的概率云中，他或她偶然的观察使球状闪电的量子态突然坍缩。我感叹着说： “我本以为对球状闪电已经很了解了，没想到……”“你还有更多没想到的，陈博士，大自然之诡异你真的难以想像。 ”丁仪打断我说。“还有什么呢？”“还有一些事，我甚至都不敢同你讨论。 ”丁仪压低了声音说。我最初没有注意他的话，但再一想却打了个寒战，抬起头，看到丁仪正用蛇一样怪异的目光看着我，让我浑身发冷。在我意识的深处， 有一个最幽暗的阴影区， 我一直在努力忘掉它， 几乎成功了，我现在真的不敢去触动它。在以后两天的试验中，球状闪电的宏观量子效应得到了进一步的证实。只要去除观察者，雷球武器发射的球状闪电的弹着点就会严重发散，对目标的命中率只及存在观察者时的十分之一。我们又运来了更多的设备，进行了更复杂的试验，主要是试图确定一个宏电子在量子态时所产生的概率云的大小。其实，在严格的量子力学意义上，这种说法是很不严谨的，一个电子（不论是宏观的还是微观的），其概率云与整个宇宙一样大，处于量子态的球状闪电有可能在仙女座星云出现，只是这种概率极其微小。我们所说的概率云大小，是工程学意义上的，指的是这样一个模糊的边界，在边界以外，概率云已经稀薄到可以忽略不计。","178":"但在第三天，出现了一次例外，在没有任何观察者的情况下，雷球机枪发射的十颗球状闪电全部准确地击中了目标，这是一类以金属作为能量释放目标的宏电子，激发能量很高，那个作为靶标的报废装甲车有三分之一被熔化了。“肯定有疏忽，出现了观察者，也许是哪个摄像机没关，更有可能是哪个战士偷着睁了一下眼，想看看宏电子云什么的。”丁仪相当肯定地说。于是在下次发射前，拆除了仅有的两部摄像机，将靶场上的所有人员全部撤到与外界隔绝的一个地下掩体部里，靶场上空无一人，已瞄准完毕的雷球机枪改为自动发射。但这次发射的十五颗球状闪电仍全部准确命中。我很高兴有能够难住丁仪的事，哪怕是暂时难住也行。看到结果后他确实显得很担心，但这种担心与我想得是两回事，他显然并没有被难住。“立刻停止试验和实弹训练吧。 ”他对林云说。林云先是看看丁仪，然后看了一眼天空。我说： “为什么要停呢？这可是一次绝对没有观察者的发射，量子效应却没有出现，总该搞清楚原因吧？”林云向上扬了一下头： “不，有观察者。 ”我抬头看天空，这才发现这些天一直密布的阴云不知什么时候裂开了一道缝，一条狭窄的蓝天露了出来。烧毁芯片从南方回到基地后，发现北京已到深秋，晚上已经有些冷了。随着气温一起降下来的，还有军方对球状闪电武器的热情。一回到基地我们就从许大校那里得知，总参和总装备部都不准备把这种武器大规模装备部队，晨光部队的规模也不再扩大。上级的这种"};
const CITE_NEEDLE = { q113:'闪电只是点燃或激发了它', q161a:'我们所捕获到的那个空泡', q161b:'那这个宏原子的原子核在哪里呢', q176:'摄像机也是观察者', q177:'命中率只及存在观察者时的十分之一' };
const NAV = [
['报告归纳','设计推演'], ['原文线索','小说虚构'], ['外部科学资料','现实争议'],
['报告归纳','现实争议'], ['报告归纳','人物关系'], ['原文线索','文学象征']
];
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const screens = ['cover','stages','concepts','people','rose'].map(id => document.getElementById(id));
let cur = 0;
const BOOT_HASH = location.hash;
let hashBooted = false;
const STATUS_WHY = {
'原文线索': '这一段的情节骨架能在原著正文里找到对应页码，属于“书上确实这么写”。',
'小说虚构': '原著没明写、由整理者补写的部分；用来把证据链讲圆，不代表小说结论。',
'报告归纳': '来自第二手材料（报道、访谈、研究综述）的归纳，不是原著原句。',
'现实知识': '现实世界里可查证的科学结论，用来和小说设定对照。',
'现实争议': '现实里尚无定论的部分；单独标出来，免得被当成已确认的结论。',
'文学象征': '这个元素在小说里主要承担象征功能（记忆、死亡），不是物理设定。',
'设计推演': '由现实机制往工程侧推演出的虚构设计，属于“可能长这样”。',
'人物关系': '依据人物之间的对话、书信与行动整理出的关系判断。',
'逐字引用': '逐字引用原著原文，未做改写。',
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
const st = window.__arch && window.__arch.state ? window.__arch.state() : null;
const pid = st && st.phase !== 'idle' ? st.pid : '';
const want = '#' + cur + (pid ? '/' + pid : '');
if (location.hash !== want){
try { history.replaceState(null, '', want); } catch (_) { location.hash = want; }
}
}
window.__syncHash = syncHash;
function readHash(){
const src = hashBooted ? (location.hash || '') : (BOOT_HASH || location.hash || '');
hashBooted = true;
const m = /^#(\d)(?:\/([A-Za-z0-9_-]+))?$/.exec(src);
if (!m) return;
const i = Math.max(0, Math.min(screens.length - 1, +m[1]));
if (i !== cur) go(i);
const pid = m[2];
if (pid && i === 4 && window.__arch){
const ok = window.__arch.people.some(p => p.id === pid);
if (ok && window.__arch.state().phase === 'idle') window.__arch.open(pid);
}
}
const SCREEN_NOTE = [
'封面 · 章节入口，附序章与番外',
'七阶段 · 逐条对应研究报告 TABLE 4',
'概念关系 · 44 个词的关系网，可切实验模式',
'人物 · 只描关系，不虚构面孔',
'量子玫瑰 · 观测者与坍缩'
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
if (i === 3 && window.__stage3D) window.__stage3D.on();
$$('#toc button').forEach((b, j) => b.setAttribute('aria-current', String(i === j)));
const pageNow = $('#pageNow');
if (pageNow) pageNow.textContent = '0' + i;
if (window.__dockRail) window.__dockRail(i);
document.body.dataset.screen = String(i);
const prevBtn = $('#prev');
const nextBtn = $('#next');
if (prevBtn) prevBtn.disabled = i === 0;
if (nextBtn) nextBtn.disabled = i === screens.length - 1;
setStatus(NAV[i][0], NAV[i][1]);
const noteEl = $('#screenNote');
if (noteEl) noteEl.textContent = SCREEN_NOTE[i] || '';
if (screens[i].scrollTop) screens[i].scrollTop = 0;
if (i === 1) requestAnimationFrame(layoutChaps);
if (window.__labFx) {
if (i === 3) requestAnimationFrame(() => { window.__labFx.resize(); window.__labFx.start(); if (window.__labGame) window.__labGame.resume(); if (window.__mini) window.__mini.resume(); });
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
if ($('#prev')) $('#prev').addEventListener('click', () => go(cur - 1));
if ($('#next')) $('#next').addEventListener('click', () => go(cur + 1));
addEventListener('keydown', e => {
if (chapMode !== 'scatter' && document.getElementById('stages') && document.getElementById('stages').classList.contains('on')) return;
if (e.key === 'ArrowRight' || e.key === 'PageDown') { go(cur + 1); e.preventDefault(); }
else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { go(cur - 1); e.preventDefault(); }
else if (e.key === 'Home') go(0);
else if (e.key === 'End') go(screens.length - 1);
});
const chapStage = $('#chapStage');
const chapList = $('#chapList');
const chapHint = $('#chapHint');
const chapCoord = $('#chapCoord');
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
return '<svg viewBox="0 0 260 340" preserveAspectRatio="none" aria-hidden="true">' + A.join('') + '</svg>';
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
const w = chapStage.clientWidth, h = chapStage.clientHeight;
const cx = w / 2, cy = h / 2;
const narrow = w <= 960;
const fit = Math.min(1, (w - 56) / 260, (h * 0.40) / 340);
chapItems.forEach((el, i) => {
let x = cx, y = cy, sc = 1, op = 1, z = 10, pe = 'auto', rot = 0;
if (chapMode === 'scatter'){
if (narrow){
const pt = SCATTER_N[i];
chapNodeX[i] = pt[0];
x = w * pt[0]; y = h * pt[1];
sc = .56; op = 1; z = 10;
pe = 'none'; /* 热区交给 .txt（见 CSS） */
rot = i % 2 ? 1.8 : -2.2;
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
syncSceneEntry(chapIdx);
if (window.__chapMarks) window.__chapMarks();
if (window.__chapBolt) window.__chapBolt.sync(chapIdx);
}
(function boltBand(){
const stage = document.getElementById('chapStage');
const list = document.getElementById('chapList');
if (!stage || !list) return;
const P0 = .10, P1 = .93;   /* 第一击的落点 / 最后一击的落点，留边不贴屏 */
const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wrap = document.createElement('div');
wrap.className = 'chap-bolt';
wrap.setAttribute('aria-hidden', 'true');
const vid = document.createElement('video');
vid.className = 'chap-bolt-vid';
vid.muted = true;
vid.defaultMuted = true;
vid.loop = true;
vid.autoplay = !reduce;
vid.playsInline = true;
vid.setAttribute('muted', '');
vid.setAttribute('playsinline', '');
vid.setAttribute('preload', 'auto');
vid.src = 'assets/bolt-chapters.mp4';
const scrim = document.createElement('div');
scrim.className = 'chap-bolt-scrim';
const head = document.createElement('div');
head.className = 'chap-bolt-head';
wrap.appendChild(vid);
wrap.appendChild(scrim);
wrap.appendChild(head);
stage.insertBefore(wrap, list);
let cur = P0, raf = 0;
function paint(p){
cur = p;
stage.style.setProperty('--bolt-p', p.toFixed(4));
stage.style.setProperty('--bolt-y', boltYAt(p).toFixed(4));
if (window.__chapTel) window.__chapTel.update(p);
document.documentElement.style.setProperty('--bolt-p', p.toFixed(4));
}
paint(P0);
function ease(t){ return 1 - Math.pow(1 - t, 3); }
function to(p, ms){
p = Math.max(P0, Math.min(P1, p));
if (raf){ cancelAnimationFrame(raf); raf = 0; }
if (reduce || Math.abs(p - cur) < 1e-4){ paint(p); return; }
const from = cur, t0 = performance.now(), dur = ms || 900;
function step(now){
const k = Math.min(1, (now - t0) / dur);
paint(from + (p - from) * ease(k));
raf = k < 1 ? requestAnimationFrame(step) : 0;
}
raf = requestAnimationFrame(step);
}
function running(on){
if (reduce) return;
if (on){ const r = vid.play(); if (r && r.then) r.catch(function () {}); }
else vid.pause();
}
if (window.IntersectionObserver){
new IntersectionObserver(function (es) { running(es[0].isIntersecting); }, { threshold: .15 }).observe(stage);
}
document.addEventListener('visibilitychange', function () {
running(!document.hidden && stage.classList.contains('on'));
});
window.__chapBolt = {
sync: function (i){
const nx = (typeof chapNodeX[i] === 'number') ? chapNodeX[i] : 0;
to(Math.max(.05, Math.min(.98, nx)), 900);
},
progress: function () { return cur; },
video: vid
};
})();
(function chapTelemetry(){
const stage = document.getElementById('chapStage');
if (!stage) return;
const wrap = document.createElement('div');
wrap.className = 'chap-tel';
wrap.setAttribute('aria-hidden', 'true');
function rows(list){
return list.map(function (r) {
return '<div class="row"><span>' + r[0] + '</span>' + r[1] + '</div>';
}).join('');
}
const axis = ['+30°', '+20°', '+10°', '0°', '-10°', '-20°', '-30°'].map(function (t) {
return '<i' + (t === '0°' ? ' class="zero"' : '') + '><em></em>' + t + '</i>';
}).join('');
let ticks = '';
for (let k = 0; k < 41; k++) ticks += '<s' + (k % 4 === 0 ? ' class="mj"' : '') + '></s>';
wrap.innerHTML =
'<div class="tel tel-axis"><span class="rail"></span><span class="minor"></span>' + axis + '</div>' +
'<div class="tel tel-tr">' + rows([
['PHASE', '<b data-tel="phase">0.16 rad</b>'],
['DRIFT', '<b>0.0071</b>'],
['FIELD', '<b class="chip">STABLE</b>']
]) + '</div>' +
'<div class="tel tel-bl">' + rows([
['VEC', '<b data-tel="vec">0.090 /-0.301</b>'],
['LAT', '<b>12.6 m/s²</b>'],
['ENV', '<b>VACUUM</b>']
]) + '</div>' +
'<div class="tel tel-br">' + rows([
['FLUX', '<b>2.41×10³</b>'],
['TEMP', '<b>3.8 K</b>'],
['MODE', '<b class="chip">NAV</b>']
]) + '</div>' +
'<div class="tel tel-axb"><span class="lb">150°</span><span class="tk">' + ticks + '</span><span class="lb">330°</span>' +
'<span class="chap-marks" role="group" aria-label="跳到某一章">' +
stages.map(function (s, k) {
return '<button type="button" class="ck" style="--i:' + k + '" data-ch="' + k + '" title="' + (s[1] || '') + '"><u></u></button>';
}).join('') +
'</span><span class="chap-cur" aria-hidden="true"></span></div>' +
'<div class="tel tel-top"><span>SYS.PB v2.7</span><span>CH.NAV 0045-01</span></div>';
stage.appendChild(wrap);
const phaseEl = wrap.querySelector('[data-tel="phase"]');
const vecEl = wrap.querySelector('[data-tel="vec"]');
let lastQ = -1;
const marks = wrap.querySelector('.chap-marks');
const curMark = wrap.querySelector('.chap-cur');
function syncMark(){
const k = Math.max(0, Math.min(6, chapIdx));
if (curMark) curMark.style.setProperty('--ch', String(k / 6));
if (marks) {
Array.prototype.forEach.call(marks.children, function (b, n) {
b.classList.toggle('on', n === k);
});
}
}
if (marks) {
marks.addEventListener('click', function (e) {
const b = e.target.closest('.ck');
if (!b) return;
const k = +b.dataset.ch;
chapIdx = k;
layoutChaps();
if (window.__chapBolt) window.__chapBolt.sync(k);
syncMark();
});
}
window.__chapMarks = syncMark;
syncMark();
if (!document.querySelector('.chap-sig')){
const sig = document.createElement('div');
sig.className = 'chap-sig';
sig.setAttribute('aria-hidden', 'true');
sig.innerHTML =
'<i class="sig-hatch"></i>' +
'<span class="sig-body"><b>CH.01–07</b><em>七阶段 · 沿放电轨迹</em></span>' +
'<span class="sig-dots"></span>';
stage.appendChild(sig);
}
window.__chapTel = {
update: function (p){
const q = Math.round(p * 200);
if (q === lastQ) return;
lastQ = q;
if (phaseEl) phaseEl.textContent = (p * 1.57).toFixed(2) + ' rad';
if (vecEl) vecEl.textContent = p.toFixed(3) + ' /' + (-boltYAt(p)).toFixed(3);
}
};
})();
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
function hasScene(i){ return i === 0 || !!(stages[i] && stages[i][9] === 'anomaly'); }
function sceneLabel(i){ return i === 0 ? '▶ 进入序章场景' : '▶ 进入番外场景'; }
function syncSceneEntry(i){
var host = $('#sideTags');
if (!host || !host.parentNode) return;
var b = document.getElementById('sceneEntry');
if (!b){
b = document.createElement('button');
b.id = 'sceneEntry';
b.type = 'button';
b.style.cssText = 'margin-top:14px;display:inline-flex;align-items:center;gap:6px;font-family:inherit;' +
'font-size:11px;letter-spacing:.08em;color:#cfe9ef;cursor:pointer;' +
'border:1px solid rgba(179,205,232,.45);border-radius:999px;padding:5px 12px;background:rgba(133,154,175,.14)';
b.addEventListener('click', function(){
var k = +b.dataset.i;
if (k === 0) openScene3D(); else showScene('anomaly');
});
host.parentNode.insertBefore(b, host.nextSibling);
}
var on = hasScene(i);
b.dataset.i = String(i);
b.textContent = sceneLabel(i);
b.style.display = on ? 'inline-flex' : 'none';
}
function setChapMode(m){ chapMode = m; layoutChaps(); }
const scene3dBox = document.getElementById('scene3d');
const scene3dFrame = document.getElementById('scene3dFrame');
const SCENE3D_URL = (function(){
var p = location.pathname;
if (/\/scene-lab\//.test(p)) return '../../scene-lab/prologue.html';
if (/\/src\/index\.html$/.test(p)) return '../prologue-acts/index.html';
return 'prologue-acts/index.html';
})();
let scene3dLoaded = false;
function openScene3D(){
if (!scene3dBox || !scene3dFrame){ if (typeof window.__prologueReplay === 'function') window.__prologueReplay(); return; }
showScene('prologue');
scene3dBox.hidden = false;
document.body.classList.add('scene3d-open');
}
function closeScene3D(){
if (!scene3dBox) return;
dropAnomalyGate();
try { scene3dFrame && scene3dFrame.contentWindow && scene3dFrame.contentWindow.postMessage({ type: 'scene-pause' }, '*'); } catch (e) {}
scene3dBox.hidden = true;
document.body.classList.remove('scene3d-open');
var pro = document.getElementById('prologue');
if (pro) pro.classList.add('done');
document.body.classList.remove('prologue-active', 'cover-intro');
try { if (scene3dFrame) { scene3dFrame.src = 'about:blank'; delete scene3dFrame.dataset.which; } } catch (e) {}
}
function anomalyUrl(){
var p = location.pathname;
if (/\/scene-lab\//.test(p)) return '../../scene-lab/anomaly.html?from=site';
if (/\/src\/index\.html$/.test(p)) return '../anomaly/index.html?from=site';
return 'anomaly/index.html?from=site';
}
function sceneFrameUrl(which){
return which === 'anomaly' ? anomalyUrl() : SCENE3D_URL + '?from=site';
}
var anomalyGate = null;
var anomalyAllowed = false;
function dropAnomalyGate(){
if (anomalyGate && anomalyGate.parentNode) anomalyGate.parentNode.removeChild(anomalyGate);
anomalyGate = null;
}
function showAnomalyGate(){
if (!scene3dBox) return;
dropAnomalyGate();
var wrap = document.createElement('div');
wrap.style.cssText = 'position:absolute;inset:0;z-index:131;display:flex;align-items:center;justify-content:center;' +
'padding:24px;background:rgba(4,6,8,.9)';
var panel = document.createElement('div');
panel.style.cssText = 'max-width:460px;border:1px solid rgba(201,138,63,.38);border-radius:14px;' +
'padding:26px 28px 22px;background:rgba(12,14,17,.94);text-align:left;' +
'box-shadow:0 24px 70px rgba(0,0,0,.65)';
function el(tag, css, text){
var n = document.createElement(tag);
n.style.cssText = css;
if (text) n.textContent = text;
return n;
}
panel.appendChild(el('div', 'font-size:10px;letter-spacing:.2em;color:rgba(201,138,63,.92)', '番外 · 异象之一 · 3D 场景'));
var offline = location.protocol === 'file:';
panel.appendChild(el('div', 'margin-top:12px;font-size:19px;letter-spacing:.02em;color:#f2f4f6',
offline ? '离线打开，这个场景会缺东西' : '这个场景有点重'));
panel.appendChild(el('p', 'margin:12px 0 0;font-size:12.5px;line-height:1.95;color:rgba(216,221,226,.74)',
offline
? '你现在是双击打开的文件，浏览器不允许页面读取本机的模型，房间、蛋糕和杯子会退成方块（旁白、字画、检视图照常）。' +
'想看到完整的旧屋，用线上版，或者在目录里起个本地服务再打开。'
: '房间、道具和几组检视图都要现取，第一次进去可能要等十几秒，网慢的时候更久。' +
'加载过就不再问；不想等的话可以先去读书，这里随时能回来。'));
var row = el('div', 'display:flex;align-items:center;gap:10px;margin-top:20px');
var go = el('button', 'font-family:inherit;font-size:11.5px;letter-spacing:.1em;cursor:pointer;' +
'padding:8px 18px;border-radius:999px;border:1px solid rgba(201,138,63,.85);' +
'background:rgba(201,138,63,.16);color:#f0d3ab', offline ? '仍然试一下' : '▶ 加载 3D');
go.type = 'button';
var no = el('button', 'font-family:inherit;font-size:11.5px;letter-spacing:.1em;cursor:pointer;' +
'padding:8px 16px;border-radius:999px;border:1px solid rgba(179,205,232,.28);' +
'background:transparent;color:rgba(216,221,226,.62)', '先不看');
no.type = 'button';
row.appendChild(go);
row.appendChild(no);
panel.appendChild(row);
panel.appendChild(el('div', 'margin-top:14px;font-size:10.5px;color:rgba(216,221,226,.34)', '按 Esc 也可以退出'));
wrap.appendChild(panel);
scene3dBox.appendChild(wrap);
anomalyGate = wrap;
go.addEventListener('click', function(){
anomalyAllowed = true;
dropAnomalyGate();
showScene('anomaly');
});
no.addEventListener('click', function(){ closeScene3D(); });
}
function showScene(which){
if (!scene3dBox || !scene3dFrame) return;
if (which === 'anomaly' && !anomalyAllowed){
scene3dBox.hidden = false;
document.body.classList.add('scene3d-open');
var h0 = document.getElementById('scene3dHint');
if (h0) h0.textContent = '番外 · 异象之一';
showAnomalyGate();
return;
}
dropAnomalyGate();
const url = sceneFrameUrl(which);
if (scene3dFrame.dataset.which !== which){
scene3dFrame.dataset.which = which;
scene3dFrame.src = url;
}
const hint = document.getElementById('scene3dHint');
if (hint) hint.textContent = which === 'anomaly' ? '番外 · 异象之一' : '第一章 · 序章 · 影子戏';
scene3dBox.hidden = false;
document.body.classList.add('scene3d-open');
}
addEventListener('message', function (e) {
const d = e.data || {};
if (!d || d.type !== 'scene-goto' || typeof d.href !== 'string') return;
const href = d.href;
if (/anomaly\.html/.test(href)) { showScene('anomaly'); return; }
if (/prologue\.html/.test(href)) { showScene('prologue'); return; }
if (/arsenal\.html/.test(href)) { closeScene3D(); location.href = entryHref(); return; }
const m = href.match(/#\d+/);
closeScene3D();
if (m) location.hash = m[0];
});
(function wireScene3D(){
const btn = document.getElementById('scene3dClose');
if (btn) btn.addEventListener('click', closeScene3D);
addEventListener('keydown', e => {
if (e.key === 'Escape' && scene3dBox && !scene3dBox.hidden){ closeScene3D(); e.preventDefault(); }
});
try {
if (/[?&]ch1=3d/.test(location.search)) setTimeout(openScene3D, 400);
} catch (_) {}
})();
chapList.addEventListener('click', e => {
if (chapSuppressAt && performance.now() - chapSuppressAt < 400){ chapSuppressAt = 0; return; }
chapSuppressAt = 0;
const el = e.target.closest('.chap-item');
if (!el) return;
const i = +el.dataset.i;
if (e.target.closest('.play') && hasScene(i)){
chapIdx = i;
if (i === 0) openScene3D(); else showScene('anomaly');
return;
}
if (chapMode === 'scatter' || chapMode === 'row'){ chapIdx = i; setChapMode('detail'); }
else { setChapMode('row'); }
});
$('#chapClose').addEventListener('click', () => setChapMode('scatter'));
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
let lensKey = 'ball';
const wdEl = $('#wd');
if (wdEl) {
Object.keys(nodes).forEach(k => {
const b = document.createElement('button');
b.dataset.k = k;
b.textContent = nodes[k].n;
wdEl.appendChild(b);
});
function setWord(k){
lensKey = k;
const d = nodes[k];
const hyp = HYP[k] || ['无对应候选', '现实中暂无对应机制。', '小说虚构'];
const hasHyp = hyp[0] !== '无对应候选' && hyp[0] !== '无需假说';
$('#wl').className = 'wl' + (hasHyp ? '' : ' two');
const fictionBnd = d.bnd;
wdEl.querySelectorAll('button').forEach(b => b.setAttribute('aria-current', String(b.dataset.k === k)));
const TINT = {
storm:'rgba(60,110,150,.38)', ball:'rgba(70,90,180,.38)', macro:'rgba(120,70,170,.34)',
nucleus:'rgba(90,80,170,.32)', bubble:'rgba(50,120,130,.34)', quantum:'rgba(120,80,160,.32)',
transition:'rgba(60,110,160,.30)', fusion:'rgba(150,60,90,.32)', observer:'rgba(70,90,160,.32)',
rose:'rgba(140,80,140,.32)'
};
const hero = $('#wlHero');
hero.style.setProperty('--tint', TINT[k] || 'rgba(70,90,160,.32)');
const idx = Object.keys(nodes).indexOf(k);
$('#wlIdx').textContent = 'CH.' + String(idx + 1).padStart(2, '0') + '  ·  CONCEPT';
$('#wlName').textContent = d.n;
$('#wlTags').innerHTML = '<span class="chip accent">' + d.sub + '</span>' +
(d.bnd && d.bnd !== d.sub ? '<span class="chip">' + d.bnd + '</span>' : '');
let art = '';
try { art = SCENES[k] ? SCENES[k]() : ''; } catch (e) { art = ''; }
$('#wlArt').innerHTML = art;
let ficHtml = '<ul>';
d.fic.split('；').forEach(x => { if (x.trim()) ficHtml += '<li>' + x.trim() + '</li>'; });
ficHtml += '</ul>';
if (d.q) ficHtml += '<div class="q"><b>原文</b>' + d.q + '</div>';
$('#wl').innerHTML =
'<div class="card wl-card">' +
'<div class="k" style="color:#7fd4ff">现实科学 · REALITY</div>' +
'<h3>' + d.n + '：现实中能说到哪里</h3>' +
'<ul><li>' + d.sci + '</li><li>边界标签：<b>' + d.bnd + '</b></li></ul>' +
'<p class="none" style="margin-top:auto">这一栏只写可核实的内容。</p>' +
'</div>' +
(hasHyp ?
'<div class="card wl-card">' +
'<div class="k" style="color:#ffbd7e">候选假说 · HYPOTHESIS</div>' +
'<h3>' + hyp[0] + '</h3>' +
'<ul><li>' + hyp[1] + '</li></ul>' +
'<p class="none" style="margin-top:auto">假说解释力越强，越要问一句：证据在哪里。</p>' +
'</div>' : '') +
'<div class="card wl-card">' +
'<div class="k" style="color:#ff9ec4">小说设定 · FICTION</div>' +
'<h3>' + d.n + '：小说里它是什么</h3>' +
ficHtml +
'</div>';
setStatus('报告归纳', fictionBnd);
}
wdEl.addEventListener('click', e => {
const b = e.target.closest('[data-k]');
if (b) setWord(b.dataset.k);
});
requestAnimationFrame(() => setWord('ball'));
}
(function bookmark(){
const btn = document.getElementById('markBtn');
const modal = document.getElementById('markModal');
if (!btn || !modal) return;
const QUOTE = '当我走到人生的尽头，当我在弥留之际最后一次睁开眼睛，那时我所有的知性和记忆都消失在过去的深渊中，又回到童年纯真的感觉和梦幻之中，那就是量子玫瑰向我微笑的时候。';
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
function draw(){
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
tracked(g, '球状闪电 · 粒子之间', 0, 0, 3.2, 'left');
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
g.font = '600 92px ' + SERIF;
tracked(g, '球状闪电', M, 246, 2, 'left');
g.fillStyle = rgba(AMBER, .9);
g.fillRect(M, 272, 58, 2);
g.fillStyle = rgba(INK, .74);
g.font = '300 14px ' + SANS;
tracked(g, '粒子之间', M + 2, 316, 8.4, 'left');
g.fillStyle = rgba(AMBER, .55);
g.fillRect(M - 22, 372, 3, 62);
const quote = '当我走到人生的尽头，当我在弥留之际最后一次睁开眼睛，那时我所有的知性和记忆都消失在过去的深渊中，又回到童年纯真的感觉和梦幻之中，那就是量子玫瑰向我微笑的时候。';
g.fillStyle = rgba(INK, .86);
g.font = '300 20px ' + SERIF;
const maxW = 508, lh = 40;
const NO_START = '，。、；：？！）」』】〉》·…—';
let y = 400, line = '';
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
tracked(g, '《球状闪电》尾声 · 刘慈欣', M + 38, y + 50, 1.6, 'left');
const RCX = 456, RCY = 754, RR = 134;
const ground = g.createRadialGradient(RCX, RCY + 96, 0, RCX, RCY + 96, RR * 1.5);
ground.addColorStop(0, 'rgba(120,150,255,.16)');
ground.addColorStop(1, 'rgba(120,150,255,0)');
g.save();
g.translate(RCX, RCY + 96);
g.scale(1, 0.34);
g.translate(-RCX, -(RCY + 96));
g.fillStyle = ground;
g.fillRect(RCX - RR * 1.6, RCY + 96 - RR * 1.6, RR * 3.2, RR * 3.2);
g.restore();
const halo = g.createRadialGradient(RCX, RCY, 0, RCX, RCY, RR * 1.8);
halo.addColorStop(0, 'rgba(120,150,255,.20)');
halo.addColorStop(0.5, 'rgba(100,130,240,.07)');
halo.addColorStop(1, 'rgba(120,150,255,0)');
g.fillStyle = halo;
g.fillRect(RCX - RR * 1.9, RCY - RR * 1.9, RR * 3.8, RR * 3.8);
function dotAt(x, yy, radius, color){
g.beginPath();
g.arc(x, yy, radius, 0, Math.PI * 2);
g.fillStyle = color;
g.fill();
}
const cloud = roseCloud();
const spin = Math.random() * Math.PI * 2;
const tilt = (70 + Math.random() * 14) * Math.PI / 180;
const cs2 = Math.cos(spin), sn2 = Math.sin(spin);
const ct = Math.cos(tilt), st = Math.sin(tilt);
const K = RR * 1.02;
const RM = (typeof window !== 'undefined' && window.__roseM) ? window.__roseM : {};
const gk = Math.max(0, Math.min(1, RM.gone || 0));
const mm = Math.max(0, Math.min(1, RM.morph || 0));
const rPhase = RM.phase || 'idle';
g.save();
g.globalCompositeOperation = 'lighter';
for (let i = 0; i < cloud.n; i++){
const x0 = cloud.xs[i], y0 = cloud.ys[i], z0 = cloud.zs[i];
const x1 = x0 * cs2 + z0 * sn2;
const z1 = -x0 * sn2 + z0 * cs2;
const y2 = y0 * ct - z1 * st;
const d2 = y0 * st + z1 * ct;
const persp = 1 / (1.9 - d2 * 0.55);
const scatter = 1 + gk * 1.45 + mm * 0.18;
const px = RCX + x1 * K * persp * scatter + (Math.random() - 0.5) * gk * RR * 0.75;
const py = RCY + y2 * K * persp * scatter + (Math.random() - 0.5) * gk * RR * 0.75;
const depth = (d2 + 1) / 2;
const fade = (1 - gk * 0.78) * (0.92 + 0.22 * (1 - mm));
dotAt(px, py, (0.7 + Math.random() * 1.15) * (1 + gk * 0.55),
'hsla(' + (206 + Math.round(28 * (1 - depth)) + Math.round(gk * 10)) + ',92%,' +
Math.round(54 + 26 * depth) + '%,' + ((0.09 + 0.42 * depth) * fade).toFixed(3) + ')');
}
for (let i = 0; i < 150; i++){
const t = i / 150;
const ang = spin + t * Math.PI * 6.2;
const r = RR * (0.012 + 0.15 * t);
dotAt(RCX + Math.cos(ang) * r, RCY + Math.sin(ang) * r * 0.96, 0.55 + Math.random() * 1.0,
'hsla(' + (231 + Math.round(Math.random() * 14)) + ',92%,' + (70 + Math.round(Math.random() * 12)) +
'%,' + (0.20 + 0.34 * (1 - t)).toFixed(3) + ')');
}
g.restore();
g.fillStyle = rgba(DIM, .55);
g.font = '9px ' + MONO;
tracked(g, 'OBSERVATION', M, 804, 2.2, 'left');
g.fillStyle = rgba(INK, .52);
g.font = '300 13px ' + SERIF;
g.fillText('注意力转开时出现，', M, 830);
g.fillText('被测量时消失。', M, 852);
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
g.fillText('《球状闪电》 · 序曲 · 影子戏', LM, BH - 150);
g.fillStyle = 'rgba(58,48,36,.30)';
g.font = '300 13px ' + SERIF;
g.fillText('正面是一次观测，反面是一次书写。', LM, BH - 118);
return b.toDataURL('image/png');
}
window.__markBack = drawBack;
let backUrl = null;
btn.addEventListener('click', () => {
const url = draw();
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
a.download = '量子玫瑰书签-' + stamp + '-正面.png';
a.click();
setTimeout(() => {
const b2 = document.createElement('a');
b2.href = backUrl;
b2.download = '量子玫瑰书签-' + stamp + '-反面.png';
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
['球状闪电的硅纳米颗粒氧化假说',
'Abrahamson & Dinniss · Nature · 2000',
'普通闪电击中土壤后可能产生含硅纳米颗粒网络，颗粒在空气中氧化、释放能量并发光。为“闪电—土壤成分—化学反应—能量释放”这条链提供真实科学背景。',
'假说'],
['球状闪电的光学与光谱特征观测',
'Cen、Yuan、Xue · Physical Review Letters · 2014',
'两台无狭缝光谱仪在约 0.9 公里外记录到一个持续约 1.6 秒的球状闪电，光谱中出现硅、铁、钙等土壤相关元素的发射线。',
'单次仪器观测'],
['球状闪电之谜：综述',
'Donoso、Trueba、Rañada · 2006',
'系统梳理目击特征、化学模型、电磁模型、等离子体模型与实验研究，适合用来搭建科普资料框架。',
'综述'],
['球状闪电的相对论微波理论',
'H.-C. Wu · Scientific Reports · 2016',
'闪电可能产生相对论性电子束并激发强微波；微波使空气电离，并可能形成暂时约束微波的等离子体气泡。有理论推导与数值模拟，不代表机制已被证实。',
'理论模拟'],
['球状闪电研究进展',
'Shmatov、Stephan · J. Atmos. Sol.-Terr. Phys. · 2019',
'整理近现代观测、理论模型、实验室模拟、潜在危险与未来研究方向，适合比较不同解释模型。',
'综述'],
['科学家与专业人员观测球状闪电简史',
'A. G. Keul · Hist. Geo- Space Sci. · 2021',
'汇总 1868—2020 年间八个国家的 41 个观测案例，并指出该研究仍受制于观测机会少、仪器记录不足、缺乏统一理论。',
'观测史'],
['通过窗户损伤分析球状闪电的能量与功率',
'K. D. Stephan · 2024',
'讨论目击报告中出现的圆形玻璃损伤，分析玻璃受热损坏所需的物理条件——用于检验一个模型能否解释全部目击特征。',
'单次分析'],
['2014 年山西新绛目击报道',
'《山西日报》· 人民网转载',
'一团红色火球在雷雨期间进入楼道并爆炸，导致五台计算机损坏、无人受伤。新闻记录能提出观察，但不能证明火球的物理性质。',
'新闻记录'],
['2023 年美国蒙大拿影像与 2025 年论文分析',
'雷暴期间拍摄的视频 · 论文分析',
'研究者讨论画面中的发光物体是否符合球状闪电特征。属于待评估的影像证据，不是已经确证的球状闪电。',
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
<circle cx="300" cy="300" r="176" fill="none" stroke="rgba(160,175,255,.16)" stroke-dasharray="3 10" class="fx-spin"/>
<circle cx="300" cy="300" r="116" fill="none" stroke="rgba(160,175,255,.2)"/>
<circle cx="300" cy="300" r="76" fill="rgba(125,140,255,.12)" stroke="rgba(195,208,255,.5)" class="fx-breathe"/>
<circle cx="300" cy="300" r="30" fill="#e6ebff" opacity=".92"/>
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
function setNode(k){
const d = nodes[k];
$$('#cgList [data-node]').forEach(n => n.setAttribute('aria-current', String(n.dataset.node === k)));
$('#nTitle').textContent = d.n;
$('#nSub').textContent = d.sub;
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
$('#zIn').addEventListener('click', () => setZoom(zScale + .2));
$('#zOut').addEventListener('click', () => setZoom(zScale - .2));
$('#zReset').addEventListener('click', () => setZoom(1));
$('#stage').addEventListener('wheel', e => {
e.preventDefault();
setZoom(zScale + (e.deltaY < 0 ? .12 : -.12));
}, { passive: false });
const TUNE = { bright: 100, size: 100, glow: 50, hue: 0, fluct: 100, decay: 160 };
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
TUNE.bright = 100; TUNE.size = 100; TUNE.glow = 50; TUNE.hue = 0; TUNE.fluct = 100; TUNE.decay = 160;
$('#pBright').value = 100; $('#pSize').value = 100; $('#pGlow').value = 50; $('#pHue').value = 0;
if ($('#pFluct')) $('#pFluct').value = 100;
if ($('#pDecay')) $('#pDecay').value = 160;
window.__tuneReady = false;
applyTune();
window.__tuneReady = true;
});
applyTune();
if (innerWidth > 1000) $('#concepts').classList.add('drawer-open');
setNode('ball');
const PAIRS = {
'ball|storm':        ['雷暴', '球状闪电', '【强共振 · 起点触发】自然雷暴中电荷分离诱发高能激发态；主角由此目击超常物理现象，开启终身研究。'],
'ball|macro':        ['球状闪电', '宏电子', '【强共振 · 实体本质】球状闪电被重构为宏观尺度电子的激发态；自此从不可捉摸的谜题转入可收集、储存的人工物理工程。'],
'macro|nucleus':     ['宏电子', '宏原子核', '【强共振 · 复合凝聚】带电宏电子与宏原子核通过未知强相互作用束缚，构成宏观物质单元，形成更稳定的高能基元。'],
'bubble|nucleus':    ['宏原子核', '空泡', '【强共振 · 几何屏蔽】空泡构成基态宏结构的相干保护壳，隔绝常规物质电磁撞击，赋予其穿透与平稳运动特性。'],
'bubble|quantum':    ['空泡', '量子态', '【强共振 · 宏观相干】低能态空泡接入量子概率诠释：未受观测时弥散为空间概率云，测量瞬间发生宏观定态坍缩。'],
'fusion|nucleus':    ['宏原子核', '宏聚变', '【强共振 · 终极释放】宏原子核达到临界相撞速度引发宏聚变，选择性释放极高能谱，科学理论彻底转变为战场武器。'],
'observer|rose':     ['观察者', '量子玫瑰', '【强共振 · 哲学坍缩】观察者的注视促使现实定态；移开目光时，私人情感与量子不确定性在幽蓝玫瑰中重归叠加。'],
'quantum|transition':['量子态', '量子跃迁', '【强共振 · 能态本真】微观量子跃迁被放大至宏观尺度；看似连续漂移的光球，微观上是一连串非定域瞬时跃迁。'],
'bubble|macro':      ['宏电子', '空泡', '【强共振 · 态相转换】空泡即宏电子处于未激发的超导基态；两者互为低能容纳与高能释放的对应物理态。'],
'ball|bubble':       ['球状闪电', '空泡', '【强共振 · 激发相变】雷电或强能量注入透明空泡，瞬间激发表层等离子体鞘层，低能空泡点燃为炽热的球状闪电。'],
'observer|quantum':  ['观察者', '量子态', '【强共振 · 测量假说】摄像机与人类视线同为测量系统；观察者的介入导致广延波函数瞬时向某一确定本征态收缩。'],
'ball|fusion':       ['球状闪电', '宏聚变', '【强共振 · 毁伤升级】从单一目标的分子键选择性解离，指数级跃迁至全局能量网络湮灭的宏聚变打击。'],
'macro|storm':       ['雷暴', '宏电子', '【强共振 · 自然孕育】天地雷暴不仅是背景，更是天然粒子加速腔，在云层间自然激发悬浮的基态宏电子。'],
'macro|transition':  ['宏电子', '量子跃迁', '【强共振 · 轨迹异动】宏电子在三维空间中表现出的诡异反惯性折线漂移，源自其本征的宏观量子跃迁机制。'],
'ball|transition':   ['球状闪电', '量子跃迁', '【强共振 · 表观运动】肉眼观察到的球状闪电连续飘行动线，实质是宏观空间位置的一连串非连续量子跃迁。'],
'ball|observer':     ['球状闪电', '观察者', '【强共振 · 定态显现】球状闪电的释放与轨迹依存于观察者的物理在场，测量界定了宏观波函数的定态呈现。'],
'macro|quantum':     ['宏电子', '量子态', '【强共振 · 波粒象性】宏电子在未激发状态下表现出显著的宏观波包弥散，在空间各点以概率幅形式存在。'],
'quantum|rose':      ['量子态', '量子玫瑰', '【强共振 · 宏观叠加】量子玫瑰是宏观量子态最极致的文学隐喻，只有未被观察者注视时，花朵才以概率波绽放。'],
'fusion|transition': ['宏聚变', '量子跃迁', '【强共振 · 能级雪崩】宏聚变链式反应的实质是大量宏原子核伴随高能态向极低基态的大规模量子雪崩跃迁。']
};
const CONCEPT_GRAPH = {
storm:      { ball: '激发·目击', macro: '自然激发' },
ball:       { storm: '逆向溯源', macro: '微观结构', bubble: '激发释放', fusion: '武器演进', transition: '空间跃迁', observer: '定态呈现' },
macro:      { ball: '激发态', storm: '被激发', nucleus: '构成核外层', bubble: '基态容纳', quantum: '波粒表征', transition: '轨迹异动' },
nucleus:    { macro: '捕获约束', bubble: '外壳稳定', fusion: '临界相撞' },
bubble:     { macro: '包裹基态', nucleus: '几何约束', ball: '激发释放', quantum: '超导边界' },
quantum:    { macro: '概率本性', bubble: '宏观相干', transition: '能级变迁', observer: '测量坍缩', rose: '宏观叠加' },
transition: { ball: '表观运动', macro: '空间瞬移', quantum: '非连续跳跃', fusion: '激发释放' },
fusion:     { nucleus: '高能聚合', ball: '武器终局', transition: '雪崩释放' },
observer:   { quantum: '波包坍缩', rose: '心智映射', ball: '定态呈现' },
rose:       { observer: '消退显现', quantum: '纯粹叠加' }
};
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
const verdict = pair ? pair.verdict : 'no';
const verdictLabel = verdict === 'partial' ? '部分成立' : '不成';
const gapTpl = pair ? pair.gap : (REALITY.fallbackGap || '现实里这两个概念没有已知的直接联系。');
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
if (path && path.length > 2) {
cls = 'ok chain-out';
const flowSteps = path.map(id => nodes[id].n).join(' → ');
midNames = path.slice(1, -1).map(id => nodes[id].n).join('、');
flow = '【拓扑推演回路】' + flowSteps;
fic = '通过中介物理态 「' + midNames + '」 形成间接因果链，两股理论参数跨域耦合。';
triggerStageResonance(combo.a, combo.b, false, path);
} else {
cls = 'no';
flow = nodes[combo.a].n + '　·　' + nodes[combo.b].n;
fic = '【退相干态】能级跨度或理论维度不同，未能在宏观尺度形成共振波导。';
}
}
const rl = realityLayer(ids, key, midNames);
out.className = 'combo-out ' + cls + (rlOpen ? ' rl-open' : '');
out.innerHTML = '<span class="co-top"><span class="flow">' + flow + '</span>' + rl.tools + '</span>' +
'<span class="co-fic">' + fic + '</span>' + rl.panel;
} else {
rlOpen = false;
out.className = 'combo-out no';
out.textContent = '放入两个概念启动对撞台：直接耦合触发共振，间接关联激活因果推演。';
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
'十四岁生日那夜，父母被球状闪电烧成灰，他活了下来。此后一生都在追这颗球。'],
idq:{p:17, w:'我', t:'那个蛋糕上应该只插一根蜡烛，哦不，一根都不插，那是我的新生之夜'},
dir:['球状闪电的物理结构：不是被造出来，而是自然界早已存在的结构',
'宏电子与空泡的探测、捕获与储存',
'宏聚变的武器化，以及它带来的系统毁伤'],
story:[['序曲','十四岁生日夜，一颗球状闪电进到屋里，父母在他眼前化为灰烬，他活了下来。'],
['大学','选大气电学专业，跟张彬去云南做雷电统计，第一次看到球状闪电留下的痕迹。'],
['博士','导师高波，用数学模型逼近球状闪电；模型一个接一个失败。'],
['基地','捕获到一个宏电子，丁仪给出量子解释；此后是武器化。'],
['战争','球状闪电被装上舰载武器，宏聚变在戈壁上空升起一颗蓝太阳。'],
['尾声','林云消失。他活下来，结婚，重新过普通人的日子——只有那朵玫瑰留了下来。']],
rel:[['parents','目击 · 父母死亡'],['zhang','学术启蒙'],['zhao','野外观测'],['gao','博士导师'],['ding','理论合作'],['lin','项目协作'],['jiang','战场行动'],['dai','大学同学 → 妻子'],['parker','战后 · 观察者']],
con:['ball','macro','bubble','rose'],
idx:[{p:13,w:'我',t:'今天是我的生日，直到晚上爸爸妈妈点上了生日蛋糕的蜡烛，我们三个围着十四个小火苗坐下来，我才想起这事。'},
{p:16,w:'我',t:'我知道，在火葬厂的炉子中，要把人体完全化为灰烬，要在两千度的高温下烧三十分钟，所以这是梦。'},
{p:17,w:'我',t:'那个蛋糕上应该只插一根蜡烛，哦不，一根都不插，那是我的新生之夜'}] },
{ id:'parents', no:'02', name:'父母', rm:'THE PARENTS', tag:'童年雷雨夜', role:'故事起点 · 目击者的失去', seal:'父', hue:212,
idn:['全书中没有名字，只以「爸爸」「妈妈」出现。',
'他们的死是整本书的起点：一道球状闪电穿过房间，把人烧成灰，却让身下的板凳完好、冰凉。'],
idq:{p:14, w:'我', t:'平时成天忙碌的爸爸妈妈这时都变成了哲学家，倒好像这是他们在过生日。'},
dir:['（没有研究方向）他们只出现在序曲的一夜。',
'留下的线索是那条选择性燃烧的痕迹：人成灰，板凳冰凉，旁边的书只烧掉一部分。',
'这条痕迹后来变成了主角一生的谜题，也变成了张彬相册里最要紧的一页。'],
story:[['序曲','十四岁生日夜，雷雨中一道球状闪电进到屋里，父母当场化为灰烬。'],
['序曲','身下的板凳却是奇迹般的冰凉——烧人不烧物，这个细节成了全书的第一条线索。'],
['尾声','多年后那间屋子还在，桌子还在，椅子还在。']],
rel:[['main','儿子 · 唯一目击者']],
con:['storm','ball'],
idx:[{p:13,w:'我',t:'这是个雷雨之夜'},
{p:14,w:'我',t:'平时成天忙碌的爸爸妈妈这时都变成了哲学家，倒好像这是他们在过生日。'}] },
{ id:'zhang', no:'03', name:'张彬', rm:'ZHANG BIN', tag:'大气电学 · 观测', role:'启蒙者 · 把目击变成证据', seal:'张', hue:232,
idn:['主角大学时的大气电学副教授，五十岁左右，「那种最一般的人」。',
'他有一本没给别人看过的相册：球状闪电穿过房间之后留下的痕迹。他把它交了出来。'],
idq:{p:46, w:'张彬', t:'你能相信吗？我没把这东西给别人看过，因为他们肯定会认为这是伪造的。'},
dir:['雷电观测与大气电学的工程化',
'把「目击」变成「证据」：痕迹、相册、旧计算稿',
'在基础理论的框架里做推演，也承认这个框架的边界'],
story:[['大学','讲大气电学的副教授；带主角去云南做雷电统计。'],
['大学','给主角看他藏了多年的相册：球状闪电留下的痕迹。'],
['大学','反对主角把球状闪电作为硕士论文课题：「年轻人不应热衷于一些虚无缥缈的东西。」'],
['基地','球状闪电武器测试时他还在场，说这次可能真的要再次看到它了。']],
rel:[['main','学生 → 同行'],['zhao','研究生']],
con:['storm','ball'],
idx:[{p:24,w:'叙述',t:'讲大气电学的是一名叫张彬的副教授'},
{p:46,w:'张彬',t:'你能相信吗？我没把这东西给别人看过，因为他们肯定会认为这是伪造的。'},
{p:136,w:'张彬',t:'我们都是凡人，虽然我们用超过常人的努力去探询，可我们还是凡人，只能在基础理论提供的框架中进行推演，不可能越雷池半步'}] },
{ id:'zhao', no:'04', name:'赵雨', rm:'ZHAO YU', tag:'野外观测 · 学生', role:'现场的普通人视角', seal:'赵', hue:204,
idn:['张彬的研究生，跟主角同一组去云南做雷电统计。',
'在球状闪电这件事上，他代表「这跟我没关系」的那一面：能自圆其说，就够了。'],
idq:{p:29, w:'赵雨', t:'很完美的，那些等离子体啦孤立子－谐振腔啦能告诉你的东西也不见得比这个学说多。'},
dir:['雷电野外观测的日常执行',
'对「解释」保持一种很健康的怀疑：能自圆其说，不等于是对的'],
story:[['大学','随张彬和主角去云南做雷电统计，住县里的气象站。'],
['大学','当地人早就见惯球状闪电，管它叫「鬼魂的灯笼」。'],
['大学','在泰山气象站，他从炊事员老王嘴里问出了张彬的旧事。']],
rel:[['zhang','研究生导师'],['main','同组观测']],
con:['storm','ball'],
idx:[{p:28,w:'叙述',t:'我所在的这一组除了司机和实验工，正式成员只有三个人：我、张彬和他的一个叫赵雨的研究生。'},
{p:29,w:'赵雨',t:'很完美的，那些等离子体啦孤立子－谐振腔啦能告诉你的东西也不见得比这个学说多。'}] },
{ id:'gao', no:'05', name:'高波', rm:'GAO BO', tag:'数学模型 · 导师', role:'把现象算成方程', seal:'高', hue:240,
idn:['主角的博士导师，麻省理工的博士，外号「火球」。',
'他和张彬正好是两个极端：一个靠现场与痕迹，一个靠模型与计算。'],
idq:{p:33, w:'我', t:'我的博士导师名叫高波，牌子很硬，是麻省理工的博士。'},
dir:['雷电定位系统的工程实现',
'用数学模型逼近球状闪电的结构',
'把军用技术转民用：龙卷风预报、空泡探测'],
story:[['博士','收主角做博士生，先让他做雷电定位系统。'],
['博士','提醒主角：这东西的性质决定了它最后会和武器有关系。'],
['尾声','战后把空泡探测系统转为民用，让主角去做龙卷风预报。']],
rel:[['main','博士生'],['zhang','两条路：现场 vs 模型']],
con:['storm','ball','bubble'],
idx:[{p:33,w:'我',t:'我的博士导师名叫高波，牌子很硬，是麻省理工的博士。'},
{p:33,w:'我',t:'这人首先吸引我注意的是他那个外号：火球。'},
{p:72,w:'高波',t:'球状闪电的性质决定了它的研究最后肯定会和武器有关系，你信誓旦旦要追求一生的东西就这么抛弃了？'}] },
{ id:'lin', no:'06', name:'林云', rm:'LIN YUN', tag:'少校 · 装备与作战', role:'把研究翻译成装备的人', seal:'林', hue:268,
idn:['新概念武器研究中心系统评价二部的少校，球状闪电武器项目的实际推动者。林将军的女儿。',
'她关心的是「这东西能不能变成武器」——从第一次见面到最后一次，这一点没有变过。'],
idq:{p:57, w:'我', t:'当身着少校军装的她带着灿烂的笑容向我走来时，一种超越时尚的美令我怦然心动'},
dir:['新概念武器的系统评价',
'球状闪电的武器化：机载、舰载、部署',
'宏聚变武器的工程实现'],
story:[['大学','在系统评价二部第一次见面，她给主角看了那些「新概念武器」的样品。'],
['西伯利亚','和主角一起去见格莫夫，看 1962 年的球状闪电实验记录。'],
['基地','推动球状闪电武器项目；父亲请主角在项目里「监督」她。'],
['战争','珠峰号被击沉、江星辰阵亡之后，她越来越脆弱。'],
['尾声','宏聚变的那一夜，她的身体变得透明，量子态的林云消失了。']],
rel:[['main','项目协作'],['ding','理论 → 武器化'],['jiang','恋人']],
con:['ball','fusion','observer'],
idx:[{p:57,w:'我',t:'当身着少校军装的她带着灿烂的笑容向我走来时，一种超越时尚的美令我怦然心动'},
{p:118,w:'林将军',t:'他是我给小云选的。'},
{p:280,w:'叙述',t:'她的身体开始变得透明，很快变成一个晶莹的影子，然后，量子态的林云消失了。'}] },
{ id:'jiang', no:'07', name:'江星辰', rm:'JIANG XINGCHEN', tag:'海军上校 · 珠峰号', role:'另一条路上的人', seal:'江', hue:198,
idn:['海军上校，珠峰号舰长。林云办公桌照片上的那个人。',
'他代表军队里身体力行的另一面，也是主角始终无法成为的那种人。'],
idq:{p:78, w:'林云', t:'江星辰，珠峰号舰长。'},
dir:['水面舰艇指挥',
'与球状闪电研究没有工作交集——这正是林将军那句话的弦外之音'],
story:[['基地','第一次见面在海上；他把主角带到甲板上看海。'],
['基地','带主角出海，在小岛上目睹龙卷风；劝主角回到项目里。'],
['战争','珠峰号被击沉，他在舰上阵亡。']],
rel:[['lin','恋人'],['main','劝他回项目']],
con:['ball'],
idx:[{p:78,w:'林云',t:'江星辰，珠峰号舰长。'},
{p:107,w:'江星辰',t:'你退出球状闪电研究项目，林云很难过，这个项目确实离不开你，所以我自告奋勇地来劝你回去，并对林云保证我能成功。'},
{p:212,w:'叙述',t:'珠峰号的主甲板折断，半小时后沉没，包括舰长在内的两千多名官兵阵亡。'}] },
{ id:'ding', no:'08', name:'丁仪', rm:'DING YI', tag:'理论物理 · 量子解释', role:'给出解释的人', seal:'丁', hue:252,
idn:['理论物理学家，书中称他是「国内理论物理的顶峰人物」。',
'宏电子、宏原子核、量子态与观察者——球状闪电能被想明白的那一半，是他给的。'],
idq:{p:161, w:'丁仪', t:'是自由电子呢，还是一个宏原子中的电子？如果是后者，那这个宏原子的原子核在哪里呢？'},
dir:['宏电子与宏原子核的结构',
'量子态的坍缩与观察者',
'「超级观察者」的可能性'],
story:[['基地','第一次看到捕获的空泡，提出宏电子与宏原子核的问题。'],
['基地','指出球状闪电的飘行其实是不断的量子跃迁。'],
['基地','做观察者实验：去掉观察者，命中率只剩十分之一。'],
['尾声','战后被帕克找上门：怎么让球状闪电在没有观察者时也保持坍缩。']],
rel:[['main','理论合作'],['lin','理论 → 武器化'],['parker','超级观察者']],
con:['nucleus','quantum','observer','transition'],
idx:[{p:161,w:'丁仪',t:'是自由电子呢，还是一个宏原子中的电子？如果是后者，那这个宏原子的原子核在哪里呢？'},
{p:176,w:'丁仪',t:'摄像机也是观察者，同样会引起量子态的坍缩。'},
{p:177,w:'叙述',t:'对目标的命中率只及存在观察者时的十分之一。'}] },
{ id:'dai', no:'09', name:'戴琳', rm:'DAI LIN', tag:'日常生活 · 婚姻', role:'他必须回去的那个世界', seal:'戴', hue:320,
idn:['大学同班同学。深夜的图书馆里，她问过主角在找什么。',
'战后她和主角结婚。她看得见主角在跟谁说话，却看不见那朵玫瑰。'],
idq:{p:19, w:'我', t:'但看到桌对面坐着一个本班叫戴琳的漂亮女生，她面前没有书，只是用双手撑着脑袋看着我。'},
dir:['（没有研究方向）她的位置是「日常」：战争结束后，人得重新学会过普通日子。',
'她与主角之间那道裂痕，来自一件她无法验证的东西：一朵看不见的玫瑰。'],
story:[['大学','深夜图书馆，她问主角：你很有目的性，你在找什么？'],
['尾声','战后重逢，两个月后两人结婚。'],
['尾声','她坚持要知道那朵「想象中的玫瑰」是谁插的——这成了他们之间的裂痕。']],
rel:[['main','大学同学 → 妻子']],
con:['rose','observer'],
idx:[{p:19,w:'我',t:'但看到桌对面坐着一个本班叫戴琳的漂亮女生，她面前没有书，只是用双手撑着脑袋看着我。'},
{p:283,w:'我',t:'量子玫瑰两个月后，我和戴琳结婚了。'},
{p:289,w:'戴琳',t:'你一定要告诉我那朵想像中的玫瑰是想像中的谁插上的，否则我没法忍受！'}] },
{ id:'parker', no:'10', name:'帕克', rm:'NORTON PARKER', tag:'SETI · 观察者', role:'把问题推到最后一步的人', seal:'帕', hue:186,
idn:['诺顿·帕克，天文学家，SETI@home 项目主管。',
'战后他亲自找上门，要验证一个猜想：这世界上存在一个「超级观察者」。'],
idq:{p:284, w:'帕克', t:'我们正在寻找和观察球状闪电的这样一种现象：当没有观察者时，它们仍保持坍缩状态而非量子态。'},
dir:['SETI：寻找外星文明',
'用球状闪电检验「超级观察者」',
'把球状闪电研究带出战争语境'],
story:[['大学','主角拿 SETI@home 的计算资源算球状闪电模型；那份工作的主管署名帕克。'],
['尾声','战后亲自来访，提出超级观察者的实验。'],
['尾声','「如果早些发现那个超级观察者，这场战争也许就能避免了。」']],
rel:[['main','战后 · 观察者'],['ding','请教理论']],
con:['observer','quantum'],
idx:[{p:83,w:'帕克',t:'SETI@home项目主管诺顿·帕克'},
{p:284,w:'帕克',t:'我们正在寻找和观察球状闪电的这样一种现象：当没有观察者时，它们仍保持坍缩状态而非量子态。'},
{p:285,w:'帕克',t:'如果真的能证明存在一个超级观察者在观察着我们的世界，那人类的行为就检点多了'}] }
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
const HEAD_MODELS = {
male: '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',
female: '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'
};
const SECS = ['人物身份', '研究方向', '故事发展', '人物关系', '关联概念', '原著索引'];
const TERM_STATUS = {
main:['在研',''], parents:['已故','dead'], zhang:['在档',''], zhao:['在档',''], gao:['在档',''],
lin:['量子态','void'], jiang:['殉职','dead'], ding:['在研',''], dai:['在档',''], parker:['境外','away']
};
const TERM_RING = ['parents','dai','parker','jiang','lin','ding','zhao','gao','zhang'];
const TERM_EDGES = [
['main','parents','目击 · 父母死亡'], ['main','dai','大学同学 → 妻子'], ['main','zhang','学术启蒙'],
['main','gao','博士导师'], ['main','zhao','观测线索'], ['main','ding','理论合作'], ['main','lin','项目协作'],
['main','jiang','战场行动'], ['main','parker','战后 · 观察者'], ['ding','lin','理论 → 武器化'], ['lin','jiang','部署 → 行动']
];
(function(){
const xe = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
const byId = id => ARCH.find(x => x.id === id);
const termEl = document.getElementById('term');
const listEl = document.getElementById('termList');
const svg = document.getElementById('termSvg');
const readEl = document.getElementById('termRead');
const folderEl = document.getElementById('holoFolder');
const badgeEl = document.getElementById('badge');
const dosEl = document.getElementById('dos');
const dosHead = document.getElementById('dosHead');
const dosTabs = document.getElementById('dosTabs');
const dosBody = document.getElementById('dosBody');
const peopleEl = document.getElementById('people');
if (!termEl || !svg) return;
const S = { phase: 'idle', pid: null, tab: 0, opens: 0 };
const setPhase = p => { S.phase = p; termEl.dataset.phase = p; if (window.__syncHash) window.__syncHash(); };
function emblem(i){
const N = 7 + (i % 5), R1 = 21, R2 = 31;
let tick = '';
for (let k = 0; k < N; k++){
const t = k / N * 6.283 - 1.57;
tick += '<line x1="' + (50 + Math.cos(t) * R1).toFixed(1) + '" y1="' + (50 + Math.sin(t) * R1).toFixed(1) +
'" x2="' + (50 + Math.cos(t) * R2).toFixed(1) + '" y2="' + (50 + Math.sin(t) * R2).toFixed(1) + '"/>';
}
return '<svg viewBox="0 0 100 100" aria-hidden="true">' +
'<circle cx="50" cy="50" r="35"/><circle cx="50" cy="50" r="27" stroke-dasharray="2 5"/>' +
'<g>' + tick + '</g><circle cx="50" cy="50" r="12"/><circle cx="50" cy="50" r="2.6" class="dot"/></svg>';
}
function barcode(seed){
let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
let s = '';
for (let k = 0; k < 38; k++){ h = (h * 1103515245 + 12345) >>> 0; s += '<i style="width:' + (1 + (h >> 16) % 3) + 'px;margin-right:' + ((h >> 8) % 2) + 'px"></i>'; }
return s;
}
const st = id => TERM_STATUS[id] || ['在档', ''];
listEl.innerHTML = ARCH.map(p =>
'<button class="tl-i" data-pid="' + p.id + '" aria-label="调出 ' + xe(p.name) + ' 的档案">' +
'<span class="tl-no">' + p.no + '</span>' +
'<span><span class="tl-n">' + xe(p.name) + '</span><span class="tl-r">' + xe(p.role) + '</span></span>' +
'<span class="tl-s ' + st(p.id)[1] + '">' + st(p.id)[0] + '</span>' +
'</button>').join('');
const NS = 'http://www.w3.org/2000/svg';
let G = { nodes: {}, edges: [] };
function el(tag, attrs, parent){ const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
function buildGraph(){
const narrow = innerWidth <= 1000;
const W = narrow ? 600 : 800, H = narrow ? 640 : 600;
const cx = W / 2, cy = H / 2, rx = narrow ? 222 : 292, ry = narrow ? 236 : 214;
const R = narrow ? 46 : 38, RM = narrow ? 60 : 52, F = narrow ? 22 : 15;
svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
svg.innerHTML = '';
G = { nodes: {}, edges: [] };
el('ellipse', { cx, cy, rx, ry, class: 'orbit' }, svg);
el('ellipse', { cx, cy, rx: rx * .55, ry: ry * .55, class: 'orbit o2' }, svg);
const pos = { main: { x: cx, y: cy, r: RM } };
TERM_RING.forEach((id, i) => {
const t = (-90 + i * 40) * Math.PI / 180;
pos[id] = { x: cx + Math.cos(t) * rx, y: cy + Math.sin(t) * ry, r: R };
});
const eg = el('g', {}, svg), lg = el('g', {}, svg), ng = el('g', {}, svg);
TERM_EDGES.forEach(e => {
const a = pos[e[0]], b = pos[e[1]]; if (!a || !b) return;
const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
const line = el('line', { x1: (a.x + ux * (a.r + 6)).toFixed(1), y1: (a.y + uy * (a.r + 6)).toFixed(1),
x2: (b.x - ux * (b.r + 6)).toFixed(1), y2: (b.y - uy * (b.r + 6)).toFixed(1), class: 'tedge' }, eg);
const label = el('text', { x: (a.x + dx * .5).toFixed(1), y: (a.y + dy * .5 - 6).toFixed(1), class: 'tlabel', 'font-size': narrow ? 17 : 11 }, lg);
label.textContent = e[2];
G.edges.push({ a: e[0], b: e[1], line, label });
});
ARCH.forEach(p => {
const o = pos[p.id]; if (!o) return;
const g = el('g', { class: 'tnode', 'data-pid': p.id, tabindex: '0', role: 'button',
'aria-label': p.name + ' · ' + p.role + '，按回车调出档案' }, ng);
el('circle', { cx: o.x, cy: o.y, r: o.r + 8, class: 'ring' }, g);
el('circle', { cx: o.x, cy: o.y, r: o.r, class: 'halo' }, g);
el('circle', { cx: o.x, cy: o.y, r: o.r * .7, class: 'core' }, g);
const no = el('text', { x: o.x, y: o.y - o.r * .2, class: 'no', 'font-size': F * .62 }, g); no.textContent = p.no;
const nm = el('text', { x: o.x, y: o.y + F * .55, 'font-size': p.id === 'main' ? F * 1.15 : F }, g); nm.textContent = p.name;
const rl = el('text', { x: o.x, y: o.y + o.r + F + 2, class: 'rl', 'font-size': F * .7 }, g); rl.textContent = p.tag.split(' · ')[0];
G.nodes[p.id] = g;
});
paint();
}
let hot = null;
function paint(){
const focus = hot || S.pid;
Object.entries(G.nodes).forEach(([id, g]) => {
g.classList.toggle('sel', id === S.pid);
g.classList.toggle('hot', id === hot);
const linked = !focus || id === focus || G.edges.some(e => (e.a === focus && e.b === id) || (e.b === focus && e.a === id));
g.classList.toggle('dim', !linked);
});
G.edges.forEach(e => {
const on = !!focus && (e.a === focus || e.b === focus);
e.line.classList.toggle('lit', on); e.label.classList.toggle('lit', on);
e.line.classList.toggle('dim', !!focus && !on);
});
listEl.querySelectorAll('.tl-i').forEach(b => {
b.classList.toggle('sel', b.dataset.pid === S.pid);
b.classList.toggle('hot', b.dataset.pid === hot);
});
}
function setHot(id){ if (hot === id) return; hot = id; paint(); }
const nQuote = ARCH.reduce((n, p) => n + p.idx.length + 1, 0);
readEl.innerHTML = '<span>人员<b>' + ARCH.length + '</b></span><span>关系<b>' + TERM_EDGES.length + '</b></span>' +
'<span>原文引文<b>' + nQuote + '</b></span><span>证据<b>逐字 · 标页码</b></span>' +
'<span class="kb"><kbd>↑</kbd><kbd>↓</kbd> 选人 <kbd>Enter</kbd> 调档 <kbd>Esc</kbd> 退出</span>';
const SHUF_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$&*()-_+=/[]{};:<>';
let shufCur = null, shufRaf = 0, shufTimer = 0;
function shufRestore(){
if (shufTimer){ clearTimeout(shufTimer); shufTimer = 0; }
if (shufRaf){ cancelAnimationFrame(shufRaf); shufRaf = 0; }
const cur = shufCur; shufCur = null;
if (cur && cur.el) cur.el.textContent = cur.real;
}
function shufPlay(el){
if (!el) return;
const real = el.textContent;
shufRestore();
if (!real || document.hidden) return;
if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
const chars = Array.from(real), n = chars.length;
if (n > 12) return;
const mid = (n - 1) / 2;
const cells = [];
el.textContent = '';
chars.forEach(function(ch, i){
const s = document.createElement('span');
s.textContent = ch;
s.style.display = 'inline-block';
s.style.minWidth = '1em';
s.style.textAlign = 'center';
el.appendChild(s);
cells.push({ el: s, ch: ch, dist: mid ? Math.abs(i - mid) / mid : 0 });
});
const t0 = performance.now(), dur = 240;
shufCur = { el: el, real: real, cells: cells };
shufTimer = setTimeout(shufRestore, dur + 120);   /* 兜底：不依赖 rAF 也能还原 */
(function tick(){
if (!shufCur || shufCur.el !== el) return;
const t = (performance.now() - t0) / dur;
if (t >= 1){ shufRestore(); return; }
for (let i = 0; i < cells.length; i++){
const c = cells[i];
const end = 0.60 + (1 - c.dist) * 0.34;   /* 边缘先落定，中心最后收 */
c.el.textContent = t < end ? SHUF_POOL[(Math.random() * SHUF_POOL.length) | 0] : c.ch;
}
shufRaf = requestAnimationFrame(tick);
})();
}
function renderFolder(p){
const s = st(p.id);
const stEl = document.getElementById('scanStatus');
if (stEl) stEl.textContent = s[0];
const noEl = document.getElementById('scanNo');
if (noEl) noEl.textContent = 'BL-P' + p.no;
folderEl.innerHTML =
'<p class="ov-k">SUBJECT OVERVIEW</p>' +
'<h3 class="hf-name">' + xe(p.name) + '</h3>' +
'<p class="hf-rm">' + xe(p.rm) + ' · ' + xe(p.tag) + '</p>' +
'<div class="ov-idn">' + p.idn.map(function(t, i){ return '<p class="ov-p' + (i ? ' dim' : '') + '">' + xe(t) + '</p>'; }).join('') + '</div>' +
'<button class="ov-dos" type="button" data-act="expand">' +
'<i class="ov-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2.5h9A1.5 1.5 0 0 1 21 10v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18z"/></svg></i>' +
'<span class="ov-dos-k"><b>PERSONNEL DOSSIER</b><i>CLASSIFIED · FILE ' + p.no + '</i></span>' +
'<span class="ov-dos-n">人物档案文件夹</span>' +
'<span class="ov-dos-go">点击展开完整档案 →</span>' +
'</button>' +
'<blockquote class="hf-q">“' + xe(p.idq.t) + '”<i>原文 P' + p.idq.p + '</i></blockquote>' +
'<p class="hf-note">研究方向、关系为报告归纳；引文逐字取自正文。</p>' +
'<div class="hf-act"><button class="hf-btn ghost" data-act="close">返回终端</button></div>';
shufPlay(folderEl.querySelector('.hf-name'));
}
function renderBadge(p){
badgeEl.style.setProperty('--hue', p.hue);
badgeEl.innerHTML =
'<i class="bg-strap"></i><i class="bg-clip"></i>' +
'<div class="bg-card"><i class="bg-slot"></i>' +
'<div class="bg-org"><b>球状闪电研究</b><i>BL-P' + p.no + '</i></div>' +
'<div class="bg-photo">' +
(PORTRAITS[p.id]
? '<img class="bg-portrait" alt="" src="' + PORTRAITS[p.id] + '">'
: emblem(ARCH.indexOf(p))) +
'<em>' + (PORTRAITS[p.id] ? '档案照 · AI生成' : '纹章 · 非肖像') + '</em></div>' +
'<p class="bg-name">' + xe(p.name) + '</p>' +
'<p class="bg-rm">' + xe(p.rm) + '</p>' +
'<div class="bg-row"><span>编号</span><b>' + p.no + '</b></div>' +
'<div class="bg-row"><span>状态</span><b>' + st(p.id)[0] + '</b></div>' +
'<div class="bg-bar">' + barcode('BL' + p.no + p.id) + '</div>' +
'<i class="bg-holo"></i>' +
'</div>';
}
function quoteBlock(q){
return '<blockquote class="pg-q">“' + xe(q.t) + '”<i>P' + q.p + (q.w ? ' · ' + xe(q.w) : '') + '</i></blockquote>';
}
function secHtml(k, p){
const head = '<p class="pg-k"><b>' + String(k + 1).padStart(2, '0') + '</b>' + SECS[k] + '</p>';
if (k === 0){
const shot = PORTRAITS[p.id];
return head +
'<div class="pg-idn">' +
'<div class="pg-seal' + (shot ? ' pg-seal-photo' : '') + '" style="--hue:' + p.hue + '">' +
(shot
? '<img class="pg-portrait" alt="" src="' + shot + '">'
: emblem(ARCH.indexOf(p)) + '<span>' + xe(p.seal) + '</span>') +
'<i>NO.' + p.no + '</i></div>' +
'<div class="pg-idn-t"><h3>' + xe(p.name) + '</h3><p class="pg-rm">' + xe(p.rm) + '</p>' +
'<p class="pg-role">' + xe(p.role) + '</p>' +
'<p class="pg-tagline">' + xe(p.tag) + '</p>' +
p.idn.map(t => '<p class="pg-p">' + xe(t) + '</p>').join('') +
'</div>' +
'</div>' + quoteBlock(p.idq);
}
if (k === 1){
return head + '<ul class="pg-list">' + p.dir.map(t => '<li>' + xe(t) + '</li>').join('') + '</ul>' +
'<p class="pg-src">报告归纳 · 不是原著原话</p>' +
'<p class="pg-k pg-k2"><b>·</b>在故事里的功能</p>' +
'<p class="pg-p">' + xe(p.role) + '。这一栏写的是他在球状闪电这条线上承担什么，而不是性格评价。</p>';
}
if (k === 2){
return head + '<ol class="pg-tl">' + p.story.map(it =>
'<li><span class="pg-st">' + xe(it[0]) + '</span><p>' + xe(it[1]) + '</p></li>').join('') + '</ol>' +
'<p class="pg-src">报告归纳 · 情节按书里顺序，页码见「原著索引」</p>';
}
if (k === 3){
return head + '<div class="pg-rel">' + p.rel.map(r => {
const o = byId(r[0]);
return o ? '<button data-open="' + o.id + '"><b>' + xe(o.name) + '</b><span>' + xe(r[1]) + '</span><i>NO.' + o.no + '</i></button>' : '';
}).join('') + '</div>' +
'<p class="pg-hint">点名字，直接调出那个人的档案。</p>' +
'<p class="pg-src">关系取自研究报告的归纳，不是原著原话</p>';
}
if (k === 4){
return head + '<div class="pg-con">' + p.con.map(key => {
const c = (typeof nodes !== 'undefined' && nodes[key]) || null;
if (!c) return '';
return '<button data-concept="' + key + '"><b>' + xe(c.n) + '</b><span>' + xe(c.sub) + '</span><i>' + xe(c.bnd) + '</i></button>';
}).join('') + '</div>' +
'<p class="pg-hint">点概念，跳到 03 屏看它所在的粒子场景。</p>';
}
return head + '<ul class="pg-idx">' + p.idx.map(q => '<li>' + quoteBlock(q) + '</li>').join('') + '</ul>' +
'<p class="pg-src">引文逐字取自小说正文，页码按电子本核对。</p>';
}
function renderDos(){
const p = byId(S.pid); if (!p) return;
const s = st(p.id);
dosHead.innerHTML = '<span class="dh-no">BL-P' + p.no + '</span><h3 class="dh-name">' + xe(p.name) + '</h3>' +
'<span class="dh-role">' + xe(p.role) + '</span><span class="dh-st ' + s[1] + '">' + s[0] + '</span><span class="dh-sp"></span>' +
'<button class="dh-btn" data-act="collapse">收起</button><button class="dh-btn" data-act="close">退出 ✕</button>';
dosTabs.innerHTML = SECS.map((n, i) => '<button data-tab="' + i + '"' + (i === S.tab ? ' aria-current="true"' : '') + '><b>' +
String(i + 1).padStart(2, '0') + '</b>' + n + '</button>').join('');
dosBody.innerHTML = secHtml(S.tab, p);
dosBody.scrollTop = 0;
}
function glitch(n){ n.classList.remove('glitch'); void n.offsetWidth; n.classList.add('glitch'); }
function openPerson(id){
const p = byId(id); if (!p) return;
S.opens++;
const swap = S.pid && S.pid !== id;
S.pid = id;
renderFolder(p); renderBadge(p);
if (S.phase === 'dossier'){
S.tab = 0; renderDos(); glitch(dosEl);
} else {
setPhase('card');
if (swap){ glitch(folderEl); glitch(badgeEl); badgeEl.classList.add('flip'); }
const btn = folderEl.querySelector('[data-act="expand"]'); if (btn) btn.focus({ preventScroll: true });
}
if (window.__bust) window.__bust.open(id);
hot = null; paint();
}
function expand(){
if (!S.pid) return;
S.tab = 0; renderDos(); setPhase('dossier');
const t = dosTabs.querySelector('[aria-current]'); if (t) t.focus({ preventScroll: true });
}
function collapse(){
if (S.phase !== 'dossier') return;
setPhase('card');
const btn = folderEl.querySelector('[data-act="expand"]'); if (btn) btn.focus({ preventScroll: true });
}
function closeAll(){
const was = S.pid;
setPhase('idle'); S.pid = null; badgeEl.classList.remove('flip');
if (window.__bust) window.__bust.close();
paint();
const li = was && listEl.querySelector('[data-pid="' + was + '"]'); if (li) li.focus({ preventScroll: true });
}
function setTab(i){
if (S.phase !== 'dossier') return;
i = Math.max(0, Math.min(SECS.length - 1, i));
if (i === S.tab) return;
S.tab = i; renderDos(); glitch(dosEl);
const t = dosTabs.querySelector('[aria-current]'); if (t) t.focus({ preventScroll: true });
}
listEl.addEventListener('click', e => { const b = e.target.closest('[data-pid]'); if (b) openPerson(b.dataset.pid); });
listEl.addEventListener('mouseover', e => { const b = e.target.closest('[data-pid]'); setHot(b ? b.dataset.pid : null); });
listEl.addEventListener('mouseleave', () => setHot(null));
listEl.addEventListener('focusin', e => { const b = e.target.closest('[data-pid]'); if (b && S.phase === 'idle') setHot(b.dataset.pid); });
svg.addEventListener('click', e => { const g = e.target.closest('.tnode'); if (g) openPerson(g.dataset.pid); });
svg.addEventListener('mouseover', e => { const g = e.target.closest('.tnode'); setHot(g ? g.dataset.pid : null); });
svg.addEventListener('mouseleave', () => setHot(null));
svg.addEventListener('focusin', e => { const g = e.target.closest('.tnode'); if (g) setHot(g.dataset.pid); });
svg.addEventListener('keydown', e => {
const g = e.target.closest && e.target.closest('.tnode');
if (!g) return;
if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); e.stopPropagation(); openPerson(g.dataset.pid); }
});
termEl.addEventListener('click', e => {
const a = e.target.closest('[data-act]');
if (a){ const k = a.dataset.act; if (k === 'expand') expand(); else if (k === 'collapse') collapse(); else closeAll(); return; }
const t = e.target.closest('[data-tab]'); if (t){ setTab(+t.dataset.tab); return; }
const o = e.target.closest('[data-open]'); if (o){ openPerson(o.dataset.open); return; }
const c = e.target.closest('[data-concept]');
if (c){ const key = c.dataset.concept; closeAll(); go(3); if (window.__stageFx) window.__stageFx.scene(key);
if (window.__stage3D) window.__stage3D.scene(key); return; }
if (e.target.classList.contains('holo-veil') || e.target.classList.contains('holo-stage')){ if (S.phase === 'card') closeAll(); }
});
document.addEventListener('keydown', e => {
if (!peopleEl.classList.contains('on')) return;
const stop = () => { e.preventDefault(); e.stopPropagation(); };
if (e.key === 'Escape'){
if (S.phase === 'dossier'){ collapse(); stop(); } else if (S.phase === 'card'){ closeAll(); stop(); }
return;
}
if (S.phase === 'dossier'){
if (e.key === 'ArrowDown' || e.key === 'ArrowRight'){ setTab(S.tab + 1); stop(); }
else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft'){ setTab(S.tab - 1); stop(); }
else if (/^[1-6]$/.test(e.key)){ setTab(+e.key - 1); stop(); }
return;
}
if (S.phase === 'card' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')){
const onBust = document.activeElement && document.activeElement.closest && document.activeElement.closest('#bust');
if (onBust){ if (window.__bust) window.__bust.rotate(e.key === 'ArrowRight' ? 1 : -1); stop(); }
else {
const cur = ARCH.findIndex(x => x.id === S.pid);
const nxt = ARCH[(cur + (e.key === 'ArrowRight' ? 1 : -1) + ARCH.length) % ARCH.length];
openPerson(nxt.id); stop();
}
return;
}
if (S.phase === 'idle' && (e.key === 'ArrowDown' || e.key === 'ArrowUp')){
const items = [...listEl.querySelectorAll('.tl-i')];
const i = items.indexOf(document.activeElement);
const n = items[(i < 0 ? 0 : i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length];
n.focus(); n.scrollIntoView({ block: 'nearest', inline: 'nearest' }); stop();
}
}, true);
buildGraph();
let lastNarrow = innerWidth <= 1000, rt = 0;
addEventListener('resize', () => {
clearTimeout(rt);
rt = setTimeout(() => { const n = innerWidth <= 1000; if (n !== lastNarrow){ lastNarrow = n; buildGraph(); } }, 160);
});
window.__arch = {
people: ARCH,
state: () => ({ phase: S.phase, pid: S.pid, tab: S.tab, opens: S.opens }),
open: openPerson, expand, collapse, close: closeAll, tab: setTab
};
})();
(function(){
const peopleEl = document.getElementById('people');
const termEl = document.getElementById('term');
const wrap = document.getElementById('bust');
if (!peopleEl || !termEl || !wrap) return;
const cv = document.createElement('canvas');
cv.className = 'bust-cv';
cv.setAttribute('aria-label', '人物粒子扫描模型，可拖动旋转；聚焦后左右方向键旋转');
cv.tabIndex = 0;
wrap.appendChild(cv);
const modeBtn = document.createElement('button');
modeBtn.type = 'button';
modeBtn.className = 'bust-mode';
modeBtn.setAttribute('aria-label', '切换粒子显示状态');
const modeSlot = document.querySelector('.scan-mode-slot');
(modeSlot || wrap).appendChild(modeBtn);
const hintEl = document.createElement('span');
hintEl.className = 'bust-hint';
hintEl.textContent = '拖动旋转 · ← → 切换人物';
wrap.appendChild(hintEl);
const TAU = Math.PI * 2, sin = Math.sin, cos = Math.cos, abs = Math.abs;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
function hashStr(s){ let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; } return h >>> 0; }
function rng(seed){ let s = (seed >>> 0) || 1; return function(){ s ^= s << 13; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
function hsl(h, sat, li){
const hh = ((h % 360) + 360) % 360 / 360;
const q = li < .5 ? li * (1 + sat) : li + sat - li * sat, p = 2 * li - q;
const f = t => { t = ((t % 1) + 1) % 1; return t < 1/6 ? p + (q - p) * 6 * t : t < 1/2 ? q : t < 2/3 ? p + (q - p) * (2/3 - t) * 6 : p; };
return [f(hh + 1/3), f(hh), f(hh - 1/3)];
}
const P = { x: null, y: null, z: null, nx: null, ny: null, nz: null, role: null, pr: null, pg: null, pb: null, n: 0, hue: 226 };
let lastPid = null;
const HEAD_CACHE = {};
function octDec(bx, by){
let ox = bx / 127, oy = by / 127;
let oz = 1 - Math.abs(ox) - Math.abs(oy);
if (oz < 0){
const x = ox, y = oy;
ox = (1 - Math.abs(y)) * (x >= 0 ? 1 : -1);
oy = (1 - Math.abs(x)) * (y >= 0 ? 1 : -1);
}
const l = Math.hypot(ox, oy, oz) || 1;
return [ox / l, oy / l, oz / l];
}
function headModel(kind){
let m = HEAD_CACHE[kind];
if (m) return m;
const src = HEAD_MODELS[kind];
if (!src) return null;
const bin = atob(src), len = bin.length, n0 = (len / 8) | 0;
const buf = new Uint8Array(len);
for (let i = 0; i < len; i++) buf[i] = bin.charCodeAt(i);
const dv = new DataView(buf.buffer);
const nExtra = 12000;
const n = n0 + nExtra;
m = { n: n, x: new Float32Array(n), y: new Float32Array(n), z: new Float32Array(n),
nx: new Float32Array(n), ny: new Float32Array(n), nz: new Float32Array(n) };
for (let i = 0; i < n0; i++){
const o = i * 8;
m.x[i] = dv.getInt16(o, true) / 10000;
m.y[i] = dv.getInt16(o + 2, true) / 10000;
m.z[i] = dv.getInt16(o + 4, true) / 10000;
const [nx, ny, nz] = octDec(dv.getInt8(o + 6), dv.getInt8(o + 7));
m.nx[i] = nx; m.ny[i] = ny; m.nz[i] = nz;
}
const CA = -0.7373688780783199, SA = 0.6754902942615238;
let cosA = 1, sinA = 0;
for (let j = 0; j < nExtra; j++){
const nextCos = cosA * CA - sinA * SA;
const nextSin = sinA * CA + cosA * SA;
if ((j & 511) === 0){
const rl = Math.hypot(nextCos, nextSin) || 1;
cosA = nextCos / rl; sinA = nextSin / rl;
} else {
cosA = nextCos; sinA = nextSin;
}
const baseIdx = (j * 7 + 13) % n0;
const bx = m.x[baseIdx], by = m.y[baseIdx], bz = m.z[baseIdx];
const nx = m.nx[baseIdx], ny = m.ny[baseIdx], nz = m.nz[baseIdx];
const tx = Math.abs(nx) < 0.8 ? -nz : 0;
const ty = Math.abs(nx) < 0.8 ? 0 : -nz;
const tz = Math.abs(nx) < 0.8 ? nx : ny;
const tl = Math.hypot(tx, ty, tz) || 1;
const ux = tx / tl, uy = ty / tl, uz = tz / tl;
const vx = ny * uz - nz * uy, vy = nz * ux - nx * uz, vz = nx * uy - ny * ux;
const rad = 0.004 + (j % 5) * 0.0015;
const dx = ux * cosA + vx * sinA;
const dy = uy * cosA + vy * sinA;
const dz = uz * cosA + vz * sinA;
const sink = -2.2 * rad * rad;
const targetIdx = n0 + j;
m.x[targetIdx] = bx + dx * rad + nx * sink;
m.y[targetIdx] = by + dy * rad + ny * sink;
m.z[targetIdx] = bz + dz * rad + nz * sink;
const bend = 0.18 * (rad / 0.01);
const rnx = nx + dx * bend, rny = ny + dy * bend, rnz = nz + dz * bend;
const nl = Math.hypot(rnx, rny, rnz) || 1;
m.nx[targetIdx] = rnx / nl; m.ny[targetIdx] = rny / nl; m.nz[targetIdx] = rnz / nl;
}
HEAD_CACHE[kind] = m;
return m;
}
const FEMALE_IDS = { lin: 1, dai: 1 };
function build(pid){
const people = (window.__arch && window.__arch.people) || [];
const p = people.find(x => x.id === pid) || { id: pid, hue: 226 };
const r = rng(hashStr('bust:' + pid));
const hue = (typeof p.hue === 'number') ? p.hue : 226;
const head = headModel(FEMALE_IDS[pid] ? 'female' : 'male');
const gx = 0.95 + 0.10 * r();
const gy = 0.98 + 0.04 * r();
const gz = 0.95 + 0.10 * r();
const shoulder = 1.80 + 0.60 * r();
const shoulderH = 0.50 + 0.18 * r();
const hairAmt = 0.25 + 0.65 * r();
const tmp = [];
const push = (x, y, z, nx, ny, nz, role) => tmp.push(x, y, z, nx, ny, nz, role);
if (head){
const jr = rng(hashStr('jit:' + pid));
for (let i = 0; i < head.n; i++){
const y = head.y[i] * gy;
const x = head.x[i] * gx + (jr() - 0.5) * 0.010;
const z = head.z[i] * gz + (jr() - 0.5) * 0.010;
const role = y > -0.34 ? 0 : (y > -0.94 ? 3 : 4);
push(x, y, z, head.nx[i], head.ny[i], head.nz[i], role);
if (y > 0.40 && head.ny[i] > -0.10 && jr() < hairAmt * 0.30){
const d = 0.03 + 0.08 * jr();
push(x + head.nx[i] * d, y + head.ny[i] * d, z + head.nz[i] * d, head.nx[i], head.ny[i], head.nz[i], 5);
}
}
}
for (let i = 0; i < 560; i++){
const th = TAU * r();
const yy = -0.90 - r() * 0.20;
const rr = 0.54 + 0.05 * sin(th * 3);
push(cos(th) * rr, yy, sin(th) * rr * 0.86 - 0.02, cos(th), 0, sin(th), 3);
}
for (let i = 0; i < 2600; i++){
const u = Math.acos(2 * r() - 1), v = TAU * r();
const X = sin(u) * cos(v), Y = cos(u), Z = sin(u) * sin(v);
if (Y < -0.05) continue;
push(X * shoulder, Y * shoulderH - 1.46, Z * 0.62 - 0.18, X, Y, Z, 4);
}
const n = (tmp.length / 7) | 0;
P.x = new Float32Array(n); P.y = new Float32Array(n); P.z = new Float32Array(n);
P.nx = new Float32Array(n); P.ny = new Float32Array(n); P.nz = new Float32Array(n);
P.role = new Uint8Array(n); P.pr = new Float32Array(n); P.pg = new Float32Array(n); P.pb = new Float32Array(n);
const ROLE_H = [[46, 68], [40, 74], [48, 60], [52, 52], [58, 46], [60, 34]];
const jr2 = rng(hashStr('col:' + pid));
for (let i = 0; i < n; i++){
const o = i * 7;
P.x[i] = tmp[o]; P.y[i] = tmp[o + 1]; P.z[i] = tmp[o + 2];
P.nx[i] = tmp[o + 3]; P.ny[i] = tmp[o + 4]; P.nz[i] = tmp[o + 5];
P.role[i] = tmp[o + 6];
const rh = ROLE_H[P.role[i]] || ROLE_H[0];
const c = hsl(hue, rh[0] / 100, clamp(rh[1] / 100 + (jr2() - 0.5) * 0.10, 0, 1));
P.pr[i] = c[0] * 255; P.pg[i] = c[1] * 255; P.pb[i] = c[2] * 255;
}
P.n = n; P.hue = hue;
}
const MAX = 28000;
const FBUF = new Float32Array(MAX * 7);
let gl = null, c2 = null, prog = null, vbo = null, loc = {};
try { gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false }); } catch (_) {}
c2 = gl ? null : cv.getContext('2d');
if (gl){
const vs = 'attribute vec2 aP;attribute float aS;attribute vec4 aC;uniform vec2 uR;uniform float uH;varying vec4 vC;' +
'vec3 hue(vec3 c,float a){const vec3 k=vec3(0.57735);float ca=cos(a);return c*ca+cross(k,c)*sin(a)+k*dot(k,c)*(1.0-ca);}' +
'void main(){vec2 p=aP/uR*2.0-1.0;gl_Position=vec4(p.x,-p.y,0.0,1.0);gl_PointSize=aS;vC=vec4(clamp(hue(aC.rgb,uH),0.0,1.0),aC.a);}';
const fs = 'precision mediump float;varying vec4 vC;uniform float uG;' +
'void main(){vec2 q=gl_PointCoord-0.5;float d=length(q)*2.0;if(d>1.0)discard;' +
'float a=(exp(-d*d*7.0)+exp(-d*d*2.2)*0.45*uG)*vC.a;gl_FragColor=vec4(vC.rgb*a,a);}';
const sh = (type, src) => { const o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return o; };
prog = gl.createProgram();
gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
gl.linkProgram(prog);
if (!gl.getProgramParameter(prog, gl.LINK_STATUS)){ gl = null; }
else {
gl.useProgram(prog);
vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, FBUF.byteLength, gl.DYNAMIC_DRAW);
loc = { P: gl.getAttribLocation(prog, 'aP'), S: gl.getAttribLocation(prog, 'aS'), C: gl.getAttribLocation(prog, 'aC'),
R: gl.getUniformLocation(prog, 'uR'), H: gl.getUniformLocation(prog, 'uH'), G: gl.getUniformLocation(prog, 'uG') };
gl.enableVertexAttribArray(loc.P); gl.vertexAttribPointer(loc.P, 2, gl.FLOAT, false, 28, 0);
gl.enableVertexAttribArray(loc.S); gl.vertexAttribPointer(loc.S, 1, gl.FLOAT, false, 28, 8);
gl.enableVertexAttribArray(loc.C); gl.vertexAttribPointer(loc.C, 4, gl.FLOAT, false, 28, 12);
gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
}
}
const CAM = { yaw: 0, pitch: 0.30, dist: 5.4, distT: 5.4, scan: -1, drag: false, lastX: 0, lastY: 0, sway: 0 };
const MODE_LABEL = ['点云', '轮廓', '体素'];
let mode = 0, W = 0, H = 0, dpr = 1, drawn = 0;
function setModeBtn(){ modeBtn.textContent = '粒子 · ' + MODE_LABEL[mode]; }
setModeBtn();
function layout(){
const r = wrap.getBoundingClientRect();
dpr = Math.min(2, window.devicePixelRatio || 1);
const cw = wrap.clientWidth || Math.round(r.width), ch = wrap.clientHeight || Math.round(r.height);
const w = Math.max(1, Math.round(cw * dpr)), h = Math.max(1, Math.round(ch * dpr));
if (w !== W || h !== H){ W = w; H = h; cv.width = w; cv.height = h; if (gl) gl.viewport(0, 0, w, h); }
}
const easeIO = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
function fill(){
const n = P.n; if (!n){ drawn = 0; return; }
let yaw = CAM.yaw;
if (!CAM.drag) yaw += sin(CAM.sway * 0.55) * 0.05;
const cy = cos(yaw), sy = sin(yaw), cp = cos(CAM.pitch), sp = sin(CAM.pitch);
const dist = CAM.dist, f = 2.1;
const scanOn = CAM.scan >= 0;
const scanY = scanOn ? 1.14 - 1.66 * easeIO(clamp(CAM.scan, 0, 1)) : 0;
const band = 0.075, pxPerWorld = H / 3.15, cx = W * 0.5, cyPx = H * 0.475;
const baseSz = 1.9 * dpr * (H / 720);
const vox = mode === 2 ? 0.15 : 0;
const wire = mode === 1;
let m = 0;
for (let i = 0; i < n; i++){
let x = P.x[i], y = P.y[i], z = P.z[i];
if (vox){ x = Math.round(x / vox) * vox; y = Math.round(y / vox) * vox; z = Math.round(z / vox) * vox; }
const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
const nx1 = P.nx[i] * cy + P.nz[i] * sy, nz1 = -P.nx[i] * sy + P.nz[i] * cy;
const ny2 = P.ny[i] * cp - nz1 * sp, nz2 = P.ny[i] * sp + nz1 * cp;
if (wire && abs(nz2) > 0.24) continue;
const s = f / (dist - z2);
const px = cx + x1 * s * pxPerWorld, py = cyPx - y2 * s * pxPerWorld;
if (px < -24 || px > W + 24 || py < -24 || py > H + 24) continue;
let a = 0.17 + (z2 + 1.3) * 0.19;
const lam = 0.30 + 0.70 * clamp(nz2 * 0.5 + 0.5, 0, 1);
const spec = clamp(nx1 * -0.34 + ny2 * 0.42 + nz2 * 0.84, 0, 1);
const br = lam + 0.62 * spec * spec * spec * spec;
let r = P.pr[i] * br, g = P.pg[i] * br, b = P.pb[i] * br;
if (scanOn && abs(P.y[i] - scanY) < band){
const k = 1 - abs(P.y[i] - scanY) / band;
r += (205 - r) * k; g += (232 - g) * k; b += (255 - b) * k;
a = Math.max(a, 0.55 + 0.45 * k);
}
a = clamp(a, 0, 1);
const sz = baseSz * s * (wire ? 1.5 : 1) * (vox ? 0.8 : 1);
const o = m * 7;
FBUF[o] = px; FBUF[o + 1] = py; FBUF[o + 2] = sz; FBUF[o + 3] = r / 255; FBUF[o + 4] = g / 255; FBUF[o + 5] = b / 255; FBUF[o + 6] = a;
m++;
}
drawn = m;
}
function draw(){
if (gl){
gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
gl.uniform2f(loc.R, W, H); gl.uniform1f(loc.H, 0); gl.uniform1f(loc.G, 1.0);
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferSubData(gl.ARRAY_BUFFER, 0, FBUF.subarray(0, drawn * 7));
gl.drawArrays(gl.POINTS, 0, drawn);
} else if (c2){
c2.clearRect(0, 0, W, H);
c2.globalCompositeOperation = 'lighter';
for (let i = 0; i < drawn; i++){
const o = i * 7, a = FBUF[o + 6]; if (a < 0.02) continue;
c2.fillStyle = 'rgba(' + (FBUF[o + 3] * 255 | 0) + ',' + (FBUF[o + 4] * 255 | 0) + ',' + (FBUF[o + 5] * 255 | 0) + ',' + a + ')';
const z = FBUF[o + 2] * 0.6;
c2.fillRect(FBUF[o] - z / 2, FBUF[o + 1] - z / 2, z, z);
}
c2.globalCompositeOperation = 'source-over';
}
}
let raf = null, last = 0, frames = 0;
const onScreen = () => {
if (!wrap.isConnected || wrap.clientWidth < 8 || wrap.clientHeight < 8) return false;
const r = wrap.getBoundingClientRect();
return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
};
const running = () => onScreen() && termEl.dataset.phase === 'card' && !document.hidden;
function kick(){ if (raf == null && running()){ last = performance.now(); raf = requestAnimationFrame(frame); } }
function frame(now){
raf = null;
if (!running()){ if (gl){ gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); } return; }
const real = Math.min(0.1, (now - last) / 1000 || 0.016); last = now;
const dt = Math.min(0.05, real);
CAM.sway += dt;
CAM.dist += (CAM.distT - CAM.dist) * Math.min(1, dt * 2.6);
if (CAM.scan >= 0 && abs(CAM.dist - CAM.distT) < 0.12){ CAM.scan += dt / 1.3; if (CAM.scan > 1.05) CAM.scan = -1; }
layout(); fill(); draw();
frames++;
raf = requestAnimationFrame(frame);
}
cv.addEventListener('pointerdown', e => {
if (e.button != null && e.button !== 0) return;
CAM.drag = true; CAM.lastX = e.clientX; CAM.lastY = e.clientY;
if (cv.setPointerCapture) cv.setPointerCapture(e.pointerId);
e.preventDefault();
});
cv.addEventListener('pointermove', e => {
if (!CAM.drag) return;
const dx = e.clientX - CAM.lastX, dy = e.clientY - CAM.lastY;
CAM.lastX = e.clientX; CAM.lastY = e.clientY;
CAM.yaw += dx * 0.006;
CAM.pitch = clamp(CAM.pitch + dy * 0.002, 0.04, 0.62);
kick();
});
const endDrag = () => { CAM.drag = false; };
cv.addEventListener('pointerup', endDrag);
cv.addEventListener('pointercancel', endDrag);
modeBtn.addEventListener('click', e => { e.stopPropagation(); mode = (mode + 1) % 3; setModeBtn(); });
new MutationObserver(kick).observe(termEl, { attributes: true, attributeFilter: ['data-phase'] });
new MutationObserver(kick).observe(peopleEl, { attributes: true, attributeFilter: ['class'] });
document.addEventListener('visibilitychange', kick);
addEventListener('resize', kick);
function watchBust(){
clearTimeout(watchBust._t);
watchBust._t = setTimeout(() => {
if (termEl.dataset.phase !== 'card') return;
const bad = [];
if (!frames) bad.push('一帧都没渲染（渲染循环没启动）');
if (frames && !drawn) bad.push('跑了 ' + frames + ' 帧但一个点都没画出来');
if (W < 8 || H < 8) bad.push('画布尺寸 ' + W + '×' + H + '（面板被折叠了）');
if (!gl && !c2) bad.push('拿不到 canvas 上下文');
if (!bad.length){ const e = wrap.querySelector('.bust-err'); if (e) e.remove(); return; }
let e = wrap.querySelector('.bust-err');
if (!e){ e = document.createElement('div'); e.className = 'bust-err'; wrap.appendChild(e); }
e.textContent = '粒子头像没画出来：' + bad.join('；') + '（gl=' + !!gl + ' · dpr=' + dpr + ' · n=' + P.n + '）';
}, 1600);
}
function open(pid){
if (pid !== lastPid){ build(pid); lastPid = pid; }
CAM.dist = 5.4; CAM.distT = 2.2; CAM.scan = 0; CAM.yaw = 0.34;
kick();
watchBust();
}
function close(){ CAM.scan = -1; CAM.distT = 5.4; }
window.__bust = {
open, close,
rotate: d => { CAM.yaw += d * 0.28; kick(); },
setMode: m => { mode = ((m % 3) + 3) % 3; setModeBtn(); },
mode: () => mode,
info: () => ({ n: P.n, frames, running: raf != null, gl: !!gl, mode }),
shape: (bands) => {
const nb = bands > 0 ? bands | 0 : 20;
const out = [];
for (let b = 0; b < nb; b++) out.push({ l: 1e9, r: -1e9, n: 0 });
const bh = H / nb;
for (let i = 0; i < drawn; i++){
const o = i * 7, sx = FBUF[o], sy = FBUF[o + 1];
const b = Math.floor(sy / bh);
if (b < 0 || b >= nb) continue;
const s = out[b];
if (sx < s.l) s.l = sx;
if (sx > s.r) s.r = sx;
s.n++;
}
return { w: W, h: H, drawn: drawn,
bands: out.map(s => s.n ? { l: Math.round(s.l), r: Math.round(s.r), n: s.n } : { l: -1, r: -1, n: 0 }) };
}
};
})();
const DIALOGUE = {
2: { kind:'research', kicker:'03 中篇 · 研究 / 研究群聊', title:'一个人的问题，怎样变成一组人的任务',
threads:[{ items:[
{m:'大学 · 导师的提醒'},
{w:'高波', id:'gao', p:72, t:'球状闪电的性质决定了它的研究最后肯定会和武器有关系，你信誓旦旦要追求一生的东西就这么抛弃了？'},
{m:'雷电武器试验场'},
{w:'林云', id:'lin', p:66, t:'首先是射程，超不过一百米，否则就放不出电来。一百米，手榴弹都能投那么远。'},
{w:'林云', id:'lin', p:66, t:'我们尽了最大努力，但这已经是射程极限了。'},
{m:'西伯利亚 · 3141 基地'},
{w:'格莫夫', p:88, t:'你们想要的那些资料我也有过，这间房子都堆不下，但在十年前我已全部付之一炬了。'},
{w:'格莫夫', p:94, t:'当时进行雷电模拟实验时，洞厅顶部的一些金属构件被闪电熔化，滴下来冷却后就形成了这种东西。'},
{w:'格莫夫', p:101, t:'孩子们，找点别的事干吧，世界上有意思的事很多……人生就一次，不要浪费在虚无缥缈的东西上。'},
{m:'海滩 · 劝返'},
{w:'江星辰', id:'jiang', p:107, t:'你退出球状闪电研究项目，林云很难过，这个项目确实离不开你，所以我自告奋勇地来劝你回去，并对林云保证我能成功。'},
{m:'林家 · 思路翻转'},
{w:'我', id:'main', p:113, t:'球状闪电并不是由闪电产生的，而是自然界早已存在的一种结构。'},
{w:'林云', id:'lin', p:113, t:'你是说……闪电只是点燃或激发了它？'},
{w:'我', id:'main', p:113, t:'太对了，就像电流点亮了电灯，但电灯本身早已存在！'},
{w:'林云', id:'lin', p:119, t:'我们第一步是努力用现有的设备发现球状闪电，让上级看到它作为武器的潜力。'}
]}] },
3: { kind:'review', kicker:'04 军事化 / 项目评审会', title:'理论什么时候变成武器',
sub:'从"能不能继续试"一路升级到"该不该部署"。你可以表态，但书里没有第二种结局：每次揭示的都是同一段原文。',
threads:[{ items:[
{m:'议程一 · 直升机坠落之后，还试不试'},
{w:'许大校', p:125, t:'在想出行之有效的措施保证安全之前，试验必须停止！'},
{w:'林云', id:'lin', p:125, t:'这样的事故不能再发生了，是应该有一个可靠的安全保证。'},
{w:'林云', id:'lin', p:126, t:'我请各位把大前提搞对：我们并不是为你们这个项目冒险，而是为我们自己冒险，现在，陆军航空兵比任何时候都需要新武器！'},
{w:'张彬', id:'zhang', p:130, t:'许大校已经把你们的想法告诉我了，对它我现在还做不出什么评价，但有个直觉：这次你我可能真的要再次看到球状闪电了。'},
{m:'议程二 · 请来理论物理学家'},
{w:'林云', id:'lin', p:136, t:'对球状闪电的研究方向必须转移到现代物理学的最前沿。'},
{w:'丁仪', id:'ding', p:143, t:'那就再激发几个仔细看看吧。'},
{w:'许大校', p:143, t:'丁教授，激发雷球是一件很危险的事，我们可要慎重。'},
{q:'如果你在场：明知危险，还要不要再激发？', opts:['先停下，慎重','再试一次'],
ans:[{w:'林云', id:'lin', p:143, t:'我看就照丁教授说的再试一次吧，有时候险也是不得不冒的。'}],
note:'书里拍板的是林云。注意这句"险也是不得不冒的"：后面每一次升级，用的都是同一个理由。'},
{w:'丁仪', id:'ding', p:161, t:'它们是宏观尺度的电子，就叫宏电子吧。'},
{m:'议程三 · 核电站人质事件'},
{w:'总指挥', p:191, t:'情况你们知道了，现在我问第二个问题：你们的这种武器能够区分成年人和孩子吗？'},
{q:'在回答之前，你觉得一件武器"能不能区分"，应该由谁来负责？', opts:['设计武器的人','下令使用的人'],
ans:[{w:'许大校', p:191, t:'没有这种情况也不行，'}, {w:'许大校', p:191, t:'反应堆和控制室结合成一个建筑。我们的武器是将建筑物作为一个整体攻击的'}],
note:'技术上的答案很干脆：区分不了。剩下的问题落在人身上，书里没有替你回答。'},
{m:'议程四 · 导师的判断'},
{w:'杜将军', p:256, t:'这与个性无关，我认为，一个把武器当毒品的人，是不适合从事武器研究的，特别不适合从事尖端和新概念武器的研究。'},
{w:'林云', id:'lin', p:258, t:'我是在执行一项崇高的命令，这个命令是那些比你更理智、更有道德、更负责任的人做出的，这些人中包括你的父亲。'},
{q:'"能制造"等于"应该部署"吗？', opts:['不等于','在战争里，可能等于'],
ans:[{w:'林将军', p:268, t:'是的孩子，我们一起走到这里的。'}],
note:'这是宏聚变之后父亲对林云说的话。小说把判断留给读者：它只写出了"一起走到这里"的每一步。'}
]}] },
4: { kind:'radio', kicker:'05 战争 / 通讯与日志', title:'风险不再只属于实验室',
sub:'短句、断续，只留原文。',
threads:[{ items:[
{m:'LOG · 珠峰号'},
{w:'叙述', k:'log', p:212, t:'珠峰号的主甲板折断，半小时后沉没，包括舰长在内的两千多名官兵阵亡。'},
{m:'记录 · 父与女'},
{w:'林将军', p:220, t:'小云啊，你对武器的迷恋不应发展到迷信，应该使自己对战争的思考深刻一些、整体化一些，靠一两件新式武器赢得整场战争的想法是十分幼稚的。'},
{m:'作战会议'},
{w:'林云', id:'lin', p:222, t:'只有一样东西，渔船。'},
{m:'墓碑前'},
{w:'丁仪', id:'ding', p:241, t:'转过身去！少一个观察者，它的坍缩就慢些！'},
{m:'戈壁 · 聚变点'},
{w:'丁仪', id:'ding', p:254, t:'林云，离开基地。'},
{m:'宏聚变之后'},
{w:'林云', id:'lin', p:268, t:'爸爸，我真没有想到宏聚变的威力竟这样大。'},
{w:'林将军', p:268, t:'是的孩子，我们一起走到这里的。'},
{w:'叙述', k:'log', p:280, t:'她的身体开始变得透明，很快变成一个晶莹的影子，然后，量子态的林云消失了。'}
]}] },
5: { kind:'memory', kicker:'06 尾声 / 两条并行对话', title:'最后留下的是不可替代的生活',
sub:'一条是帕克带来的"超级观察者"，一条是写字台上那只紫水晶花瓶。',
threads:[
{ label:'帕克来访 · 观察者', items:[
{w:'帕克', id:'parker', p:284, t:'我们正在寻找和观察球状闪电的这样一种现象：当没有观察者时，它们仍保持坍缩状态而非量子态。'},
{w:'我', id:'main', p:284, t:'这种现象我们也发现过几次，但到最后总能找出一个或多个不易发现的观察者。'},
{w:'帕克', id:'parker', p:285, t:'在矿井试验中，人类观察者不存在，人类制造的观测设备形成的观察者也不存在，而球状闪电仍处于坍缩态。这只能说明，存在着一个人类之上的观察者。'},
{w:'我', id:'main', p:285, t:'这应该是一个强有力的观察者，它们的观察能够穿透地层！'},
{w:'帕克', id:'parker', p:285, t:'这是惟一合理的解释。'},
{w:'我', id:'main', p:285, t:'人类社会也很像是处于不确定的量子态，一个超级观察者能令它坍缩回理智状态。'}
]},
{ label:'戴琳 · 看不见的玫瑰', items:[
{m:'深秋 · 午夜两点'},
{w:'我', id:'main', p:288, t:'是你吗？'},
{w:'我', id:'main', p:288, t:'我知道是你。'},
{w:'叙述', k:'nar', p:288, t:'就在书桌上的紫水晶花瓶上，出现了一朵蓝色的玫瑰，但玫瑰在我看到它的瞬间就消失了，只剩空花瓶静静地立在那里。'},
{m:'第二天'},
{w:'我', id:'main', p:289, t:'是一朵蓝色的玫瑰。'},
{w:'戴琳', id:'dai', p:289, t:'哦，那可是最贵的品种。'},
{w:'戴琳', id:'dai', p:289, t:'我知道，你在内心深处有自己的一块天地，我也有，毕竟这么多年了……你可以保留它，但不该把它带到我们的生活里来！'},
{w:'孩子', p:289, t:'妈妈，写字台上的那个紫花瓶中插着一朵玫瑰呢，蓝色的，好看呢！可你一看它就没了。'},
{w:'戴琳', id:'dai', as:'妻子', p:290, t:'我刚才一醒来，就闻到了一股……玫瑰花香，就从那个花瓶上发出来的！'},
{w:'我', id:'main', p:290, t:'我知道你没骗我，那里真的有一朵玫瑰嘛，蓝色的玫瑰。'},
{w:'叙述', k:'nar', p:290, t:'它是一朵我只能用心来看的花。'}
]}
] }
};
(() => {
const dlg = $('#dlg'), body = $('#dlgBody'), tabs = $('#dlgTabs');
const btnNext = $('#dlgNext'), btnAll = $('#dlgAll'), sideBtn = $('#sideDlg');
if (!dlg || !body || !sideBtn) return;
const S = { idx: -1, th: 0, shown: 0, pick: {} };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
const people = () => (window.__arch && window.__arch.people) || [];
const hasDossier = id => !!id && people().some(p => p.id === id);
const items = () => DIALOGUE[S.idx].threads[S.th].items;
const lineCount = d => d.threads.reduce((n, t) => n + t.items.reduce((m, x) => m + (x.t ? 1 : 0) + (x.ans ? x.ans.length : 0), 0), 0);
function lineHtml(x){
const cls = 'dl' + (x.k ? ' dl-' + x.k : '') + (x.w === '我' ? ' dl-me' : '');
const who = x.k ? '' : (hasDossier(x.id)
? '<button type="button" class="dl-who" data-pid="' + x.id + '" title="打开 04 屏人物档案">' + esc(x.w) + '<i aria-hidden="true">↗</i></button>'
: '<span class="dl-who">' + esc(x.w) + '</span>');
return '<li class="' + cls + '">' + who + '<q>' + esc(x.t) + '</q><cite>P' + x.p + '</cite></li>';
}
function itemHtml(x, i){
if (x.m) return '<li class="dl-m">' + esc(x.m) + '</li>';
if (x.q){
const pick = S.pick[S.th + ':' + i];
return '<li class="dl-gate" data-gate="' + i + '"><p class="gq"><b>本站提问</b>' + esc(x.q) + '</p><div class="go">' +
x.opts.map((o, j) => '<button type="button" data-opt="' + j + '"' + (pick === j ? ' aria-pressed="true"' : '') +
(pick != null ? ' disabled' : '') + '>' + esc(o) + '</button>').join('') + '</div>' +
(pick != null ? '<p class="gr">你选了「' + esc(x.opts[pick]) + '」。原文是这样写的：</p><ol>' + x.ans.map(lineHtml).join('') + '</ol>' +
'<p class="gn"><b>导读</b>' + esc(x.note) + '</p>' : '') + '</li>';
}
return lineHtml(x);
}
const gateOpen = () => { const it = items(), x = it[S.shown - 1]; return !!(x && x.q && S.pick[S.th + ':' + (S.shown - 1)] == null); };
function render(){
const d = DIALOGUE[S.idx], it = items();
dlg.dataset.kind = d.kind;
$('#dlgKicker').textContent = d.kicker;
$('#dlgTitle').textContent = d.title;
$('#dlgSub').textContent = d.sub || '';
tabs.hidden = d.threads.length < 2;
tabs.innerHTML = d.threads.length < 2 ? '' : d.threads.map((t, j) =>
'<button type="button" role="tab" data-th="' + j + '" aria-selected="' + (j === S.th) + '">' + esc(t.label) + '</button>').join('');
body.innerHTML = it.slice(0, S.shown).map(itemHtml).join('');
const done = S.shown >= it.length, blocked = gateOpen();
btnNext.disabled = done || blocked;
btnNext.textContent = done ? '已到结尾' : (blocked ? '先表个态' : '下一句 →');
btnAll.disabled = done;
$('#dlgProg').textContent = S.shown + ' / ' + it.length;
body.scrollTop = body.scrollHeight;
if (S.shown >= it.length) markRead(chapIdx);
}
function prime(){ const it = items(); S.shown = 0; do { S.shown++; } while (S.shown < it.length && it[S.shown - 1].m); }
const READMAP = [1, null, 2, 3, 4, 4, 5];
function markRead(i){
const ch = READMAP[i]; if (!ch) return;
try {
const a = JSON.parse(localStorage.getItem('bl.read') || '[]');
if (a.indexOf(ch) >= 0) return;
a.push(ch); a.sort((x, y) => x - y);
localStorage.setItem('bl.read', JSON.stringify(a));
setStatus('已读', '第 ' + ch + ' 章 · 解锁新的强化卡');
} catch (e) {}
}
window.__markRead = markRead;
function open(i){
if (!DIALOGUE[i]) return;
S.idx = i; S.th = 0; S.pick = {}; prime();
dlg.hidden = false; render();
btnNext.focus({ preventScroll: true });
setStatus('原文线索', '逐字引用');
}
function close(){
if (dlg.hidden) return;
dlg.hidden = true; S.idx = -1;
if (!sideBtn.hidden) sideBtn.focus({ preventScroll: true });
}
function next(){
if (gateOpen()) return;
const it = items();
if (S.shown < it.length) S.shown++;
while (S.shown < it.length && it[S.shown - 1].m) S.shown++;
render();
}
function all(){
const it = items();
while (S.shown < it.length && !gateOpen()) S.shown++;
render();
}
sideBtn.addEventListener('click', () => open(chapIdx));
$('#dlgClose').addEventListener('click', close);
dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
btnNext.addEventListener('click', next);
btnAll.addEventListener('click', all);
tabs.addEventListener('click', e => {
const b = e.target.closest('[data-th]'); if (!b) return;
S.th = +b.dataset.th; prime(); render();
});
body.addEventListener('click', e => {
const o = e.target.closest('[data-opt]');
if (o){
const g = o.closest('[data-gate]');
S.pick[S.th + ':' + g.dataset.gate] = +o.dataset.opt;
render();
if (!btnNext.disabled) btnNext.focus({ preventScroll: true });
return;
}
const w = e.target.closest('[data-pid]');
if (w && window.__arch){
const pid = w.dataset.pid;
close(); go(4);
requestAnimationFrame(() => { if (window.__arch.state().phase !== 'idle') window.__arch.close(); window.__arch.open(pid); });
}
});
addEventListener('keydown', e => {
if (dlg.hidden || e.key !== 'Escape') return;
e.stopImmediatePropagation(); e.preventDefault(); close();
}, true);
window.__dlgSync = () => {
const d = DIALOGUE[chapIdx];
const on = !!d && chapMode === 'detail';
sideBtn.hidden = !d;
if (d) $('#sideDlgN').textContent = '原文 ' + lineCount(d) + ' 句';
if (!dlg.hidden && (!on || S.idx !== chapIdx)) close();
};
window.__dlgClose = close;
window.__dialogue = { data: DIALOGUE, open, close, next, all, state: () => ({ idx: S.idx, th: S.th, shown: S.shown, open: !dlg.hidden }) };
window.__dlgSync();
})();
$('#roseChoice').addEventListener('click', e => {
const b = e.target.closest('[data-rose]');
if (!b) return;
const hidden = b.dataset.rose === 'hidden';
const lightning = b.dataset.rose === 'lightning';
$$('#roseChoice button').forEach(x => x.setAttribute('aria-current', String(x === b)));
$('#roseFigure').dataset.state = hidden ? 'hidden' : (lightning ? 'lightning' : 'seen');
if (window.__roseM) {
if (hidden) { window.__roseHold = false; window.__roseM.phase = 'gone'; window.__roseM.gone = 0; window.__roseM.target = 0; }
else { window.__roseHold = true; window.__roseM.phase = 'gaze'; }
}
if (window.__roseMorph) window.__roseMorph.to(lightning ? 'lightning' : 'rose');
$('#roseCore').textContent = hidden ? '不可见' : (lightning ? '粒子闪电' : '蓝色玫瑰');
$('#roseCaption').textContent = hidden
? '它不提供可重复的结果，只留下关于失去的感觉。'
: (lightning ? '模型的轮廓被采样成粒子，沿同一条光路重新聚合。' : '它更像记忆的回声，而不是实验室里的对象。');
setStatus('原文线索', '文学象征');
});
$('#roseChoice button[data-rose="seen"]').setAttribute('aria-current', 'true');
(function crtScreen(){
const crt = document.getElementById('crt');
const cv = document.getElementById('crtGL');
if (!crt || !cv) return;
const cover = document.getElementById('cover');
const scene = document.getElementById('coverScene');
const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let awakened = false;
function setParallax(e){
if (!scene || reduceMotion) return;
const r = crt.getBoundingClientRect();
const x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - .5) * 2));
const y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - .5) * 2));
scene.style.setProperty('--px', (x * 22).toFixed(2) + 'px');
scene.style.setProperty('--py', (y * 14).toFixed(2) + 'px');
}
function awaken(){
if (awakened || !cover || !document.body.classList.contains('cover-intro')) return;
awakened = true;
document.body.classList.remove('cover-intro');
document.body.classList.add('cover-awake');
window.setTimeout(() => document.body.classList.add('cover-reveal'), reduceMotion ? 0 : 900);
}
if (cover && document.body.classList.contains('cover-intro')){
window.setTimeout(awaken, reduceMotion ? 0 : 1600);
crt.addEventListener('pointerdown', awaken, { once: true });
}
function grainTile(size, density){
const c = document.createElement('canvas');
c.width = c.height = size;
const g = c.getContext('2d');
const img = g.createImageData(size, size);
const d = img.data;
for (let i = 0; i < d.length; i += 4){
let v = 0;
if (density >= 1 || Math.random() < density) v = 60 + ((Math.random() * 195) | 0);
d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 255;
}
g.putImageData(img, 0, 0);
return c.toDataURL();
}
document.documentElement.style.setProperty('--grain', 'url(' + grainTile(220, 1) + ')');
crt.style.setProperty('--grainSnow', 'url(' + grainTile(180, 0.16) + ')');
const GW = 132, GH = 92;
let wPrev = new Float32Array(GW * GH);
let wCur = new Float32Array(GW * GH);
const wBytes = new Uint8Array(GW * GH);
function stamp(fx, fy, power){
const cx = fx * GW, cy = fy * GH, rad = 2.4;
for (let y = Math.floor(cy - rad); y <= cy + rad; y++){
for (let x = Math.floor(cx - rad); x <= cx + rad; x++){
if (x < 1 || y < 1 || x >= GW - 1 || y >= GH - 1) continue;
const d = Math.hypot(x - cx, y - cy);
if (d > rad) continue;
wCur[y * GW + x] -= power * (1 - d / rad);
}
}
}
function simulate(){
for (let y = 1; y < GH - 1; y++){
const row = y * GW;
for (let x = 1; x < GW - 1; x++){
const i = row + x;
const v = (wPrev[i - 1] + wPrev[i + 1] + wPrev[i - GW] + wPrev[i + GW]) * 0.5 - wCur[i];
wCur[i] = v * 0.980;
}
}
const t = wPrev; wPrev = wCur; wCur = t;
for (let i = 0; i < wBytes.length; i++){
const v = 128 + wPrev[i] * 150;
wBytes[i] = v < 0 ? 0 : v > 255 ? 255 : v;
}
}
const gl = cv.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false });
if (!gl){ cv.style.display = 'none'; return; }
const VS = 'attribute vec2 aPos;varying vec2 vUv;' +
'void main(){vUv=aPos*0.5+0.5;gl_Position=vec4(aPos,0.0,1.0);}';
const FS = [
'precision highp float;',
'varying vec2 vUv;',
'uniform sampler2D uWave;',
'uniform vec2 uRes;',
'uniform float uTime;',
'uniform vec2 uPtr;',
'uniform float uHit;',
'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
'float noise(vec2 p){',
'  vec2 i=floor(p),f=fract(p);',
'  vec2 u=f*f*(3.0-2.0*f);',
'  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),',
'             mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);',
'}',
'float fbm(vec2 p){',
'  float v=0.0,a=0.55;',
'  for(int k=0;k<3;k++){v+=a*noise(p);p=p*2.07+11.3;a*=0.5;}',
'  return v;',
'}',
'void main(){',
'  vec2 uv=vUv;',
'  vec2 texel=1.0/uRes;',
'  float hL=texture2D(uWave,uv-vec2(texel.x,0.0)).r;',
'  float hR=texture2D(uWave,uv+vec2(texel.x,0.0)).r;',
'  float hD=texture2D(uWave,uv-vec2(0.0,texel.y)).r;',
'  float hU=texture2D(uWave,uv+vec2(0.0,texel.y)).r;',
'  vec2 grad=vec2(hR-hL,hU-hD);',
'  vec2 duv=uv+grad*0.115;',
'  float t=uTime*0.028;',
'  vec2 q=vec2(fbm(duv*1.7+vec2(t,-t*0.7)),',
'              fbm(duv*1.7+vec2(-t*0.6,t*0.9)+3.71));',
'  float warp=fbm(duv*3.3+q*2.3);',
'  float fine=fbm(duv*8.0-q*1.6);',
'  vec3 col=vec3(0.008,0.012,0.034);',
'  col+=vec3(0.05,0.20,0.58)*pow(warp,2.3)*1.10;',
'  col+=vec3(0.20,0.13,0.62)*pow(fine,2.7)*0.90;',
'  col+=vec3(0.10,0.42,0.95)*pow(warp*fine*3.0,1.9)*0.42;',
'  float d=length(uv-uPtr);',
'  col+=vec3(0.16,0.34,0.95)*smoothstep(0.38,0.0,d)*(0.03+uHit*0.10);',
'  float crest=smoothstep(0.07,0.38,abs(grad.x)+abs(grad.y));',
'  col+=vec3(0.45,0.70,1.00)*pow(crest,1.6)*0.75;',
'  col*=1.0-0.58*pow(length(uv-vec2(0.5))*1.32,2.1);',
'  gl_FragColor=vec4(col,1.0);',
'}'  ].join('\n');
function compile(type, src){
const s = gl.createShader(type);
gl.shaderSource(s, src); gl.compileShader(s);
if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
return s;
}
let prog;
try {
prog = gl.createProgram();
gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
gl.linkProgram(prog);
if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
} catch (err){
console.error('[crt]', err);
cv.style.display = 'none';
return;
}
gl.useProgram(prog);
const buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
const aPos = gl.getAttribLocation(prog, 'aPos');
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
const waveTex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, waveTex);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, GW, GH, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, wBytes);
const uWave = gl.getUniformLocation(prog, 'uWave');
const uRes = gl.getUniformLocation(prog, 'uRes');
const uTime = gl.getUniformLocation(prog, 'uTime');
const uPtr = gl.getUniformLocation(prog, 'uPtr');
const uHit = gl.getUniformLocation(prog, 'uHit');
const SCALE = 0.62;
let W = 1, H = 1;
function resize(){
const r = cv.getBoundingClientRect();
W = Math.max(1, Math.round(r.width * SCALE));
H = Math.max(1, Math.round(r.height * SCALE));
cv.width = W; cv.height = H;
gl.viewport(0, 0, W, H);
}
resize();
window.addEventListener('resize', resize);
const ptr = { x: .5, y: .5, down: false, on: false, lastX: .5, lastY: .5 };
let hit = 0;
function toUV(e){
const r = cv.getBoundingClientRect();
ptr.x = (e.clientX - r.left) / r.width;
ptr.y = 1.0 - (e.clientY - r.top) / r.height;
}
crt.addEventListener('pointerenter', () => { ptr.on = true; });
crt.addEventListener('pointerleave', () => { ptr.on = false; ptr.down = false; });
crt.addEventListener('pointerdown', e => {
toUV(e); ptr.down = true; hit = 1;
ptr.lastX = ptr.x; ptr.lastY = ptr.y;
stamp(ptr.x, ptr.y, 1.35);
});
window.addEventListener('pointerup', () => { ptr.down = false; });
crt.addEventListener('pointermove', e => {
setParallax(e);
toUV(e);
ptr.on = true;
if (!ptr.down) return;
const dx = ptr.x - ptr.lastX, dy = ptr.y - ptr.lastY;
if (Math.hypot(dx, dy) > 0.012){
stamp(ptr.x, ptr.y, Math.min(1.15, 0.45 + Math.hypot(dx, dy) * 2.0));
ptr.lastX = ptr.x; ptr.lastY = ptr.y;
}
});
let last = performance.now();
let lastDraw = 0;
function frame(now){
const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
last = now;
hit *= Math.exp(-dt * 2.2);
const running = document.getElementById('cover').classList.contains('on');
if (running && now - lastDraw > 30){
lastDraw = now;
simulate();
gl.bindTexture(gl.TEXTURE_2D, waveTex);
gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, GW, GH, gl.LUMINANCE, gl.UNSIGNED_BYTE, wBytes);
gl.uniform1i(uWave, 0);
gl.uniform2f(uRes, GW, GH);
gl.uniform1f(uTime, now / 1000);
gl.uniform2f(uPtr, ptr.x, ptr.y);
gl.uniform1f(uHit, hit);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
setInterval(function(){
if (!document.getElementById('cover').classList.contains('on')) return;
stamp(0.15 + Math.random() * 0.7, 0.2 + Math.random() * 0.6, 0.30 + Math.random() * 0.35);
}, 4200);
function snowLoop(){
const wait = 5500 + Math.random() * 9000;
setTimeout(function(){
crt.classList.add('snow');
const dur = 110 + Math.random() * 240;
setTimeout(function(){ crt.classList.remove('snow'); snowLoop(); }, dur);
}, wait);
}
snowLoop();
})();
(function prologueSequence(){
const root = document.getElementById('prologue');
const terminal = document.getElementById('prologueTerminal');
const textEl = document.getElementById('prologueText');
const world = document.getElementById('prologueWorld');
const grayWindow = document.getElementById('grayWindow');
const candle = document.getElementById('candleHit');
if (!root || !terminal || !textEl || !world || !grayWindow || !candle) return;
const story = '今天是我的生日，直到晚上爸爸妈妈点上了生日蛋糕的蜡烛，\n' +
'我们三个围着十四个小火苗坐下来，我才想起这事。\n' +
'这是个雷雨之夜，整个宇宙似乎是由密集的闪电和我们的小屋\n' +
'组成的。';
const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let audio = null;
let audioUnlocked = false;
let typingStarted = false;
let cursor = 0;
function unlockAudio(){
if (audioUnlocked) return;
try {
audio = new (window.AudioContext || window.webkitAudioContext)();
audio.resume();
audioUnlocked = true;
} catch (_) { audio = null; }
}
function sound(freq, duration, type, volume){
if (!audioUnlocked || !audio) return;
const now = audio.currentTime;
const osc = audio.createOscillator();
const gain = audio.createGain();
osc.type = type || 'square';
osc.frequency.setValueAtTime(freq, now);
gain.gain.setValueAtTime(0.0001, now);
gain.gain.exponentialRampToValueAtTime(volume || 0.025, now + 0.006);
gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
osc.connect(gain).connect(audio.destination);
osc.start(now);
osc.stop(now + duration + 0.015);
}
function typeNext(){
if (cursor >= story.length){
window.setTimeout(enterRoom, reduced ? 120 : 760);
return;
}
const char = story[cursor++];
textEl.textContent = story.slice(0, cursor);
if (char !== '\n') sound(480 + Math.random() * 70, .028, 'square', .012);
window.setTimeout(typeNext, char === '\n' ? (reduced ? 10 : 260) : (reduced ? 5 : 42 + Math.random() * 35));
}
function startTyping(){
if (typingStarted) return;
typingStarted = true;
const prompt = document.getElementById('introPrompt');
if (prompt) prompt.classList.add('hide');
root.classList.add('phase-terminal');
window.setTimeout(typeNext, reduced ? 0 : 500);
}
function footstep(delay, pitch){
window.setTimeout(() => {
sound(pitch, .16, 'triangle', .07);
sound(pitch * .52, .24, 'sine', .035);
}, delay);
}
function enterRoom(){
root.classList.remove('phase-terminal');
root.classList.add('phase-world');
world.setAttribute('aria-hidden', 'false');
footstep(280, 92); footstep(720, 84); footstep(1160, 76); footstep(1570, 68);
window.setTimeout(() => root.classList.add('room-arrived'), reduced ? 120 : 1850);
}
function openWindow(){
if (!root.classList.contains('room-arrived') || root.classList.contains('window-open')) return;
unlockAudio();
sound(210, .22, 'sine', .045);
root.classList.add('window-open');
window.setTimeout(() => root.classList.add('room-seen'), reduced ? 0 : 900);
}
function startGame(){
if (!root.classList.contains('room-seen') || root.classList.contains('candle-lit')) return;
unlockAudio();
sound(720, .35, 'sine', .04);
root.classList.add('candle-lit');
window.setTimeout(() => {
root.classList.add('phase-climax');
if (typeof window.startPrologueClimax === 'function') {
window.startPrologueClimax({
audio,
onComplete: function(destination) {
root.classList.add('done');
document.body.classList.remove('prologue-active','cover-intro');
document.body.classList.add('cover-reveal');
if (destination === 'lenses') {
go(2);
} else if (destination === 'stages') {
go(1);
} else if (destination === 'arsenal') {
window.location.href = entryHref();
} else {
go(1);
}
}
});
} else {
root.classList.add('done');
document.body.classList.remove('prologue-active','cover-intro');
document.body.classList.add('cover-reveal');
window.setTimeout(() => go(1), reduced ? 0 : 850);
}
}, reduced ? 160 : 1150);
}
window.__prologueReplay = function(){
if (typeof window.__climaxStop === 'function') { try { window.__climaxStop(); } catch (_) {} }
['done','phase-terminal','phase-world','window-open','room-seen','candle-lit','phase-climax','room-arrived']
.forEach(c => root.classList.remove(c));
document.body.classList.add('prologue-active','cover-intro');
document.body.classList.remove('cover-reveal');
textEl.textContent = '';
cursor = 0;
typingStarted = false;
const ec = document.getElementById('endCard'); if (ec) ec.classList.remove('visible');
if (typeof go === 'function') go(0);
void root.offsetWidth;
window.setTimeout(startTyping, 140);
};
let opened3d = false;
function enterPrologue3D(){
if (opened3d) return;
opened3d = true;
unlockAudio();
openScene3D();
}
root.addEventListener('pointerdown', () => {
if (!document.body.classList.contains('prologue-active') && !(document.getElementById('prologue') && !document.getElementById('prologue').classList.contains('done'))) return;
enterPrologue3D();
}, { passive: true });
window.__enterPrologue = enterPrologue3D;
window.addEventListener('keydown', e => {
if (!document.body.classList.contains('prologue-active') && !(document.getElementById('prologue') && !document.getElementById('prologue').classList.contains('done'))) return;
if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta' || e.key === 'Tab') return;
enterPrologue3D();   /* 任意键直接进入，不用先按空格再按一次 */
}, true);
grayWindow.addEventListener('click', openWindow);
candle.addEventListener('click', e => { e.stopPropagation(); startGame(); });
})();
window.startPrologueClimax = function({ audio, onComplete }) {
const canvas = document.getElementById('climaxCanvas');
const flashBang = document.getElementById('flashBang');
const spLine = document.getElementById('spLine');
const endCard = document.getElementById('endCard');
if (!canvas) return;
if (typeof window.__climaxStop === 'function') { try { window.__climaxStop(); } catch (_) {} }
window.__climaxAlive = true;
window.__climaxStop = function(){ window.__climaxAlive = false; };
window.__climaxDest = onComplete;
const ctx = canvas.getContext('2d');
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
w = canvas.width = window.innerWidth;
h = canvas.height = window.innerHeight;
});
function playAudio(fn) {
if (!audio) return;
try {
if (audio.state === 'suspended') audio.resume();
fn(audio);
} catch(e) {}
}
function playAncientXun() {
playAudio(actx => {
const now = actx.currentTime;
const osc1 = actx.createOscillator();
const osc2 = actx.createOscillator();
const filter = actx.createBiquadFilter();
const gain = actx.createGain();
osc1.type = 'sine';
osc1.frequency.setValueAtTime(88, now);
osc1.frequency.exponentialRampToValueAtTime(102, now + 6);
osc2.type = 'sine';
osc2.frequency.setValueAtTime(132, now);
osc2.frequency.exponentialRampToValueAtTime(148, now + 6);
filter.type = 'lowpass';
filter.frequency.setValueAtTime(260, now);
filter.frequency.linearRampToValueAtTime(420, now + 4);
filter.frequency.linearRampToValueAtTime(180, now + 8);
gain.gain.setValueAtTime(0.001, now);
gain.gain.exponentialRampToValueAtTime(0.16, now + 2);
gain.gain.exponentialRampToValueAtTime(0.001, now + 8.5);
osc1.connect(filter);
osc2.connect(filter);
filter.connect(gain);
gain.connect(actx.destination);
osc1.start(now);
osc2.start(now);
osc1.stop(now + 9);
osc2.stop(now + 9);
});
}
function playHairPluck() {
playAudio(actx => {
const now = actx.currentTime;
const osc = actx.createOscillator();
const gain = actx.createGain();
osc.type = 'triangle';
osc.frequency.setValueAtTime(820, now);
osc.frequency.exponentialRampToValueAtTime(240, now + 0.12);
gain.gain.setValueAtTime(0.001, now);
gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
osc.connect(gain);
gain.connect(actx.destination);
osc.start(now);
osc.stop(now + 0.15);
});
}
function playAvalancheSound() {
playAudio(actx => {
const now = actx.currentTime;
const bufSize = actx.sampleRate * 3.5;
const buffer = actx.createBuffer(1, bufSize, actx.sampleRate);
const output = buffer.getChannelData(0);
for (let i = 0; i < bufSize; i++) {
output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (actx.sampleRate * 1.2));
}
const whiteNoise = actx.createBufferSource();
whiteNoise.buffer = buffer;
const filter = actx.createBiquadFilter();
filter.type = 'bandpass';
filter.frequency.setValueAtTime(1400, now);
filter.frequency.exponentialRampToValueAtTime(320, now + 3);
filter.Q.value = 4.0;
const gain = actx.createGain();
gain.gain.setValueAtTime(0.14, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);
whiteNoise.connect(filter);
filter.connect(gain);
gain.connect(actx.destination);
whiteNoise.start(now);
});
}
let phase = 'silhouette_dialogue';
let t = 0;
let hairPlucked = false;
let marbleProgress = 0; // 0: 黑色剪影, 1: 汉白玉大理石雕塑
let avalancheProgress = 0; // 0: 雕像完整, 1: 完全坍塌成雪崩
function showSubtitle(text, dur = 3200) {
if (!spLine) return;
spLine.textContent = text;
spLine.classList.add('visible');
if (dur > 0) {
setTimeout(() => {
spLine.classList.remove('visible');
}, dur);
}
}
showSubtitle('“妈，你头上长了根白头发，我帮你拔了吧。”', 3200);
setTimeout(() => {
if (!hairPlucked && phase === 'silhouette_dialogue') {
showSubtitle('“别拔，拔一根长十根呢……”', 3200);
}
}, 3600);
const NUM_ASH = 2400;
const ashParticles = [];
function initAsh() {
ashParticles.length = 0;
for (let i = 0; i < NUM_ASH; i++) {
const isMother = (i % 2 === 0);
const baseX = isMother ? 0.38 : 0.62;
const baseY = 0.54;
const part = Math.random();
let rx, ry;
if (part < 0.25) { // 头部
rx = (Math.random() - 0.5) * 0.08;
ry = (Math.random() - 0.5) * 0.09 - 0.18;
} else if (part < 0.75) { // 躯干
rx = (Math.random() - 0.5) * 0.16;
ry = (Math.random() - 0.5) * 0.22;
} else { // 手臂桌前
rx = (Math.random() - 0.5) * 0.24;
ry = (Math.random() * 0.14) + 0.12;
}
ashParticles.push({
origX: baseX + rx,
origY: baseY + ry,
x: baseX + rx,
y: baseY + ry,
vx: (Math.random() - 0.5) * 0.0006,
vy: 0.0004 + Math.random() * 0.0018,
size: 1.2 + Math.random() * 2.2,
alpha: 0.7 + Math.random() * 0.3,
settled: false
});
}
}
initAsh();
const ballPos = { x: -0.15, y: 0.32, targetX: 0.62, targetY: 0.28 };
const ballSparks = [];
for (let i = 0; i < 90; i++) {
ballSparks.push({
angle: Math.random() * Math.PI * 2,
dist: Math.random() * 24,
speed: 0.02 + Math.random() * 0.05,
radius: 1.0 + Math.random() * 2.0,
alpha: 0.3 + Math.random() * 0.7
});
}
canvas.addEventListener('pointerdown', (e) => {
const rect = canvas.getBoundingClientRect();
const mx = (e.clientX - rect.left) / w;
const my = (e.clientY - rect.top) / h;
if (phase === 'silhouette_dialogue' && !hairPlucked) {
const dx = mx - 0.38;
const dy = my - 0.36;
if (Math.hypot(dx, dy) < 0.18) {
triggerHairPluck();
}
} else if (phase === 'statue_flash') {
triggerAvalanche();
}
});
function triggerHairPluck() {
hairPlucked = true;
playHairPluck();
showSubtitle('发丝已拔下，白发微光在指尖消散……', 2500);
setTimeout(() => {
phase = 'ball_patrol';
playAncientXun();
showSubtitle('“……那是什么？” 墙壁中浮现出一团冷色幽光。', 3800);
setTimeout(() => {
triggerStatueFlash();
}, 6500);
}, 3200);
}
function triggerStatueFlash() {
phase = 'statue_flash';
if (flashBang) {
flashBang.classList.add('flash');
setTimeout(() => {
flashBang.classList.remove('flash');
flashBang.classList.add('afterglow');
}, 80);
}
marbleProgress = 1.0;
showSubtitle('极亮刺目的白光吞没了一切……世界陷入绝对的死寂。', 3500);
setTimeout(() => {
showSubtitle('父母仍坐在那里，微笑着交谈，但已化作两座冷彻的汉白玉雕像。（轻触雕像）', 5000);
}, 4200);
}
function triggerAvalanche() {
if (phase === 'snow_avalanche' || phase === 'dest_card') return;
phase = 'snow_avalanche';
playAvalancheSound();
showSubtitle('指尖触碰的瞬间，像两堆松散的白雪一样坍塌下来……', 4000);
setTimeout(() => {
if (!window.__climaxAlive) return;
phase = 'dest_card';
if (endCard) {
endCard.classList.add('visible');
}
}, 4500);
}
document.querySelectorAll('.dest-card').forEach(btn => {
if (btn.__destBound) return;
btn.__destBound = true;
btn.addEventListener('click', (e) => {
e.stopPropagation();
if (!window.__climaxAlive) return;
const dest = btn.getAttribute('data-dest');
if (typeof window.__climaxDest === 'function') window.__climaxDest(dest);
});
});
let lastTime = performance.now();
function render(time) {
const dt = Math.min((time - lastTime) / 1000, 0.1);
lastTime = time;
t += dt;
ctx.fillStyle = '#020205';
ctx.fillRect(0, 0, w, h);
ctx.save();
const winGrad = ctx.createLinearGradient(w * 0.3, 0, w * 0.7, h * 0.7);
winGrad.addColorStop(0, 'rgba(15, 25, 60, 0.2)');
winGrad.addColorStop(1, 'rgba(5, 8, 18, 0)');
ctx.fillStyle = winGrad;
ctx.fillRect(0, 0, w, h);
ctx.restore();
const tableY = h * 0.65;
ctx.save();
ctx.fillStyle = '#080a14';
ctx.beginPath();
ctx.ellipse(w * 0.5, tableY, w * 0.28, h * 0.08, 0, 0, Math.PI * 2);
ctx.fill();
ctx.strokeStyle = 'rgba(140, 170, 255, 0.15)';
ctx.lineWidth = 1.5;
ctx.stroke();
const cakeX = w * 0.5;
const cakeY = tableY - h * 0.04;
ctx.fillStyle = '#141628';
ctx.beginPath();
ctx.ellipse(cakeX, cakeY, 32, 14, 0, 0, Math.PI * 2);
ctx.fill();
for (let c = 0; c < 14; c++) {
const angle = (c / 14) * Math.PI * 2;
const cx = cakeX + Math.cos(angle) * 22;
const cy = cakeY + Math.sin(angle) * 8 - 8;
const flicker = Math.sin(t * 8 + c) * 1.5;
const flameGrad = ctx.createRadialGradient(cx, cy, 1, cx, cy, 6 + flicker);
flameGrad.addColorStop(0, '#fff');
flameGrad.addColorStop(0.4, '#8eb4ff');
flameGrad.addColorStop(1, 'rgba(100, 140, 255, 0)');
ctx.fillStyle = flameGrad;
ctx.beginPath();
ctx.arc(cx, cy, 6 + flicker, 0, Math.PI * 2);
ctx.fill();
}
ctx.restore();
if (phase !== 'snow_avalanche' && phase !== 'dest_card') {
renderHumanSilhouette(w * 0.38, tableY, true, marbleProgress);
renderHumanSilhouette(w * 0.62, tableY, false, marbleProgress);
if (!hairPlucked && phase === 'silhouette_dialogue') {
renderWhiteHair(w * 0.38, tableY - h * 0.24);
}
} else {
renderAshAvalanche(dt);
}
if (phase === 'ball_patrol') {
renderBallLightning(dt);
}
if (window.__climaxAlive) requestAnimationFrame(render);
}
function renderHumanSilhouette(baseX, baseY, isMother, marbleVal) {
ctx.save();
ctx.translate(baseX, baseY);
let bodyColor, rimColor;
if (marbleVal > 0.5) {
bodyColor = '#e2e8f0'; // 冷白汉白玉
rimColor = 'rgba(255, 255, 255, 0.9)';
} else {
bodyColor = '#05070e';
rimColor = 'rgba(140, 180, 255, 0.3)';
}
ctx.fillStyle = bodyColor;
ctx.strokeStyle = rimColor;
ctx.lineWidth = 1.8;
ctx.beginPath();
ctx.moveTo(-w * 0.08, 0);
ctx.bezierCurveTo(-w * 0.07, -h * 0.16, -w * 0.04, -h * 0.2, 0, -h * 0.21);
ctx.bezierCurveTo(w * 0.04, -h * 0.2, w * 0.07, -h * 0.16, w * 0.08, 0);
ctx.closePath();
ctx.fill();
ctx.stroke();
const headTilt = isMother ? -0.06 : 0.05;
ctx.save();
ctx.translate(0, -h * 0.25);
ctx.rotate(headTilt);
ctx.beginPath();
ctx.ellipse(0, 0, w * 0.032, h * 0.055, 0, 0, Math.PI * 2);
ctx.fill();
ctx.stroke();
if (marbleVal > 0.5) {
ctx.strokeStyle = 'rgba(160, 180, 210, 0.4)';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(-10, -15);
ctx.lineTo(6, 4);
ctx.lineTo(14, 18);
ctx.stroke();
}
ctx.restore();
ctx.restore();
}
function renderWhiteHair(hx, hy) {
ctx.save();
ctx.translate(hx, hy);
const wave = Math.sin(t * 3) * 3;
ctx.lineWidth = 2.0;
ctx.strokeStyle = '#222';
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.quadraticCurveTo(-8, -12 + wave, -14, -20);
ctx.stroke();
ctx.strokeStyle = '#ffffff';
ctx.shadowColor = '#9dc2ff';
ctx.shadowBlur = 12;
ctx.beginPath();
ctx.moveTo(-14, -20);
ctx.quadraticCurveTo(-18, -26 + wave, -24, -32);
ctx.stroke();
ctx.fillStyle = '#fff';
ctx.beginPath();
ctx.arc(-24, -32, 2.5, 0, Math.PI * 2);
ctx.fill();
const rip = (t * 2) % 1;
ctx.strokeStyle = `rgba(180, 210, 255, ${1 - rip})`;
ctx.lineWidth = 1;
ctx.beginPath();
ctx.arc(-24, -32, rip * 18, 0, Math.PI * 2);
ctx.stroke();
ctx.restore();
}
function renderBallLightning(dt) {
ballPos.x += (ballPos.targetX - ballPos.x) * dt * 0.8;
ballPos.y += (ballPos.targetY - ballPos.y) * dt * 0.8;
const bx = ballPos.x * w;
const by = ballPos.y * h;
ctx.save();
ctx.translate(bx, by);
const outerGrad = ctx.createRadialGradient(0, 0, 12, 0, 0, 55);
outerGrad.addColorStop(0, 'rgba(30, 80, 255, 0.8)');
outerGrad.addColorStop(0.5, 'rgba(180, 30, 45, 0.45)');
outerGrad.addColorStop(1, 'rgba(180, 30, 45, 0)');
ctx.fillStyle = outerGrad;
ctx.beginPath();
ctx.arc(0, 0, 55, 0, Math.PI * 2);
ctx.fill();
const innerGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 24);
innerGrad.addColorStop(0, '#ffffff');
innerGrad.addColorStop(0.35, '#5ea8ff');
innerGrad.addColorStop(0.7, '#0037c8');
innerGrad.addColorStop(1, 'rgba(0, 20, 120, 0)');
ctx.fillStyle = innerGrad;
ctx.beginPath();
ctx.arc(0, 0, 24, 0, Math.PI * 2);
ctx.fill();
ballSparks.forEach(sp => {
sp.angle += sp.speed;
const sx = Math.cos(sp.angle) * sp.dist;
const sy = Math.sin(sp.angle) * sp.dist;
ctx.fillStyle = `rgba(210, 230, 255, ${sp.alpha})`;
ctx.beginPath();
ctx.arc(sx, sy, sp.radius, 0, Math.PI * 2);
ctx.fill();
});
ctx.restore();
}
function renderAshAvalanche(dt) {
const floorY = h * 0.68;
ctx.save();
ashParticles.forEach(p => {
if (!p.settled) {
p.vy += 0.00008;
p.y += p.vy;
p.x += p.vx + (Math.random() - 0.5) * 0.0008;
const currentPixelY = p.y * h;
if (currentPixelY >= floorY) {
p.settled = true;
p.y = floorY / h + (Math.random() - 0.5) * 0.02;
}
}
ctx.fillStyle = `rgba(240, 244, 255, ${p.alpha})`;
ctx.beginPath();
ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
ctx.fill();
});
ctx.restore();
}
requestAnimationFrame(render);
};
go(0);
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
canon: '小说原文直接写了这件事',
infer: '原文没直说，是从情节推出来的',
sim: '我们为了能操作而定的规则，不是原著内容',
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
plain: '这条线是你自己提的，小说里没有这么写。',
why: ['点线 = 待核实，表示"这只是个猜想"。', '右侧「关系」页签里是原文已有的关系，可以拿来对照。'],
next: ['换两个节点再连一条', '去 02 屏看这两个词的原文边界']
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
'<p>点画布上的圆，这里会出现：它是什么、原文怎么说、有什么规则、和谁有关系。</p>' +
'<p class="lp-legend"><i class="lg solid"></i>原文直接写了<i class="lg dashed"></i>从情节推出<i class="lg dotted"></i>我们定的规则／待核实</p></div>';
return;
}
const rels = D.relations.filter(r => r.from === state.sel || r.to === state.sel);
const tabs = [['def', '是什么'], ['ev', '原文'], ['rule', '规则'], ['rel', '关系']];
let body = '';
if (panelTab === 'def') {
body = '<p>' + esc(e.definition) + '</p>' +
'<p class="lp-k">在小说里的作用</p><p>' + esc(e.role) + '</p>' +
'<p class="lp-k">原文没交代的</p><p>' + esc((e.unknowns || []).join('；') || '—') + '</p>';
} else if (panelTab === 'ev') {
body = '<p class="lp-k">出处</p><p>' + esc(e.chapter) + ' · ' + esc(e.page) + '</p>' +
'<blockquote>' + esc(e.evidence) + '</blockquote>' +
'<p class="lp-note">' + esc(LEVEL_PLAIN[e.evidenceLevel] || '') + '。页码取自 PDF 内页标记，与纸书可能差几页。</p>' +
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
'<i class="lp-page">PAGE ' + esc(r.page) + '</i></div>';
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
'<button class="lr-more" data-more="1">为什么？看原文 ▾</button>' +
'<div class="lr-extra">' +
'<div class="lr-sec"><span class="lr-num">③</span><b>为什么</b>' + badge(res.level || 'sim', true) + '</div>' +
'<div class="lr-body">' + (res.why || res.body || []).map(s => '<p>' + esc(s) + '</p>').join('') +
(res.ev ? '<p class="lr-ev">原文：' + esc(res.ev) + '</p>' : '') + '</div></div>' +
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
'<span class="lc-drag-hint">题目全部来自小说原文，逐字核对过页码</span></div>';
return;
}
if (state.task === 'game') {
const playing = G && G.phase === 'play';
consoleEl.innerHTML =
'<div class="lc-head"><span class="lc-task">⚡ 雷雨夜 · 抓球闪</span>' +
'<span class="lc-goal">60 秒里尽量多抓。每抓一个，解锁一句小说原文。</span></div>' +
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
sim: '阈值、窗口、就绪度的算法都是我们定的模拟参数；引用的原文页码是真的。',
todo: ['就绪度的权重（四项平均）属于我们的设定，不是原著内容。']
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
why: ['小说里的"激发"必须有外部能量：闪电、人工电弧之类。'],
next: ['把「怎么激发」换成人工电弧或自然雷击'],
ev: 'PAGE 161：“我们所捕获到的那个空泡，哦，那个宏电子……”'
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
why: ['原文只写了"被激发"，没给具体数值，所以这个阈值是我们自己定的。'],
next: ['把「给多少能量」往右拉到 60 以上', '换成自然雷击，它的激发强度更高'],
ev: '原文没有能量阈值——这条规则属于设计模拟。'
});
animNode('bubble', 'fail');
return;
}
animNode('macro', 'excite');
place('ball', null, null);
showResult({
level: 'canon',
title: '成了：空泡变成球状闪电',
plain: '能量注入后，它从"低能态"跳到"高能态"——就是小说里的球状闪电。',
why: ['小说原话是"闪电只是点燃或激发了它"，也就是说球状闪电不是被造出来的，是早就在那儿的结构被点着了。',
'注意"低能态／高能态"这个说法是我们为了方便理解用的，原文没有用这个词。'],
next: ['等一会看它回落（约 2.6 秒）', '趁它亮着的时候做捕获（任务三）'],
ev: 'PAGE 113：“球状闪电并不是由闪电产生的，而是自然界早已存在的一种结构。”'
});
state.anim = setTimeout(() => {
showResult({
level: 'infer',
title: '回落：又变回暗的空泡',
plain: '高能态维持不住，能量散掉后回到原样。',
why: ['原文没有写回落要多久，这里的 2.6 秒是模拟节奏。'],
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
why: ['小说里这一步是直升机拉着电弧去"兜住"它，后来改用氦气飞艇。',
'这个百分比窗口是我们设的——原文没有给出可以照着按的秒数。'],
next: ['拿它去做任务二的激发实验', '换个时机再抓一次，看会不会失手'],
ev: 'PAGE 161：“我们所捕获到的那个空泡”；PAGE 164：捕获改用氦气飞艇。'
});
place('bubble', null, null);
} else {
showResult({
level: 'sim',
title: '没抓住：时机早了或晚了',
plain: '现在 ' + wait + '%，不在它最稳的 38–62% 之间。',
why: ['太早它还没稳，太晚它已经开始暗下去。',
'需求书里提到"约 0.5 秒"的窗口，但全文检索没有这句话，所以这里只用一个模拟百分比。'],
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
why: ['小说里的研究者也是先攒数据，再谈结构。'],
next: ['把「采几个点」拉到 8 以上']
});
return;
}
if (track === 'free') {
showResult({
level: 'infer',
title: '像自由电子：没找到中心',
plain: '轨迹基本是直的，看不出有东西拽着它。',
why: ['这不等于"没有宏原子核"，只说明这批数据不支持。',
'原文里研究者正是把"自由电子"和"原子里的电子"并列成两种可能。'],
next: ['观测更久一点再判断', '换一个电场更强的环境'],
ev: 'PAGE 161：“是自由电子呢，还是一个宏原子中的电子？”'
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
why: ['这就是"宏原子核"的推断方式：看不见它，但从轨迹能算出它大概在哪儿。',
'注意这是推出来的，不是直接看到的。'],
next: ['看看宏聚变需要的相撞速度（PAGE 251）', '继续采样，确认弯折是不是稳定的'],
ev: 'PAGE 161：“那这个宏原子的原子核在哪里呢？”'
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
plain: '小说只把"超级观察者"写成一个猜想，没说它存不存在。',
why: ['所以这里不给"成功／失败"，只把它标成待核实。'],
next: ['先对比"直接观察"和"关掉所有观测"两种确定的情况'],
ev: 'PAGE 176–177：观察者不需要有意识；去掉观察者后命中率只剩十分之一。'
});
return;
}
if (o.collapses === false) {
showResult({
level: 'canon',
title: '没人看着：结果散掉了',
plain: '关掉所有观测后，落点变得没法预测。',
why: ['原文写得很具体：去掉观察者后，命中率只有有人观察时的十分之一。',
'这不是"实验更成功"，而是它退回了概率状态。'],
next: ['换成摄像机观察，看看有什么区别', '记住：摄像机也算观察者'],
ev: 'PAGE 177：“只要去除观察者……命中率只及存在观察者时的十分之一。”'
});
place('quantum', null, null);
return;
}
showResult({
level: 'canon',
title: '有人看着：定住了',
plain: id === 'camera' ? '摄像机没有人，但原文明确说它也算观察者。' : '你在看，它就定成了确定的样子。',
why: ['小说用这一点把物理和哲学接在一起：观察者不需要有意识。'],
next: ['试试"关闭所有观测"', '再去看那朵玫瑰'],
ev: 'PAGE 176：“摄像机也是观察者……观察者并不需要有意识。”'
});
place('observer', null, null);
place('quantum', null, null);
}
function runRose() {
showResult({
level: 'todo',
title: '量子玫瑰：没有配方',
plain: '你越盯着看，它越不出现；视线移开，余光里才有蓝色轮廓。',
why: ['小说把它写成文学意象：理解理论并不能让你"做"出它，也不能让你再看一次。'],
next: ['把这段和尾声原文对照', '回 05 屏看那朵点云玫瑰'],
ev: 'PAGE 283：“那就是量子玫瑰向我微笑的时候。”'
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
(r.ev ? '<p class="lr-ev">原文：' + esc(r.ev) + '</p>' : '') + '</div>').join('') + '</div>';
}
if (resultEl) resultEl.addEventListener('click', e => {
if (e.target.closest('[data-close]')) { showResult(null); return; }
if (e.target.closest('[data-more]')) {
resultEl.classList.toggle('open');
const b = resultEl.querySelector('[data-more]');
if (b) b.textContent = resultEl.classList.contains('open') ? '收起解释 ▴' : '为什么？看原文 ▾';
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
why: ['每一步都在用小说里同一条研究路径：先有信号，再谈结构，最后才是能不能用它。'],
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
capture: { title: '等它最亮的时候点', plain: '球状闪电一明一暗地飘。外圈变绿、底部指针进绿区时点一下画面（或空格），飞艇就把它兜住。抓 3 个。', next: ['盯住外圈颜色', '变绿就点'] },
nucleus: { title: '记下电子走过的地方', plain: '一个宏电子在绕着看不见的东西转。点 6 下画面，每点一下记下它此刻的位置；然后点你觉得核所在的地方。', next: ['点 6 下记录轨迹', '再点一下你猜的核'] },
observer: { title: '开着摄像机打一轮，关掉再打一轮', plain: '左边发射球状闪电，右边是靶。先开着摄像机打 5 发，再关掉打 5 发，看命中差多少。', next: ['点「发射 5 发」', '再关掉摄像机打一轮'] }
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
showResult(Object.assign({ level: 'sim' }, MG_HELP[id], { why: ['这一步的玩法是我们设计的，用来把小说里的研究步骤变成能上手的操作。'] }), true);
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
mgFinish(Math.max(0, 1 - Math.abs(MG.e - 0.675) / 0.2), '<b>空泡被点成了球状闪电</b>“闪电只是点燃或激发了它？”<i class="cite" data-cite="113" data-needle="q113" role="button" tabindex="0">原文 · 第 113 页</i>');
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
mgFinish(Math.max(0, 1 - err / 0.28), '<b>三颗都关进了空泡</b>“我们所捕获到的那个空泡，哦，那个宏电子……”<i class="cite" data-cite="161" data-needle="q161a" role="button" tabindex="0">原文 · 第 161 页</i>');
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
mgFinish(q, '<b>它绕着一个看不见的核在转</b>“如果是后者，那这个宏原子的原子核在哪里呢？”<i class="cite" data-cite="161" data-needle="q161b" role="button" tabindex="0">原文 · 第 161 页</i>');
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
mgFinish({ eye: c.eye }, c.eye ? '<b>摄像机开着：' + c.hit + ' / 5 命中</b>“摄像机也是观察者……观察者并不需要有意识。”<i class="cite" data-cite="176" data-needle="q176" role="button" tabindex="0">原文 · 第 176 页</i>' :
'<b>没人看：' + c.hit + ' / 5 命中</b>“只要去除观察者……命中率只及存在观察者时的十分之一。”<i class="cite" data-cite="177" data-needle="q177" role="button" tabindex="0">原文 · 第 177 页</i>');
} else if (roundDone) {
MG.rose = 0.001;
const on = MG.round.find(r => r.eye), off = MG.round.find(r => !r.eye);
mgFinish({ on: on ? on.hit : null, off: off ? off.hit : null }, '<b>有人看 ' + (on ? on.hit : '–') + ' / 5，没人看 ' + (off ? off.hit : '–') + ' / 5</b>“只要去除观察者……命中率只及存在观察者时的十分之一。”<i class="cite" data-cite="177" data-needle="q177" role="button" tabindex="0">原文 · 第 177 页</i>');
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
showResult({ level: 'canon', title: '成了：空泡被点成球状闪电', plain: '雷电把能量灌进去，暗的空泡亮成了会飘的火球。',
carry: ['稳定度 ' + pct(q)],
why: ['小说原话是"闪电只是点燃或激发了它"：球状闪电不是被造出来的，是早就在那儿的结构被点着了。',
'绿区、充能速度都是我们设计的；原文没有给能量阈值。'],
next: ['再玩一次，争取停在绿区正中', '下一步：③ 抓住它'],
ev: 'PAGE 113：“球状闪电并不是由闪电产生的，而是自然界早已存在的一种结构。”' });
} else if (id === 'capture') {
place('bubble', null, null); draw();
showResult({ level: 'canon', title: '抓住了：三颗都关进空泡', plain: '每一次都在它最亮最稳的时候出手。',
carry: ['时机准度 ' + pct(q)],
why: ['小说里这一步先是直升机拉电弧去兜住它，后来改用氦气飞艇。',
'"最亮时才能抓"和亮暗周期是我们设计的；原文没有给出可以照着按的秒数。'],
next: ['再玩一次，看能不能每次都点在最亮的一刻', '下一步：④ 找原子核'],
ev: 'PAGE 161：“我们所捕获到的那个空泡”；PAGE 164：捕获改用氦气飞艇。' });
} else if (id === 'nucleus') {
place('nucleus', null, null); draw();
showResult({ level: 'infer', title: '推断：中间有个没露面的核', plain: '电子一直弯向同一个地方转，说明那儿有东西拉着它。',
carry: ['你的猜测准度 ' + pct(q)],
why: ['这就是"宏原子核"的推断方式：看不见它，但从轨迹能算出它大概在哪儿。',
'轨道形状和判定半径是我们设计的；原文只提出了"原子核在哪里"这个问题。'],
next: ['再玩一次，核的位置每局都会变', '下一步：⑤ 看与不看'],
ev: 'PAGE 161：“是自由电子呢，还是一个宏原子中的电子？如果是后者，那这个宏原子的原子核在哪里呢？”' });
} else {
place('observer', null, null); place('quantum', null, null); draw();
showResult({ level: 'canon', title: '有人看 ' + q.on + ' / 5，没人看 ' + q.off + ' / 5', plain: '摄像机开着，它就定成确定的样子、一打一个准；关掉，它退回一团概率云，落点散了。',
carry: ['有人看命中 ' + q.on + ' / 5', '没人看命中 ' + q.off + ' / 5'],
why: ['原文写得很具体：去掉观察者后，命中率只有有人观察时的十分之一；摄像机也算观察者。',
'每发的落点是随机的，按十分之一的比例抽，所以偶尔也会碰巧打中。'],
next: ['去看那朵玫瑰', '再玩一次'],
ev: 'PAGE 176：“摄像机也是观察者……观察者并不需要有意识。”PAGE 177：“只要去除观察者……命中率只及存在观察者时的十分之一。”' });
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
var QZ_DATA = {"timeline":[{"id":"t1","label":"生日夜球状闪电穿墙而入","quote":"这时它来了，是穿墙进来的，它从墙上那幅希腊众神狂欢的油画旁出现，仿佛是来自画中的一个幽灵。","page":15},{"id":"t2","label":"泰山上结识林云","quote":"她自我介绍叫林云，是国防科技大学的博士研究生，专业是防空武器系统。","page":41},{"id":"t3","label":"雷电武器只是玩具","quote":"正如上尉所说，我们造了个玩具，表演一下吓唬吓唬人还可以，却没有任何实战价值。","page":66},{"id":"t4","label":"格莫夫讲述3141往事","quote":"在那一时刻我认输了，在这自然或超自然的力量面前，经过三十年的奋斗，我彻底认输了。","page":101},{"id":"t5","label":"首次激发出球状闪电","quote":"这被人类激发的第一颗球状闪电在空中缓缓飘行了约一分钟，突然消失了。","page":133},{"id":"t6","label":"丁仪命名宏电子","quote":"它们是宏观尺度的电子，就叫宏电子吧。","page":161},{"id":"t7","label":"回国十天后战争爆发","quote":"我可能是最后一批出国的学者，回国后的第十天，战争爆发了。","page":209},{"id":"t8","label":"渔船伏击敌舰队","quote":"它们组成的舰阵正中是三艘航空母舰，它们那巨大的身躯在海面上投下三道巨大的阴影。","page":233},{"id":"t9","label":"宏聚变升起蓝太阳","quote":"整个宏聚变过程看上去就是一轮蓝太阳的升起和落下。","page":264},{"id":"t10","label":"只能用心看的量子玫瑰","quote":"又回到童年纯真的感觉和梦幻之中，那就是量子玫瑰向我微笑的时候。","page":290}],"speaker":[{"quote":"你能相信吗？我没把这东西给别人看过，因为他们肯定会认为这是伪造的。","speaker":"张彬","page":46,"context":"张彬给我看半焦半好的笔记本"},{"quote":"怎么样，对我所说的痛苦，你还抱着刚才那种超然的态度吗？","speaker":"张彬","page":51,"context":"张彬讲完寻酒的俄国故事"},{"quote":"你可能不相信，只有这时，我才感到片刻的安静。","speaker":"林云","page":39,"context":"泰山雷暴中初遇白衣姑娘"},{"quote":"你是那种被某件事占据了全部生活的人。","speaker":"林云","page":62,"context":"开车途中谈论武器之美"},{"quote":"孩子们，找点别的事干吧，世界上有意思的事很多……人生就一次，不要浪费在虚无缥缈的东西上。","speaker":"格莫夫","page":101,"context":"西伯利亚之夜醉酒劝说"},{"quote":"球状闪电并不是由闪电产生的，而是自然界早已存在的一种结构。","speaker":"我","page":113,"context":"在林将军家提出激发猜想"},{"quote":"你是说……闪电只是点燃或激发了它？","speaker":"林云","page":113,"context":"听到猜想后立刻追问"},{"quote":"我们已经把赌注放到大自然面前了，会不会血本无归呢？","speaker":"我","page":130,"context":"首次空中扫描前的忐忑"},{"quote":"没关系的，你就是将脑袋伸进去都没有关系。","speaker":"丁仪","page":157,"context":"空泡首次被众人看见"},{"quote":"看看，是我唯心还是你唯心？观察者并不需要有意识。","speaker":"丁仪","page":176,"context":"靶场争论摄像机算不算观察者"},{"quote":"是的孩子，我们一起走到这里的。","speaker":"林将军","page":268,"context":"宏聚变后镜面旁父女对话"},{"quote":"你才是做梦呢，大家整夜都在关注谈判进展。你在干什么？睡大觉？","speaker":"高波","page":282,"context":"停战消息传来的早晨"}],"realfake":[{"text":"它有篮球大小，发着朦胧的红光。","real":true,"page":15,"note":"真：P15生日夜球状闪电的样子"},{"text":"地毯上出现了两堆白灰，除此之外什么都没有了。","real":true,"page":16,"note":"真：P16父母化为灰烬"},{"text":"张彬以前叫过这个名字，‘文革’中改的，因为让人想起赫鲁晓夫。","real":true,"page":38,"note":"真：P38赵雨揭开张赫夫即张彬"},{"text":"看上去像肥皂泡，但表面没有肥皂泡的衍射彩纹","real":true,"page":142,"note":"真：P142丁仪描述空泡"},{"text":"这是人类第一次从球状闪电内部看外面的世界","real":true,"page":157,"note":"真：P157刘上尉把头伸进空泡"},{"text":"处于量子态的球状闪电有可能在仙女座星云出现，只是这种概率极其微小。","real":true,"page":177,"note":"真：P177概率云的说明"},{"text":"这是一个冷太阳，人们即使在近处也感觉不到它的任何热量。","real":true,"page":264,"note":"真：P264宏聚变的蓝太阳"},{"text":"后来知道，它的内部温度高达一万多度，表面却是滚烫的。","real":false,"page":15,"note":"假：P15原文是“表面却是冷凉的”"},{"text":"这三十年的试验中共产生了二十七个球状闪电，没有杀死过任何人。","real":false,"page":100,"note":"假：P100原文说二十七个球状闪电共杀死了三个人"},{"text":"格莫夫的儿子死于基地产生的第一个球状闪电。","real":false,"page":100,"note":"假：P100原文是死于“最后一个”球状闪电"},{"text":"“我终于喝到那酒，此生足矣！”丁仪说。","real":false,"page":133,"note":"假：P133说这话的是张彬，丁仪此时还未出场"},{"text":"只要去除观察者，球状闪电对目标的命中率只及存在观察者时的一半。","real":false,"page":177,"note":"假：P177原文是“十分之一”"},{"text":"蓝太阳停止膨胀时，半径达到二千米，这正好是丁仪预言的距离。","real":false,"page":264,"note":"假：P264原文半径为二百米"},{"text":"林云的母亲是在西伯利亚的3141基地牺牲的。","real":false,"page":268,"note":"假：P268原文说她母亲在南疆牺牲"}],"cloze":[{"before":"孩子，这就是生命和人生，脆弱而飘忽不定，经不起一丝","answer":"微风","after":"。","page":15,"decoys":["风雨","波澜","寒意"]},{"before":"美妙人生的关键在于你能","answer":"迷上","after":"什么东西。","page":19,"decoys":["看清","放下","得到"]},{"before":"如果说我的人生是一部电影，那前面已经放映过的都是黑白片，今天，在泰山之巅，画面突然变成","answer":"彩色","after":"的了。","page":42,"decoys":["透明","金色","模糊"]},{"before":"科学的入口处就是","answer":"地狱","after":"的入口处。","page":46,"decoys":["天堂","真理","迷宫"]},{"before":"就像电流点亮了电灯，但","answer":"电灯","after":"本身早已存在！","page":113,"decoys":["火焰","星星","灯塔"]},{"before":"透明的球体，因","answer":"弯曲","after":"光线而显示出圆形的边界。","page":142,"decoys":["压缩","吸收","散射"]},{"before":"摄像机也是观察者，同样会引起量子态的","answer":"坍缩","after":"。","page":176,"decoys":["叠加","膨胀","跃迁"]},{"before":"人们的目光像一把把无形的","answer":"扫帚","after":"，将芯片扫回毁灭态","page":265,"decoys":["镰刀","利剑","绳索"]},{"before":"但","answer":"存在态","after":"不管概率有多小，总还是存在的。","page":281,"decoys":["毁灭态","叠加态","量子态"]},{"before":"它是一朵我只能","answer":"用心","after":"来看的花。","page":290,"decoys":["双眼","梦里","记忆"]}]};
var QZ_ORDER = ['q-real', 'q-time', 'q-who', 'q-fill'];
var QZ_META = {
'q-real': { icon: '◐', name: '真假原文', n: 10, intro: '一句话，判断它是不是小说原文。有一半是我们改过一个字眼的假句。',
how: ['看完句子，点「原文」或「改写」（键盘 ← / →）', '每题 12 秒，答得快有加分，连对有倍数', '答错或超时扣一颗心，三颗心'] },
'q-time': { icon: '⟲', name: '回到那一夜', n: 10, intro: '十个情节被打乱了。按小说里发生的先后，一张一张点出来。',
how: ['从最早发生的那件事开始点', '点对了，它落进时间线，并展开那一页的原文', '点错扣分，不扣心'] },
'q-who': { icon: '❝', name: '谁说的', n: 10, intro: '一句台词，四个人。猜是谁说的。',
how: ['点头像，或按 1–4', '每题 12 秒，答得快有加分，连对有倍数', '答错或超时扣一颗心，三颗心'] },
'q-fill': { icon: '▢', name: '补全原句', n: 10, intro: '一句原文挖掉一个词，四个选项只有一个是刘慈欣写的。',
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
const pg = p => '<i class="qz-pg">原文 · 第 ' + p + ' 页</i>';
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
h = '<div class="qz-card qz-intro"><p class="qz-k">' + m.icon + ' 原文游戏</p><h3>' + esc(m.name) + '</h3>' +
'<p class="qz-lead">' + esc(m.intro) + '</p><ul class="qz-how">' + m.how.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
'<p class="qz-src">题目全部来自《球状闪电》原文，每一条都按页码逐字核对过。' +
(QZ.mode === 'q-real' ? '"改写"的那一半是我们故意改错的，答完会告诉你原文到底怎么写。' : '') + '</p>' +
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
h += '<div class="qz-card qz-q"><p class="qz-ask">这句话是小说原文吗？</p><blockquote class="qz-big">“' + esc(it.text) + '”</blockquote>' +
'<div class="qz-opts two">' +
['1', '0'].map(v => {
const lab = v === '1' ? '← 原文' : '改写 →';
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
(rv ? '<p class="qz-note ' + (QZ.ok ? 'ok' : 'bad') + '">' + (QZ.ok ? '✓ 答对 +' + QZ.gain : (QZ.timedOut ? '⌛ 超时' : '✗ 答错')) + ' · 原文第 ' + it.page + ' 页</p>' : '') + '</div>';
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
const rank = r > 0.75 ? '原著考据家' : r > 0.5 ? '老读者' : r > 0.25 ? '读过一遍' : '该重读了';
const head = QZ.mode === 'q-time' ? '时间线复原了' : (QZ.lives <= 0 ? '三颗心用完了' : '全部答完');
const rev = QZ.review.slice(0, 6).map(it => {
if (QZ.mode === 'q-real') return '<li><b>' + (it.real ? '原文' : '改写') + '</b>“' + esc(it.text) + '”<span>' + esc(it.note) + '</span></li>';
if (QZ.mode === 'q-who') return '<li><b>' + esc(it.speaker) + '</b>“' + esc(it.quote) + '”<span>第 ' + it.page + ' 页</span></li>';
if (QZ.mode === 'q-fill') return '<li><b>' + esc(it.answer) + '</b>“' + esc(it.before + it.answer + it.after) + '”<span>第 ' + it.page + ' 页</span></li>';
return '<li><b>' + esc(it.label) + '</b>“' + esc(it.quote) + '”<span>第 ' + it.page + ' 页</span></li>';
}).join('');
return '<div class="qz-card qz-end"><p class="qz-k">' + m.icon + ' ' + esc(m.name) + ' · ' + head + '</p>' +
'<h3>' + esc(rank) + (QZ.newBest ? ' <em>新纪录！</em>' : '') + '</h3>' +
'<div class="qz-stats"><div><b>' + QZ.score + '</b><span>分数</span></div><div><b>' + acc + '%</b><span>正确率</span></div>' +
'<div><b>' + QZ.bestStreak + '</b><span>最长连对</span></div><div><b>' + QZ.best + '</b><span>最高分</span></div></div>' +
(rev ? '<p class="qz-k qz-rk">' + (QZ.mode === 'q-time' ? '容易排错的几件事' : '答错的，原文是这样写的') + '</p><ul class="qz-review">' + rev + '</ul>' : '<p class="qz-src">一题没错。</p>') +
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
'<button data-arsenal="1" class="arsenal-chip">🔧 试验台 · 宏原子武器</button>' +
'<button class="legacy-toggle" data-legacy aria-expanded="false">原文小测 ▾</button>' +
QZ_ORDER.map(id => '<button data-task="' + id + '" class="quiz-chip legacy">' + QZ_META[id].icon + ' ' + QZ_META[id].name + '</button>').join('');
taskBar.addEventListener('click', e => {
const lg = e.target.closest('[data-legacy]');
if (lg) {
const open = taskBar.classList.toggle('show-legacy');
lg.setAttribute('aria-expanded', String(open));
lg.textContent = open ? '原文小测 ▴' : '原文小测 ▾';
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
if (box && !box.hidden) closeQuiz();
});
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
openQuiz();
renderPalette(); renderConsole(); renderLog(); renderQuest();
if (!state.nodes.length) setTask(state.task);
requestAnimationFrame(() => { draw(); fxResize(); fxStart(); gameResume(); });
}
}
if (switchEl) switchEl.addEventListener('click', e => {
const b = e.target.closest('[data-mode]');
if (!b) return;
setMode(b.dataset.mode === 'lab');
});
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
plain: '你把量子玫瑰拖过去，信号就没了。',
carry: ['操作序列：' + g.steps.join(' → ')],
why: ['原文里那朵玫瑰只能在注意力移开时出现——你不能"抓"它。'],
next: ['重置信号再来一次'],
ev: 'PAGE 283：“那就是量子玫瑰向我微笑的时候。”'
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
why: ['小说原话是"闪电只是点燃或激发了它"——点着的是早就在那儿的结构。',
'被激发过的信号能量更高，后面武器化的推演里底子更厚。'],
next: ['趁它亮着，再拖「观察者与坍缩」过去把它定住'],
ev: 'PAGE 113：“闪电只是点燃或激发了它？”'
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
why: ['原文写得比想象中硬：摄像机也算观察者，观察者不需要有意识。',
st === 'excited' ? '先激发再观察，得到的能量更高。' : '没激发就观察，位置定了但能量低。'],
next: ['再拖「空泡」过去，把它关起来'],
ev: 'PAGE 176：“摄像机也是观察者……观察者并不需要有意识。”'
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
'空泡能兜住它，是因为它已经被观察定住——原文里捕获用的正是这一层。'],
next: ['继续任务线，或者换个顺序再走一遍'],
ev: 'PAGE 161：“我们所捕获到的那个空泡，哦，那个宏电子……”'
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
{ id: 'l2', name: '激发它', why: '把低能态的结构点成球状闪电' },
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
why: ['小说里的起点就是这样：先有目击与回波，才有后面的实验室。',
'把握度越高，后面武器化的推演里"打准"的基础越好。'],
next: ['第 2 步：把它激发起来'],
ev: 'PAGE 113：“球状闪电并不是由闪电产生的，而是自然界早已存在的一种结构。”'
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
why: ['原文只写了"被激发"，没给阈值：45% 是我们定的模拟值。'],
next: ['把能量拉高，或换自然雷击']
});
return;
}
L.q.energy = clamp01(1 - Math.abs(eff - 0.62) / 0.38);
place('ball', null, null); autoLinks(); draw(); animNode('macro', 'excite');
L.step = 2; L.trail.push('用' + ex.name + '、能量 ' + power + '% 点着了');
showResult({
level: 'canon', title: '第 2 关过了：空泡被点成球状闪电',
plain: '低能态跳到高能态，它就是小说里那种会飘的发光球。',
carry: ['激发方式：' + ex.name, '稳定度 ' + Math.round(L.q.energy * 100) + '%'],
why: ['原文的说法是"闪电只是点燃或激发了它"——不是造出来，是点着早就在那儿的结构。'],
next: ['第 3 步：趁它亮着，抓住它'],
ev: 'PAGE 113：“闪电只是点燃或激发了它？”'
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
why: ['窗口 38–62% 是模拟参数；原文没有可照着按的秒数。'],
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
why: ['小说里这一步是直升机拉电弧兜住它，后期改用氦气飞艇。',
'捕获质量影响后面推演里"能不能稳住当武器"。'],
next: ['第 4 步：看它里面有没有核'],
ev: 'PAGE 161：“我们所捕获到的那个空泡”；PAGE 164：捕获改用氦气飞艇。'
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
carry: ['数据充分度 ' + Math.round(L.q.nucleus * 100) + '%', '宏原子核：推断存在'],
why: ['这是"推"出来的，不是直接看到的。原文里研究者也是这么问的。',
'有了核，"宏聚变"才谈得上——那是小说后半段的军事后果。'],
next: ['第 5 步：决定用谁来观察它'],
ev: 'PAGE 161：“那这个宏原子的原子核在哪里呢？”'
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
why: ['原文写得很直接：摄像机也算观察者，观察者不需要有意识。',
'接下来是这个推演真正的分岔：你要不要把它变成武器。'],
next: ['在下面选：继续武器化 / 到此为止'],
ev: 'PAGE 176–177：“摄像机也是观察者……”“命中率只及存在观察者时的十分之一。”'
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
why: ['小说里这条路的尽头是宏聚变武器，以及"文明退回低技术状态"的后果。',
'停手不是失败：它只是把"能不能"和"该不该"分开了。'],
next: ['换一组选择再来一次', '回到第 5 关，改看观察方式'],
ev: 'PAGE 251 起：宏聚变被军事系统吸收；结局的代价在尾声里。'
});
renderConsole(); renderQuest();
return;
}
let title, plain, why2;
if (noEye) {
title = '结局：造出来了，但打不准';
plain = '没有观察者时命中率只有十分之一，武器化没有意义。';
why2 = ['这是原文给出的数字，不是我们编的：去掉观察者，结果就发散。',
'于是你又把观察者请回来——而这就回到了"谁在看"的问题。'];
} else if (ready >= 70) {
title = '结局：武器化成功，代价也来了';
plain = '轨迹算得准、能量给得稳，宏聚变被做成了可用的东西。';
why2 = ['小说里这条路的终点是：一处引爆，大范围电子设备失效，文明退回低技术状态。',
'你这一路的每一步都"做对了"，所以后果也最完整。'];
} else {
title = '结局：勉强能用，但很不稳';
plain = '就绪度只有 ' + ready + '%，打出去更像碰运气。';
why2 = ['信号把握、激发稳定度、捕获质量、数据充分度里有一项拖了后腿。',
'在小说里，这种"大概能行"的东西照样会被推上前线。'];
}
L.trail.push(kind === 'weapon' ? '选择继续武器化' : '');
showResult({
level: ready >= 70 ? 'canon' : 'sim',
title: title,
plain: plain,
carry: ['就绪度 ' + Math.round(ready) + '%', L.obs === 'off' ? '命中率约 10%' : '命中率接近 100%'],
why: why2,
next: ['换一组选择再来一次'],
ev: 'PAGE 251：“达到临界速度的相撞肯定会引发核聚变。”尾声：代价。'
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
gToast.innerHTML = '<b>原文碎片 ' + G.cards.length + '/' + G_CARDS.length + ' · ' + esc(e.name) + '</b>' +
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
'<p class="lg-note">为什么要"先看再抓"：小说里写过"摄像机也是观察者"，被观察的球闪才停得住（PAGE 176）。' +
'游戏把它简化成两下点击——计时、分数、红球都是我们设计的玩法，不是原著。</p>' +
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
stat('最高连击', G.bestCombo) + stat('原文碎片', G.cards.length + '/' + G_CARDS.length) + stat('最高分', G.best) +
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
const MAX = 24000;
let N = REDUCED ? 6000 : (innerWidth <= 1000 ? 12000 : MAX);
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
const X = F(MAX), Y = F(MAX), SA = F(MAX), SB = F(MAX), SC = F(MAX), GX = F(MAX), GY = F(MAX);
const TX = F(MAX), TY = F(MAX), TS = F(MAX), TR = F(MAX), TG = F(MAX), TB = F(MAX), TA = F(MAX);
const BUF = F(MAX * 7);
for (let i = 0; i < MAX; i++) {
SA[i] = Math.random(); SB[i] = Math.random(); SC[i] = Math.random();
const r = Math.sqrt(-2 * Math.log(Math.random() + 1e-9)), a = Math.random() * Math.PI * 2;
GX[i] = r * Math.cos(a); GY[i] = r * Math.sin(a);
X[i] = 300 + GX[i] * 160; Y[i] = 300 + GY[i] * 160;
}
const TAU = Math.PI * 2, sin = Math.sin, cos = Math.cos, sqrt = Math.sqrt, abs = Math.abs;
const hash = (i, k) => { const v = sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
function put(i, x, y, sz, r, g, b, a) {
TX[i] = x; TY[i] = y; TS[i] = sz; TR[i] = r / 255; TG[i] = g / 255; TB[i] = b / 255; TA[i] = a;
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
storm: { follow: 0.3, repel: true, hint: '负电荷层与正电荷层不断积累，然后一次放电。移动鼠标可以拨开粒子。', f(t) {
const cyc = 2.6, k = Math.floor(t / cyc), ph = t - k * cyc;
if (k !== S.boltK) {
S.boltK = k;
const x0 = 170 + Math.random() * 260, x1 = x0 + (Math.random() - 0.5) * 160;
S.bolt = jag(x0, 150, x1, 450, 70, 6);
const p = along(S.bolt, 0.35 + Math.random() * 0.2);
S.branch = jag(p[0], p[1], p[0] + (Math.random() < 0.5 ? -1 : 1) * (60 + Math.random() * 80), p[1] + 70 + Math.random() * 60, 30, 4);
}
const vis = ph < 0.07 ? 1 : ph < 0.13 ? 0.25 : ph < 0.2 ? 0.95 : ph < 0.5 ? Math.max(0, 1 - (ph - 0.2) / 0.3) : 0;
const flash = vis * 0.5;
for (let i = 0; i < N; i++) {
const a = SA[i], b = SB[i], c = SC[i], role = i % 10;
if (role === 9 && vis > 0.02) {
const p = b < 0.28 ? along(S.branch, a) : along(S.bolt, a);
put(i, p[0] + GX[i] * 1.6, p[1] + GY[i] * 1.6, 2.1 + vis, 230, 240, 255, 0.9 * vis);
continue;
}
if (role === 8) {
const y = ((b * 640 + t * (380 + c * 260)) % 640) - 20;
put(i, a * 680 - 40 - y * 0.12, y, 0.9, 150, 175, 230, 0.16 + flash * 0.3);
continue;
}
const top = role < 4 || (role === 9 && b < 0.5);
const yb = top ? 150 : 450;
const x = 80 + a * 440 + sin(t * 0.7 + b * 20) * 6;
const y = yb + GY[i] * 7 + sin(t * 2.3 + a * 30) * 3;
if (top) put(i, x, y, 1.15, 120, 150, 255, 0.34 + flash);
else put(i, x, y, 1.15, 255, 165, 110, 0.32 + flash);
}
} },
ball: { follow: 0.2, repel: true, hint: '高温发光的核心、旋转的外壳、不断甩出的火花。移动鼠标可以拨开粒子。', f(t) {
const ox = 300 + sin(t * 0.4) * 34, oy = 300 + sin(t * 0.53) * 22;
for (let i = 0; i < N; i++) {
const a = SA[i], b = SB[i], c = SC[i], role = i % 20;
if (role < 11) {
const r = 74 * Math.pow(b, 0.55), th = a * TAU + t * (0.9 / (0.25 + b)), ph = Math.acos(2 * c - 1);
const pul = 1 + sin(t * 3 + b * 6) * 0.04, hot = 1 - b;
const z = r * Math.sin(ph) * sin(th);
put(i, ox + r * Math.sin(ph) * cos(th) * pul, oy + r * cos(ph) * pul, 1.1 + hot * 2.1,
255, 160 + hot * 90, 90 + hot * 150, 0.22 + hot * 0.48 + z / 74 * 0.08);
} else if (role < 17) {
const ring = role < 14 ? 0 : 1, R = (ring ? 170 : 118) + (b - 0.5) * 6, tilt = ring ? 1.15 : 0.5;
const th = a * TAU + t * (ring ? -0.25 : 0.4);
const x3 = cos(th) * R, z3 = sin(th) * R, y3 = z3 * sin(tilt), zz = z3 * cos(tilt);
const rot = ring ? 0.6 : -0.3;
put(i, ox + x3 * cos(rot) - y3 * sin(rot), oy + x3 * sin(rot) + y3 * cos(rot), zz > 0 ? 1.5 : 1,
150, 175, 255, 0.2 + (zz / R) * 0.12);
} else {
const life = (t * 0.55 + a) % 1, ang = b * TAU + sin(t + c * 9) * 0.3, d = 72 + life * (150 + c * 120);
put(i, ox + cos(ang) * d, oy + sin(ang) * d - life * life * 30, 1.8 * (1 - life) + 0.4, 255, 215, 150, (1 - life) * 0.8);
}
}
} },
macro: { follow: 0.2, repel: true, hint: '左边是普通电子，右边是放大 10¹⁴ 倍的宏电子：越大，波的形态越明显。', f(t) {
for (let i = 0; i < N; i++) {
const a = SA[i], b = SB[i], c = SC[i], role = i % 25;
if (role < 2) put(i, 170 + GX[i] * 4, 310 + GY[i] * 4, 1.4, 230, 235, 255, 0.7);
else if (role < 16) {
const th = a * TAU + t * 0.35 * (b < 0.5 ? 1 : -1);
const rr = 98 * (0.22 + 0.78 * sqrt(b)) + cos(th * 5 - t * 2.2) * 10 * b;
put(i, 430 + cos(th) * rr, 310 + sin(th) * rr, 1.1 + (1 - b) * 1.2, 140, 160, 255, 0.2 + (1 - b) * 0.3);
} else {
const life = (t * 0.3 + a) % 1, amp = life * life * 62;
put(i, 178 + life * 236, 310 + sin(life * 18 - t * 4 + b * TAU) * amp * c, 0.8 + life * 1.8,
190, 200, 255, 0.12 + 0.5 * sin(life * Math.PI));
}
}
} },
nucleus: { follow: 0.22, repel: true, hint: '宏原子：中间是宏原子核，三条轨道上的宏电子拖着尾巴绕行。', f(t) {
for (let i = 0; i < N; i++) {
const a = SA[i], b = SB[i], c = SC[i], role = i % 10;
if (role < 2) {
const br = 1 + sin(t * 2.2) * 0.08, sw = t * 0.6;
const x = GX[i] * 17 * br, y = GY[i] * 17 * br;
put(i, 300 + x * cos(sw) - y * sin(sw), 300 + x * sin(sw) + y * cos(sw), 1.6, 255, 215, 170, 0.5);
} else {
const ring = i % 3, trail = b * b;
const ang = t * (0.9 + ring * 0.35) + ring * 2 - trail * 2.8;
const R = 125 + ring * 22 + (c - 0.5) * 4, incl = 1.2, rot = ring * 2.1;
const x3 = cos(ang) * R, y3 = sin(ang) * R * cos(incl), z3 = sin(ang) * R * sin(incl);
const head = Math.pow(1 - trail, 3);
put(i, 300 + x3 * cos(rot) - y3 * sin(rot), 300 + x3 * sin(rot) + y3 * cos(rot),
1 + Math.pow(1 - trail, 6) * 2.6, 150, 180, 255, (0.05 + 0.7 * head) * (z3 > 0 ? 1 : 0.55));
}
}
} },
bubble: { follow: 0.2, repel: true, hint: '空泡：一层透明的壳，只有边缘看得见。壳上有缓慢的涟漪。', f(t) {
const ry = t * 0.25, rx = 0.35;
for (let i = 0; i < N; i++) {
const a = SA[i], b = SB[i], c = SC[i], role = i % 20;
if (role < 16) {
const th = a * TAU, ph = Math.acos(2 * b - 1), R = 150 + sin(ph * 7 - t * 2.5) * 3.5;
let x = R * Math.sin(ph) * cos(th), y = R * cos(ph), z = R * Math.sin(ph) * sin(th);
const x2 = x * cos(ry) + z * sin(ry), z2 = -x * sin(ry) + z * cos(ry);
const y2 = y * cos(rx) - z2 * sin(rx), z3 = y * sin(rx) + z2 * cos(rx);
const rim = Math.pow(1 - abs(z3) / R, 2);
put(i, 300 + x2, 300 + y2, 1.1, 170, 215, 255, 0.03 + rim * 0.5);
} else if (role < 19) {
const r = 86 * sqrt(c), th = a * TAU + t * (0.5 / (0.3 + c));
put(i, 300 + cos(th) * r, 300 + sin(th) * r * 0.9, 1, 160, 190, 255, 0.14);
} else put(i, 300 + GX[i] * 10, 300 + GY[i] * 10, 1.6, 240, 245, 255, 0.6);
}
} },
quantum: { follow: 0.5, repel: false, hint: '没人看时，它同时在两处（概率云）。把鼠标移到中间 = 观察，它坍缩到其中一处。', f(t, dt) {
const want = S.px != null ? nearness(230) : ((t % 7) > 5.2 ? 1 : 0);
if (want && S.obs < 0.05) S.lobe = Math.random() < 0.5 ? 268 : 332;
S.obs += (want - S.obs) * Math.min(1, dt * 5);
const o = S.obs;
for (let i = 0; i < N; i++) {
const k = Math.floor(t * 7 + SA[i] * 7);
const h1 = hash(i, k), h2 = hash(i + 7.3, k), h3 = hash(i + 3.1, k);
const rad = sqrt(-2 * Math.log(h1 + 1e-6)) * 34, ang = h2 * TAU, lobe = h3 < 0.5 ? 268 : 332;
const x0 = lobe + cos(ang) * rad, y0 = 300 + sin(ang) * rad;
const x1 = S.lobe + GX[i] * 3, y1 = 300 + GY[i] * 3;
put(i, x0 + (x1 - x0) * o, y0 + (y1 - y0) * o, 1.1 + o * 0.8,
130 + 110 * o, 150 + 95 * o, 255, 0.3 + o * 0.35);
}
} },
transition: { follow: 0.3, repel: true, hint: '粒子在两个能级之间瞬移，中间不经过；虚线上流动的光点是"我们眼中的连续轨迹"。', f(t) {
for (let i = 0; i < N; i++) {
const a = SA[i], b = SB[i], c = SC[i], role = i % 10;
if (role < 7) {
const p = (t * 0.22 + a) % 1, lvl = p < 0.5 ? 0 : 1, fl = Math.max(0, 1 - (p % 0.5) / 0.06);
const cx = lvl ? 430 : 170, th = b * TAU + t * 1.5, R = 34 + (c - 0.5) * 8;
if (lvl) put(i, cx + cos(th) * R, 300 + sin(th) * R, 1.2 + fl * 2, 255, 190, 130, 0.32 + fl * 0.5);
else put(i, cx + cos(th) * R, 300 + sin(th) * R, 1.2 + fl * 2, 150, 175, 255, 0.32 + fl * 0.5);
} else if (role < 9) {
put(i, 215 + ((t * 0.4 + a) % 1) * 170, 300 + (b - 0.5) * 4, 0.9, 235, 240, 255, 0.22);
} else {
const life = (t * 0.8 + a) % 1, side = Math.floor(t * 0.8 + a) % 2 ? 430 : 170, ang = b * TAU;
put(i, side + cos(ang) * life * 120, 300 + sin(ang) * life * 120, 1.2, 255, 230, 170, (1 - life) * 0.55);
}
}
} },
fusion: { follow: 0.25, repel: true, hint: '宏聚变：中心压缩、点燃，冲击波一格一格扫过，被扫到的单元先亮后熄。', f(t) {
const ph = t % 6, R = Math.max(0, ph - 0.6) / 5.4 * 330;
for (let i = 0; i < N; i++) {
const a = SA[i], b = SB[i], c = SC[i], role = i % 20;
if (role < 12) {
const cell = i % 49, gx = 198 + (cell % 7) * 32, gy = 198 + Math.floor(cell / 7) * 32;
const dx = gx - 300, dy = gy - 300, d = Math.hypot(dx, dy) || 1, hit = R - d;
let x = gx + (a - 0.5) * 20, y = gy + (b - 0.5) * 20;
if (R <= 0 || hit < 0) put(i, x, y, 1, 150, 170, 255, 0.22);
else if (hit < 40) {
const k = 1 - hit / 40;
put(i, x + dx / d * hit * 0.5 * c, y + dy / d * hit * 0.5 * c, 1.2 + k * 1.6, 255, 190, 110, 0.3 + k * 0.6);
} else put(i, x, y + Math.min(26, (hit - 40) * 0.3) * c, 0.9, 110, 110, 140, 0.08);
} else if (role < 16) {
const r = ph < 0.6 ? 42 * (1 - ph / 0.6 * 0.82) : 8 + (ph - 0.6) * 5;
const hot = ph > 0.55 && ph < 1.1 ? 1 - abs(ph - 0.8) / 0.3 : 0;
const th = a * TAU + t;
put(i, 300 + cos(th) * (r + GX[i] * 2), 300 + sin(th) * (r + GY[i] * 2), 1.2 + hot * 2.4,
200 + hot * 55, 200 + hot * 20, 255 - hot * 120, 0.3 + hot * 0.6);
} else {
const r = R + (b - 0.5) * 6, th = a * TAU;
put(i, 300 + cos(th) * r, 300 + sin(th) * r, 1.1, 255, 200, 140, R > 0 && R < 330 ? (1 - R / 330) * 0.6 : 0);
}
}
} },
observer: { follow: 0.22, repel: false, hint: '一条铺开的波。把鼠标移到中间 = 观察，波坍缩成一个点；移开，它又散回波。', f(t, dt) {
const want = S.px != null ? nearness(230) : (((t % 7) > 4.6 && (t % 7) < 6.2) ? 1 : 0);
S.obs += (want - S.obs) * Math.min(1, dt * 4);
const o = S.obs;
for (let i = 0; i < N; i++) {
const x = 80 + SA[i] * 440, env = Math.exp(-Math.pow((x - 300) / 170, 2));
const y = 300 - 34 * sin(Math.PI * (x - 80) / 68 - t * 2) * (0.55 + 0.45 * env) + (SB[i] - 0.5) * 10;
const x1 = 300 + GX[i] * 2.5, y1 = 300 + GY[i] * 2.5;
put(i, x + (x1 - x) * o, y + (y1 - y) * o, 1.1 + o * 0.7, 150 + 90 * o, 170 + 75 * o, 255, 0.26 + 0.3 * o);
}
} },
rose: { follow: 0.12, repel: false, hint: '量子玫瑰只在没人盯着时显形。把鼠标移到中间盯着它，它就散开；移开视线，它才回来。', f(t, dt) {
const want = S.px != null ? nearness(200) : 0;
S.look += (want - S.look) * Math.min(1, dt * 3);
const lk = S.look, br = 1 + sin(t * 0.8) * 0.03;
const KS = [5, 3, 7], RS = [152, 108, 64], CL = [[100, 140, 255], [140, 170, 255], [200, 215, 255]];
for (let i = 0; i < N; i++) {
const L = i % 3, th = SA[i] * Math.PI, k = KS[L];
const r = RS[L] * br * cos(k * th) * (0.7 + 0.3 * sqrt(SB[i]));
const rot = t * 0.08 * (L + 1) * (L % 2 ? -1 : 1);
const x = 300 + r * cos(th + rot) + GX[i] * lk * 130, y = 300 + r * sin(th + rot) + GY[i] * lk * 130;
put(i, x, y, 1.2, CL[L][0], CL[L][1], CL[L][2], 0.3 * (1 - lk * 0.85));
}
} }
};
let cur = 'ball';
function setScene(k) {
if (!SCN[k]) k = 'ball';
if (k === cur && S.sceneT) return;
cur = k; S.sceneT = S.t; S.obs = 0; S.look = 0; S.boltK = -1;
hint.textContent = SCN[k].hint;
kick();
}
let prog = null, vbo = null, loc = {};
if (gl) {
const vs = 'attribute vec2 aP;attribute float aS;attribute vec4 aC;uniform vec2 uR;uniform float uH;varying vec4 vC;' +
'vec3 hue(vec3 c,float a){const vec3 k=vec3(0.57735);float ca=cos(a);return c*ca+cross(k,c)*sin(a)+k*dot(k,c)*(1.0-ca);}' +
'void main(){vec2 p=aP/uR*2.0-1.0;gl_Position=vec4(p.x,-p.y,0.0,1.0);gl_PointSize=aS;vC=vec4(clamp(hue(aC.rgb,uH),0.0,1.0),aC.a);}';
const fs = 'precision mediump float;varying vec4 vC;uniform float uG;' +
'void main(){vec2 q=gl_PointCoord-0.5;float d=length(q)*2.0;if(d>1.0)discard;' +
'float a=(exp(-d*d*7.0)+exp(-d*d*2.2)*0.45*uG)*vC.a;gl_FragColor=vec4(vC.rgb*a,a);}';
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
loc = { P: gl.getAttribLocation(prog, 'aP'), S: gl.getAttribLocation(prog, 'aS'), C: gl.getAttribLocation(prog, 'aC'),
R: gl.getUniformLocation(prog, 'uR'), H: gl.getUniformLocation(prog, 'uH'), G: gl.getUniformLocation(prog, 'uG') };
gl.enableVertexAttribArray(loc.P); gl.vertexAttribPointer(loc.P, 2, gl.FLOAT, false, 28, 0);
gl.enableVertexAttribArray(loc.S); gl.vertexAttribPointer(loc.S, 1, gl.FLOAT, false, 28, 8);
gl.enableVertexAttribArray(loc.C); gl.vertexAttribPointer(loc.C, 4, gl.FLOAT, false, 28, 12);
gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
}
}
let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, u = 1;
function layout() {
const r = stage.getBoundingClientRect();
dpr = Math.min(2, devicePixelRatio || 1);
const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
if (w !== W || h !== H) { W = w; H = h; cv.width = w; cv.height = h; if (gl) gl.viewport(0, 0, w, h); }
const c = center.getBoundingClientRect();
const z = typeof zScale === 'number' ? zScale : 1;
cx = (c.left - r.left + c.width / 2) * dpr; cy = (c.top - r.top + c.height / 2) * dpr;
u = c.width / 600 * z * dpr;
}
stage.addEventListener('pointermove', e => {
const r = stage.getBoundingClientRect();
S.px = ((e.clientX - r.left) * dpr - cx) / u + 300;
S.py = ((e.clientY - r.top) * dpr - cy) / u + 300;
});
stage.addEventListener('pointerleave', () => { S.px = S.py = null; });
let raf = null, last = 0, frames = 0, ema = 16, sinceAdapt = 0;
const running = () => concepts.classList.contains('on') && !concepts.classList.contains('lab-on') && !document.hidden;
function kick() { if (raf == null && running()) { last = performance.now(); raf = requestAnimationFrame(frame); } }
function frame(now) {
raf = null;
if (!running()) { if (gl) { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); } return; }
const real = Math.min(0.1, (now - last) / 1000 || 0.016);
last = now;
const dt = Math.min(0.05, real) * (REDUCED ? 0.35 : 1);
S.t += dt;
ema = ema * 0.94 + real * 1000 * 0.06;
if (++sinceAdapt > 150 && ema > 42 && N > 12000) { N = Math.max(12000, Math.floor(N * 0.8)); sinceAdapt = 0; }
layout();
const sc = SCN[cur];
sc.f(S.t, dt);
const mt = Math.min(1, (S.t - S.sceneT) / 1.1);
const fol = mt < 1 ? 0.035 + 0.12 * mt : sc.follow;
const T = window.TUNE || { bright: 100, size: 100, glow: 50, hue: 0 };
const sizeK = 1.8 * dpr * (T.size / 100) * Math.max(0.7, Math.min(1.6, u / dpr)) * (1 + T.glow / 100 * 0.6);
const alphaK = (T.bright / 100) * Math.min(1.6, sqrt(MAX / N)) * 0.9;
const rep = sc.repel && S.px != null, rr = 70;
for (let i = 0; i < N; i++) {
let x = X[i], y = Y[i];
const dx0 = TX[i] - x, dy0 = TY[i] - y;
if (mt >= 1 && dx0 * dx0 + dy0 * dy0 > 14400) { x = TX[i]; y = TY[i]; }
else { x += dx0 * fol; y += dy0 * fol; }
if (rep) {
const dx = x - S.px, dy = y - S.py, d2 = dx * dx + dy * dy;
if (d2 < rr * rr && d2 > 0.01) { const d = sqrt(d2), k = (1 - d / rr); x += dx / d * k * k * 18; y += dy / d * k * k * 18; }
}
X[i] = x; Y[i] = y;
const o = i * 7;
BUF[o] = cx + (x - 300) * u; BUF[o + 1] = cy + (y - 300) * u; BUF[o + 2] = TS[i] * sizeK;
BUF[o + 3] = TR[i]; BUF[o + 4] = TG[i]; BUF[o + 5] = TB[i]; BUF[o + 6] = Math.max(0, Math.min(1, TA[i] * alphaK));
}
if (gl) {
gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
gl.uniform2f(loc.R, W, H);
gl.uniform1f(loc.H, T.hue * Math.PI / 180);
gl.uniform1f(loc.G, T.glow / 50);
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferSubData(gl.ARRAY_BUFFER, 0, BUF.subarray(0, N * 7));
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
info: () => ({ n: N, scene: cur, frames, running: raf != null, gl: !!gl, ema: Math.round(ema) })
};
const curBtn = document.querySelector('#cgList [aria-current="true"]');
setScene(curBtn ? curBtn.dataset.node : 'ball');
})();
readHash();
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
(function () {
var panel = document.getElementById('citePanel');
var scrim = document.getElementById('citeScrim');
var body = document.getElementById('citeBody');
var title = document.getElementById('citeTitle');
var pos = document.getElementById('citePos');
var prev = document.getElementById('citePrev');
var next = document.getElementById('citeNext');
var closeBtn = document.getElementById('citeClose');
if (!panel || typeof CITE_PAGES === 'undefined') return;
var cur = 0, needle = '';
var keys = Object.keys(CITE_PAGES).map(Number).sort(function (a, b) { return a - b; });
function esc(s) {
return String(s).replace(/[&<>"]/g, function (c) {
return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
});
}
function render() {
var t = CITE_PAGES[cur];
if (!t) return;
var html = esc(t);
var q = needle ? esc(needle) : '';
if (q && html.indexOf(q) !== -1) html = html.replace(q, '<mark>' + q + '</mark>');
body.innerHTML = html;
title.textContent = '第 ' + cur + ' 页';
pos.textContent = cur + ' / ' + keys[keys.length - 1];
var i = keys.indexOf(cur);
prev.disabled = i <= 0;
next.disabled = i < 0 || i >= keys.length - 1;
body.scrollTop = 0;
var mk = body.querySelector('mark');
if (mk) { var top = mk.offsetTop - body.clientHeight * 0.35; if (top > 0) body.scrollTop = top; }
}
function open(page, id) {
cur = Number(page) || keys[0];
needle = (CITE_NEEDLE && CITE_NEEDLE[id]) || '';
panel.classList.add('on'); scrim.classList.add('on');
panel.setAttribute('aria-hidden', 'false');
render();
}
function shut() {
panel.classList.remove('on'); scrim.classList.remove('on');
panel.setAttribute('aria-hidden', 'true');
}
function step(d) { var i = keys.indexOf(cur) + d; if (i >= 0 && i < keys.length) { cur = keys[i]; needle = ''; render(); } }
document.addEventListener('click', function (e) {
var t = e.target.closest ? e.target.closest('.cite') : null;
if (t) { e.preventDefault(); open(t.getAttribute('data-cite'), t.getAttribute('data-needle')); return; }
if (e.target === scrim) shut();
});
document.addEventListener('keydown', function (e) {
if (e.key === 'Escape') shut();
});
prev.onclick = function () { step(-1); };
next.onclick = function () { step(1); };
closeBtn.onclick = shut;
})();
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
var g=document.getElementById('bootGate'); if(!g) return;
var pct=document.getElementById('bootPct'), bar=document.getElementById('bootBar');
var p=0, done=false;
function draw(v){ p=v; if(pct) pct.textContent=String(Math.floor(v)); if(bar) bar.style.width=v+'%'; }
var t=setInterval(function(){ if(done) return; if(p<86){ p+=Math.random()*7; draw(Math.min(86,p)); } },260);
function finish(){
if(done) return; done=true; clearInterval(t); draw(100);
setTimeout(function(){ g.classList.add('bg-done'); setTimeout(function(){ g.remove(); },700); },260);
}
function check(){
var v=document.querySelector('#cover .cover-vid') || document.querySelector('.cover-vid');
if(v && v.readyState>=2) return finish();
setTimeout(check,220);
}
if(document.readyState==='complete') setTimeout(check,120);
else window.addEventListener('load',function(){ setTimeout(check,120); });
setTimeout(finish,12000);   /* 兜底：无论如何 12 秒后放行 */
})();
addEventListener('message', function (e) {
var t = e.data && e.data.type;
if (t === 'prologue-home') { closeScene3D(); }
if (t === 'prologue-next') { closeScene3D(); showScene('anomaly'); }
});