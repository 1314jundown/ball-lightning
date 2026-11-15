window.LAB = {
meta: {
source: '《球状闪电》正文（PDF 抽取全文）＋ 研究报告 TABLE 4/5/6 ＋ 现实层（教科书级共识／观测与实验，逐条标来源）',
pageNote: '页码取自 PDF 内嵌页标记（===== PAGE n =====），与纸书版次可能相差数页。',
levels: {
canon: { label: '原文明示', line: 'solid' },
infer: { label: '文本推断', line: 'dashed' },
sim: { label: '设计模拟', line: 'dotted' },
todo: { label: '待核实', line: 'dotted' }
}
},
elements: {
storm: {
name: '雷暴', realityStatus: '现实知识', evidenceLevel: 'canon',
definition: '雷暴云中电荷分离与放电形成闪电，是现实大气电学；在小说里它既是序曲的场景，也是后续"人工引雷"的实验条件。',
role: '为球状闪电的出现、以及"用闪电去激发它"的思路提供大气背景。',
chapter: '序曲 / 中篇', page: '1–5、113',
evidence: '“球状闪电并不是由闪电产生的，而是自然界早已存在的一种结构。”“你是说……闪电只是点燃或激发了它？”',
rules: {
pre: ['需要雷暴或人工引雷条件'],
trigger: ['大气电场达到临界点'],
states: ['平静 → 电场累积 → 放电'],
observable: ['闪电通道、雷声、电磁脉冲'],
fail: ['电场不足，不触发'],
consequence: ['可能触发空间中已存在的结构（小说设定）']
},
related: ['ball', 'macro'],
unknowns: ['小说没有说明自然雷暴与人工引雷在"激发"上的差别。']
},
macro: {
name: '宏电子', realityStatus: '小说设定', evidenceLevel: 'canon',
definition: '小说设定的宏观尺度电子／带电结构，可被收集、储存或激发，是制造球状闪电的关键材料。',
role: '把"球状闪电"从神秘现象变成可操作对象，是整套设定的枢纽。',
chapter: '中篇 研究', page: '约 120–160',
evidence: '“对于宏电子来说，波粒二象性中波的形态占很大比重……它们是宏观尺度的电子，就叫宏电子吧。”（另见 PAGE 161：“我们所捕获到的那个空泡，哦，那个宏电子”）',
rules: {
pre: ['存在可被激发的宏电子（未被观测时呈概率云）'],
trigger: ['电场／闪电激发', '人工电弧扫描'],
states: ['空泡（低能态）→ 受激 → 球状闪电（高能态）→ 回落'],
observable: ['发光球体、飘行轨迹、能量释放'],
fail: ['能量不足：不激发', '被持续观测：量子态坍缩，无法维持'],
consequence: ['可被捕获、储存，进而武器化']
},
related: ['bubble', 'ball', 'nucleus', 'transition'],
unknowns: ['宏电子为何能在宏观尺度稳定存在，小说未给出机制。']
},
bubble: {
name: '空泡', realityStatus: '小说设定', evidenceLevel: 'canon',
definition: '包裹或隔离宏观量子结构的空间／场结构，使球状闪电能在通常物质中运动而不立即耗散；在小说里它是宏电子被捕获时的形态。',
role: '承担"保护壳"的功能，是"低能态"的可见形态。',
chapter: '中篇 研究', page: '161、164',
evidence: '“我们所捕获到的那个空泡，哦，那个宏电子，是自由电子呢，还是一个宏原子中的电子？”',
rules: {
pre: ['宏电子处于未被激发的状态'],
trigger: ['捕获成功（电弧／飞艇）'],
states: ['自由飘行 → 被约束 → 可储存'],
observable: ['透明、可见轮廓、内部发光'],
fail: ['约束失败则耗散'],
consequence: ['为下一步激发提供"原料"']
},
related: ['macro', 'ball', 'quantum'],
unknowns: ['空泡的边界由什么维持，小说没有交代。']
},
ball: {
name: '球状闪电', realityStatus: '现实知识 + 小说设定', evidenceLevel: 'canon',
definition: '小说中的核心现象：可穿墙、漂浮、发光，内部能量密度极高，对不同物质有选择性作用。',
role: '既是研究对象，也是推动人物选择、制度决策与战争升级的叙事装置。',
chapter: '序曲 → 尾声', page: '1–5 起',
evidence: '“还有微波激射－孤立子理论……比较受到注意的是新西兰坎特伯雷大学的亚伯拉罕森和迪尼斯的理论，认为球状闪电主要是由微型含硅颗粒组成的网络球体燃烧形成。”',
rules: {
pre: ['宏电子被激发（小说设定）／现实中有大量目击记录'],
trigger: ['闪电激发、人工电弧、自然出现'],
states: ['出现 → 飘行 → 能量释放 → 消失/回落'],
observable: ['发光球体、轨迹、选择性毁伤'],
fail: ['观测介入导致坍缩（小说设定）'],
consequence: ['被军事系统吸收，成为宏聚变武器的基础']
},
related: ['macro', 'bubble', 'storm', 'fusion'],
unknowns: ['现实机制至今无统一解释；小说机制不可外推为现实结论。']
},
nucleus: {
name: '宏原子核', realityStatus: '小说设定', evidenceLevel: 'canon',
definition: '与宏电子构成宏原子，能在宏观尺度保持类似原子结构的稳定性。',
role: '从"带电粒子"升级为"宏观物质单元"，是宏聚变的前置。',
chapter: '中篇 研究', page: '约 160–250',
evidence: '“找不到宏原子核主要不是因为它们不能被激发，而是因为我们根本不知道它们是什么样子。”',
rules: {
pre: ['宏电子被捕获并观测'],
trigger: ['通过轨迹推断存在束缚结构'],
states: ['自由电子（无核）→ 束缚态（有核）'],
observable: ['轨迹弯折、周期运动'],
fail: ['观测数据不足，无法判断'],
consequence: ['确认后才有"宏聚变"的可能']
},
related: ['macro', 'fusion', 'transition'],
unknowns: ['小说未描述宏原子核的直接观测手段。']
},
quantum: {
name: '量子态', realityStatus: '现实知识 + 小说设定', evidenceLevel: 'canon',
definition: '小说中球状闪电在未被观察时可处于叠加或概率状态，观察会促使其呈现确定结果。',
role: '把宏观现象接入量子解释，是"看不见"这一体验的理论支点。',
chapter: '中篇 研究 / 尾声', page: '176–177',
evidence: '“目击者处于一个宏电子的概率云中，他或她偶然的观察使球状闪电的量子态突然坍缩。”',
rules: {
pre: ['系统与外界充分隔离'],
trigger: ['观察者介入（含摄像机）'],
states: ['概率云（未观测）→ 坍缩（观测）'],
observable: ['位置弥散 → 位置确定'],
fail: ['隔离失败：提前坍缩'],
consequence: ['观测方式决定结果，构成"超级观察者"问题']
},
related: ['observer', 'bubble', 'transition'],
unknowns: ['"观察者"的边界（是否有意识）在小说里是争论点，不是结论。']
},
transition: {
name: '量子跃迁', realityStatus: '小说设定（类比）', evidenceLevel: 'canon',
definition: '把宏观结构的状态改变、能量释放和位置变化与量子跃迁联系起来。',
role: '解释"球状闪电为什么能瞬间改变位置/亮度"。',
chapter: '中篇 研究', page: '约 170–200',
evidence: '“宏电子或它被激发后形成的球状闪电那轨迹复杂的飘行，实际上是一种不断的量子跃迁，但在我们的视觉中它的运行是连续的。”',
rules: {
pre: ['处于激发态'],
trigger: ['能级改变'],
states: ['高能态 → 低能态（释放能量）'],
observable: ['亮度跳变、位置跳变'],
fail: ['无合适能级，不跃迁'],
consequence: ['能量以光/热形式释放']
},
related: ['quantum', 'macro'],
unknowns: ['现实能级跃迁只在原子/分子尺度成立，小说是类比。']
},
fusion: {
name: '宏聚变', realityStatus: '小说设定', evidenceLevel: 'canon',
definition: '宏原子核在特定条件下发生类似聚变的巨大能量释放，成为军事破坏力的来源。',
role: '把科学模型推进到战争后果，是伦理讨论的引爆点。',
chapter: '下篇 战争', page: '251 起',
evidence: '“每秒四百多米的撞击速度已经相当于我们世界的临界速度了。所以，达到临界速度的相撞肯定会引发核聚变。”',
rules: {
pre: ['确认宏原子核存在', '武器化平台'],
trigger: ['两枚宏原子核以临界速度相撞'],
states: ['待发 → 撞击 → 能量释放'],
observable: ['大范围电子信息设备失效'],
fail: ['速度不足：不引发聚变'],
consequence: ['文明退回低技术状态（小说推演）']
},
related: ['nucleus', 'rose'],
unknowns: ['能量大小与作用范围在小说里也被研究员称为"理论上变数很多"。']
},
observer: {
name: '观察者与坍缩', realityStatus: '小说设定 + 现实讨论', evidenceLevel: 'canon',
definition: '观察者使量子态从概率描述变成确定结果，后期延伸为"超级观察者"。',
role: '既是物理机制，也是全书的哲学命题：谁在看着这个世界。',
chapter: '中篇 研究 / 尾声', page: '176–177',
evidence: '“摄像机也是观察者，同样会引起量子态的坍缩……观察者并不需要有意识。”“只要去除观察者，弹着点就会严重发散，命中率只及存在观察者时的十分之一。”',
rules: {
pre: ['系统处于量子态'],
trigger: ['直接观察 / 摄像机 / 任何测量'],
states: ['概率云 → 确定态'],
observable: ['命中率、位置确定性'],
fail: ['关闭所有观测：结果发散，不可预测'],
consequence: ['"超级观察者"成为未证实的假说']
},
related: ['quantum', 'rose'],
unknowns: ['超级观察者是否存在，原文明确保持为开放性假说。']
},
rose: {
name: '量子玫瑰', realityStatus: '文学意象', evidenceLevel: 'canon',
definition: '结尾中的蓝色玫瑰只在主角或家人注意力转移时显现，成为记忆、情感和量子观察的诗性象征。',
role: '把"观察"从实验室概念转回婚姻、记忆与死亡体验。',
chapter: '尾声', page: '约 270–283',
evidence: '“当我走到人生的尽头，当我在弥留之际最后一次睁开眼睛……那就是量子玫瑰向我微笑的时候。”',
rules: {
pre: ['注意力不在它身上'],
trigger: ['视线移开 / 注意力转移'],
states: ['可见 ↔ 不可见（不可被"抓住"）'],
observable: ['余光中的蓝色轮廓'],
fail: ['试图注视它就消失——没有"正确配方"'],
consequence: ['理解理论也不能让它再次被看见']
},
related: ['observer', 'quantum'],
unknowns: ['没有任何可复现的生成条件；这是文学写法，不是物理设定。']
}
},
reality: {
note: '现实层只回答“在现实世界里这件事是什么样”。它既不为小说辩护，也不拿现实去改写小说——两者并置，把分界说清楚。',
statusLine: {
real: '已确立',
partial: '部分成立',
obs: '有观测 · 无定论',
fiction: '纯虚构',
lit: '文学意象'
},
concepts: {
storm: {
status: 'real',
real: '积雨云里冰晶与霰粒碰撞分离电荷，云地之间积累到约 10⁸–10⁹ V；阶梯先导一步步向下探路，回击把通道加热到约 3 万 K（约为太阳表面 5 倍），峰值电流几十 kA。',
src: '大气电学教科书（Rakov & Uman, Lightning: Physics and Effects）',
shot: 'leader'
},
ball: {
status: 'obs',
real: '目击记录有几百年，实验室只能做出部分相似的发光球；候选机制包括等离子体、含硅纳米颗粒网络燃烧、微波激射腔。',
hyp: '硅纳米颗粒网络燃烧、微波激射—孤立子、相对论微波、等离子体模型互相竞争，至今没有胜出者。',
src: 'Abrahamson & Dinis, Nature 403 (2000)；Kapitza 的微波激射假说；球状闪电观测综述'
},
macro: {
status: 'fiction',
real: '现实里没有“宏观电子”。但宏观量子态是真的：超导环里上亿个电子对可以共处一个量子态，冷原子气体、大分子干涉实验也做到了宏观尺度的相干。',
src: '超导量子比特与 BEC 综述；大分子干涉实验（Arndt 组，2019，约 2.5 万道尔顿）',
shot: 'magnet'
},
nucleus: {
status: 'fiction',
real: '原子核的尺度约 10⁻¹⁵ 米，靠强相互作用把质子和中子束缚在一起；现实里没有任何“宏观原子核”的观测或理论。',
src: '核物理教科书（核子尺度与强相互作用）'
},
bubble: {
status: 'fiction',
real: '现实里最接近的发光气泡是声致发光：气泡在声场里塌缩，瞬间把内部气体加热到上万 K 并闪光，但只存在微秒到毫秒级。',
src: '声致发光研究（气泡塌缩与闪光）'
},
quantum: {
status: 'real',
real: '量子态描述的是“测量会得到哪些结果、各有多大可能”，不是“一个东西同时待在两处”。宏观物体一和环境接触，叠加会被退相干迅速抹掉——尘埃颗粒量级的估算常在 10⁻²⁰ 秒或更短。',
hyp: '量子态本身没有争议；争论在「宏观物体能保持多久的可观测叠加」，也就是退相干的尺度。',
src: '量子力学教科书；退相干理论（Zurek）',
shot: 'decohere'
},
transition: {
status: 'real',
real: '原子只能在分立的能级之间跳，跳的时候放出或吸收一份确定能量的光子；光谱线、激光、原子钟都建立在这上面。',
src: '原子物理教科书（玻尔模型、自发辐射）',
shot: 'spectrum'
},
fusion: {
status: 'fiction',
real: '现实核聚变要克服库仑势垒：氘氚聚变通常要上亿 K。小说里“每秒四百多米”的临界速度，换算成氘核动能只有约 1.7 meV，而聚变要 keV 量级——差约一百万倍。',
src: '惯性／磁约束聚变综述（D–T 点火温度约 10⁸ K）',
shot: 'barrier'
},
observer: {
status: 'partial',
real: '“观察”在物理上就是测量，也就是和目标发生相互作用；退相干解释了为什么宏观世界看不到叠加。“摄像机也是观察者”“观察者不需要有意识”这两句站得住；“意识导致坍缩”没有实验支持。',
hyp: '测量问题真实存在（退相干、观测者效应）；「意识导致坍缩」只是其中一种解释，没有实验支持。',
src: '量子测量与退相干综述',
shot: 'decohere'
},
rose: {
status: 'lit',
real: '没有对应的物理对象。现实里“观察改变结果”是真的，但“只有不被注视才存在”是文学写法。',
src: '——（文学意象，无科学出处）'
}
},
pairs: {
'ball|storm': {
verdict: 'partial',
gap: '书里说闪电只是“点燃”早已存在的结构；现实雷击就是空气被击穿后的一条电流通道，被点着的是空气。两者确实常在雷雨里一起出现，但“早已存在、只是被点燃”没有证据。'
},
'ball|macro': {
verdict: 'no',
gap: '书里把球状闪电解释成宏电子的激发态；现实连球状闪电的机制都没有定论，没有“背后的那颗粒子”可以指认。'
},
'macro|nucleus': {
verdict: 'no',
gap: '书里宏电子和宏原子核靠“未知强相互作用”束缚成宏原子；现实强相互作用只在 10⁻¹⁵ 米内起作用，没有放大版，也没有“未知力”补位。'
},
'bubble|nucleus': {
verdict: 'no',
gap: '书里空泡给宏原子核当“相干保护壳”；现实里没有任何已知结构能长期屏蔽退相干——超导腔也只能把它隔离在极低温真空里，而不是做成一只壳。'
},
'bubble|quantum': {
verdict: 'no',
gap: '书里空泡让宏观量子态稳定存在；现实里宏观叠加的敌人是环境碰撞，壳本身也会和环境碰撞，加壳不解决退相干。'
},
'fusion|nucleus': {
verdict: 'no',
gap: '书里临界速度只要 400 m/s；现实聚变门槛由库仑势垒决定，和物体的宏观尺寸无关，氘核要 keV 量级（约 10⁷ K）。'
},
'observer|rose': {
verdict: 'no',
gap: '书里玫瑰只在目光移开时存在；现实里“观察改变结果”有实验基础，但没有“不被看才存在”的物理对象——这一层是文学，不是物理。'
},
'quantum|transition': {
verdict: 'partial',
gap: '两个词各自都是真实现象（跃迁会改变量子态），但书里把“跃迁”搬到了肉眼可见的球状闪电上；宏观物体的位置不确定度极小，不会这样跳。'
},
'bubble|macro': {
verdict: 'no',
gap: '书里空泡就是宏电子的低能态；现实里“低能态”依赖分立能级，而球状闪电没有已知的能级结构，“低能态／高能态”在这里只是比喻。'
},
'ball|bubble': {
verdict: 'no',
gap: '书里“给空泡注入能量就变成球状闪电”；现实里类球闪的候选机制（含硅纳米颗粒燃烧等）都没有“先有一个低能态壳”这一步。'
},
'observer|quantum': {
verdict: 'partial',
gap: '书里让观察者（含摄像机）把波函数“坍缩”成确定结果；现实里测量就是相互作用，“坍缩”在退相干框架下被重新解释——书里“摄像机也是观察者”这句其实是对的，“意识”才不是必要条件。'
},
'ball|fusion': {
verdict: 'no',
gap: '书里球状闪电的研究一路升级成宏聚变武器；现实里球状闪电和核聚变没有任何已知联系，这条线是纯叙事。'
},
'macro|storm': {
verdict: 'partial',
gap: '书里雷暴是“天然粒子加速腔”，在云里激发宏电子；现实雷暴确实能加速粒子（产生伽马射线，甚至引发光核反应），但加速的是普通电子和原子核，不是宏电子。'
},
'macro|transition': {
verdict: 'no',
gap: '书里宏电子诡异的折线来自“宏观量子跃迁”；现实里带电粒子在场中的折线是受力结果，不需要用跃迁解释。'
},
'ball|transition': {
verdict: 'no',
gap: '书里说球状闪电看起来连续的运动其实是一串跃迁；现实里宏观物体的位置不确定度极小，轨迹就是连续的。'
},
'ball|observer': {
verdict: 'no',
gap: '书里球状闪电的位置由“有没有人看”决定；现实里观测确实会扰动系统，但不会让一个宏观物体按观察者的意愿挑位置。'
},
'macro|quantum': {
verdict: 'partial',
gap: '书里宏电子未激发时是一个宏观波包；现实里波包弥散是真的，但尺度越大退相干越快，宏观波包在空气里会立刻消失——这正是“宏电子”缺的那一步。'
},
'quantum|rose': {
verdict: 'no',
gap: '书里量子玫瑰是“宏观叠加”的化身；现实里没有这朵花，它是意象，不是一种量子态。'
},
'fusion|transition': {
verdict: 'no',
gap: '书里宏聚变是大量宏原子核“量子雪崩”式的跃迁；现实聚变释放的是核结合能，不是能级跃迁——两者是不同的能量账本。'
}
},
fallbackGap: '小说用{mid}把这两个词接起来，这是一次叙事搭桥；现实里没有这条链——两个概念各自成立，但互不相干。'
},
relations: [
{ from: 'storm', to: 'ball', type: '因果', level: 'canon', page: '113', desc: '自然雷暴触发目击与创伤，是主角一生的起点。' },
{ from: 'storm', to: 'macro', type: '激发', level: 'canon', page: '113', desc: '“闪电只是点燃或激发了它”——闪电是激发手段，不是生成原因。' },
{ from: 'macro', to: 'bubble', type: '状态', level: 'canon', page: '161', desc: '被捕获的宏观结构呈空泡形态，即宏电子的低能态。' },
{ from: 'bubble', to: 'ball', type: '状态', level: 'canon', page: '113', desc: '空泡被激发后成为球状闪电（高能态）。' },
{ from: 'macro', to: 'nucleus', type: '组成', level: 'infer', page: '161', desc: '由轨迹推断是否存在束缚的宏原子核；原文只写“应该有宏原子”。' },
{ from: 'nucleus', to: 'fusion', type: '激发', level: 'canon', page: '251', desc: '宏原子核以临界速度相撞引发宏聚变。' },
{ from: 'ball', to: 'fusion', type: '因果', level: 'infer', page: '251', desc: '球状闪电的研究被军事系统吸收，最终走向宏聚变武器。' },
{ from: 'quantum', to: 'observer', type: '观测', level: 'canon', page: '176', desc: '观测导致坍缩，观察者不必有意识。' },
{ from: 'observer', to: 'rose', type: '象征', level: 'canon', page: '283', desc: '观察与记忆折叠成私人经验：看不见才留得住。' },
{ from: 'bubble', to: 'quantum', type: '观测', level: 'infer', page: '177', desc: '空泡与概率云的关系是研究者的解释框架，不是原文定论。' },
{ from: 'macro', to: 'quantum', type: '状态', level: 'infer', page: '177', desc: '宏电子在未观测时呈概率云分布。' },
{ from: 'transition', to: 'ball', type: '因果', level: 'canon', page: '约 170–200', desc: '飘行的不连续本质被解释为连续量子跃迁。' }
],
tasks: [
{
id: 'search',
ask: '把左边的概念拖到画布上的「信号」上，看它有什么反应。',
name: '任务一 · 找到它',
goal: '理解小说里"不是造出球状闪电，而是找到早已存在的结构"这条研究思路。',
evidence: 'PAGE 113：“球状闪电并不是由闪电产生的，而是自然界早已存在的一种结构。”',
elements: ['storm', 'macro'],
steps: ['把「观察者与坍缩」拖到信号上定住它', '再把「空泡」拖过去套住它', '（可选）先拖「雷暴」激发，能量更高'],
sim: '目标距离、扫描半径与「多大范围算刚好」都是我们定的模拟参数，原著没有这些数值。'
},
{
id: 'state',
ask: '按住画面让雷劈它，能量进绿区就松手。',
name: '任务二 · 点着它',
goal: '按小说内部设定，把空泡看作低能态、球状闪电视作受激发后的高能态。',
evidence: 'PAGE 113：“闪电只是点燃或激发了它”；PAGE 161：“我们所捕获到的那个空泡，哦，那个宏电子”。',
elements: ['macro', 'bubble', 'ball', 'storm'],
steps: ['按住充能', '进绿区松手', '看它亮起来'],
sim: '能量绿区与充能速度是设计模拟参数；原文只给了定性的"激发"。'
},
{
id: 'capture',
ask: '它一明一暗地飘，外圈变绿时点一下画面，抓 3 个。',
name: '任务三 · 抓住它',
goal: '体验"发现目标—判断时机—执行捕获"的过程。',
evidence: 'PAGE 161、164：捕获成功；小说里用直升机拉电弧、后期用氦气飞艇完成捕获。',
elements: ['ball', 'bubble'],
steps: ['盯住亮暗', '变绿就点', '抓满 3 个'],
sim: '“操作窗口时长”是设计模拟参数。需求书中的"约 0.5 秒"在全文检索中未出现（0 次），因此没有当作原著数值使用。',
todo: ['若要在文案里出现"0.5 秒"，请先人工核对纸书版次页码。']
},
{
id: 'nucleus',
ask: '点 6 下记下电子走过的位置，再点你猜的核。',
name: '任务四 · 找原子核',
goal: '通过观测轨迹推断看不见的结构，而不是"把两个词拼起来就合成成功"。',
evidence: 'PAGE 161：“是自由电子呢，还是一个宏原子中的电子？如果是后者，那这个宏原子的原子核在哪里呢？”',
elements: ['macro', 'nucleus'],
steps: ['记 6 个点', '看出轨道', '点你猜的核'],
sim: '轨迹曲率与判定阈值是设计模拟参数；原文没有给出数学判据。'
},
{
id: 'observer',
ask: '开着摄像机打 5 发，关掉再打 5 发，比一比命中。',
name: '任务五 · 看与不看',
goal: '把观察者理论与尾声的文学情感连起来：有些东西理解了理论也无法再次看见。',
evidence: 'PAGE 176：“摄像机也是观察者……观察者并不需要有意识。”PAGE 177：去除观察者后“命中率只及存在观察者时的十分之一”。',
elements: ['observer', 'quantum', 'rose'],
steps: ['开着打一轮', '关掉打一轮', '比命中', '去看玫瑰'],
sim: '命中率的具体数值取自原文的"十分之一"；其余表现为设计模拟。'
}
],
scenarios: {
searchAreas: [
{ id: 'A', name: 'A 区 · 城郊旷野', density: 0.35 },
{ id: 'B', name: 'B 区 · 雷暴走廊', density: 0.55 },
{ id: 'C', name: 'C 区 · 山谷上空', density: 0.25 }
],
excitation: [
{ id: 'arc', name: '人工电弧（直升机／飞艇）', power: 0.8, level: 'canon' },
{ id: 'nature', name: '自然雷击', power: 1.0, level: 'canon' },
{ id: 'none', name: '不加激发', power: 0, level: 'canon' }
],
observers: [
{ id: 'direct', name: '直接观察', collapses: true, level: 'canon' },
{ id: 'camera', name: '无人值守摄像机', collapses: true, level: 'canon' },
{ id: 'off', name: '关闭所有观测', collapses: false, level: 'canon' },
{ id: 'super', name: '引入"超级观察者"', collapses: 'unknown', level: 'todo' }
]
}
};