const { db } = require('./database');

const examples = [
    {
        subjectId: 'math', knowledgePoint: '二次函数',
        question: String.raw`## 二次函数：配方、面积与参数最值

已知 $f(x)=x^2-4x+3$，以及 $g_a(x)=ax^2-4x+3$，其中 $a>0$。

1. 求 $f(x)$ 的零点、对称轴和在区间 $[-1,3]$ 上的最小值。
2. 求曲线 $y=f(x)$ 与 $x$ 轴在 $[0,3]$ 上围成的**总面积**。
3. 讨论 $g_a(x)$ 在 $[0,3]$ 上的最小值，写成分段函数。

> 提示：面积应使用 $|f(x)|$；参数问题要先判断顶点是否在给定区间内。

| 对象 | 定义域 | 需要关注 |
| :--- | :---: | ---: |
| $f(x)$ | $[-1,3]$ | 顶点与边界 |
| $|f(x)|$ | $[0,3]$ | 零点与正负号 |
| $g_a(x)$ | $[0,3]$ | $\frac{2}{a}$ 的位置 |`,
        answer: String.raw`### 结论

- 零点为 $x=1,3$，对称轴为 $x=2$。
- $f(x)$ 在 $[-1,3]$ 上的最小值为 $-1$，在 $x=2$ 时取得。
- 总面积为 $S=\frac{8}{3}$。

参数最值：

$$
\min_{x\in[0,3]}g_a(x)=
\begin{cases}
9a-9,&0<a\le\frac{2}{3},\\
3-\frac{4}{a},&a>\frac{2}{3}.
\end{cases}
$$`,
        analysis: String.raw`### 1. 配方与零点

$$
\begin{aligned}
f(x)&=x^2-4x+3\\
&=(x-2)^2-1\\
&=(x-1)(x-3).
\end{aligned}
$$

### 2. 分段计算面积

因为 $f(x)$ 在 $[0,1]$ 上非负、在 $[1,3]$ 上非正，所以

$$
\begin{aligned}
S&=\int_0^3|f(x)|\,\mathrm{d}x\\
&=\int_0^1 f(x)\,\mathrm{d}x-\int_1^3 f(x)\,\mathrm{d}x\\
&=\frac{4}{3}-\left(-\frac{4}{3}\right)=\frac{8}{3}.
\end{aligned}
$$

### 3. 顶点与端点比较

$g_a(x)=a\left(x-\frac{2}{a}\right)^2+3-\frac{4}{a}$。
当 $0<a\le\frac{2}{3}$ 时，顶点在区间右端或右侧，最小值在 $x=3$ 取得；当 $a>\frac{2}{3}$ 时，顶点在区间内部。

在临界值 $a=\frac{2}{3}$ 处，两种表达式均得到 $-3$，结果连续。`,
        note: String.raw`### 回顾清单

- [x] 写出 $f(x)=(x-2)^2-1$。
- [x] 区分最小值 $-1$ 与取得最小值的自变量 $2$。
- [ ] 不看解析，重新推导参数分界点 $a=\frac{2}{3}$。

~~直接积分得到面积~~ → 应先判断符号，再对负值区间取反。`, reviewResult: 'familiar'
    },
    {
        subjectId: 'math', knowledgePoint: '随机事件与概率',
        question: String.raw`## 双骰子：分布、条件概率与期望

独立掷两枚均匀骰子，点数为 $X,Y\in\{1,2,\ldots,6\}$，令 $S=X+Y$。

1. 写出 $P(S=s)$ 的分段表达式。
2. 已知 $S\ge10$，求 $P(X=6\mid S\ge10)$。
3. 求 $\mathbb{E}[S]$ 与 $\operatorname{Var}(S)$。

**样本空间按有序对计数**，例如 $(1,6)$ 和 $(6,1)$ 是不同结果。

| $s$ | 2 | 3 | 4 | 5 | 6 | 7 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 组合数 | 1 | 2 | 3 | 4 | 5 | 6 |

| $s$ | 8 | 9 | 10 | 11 | 12 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 组合数 | 5 | 4 | 3 | 2 | 1 |`,
        answer: String.raw`### 概率分布

$$
P(S=s)=
\begin{cases}
\frac{s-1}{36},&s\in\{2,\ldots,7\},\\
\frac{13-s}{36},&s\in\{8,\ldots,12\},\\
0,&\text{otherwise}.
\end{cases}
$$

条件概率为 $\frac{1}{2}$；期望为 $7$；方差为 $\frac{35}{6}$。`,
        analysis: String.raw`### 条件样本空间

满足 $S\ge10$ 的有序对为

$$
\Omega_B=\{(4,6),(5,5),(6,4),(5,6),(6,5),(6,6)\}.
$$

其中 $X=6$ 的结果有 $3$ 个，因此

$$
P(X=6\mid S\ge10)=\frac{P(X=6,S\ge10)}{P(S\ge10)}=\frac{3/36}{6/36}=\frac12.
$$

### 期望与方差

$$
\begin{aligned}
\mathbb{E}[X]&=\frac16\sum_{k=1}^6k=\frac72,\\
\mathbb{E}[X^2]&=\frac16\sum_{k=1}^6k^2=\frac{91}{6},\\
\operatorname{Var}(X)&=\frac{91}{6}-\left(\frac72\right)^2=\frac{35}{12},\\
\mathbb{E}[S]&=2\mathbb{E}[X]=7,\\
\operatorname{Var}(S)&=2\operatorname{Var}(X)=\frac{35}{6}.
\end{aligned}
$$

最后一行使用了 $X,Y$ **独立**，故协方差为 $0$。`,
        note: String.raw`### 用枚举验证条件概率

~~~javascript
const pairs = [];
for (let x = 1; x <= 6; x++) {
  for (let y = 1; y <= 6; y++) {
    if (x + y >= 10) pairs.push([x, y]);
  }
}
const probability = pairs.filter(([x]) => x === 6).length / pairs.length;
// probability === 0.5
~~~

> 复习时先手算 $P(A\mid B)=\frac{P(A\cap B)}{P(B)}$，再用代码核对。`
    },
    {
        subjectId: 'physics', knowledgePoint: '匀变速直线运动',
        question: String.raw`## 分段加速度：速度、位移与平均速度

物体沿 $x$ 轴运动，初速度 $v(0)=1\,\mathrm{m/s}$，初始位置 $x(0)=0$。加速度为

$$
a(t)=
\begin{cases}
2\,\mathrm{m/s^2},&0\le t\le2\,\mathrm{s},\\
-1\,\mathrm{m/s^2},&2<t\le5\,\mathrm{s}.
\end{cases}
$$

1. 写出 $v(t)$ 与 $x(t)$ 的分段表达式。
2. 求 $t=5\,\mathrm{s}$ 时的速度、总位移与平均速度。
3. 用矩阵形式表示第一阶段的运动关系。

> 第二阶段应使用局部时间 $\tau=t-2$，并继承第一阶段末的位置和速度。`,
        answer: String.raw`### 分段运动结果

$$
v(t)=\begin{cases}1+2t,&0\le t\le2,\\7-t,&2<t\le5,\end{cases}
\qquad
x(t)=\begin{cases}t+t^2,&0\le t\le2,\\6+5(t-2)-\frac12(t-2)^2,&2<t\le5.\end{cases}
$$

上式中 $t$ 的数值以秒为单位，$v,x$ 分别以 $\mathrm{m/s}$、$\mathrm{m}$ 为单位。

| 时间 | 速度 | 位置 |
| :---: | ---: | ---: |
| $0\,\mathrm{s}$ | $1\,\mathrm{m/s}$ | $0\,\mathrm{m}$ |
| $2\,\mathrm{s}$ | $5\,\mathrm{m/s}$ | $6\,\mathrm{m}$ |
| $5\,\mathrm{s}$ | $2\,\mathrm{m/s}$ | $\frac{33}{2}\,\mathrm{m}$ |

总位移为 $\frac{33}{2}\,\mathrm{m}$，平均速度为 $\frac{33}{10}\,\mathrm{m/s}$。`,
        analysis: String.raw`### 阶段衔接

第一阶段：$v_1=1+2\times2=5\,\mathrm{m/s}$，$x_1=1\times2+\frac12\times2\times2^2=6\,\mathrm{m}$。

第二阶段历时 $3\,\mathrm{s}$：

$$
\begin{aligned}
v_2&=5-1\times3=2\,\mathrm{m/s},\\
\Delta x_2&=5\times3-\frac12\times3^2=\frac{21}{2}\,\mathrm{m},\\
\Delta x&=6+\frac{21}{2}=\frac{33}{2}\,\mathrm{m},\\
\bar v&=\frac{\Delta x}{\Delta t}=\frac{33}{10}\,\mathrm{m/s}.
\end{aligned}
$$

### 矩阵表示（匀加速阶段）

$$
\begin{pmatrix}x(t)\\v(t)\end{pmatrix}
=\begin{pmatrix}1&t\\0&1\end{pmatrix}
\begin{pmatrix}x(0)\\v(0)\end{pmatrix}
+\begin{pmatrix}\frac12t^2\\t\end{pmatrix}a.
$$

速度全程大于 $0$，因此本题的路程等于位移大小。`,
        note: String.raw`### 自查

- [x] 在 $t=2$ 处，左右两段的 $x(t)$、$v(t)$ 连续。
- [ ] 画出速度—时间图，用梯形面积重新求位移。
- [ ] 解释为什么 $a<0$ 不代表物体沿负方向运动。

**常见错误**：第二阶段将初速度误写成 $1\,\mathrm{m/s}$。`, reviewResult: 'mastered'
    },
    {
        subjectId: 'physics', knowledgePoint: '牛顿三定律',
        question: String.raw`## 斜面受力：牛顿第二定律与功—能验证

质量 $m=2\,\mathrm{kg}$ 的物块位于倾角 $\theta=30^\circ$ 的斜面上，受到沿斜面向上的恒定拉力 $F=16\,\mathrm{N}$。取 $g=10\,\mathrm{m/s^2}$，动摩擦因数 $\mu=\frac{\sqrt3}{10}$。

物块从静止开始，在拉力作用下向上滑动。求：

1. 支持力 $N$、滑动摩擦力 $f$ 和加速度 $a$。
2. 前 $4\,\mathrm{s}$ 的位移 $s$ 与末速度 $v$。
3. 用动能定理核对结果，并比较各力做功。

| 方向 | 正方向 | 对应力 |
| :--- | :--- | :--- |
| 沿斜面 | 向上 | $F,mg\sin\theta,f$ |
| 垂直斜面 | 向外 | $N,mg\cos\theta$ |

> 滑动摩擦力方向沿斜面向下，大小由 $f=\mu N$ 决定。`,
        answer: String.raw`### 数值结果

$$
\boxed{N=10\sqrt3\,\mathrm{N},\quad f=3\,\mathrm{N},\quad a=\frac32\,\mathrm{m/s^2}}
$$

$s=12\,\mathrm{m}$，$v=6\,\mathrm{m/s}$。

| 力 | 做功 |
| :--- | ---: |
| 拉力 | $192\,\mathrm{J}$ |
| 重力 | $-120\,\mathrm{J}$ |
| 摩擦力 | $-36\,\mathrm{J}$ |
| 支持力 | $0$ |
| 合力 | $36\,\mathrm{J}$ |`,
        analysis: String.raw`### 建立受力方程

$$
\begin{cases}
N-mg\cos\theta=0,\\
F-mg\sin\theta-\mu N=ma.
\end{cases}
$$

代入得到 $N=10\sqrt3$、$f=\frac{\sqrt3}{10}\times10\sqrt3=3$，因此

$$
a=\frac{16-10-3}{2}=\frac32\,\mathrm{m/s^2}.
$$

### 运动学与能量交叉核对

$$
\begin{aligned}
s&=\frac12at^2=\frac12\times\frac32\times4^2=12\,\mathrm{m},\\
v&=at=6\,\mathrm{m/s},\\
W_{\mathrm{net}}&=(F-mg\sin\theta-f)s=3\times12=36\,\mathrm{J},\\
\Delta E_k&=\frac12mv^2-0=\frac12\times2\times6^2=36\,\mathrm{J}.
\end{aligned}
$$

两种方法得到相同结果。支持力与位移垂直，所以 $W_N=Ns\cos90^\circ=0$。`,
        note: String.raw`### 错因记录

1. ~~将摩擦力写成 $\mu mg$~~：斜面上应先求 $N=mg\cos\theta$。
2. 正方向确定后，重力分力与摩擦力都应带负号。
3. **拓展**：将拉力撤去后重新建立方程，不能继续沿用 $a=\frac32\,\mathrm{m/s^2}$。

---

复习目标：能够从受力图独立推导 $F-mg\sin\theta-\mu mg\cos\theta=ma$。`, reviewResult: 'unknown'
    },
    {
        subjectId: 'english', knowledgePoint: '时态与语态',
        question: String.raw`## 英语语法：时态对比与答题统计

用括号内动词的适当形式填空，并解释时间状语的作用。

> **Learning journal**
>
> She ______ (live) in Shanghai since 2020.
> When I called her at eight last night, she ______ (read) a book.
> By the time we arrived, the lecture ______ (begin).

某同学对 $n=20$ 道时态题的答题统计如下：

| 类型 | 题数 $n_i$ | 答对数 $c_i$ |
| :--- | ---: | ---: |
| 现在完成时 | 8 | 6 |
| 过去进行时 | 7 | 5 |
| 过去完成时 | 5 | 4 |

1. 完成三处填空。
2. 根据 $A=\frac{\sum_i c_i}{\sum_i n_i}$ 求总正确率。
3. 说明总正确率为什么不能直接用三个分项正确率的算术平均数代替。`,
        answer: String.raw`### 填空与统计

1. **has lived**：从过去持续到现在。
2. **was reading**：过去某一时刻正在进行。
3. **had begun**：到达之前已经发生。

$$
A=\frac{6+5+4}{8+7+5}=\frac{15}{20}=75\%.
$$

各类别题数不同，应该按题数加权计算正确率。`,
        analysis: String.raw`### 时间线判断

| 线索 | 动作与参照点 | 所需形式 |
| :--- | :--- | :--- |
| **since 2020** | 过去开始，延续到现在 | has/have + 过去分词 |
| **at eight last night** | 过去时刻正在发生 | was/were + 现在分词 |
| **by the time we arrived** | 在过去参照点之前完成 | had + 过去分词 |

### 统计解释

设 $a_i=\frac{c_i}{n_i}$，则

$$
A=\sum_{i=1}^3 w_i a_i,\qquad w_i=\frac{n_i}{\sum_{j=1}^3n_j},\qquad\sum_{i=1}^3w_i=1.
$$

本题权重为 $\frac8{20},\frac7{20},\frac5{20}$，所以加权结果为 $75\%$。直接算术平均则为 $\frac13\left(\frac68+\frac57+\frac45\right)=\frac{317}{420}\approx75.48\%$，与总正确率不同。`,
        note: String.raw`### 复习任务

- [x] 标出 **since**、**when**、**by the time**。
- [ ] 用自己的例句解释 *过去的过去*。
- [ ] 分别计算 $\frac68,\frac57,\frac45$，核对加权平均。

> 先根据语境确定时间关系，再选择动词形式；统计时分清“类别等权”和“每道题等权”。`
    },
    {
        subjectId: 'english', knowledgePoint: '定语从句', lifecycle: 'draft',
        question: String.raw`## 英语阅读草稿：定语从句与评分规则

> The book **which I bought yesterday** describes a scientist **who developed a new battery**.
> It also introduces the laboratory **where the first experiment took place**.

1. 分别找出三个加粗部分的先行词，并判断关系词在从句中的作用。
2. 说明第一句中的 **which** 为什么可以省略，而 **who** 不可以。
3. 用正确关系词改写：This is the laboratory. The experiment took place in it.

**附加评分题**：某测验有 $8$ 道四选一题。每题答对得 $3$ 分，答错扣 $1$ 分，空白得 $0$ 分。

| 作答情况 | 数量 | 每题分值 |
| :--- | ---: | ---: |
| 答对 | 5 | $+3$ |
| 答错 | 2 | $-1$ |
| 空白 | 1 | $0$ |

求总分，并根据 $\mathbb{E}[R]=3p-(1-p)$ 解释完全随机猜一道题的期望得分。`,
        answer: String.raw`### 参考答案（待自行补充笔记）

- **which** → the book，在从句中作宾语，可以省略。
- **who** → a scientist，在从句中作主语，不能省略。
- **where** → the laboratory，在从句中作地点状语。

改写为：*This is the laboratory where the experiment took place.*
也可以写成：*This is the laboratory in which the experiment took place.*

$$
R=3\times5-1\times2+0\times1=13.
$$

完全随机猜测时 $p=\frac14$，期望得分为 $0$。`,
        analysis: String.raw`### 从句成分比较

| 关系词 | 先行词类型 | 从句中是否缺成分 | 作用 |
| :--- | :--- | :--- | :--- |
| which | 物 | bought 缺宾语 | 宾语 |
| who | 人 | developed 缺主语 | 主语 |
| where | 地点 | 主谓宾完整，缺地点状语 | 状语 |

### 得分期望

$$
\begin{aligned}
\mathbb{E}[R]&=3p+(-1)(1-p)\\
&=4p-1,\\
\mathbb{E}[R]\big|_{p=1/4}&=0.
\end{aligned}
$$

只有在 $p>\frac14$ 时，作答的期望得分才大于留空。能排除一个错误选项且在剩余选项中均匀猜测时，$p=\frac13$，期望得分为 $\frac13$。`,
        note: String.raw`### 草稿整理清单

- [x] 标出三个先行词。
- [ ] 补充 **which / where** 的对比句。
- [ ] 归档后练习，并用 $4p-1$ 验证评分规则。

**从句判断顺序**：先判断是否缺主语、是否缺宾语，再考虑地点状语。

> 本题保留草稿状态，可用来体验多段 Markdown、公式和笔记的编辑。`
    }
];

const generateTestMistakes = db.transaction((userId) => {
    const now = new Date().toISOString();
    const findPoint = db.prepare('SELECT id FROM knowledge_points WHERE subject_id = ? AND name = ? LIMIT 1');
    const insertMistake = db.prepare(`
        INSERT INTO mistakes (user_id, subject_id, primary_knowledge_point_id, lifecycle, is_test,
            question, answer, analysis, note, created_at, updated_at)
        VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)
    `);
    const insertReview = db.prepare('INSERT INTO reviews (mistake_id, result, created_at) VALUES (?, ?, ?)');
    for (const example of examples) {
        const point = findPoint.get(example.subjectId, example.knowledgePoint);
        const inserted = insertMistake.run(userId, example.subjectId, point?.id || null, example.lifecycle || 'archived',
            example.question, example.answer, example.analysis, example.note, now, now);
        if (example.reviewResult) {
            insertReview.run(inserted.lastInsertRowid, example.reviewResult, now);
        }
    }
    return examples.length;
});

module.exports = { generateTestMistakes };
