## 贪心算法

>贪心并不难 难得是证明贪心策略最终是正确的

贪心算法（又称贪婪算法）是指，在对问题求解时，总是做出在当前看来是最好的选择。也就是说，不从整体最优上加以考虑，他所做出的是在某种意义上的局部最优解。贪心算法不是对所有问题都能得到整体最优解，关键是贪心策略的选择，选择的贪心策略必须具备无后效性，即某个状态以前的过程不会影响以后的状态，只与当前状态有关。

## 贪心算法和其他算法对比

“贪心算法” 和 “动态规划”、“回溯搜索” 算法一样，完成一件事情，是分步决策的；
“贪心算法” 在每一步总是做出在当前看来最好的选择，我是这样理解 “最好” 这两个字的意思：
“最好” 的意思往往根据题目而来，可能是 “最小”，也可能是 “最大”；

贪心算法和动态规划相比，它既不看前面（也就是说它不需要从前面的状态转移过来），也不看后面（无后效性，后面的选择不会对前面的选择有影响），因此贪心算法时间复杂度一般是线性的，空间复杂度是常数级别的。



## 基本思路

- 建立数学模型来描述问题；
- 把求解的问题分成若干个子问题；
- 对每一子问题求解，得到子问题的局部最优解；
- 把子问题的解局部最优解合成原来解问题的一个解。

## 算法实现

- 从问题的某个初始解出发。
- 采用循环语句，当可以向求解目标前进一步时，就根据局部最优策略，得到一个部分解，缩小问题的范围或规模。
- 将所有部分解综合起来，得到问题的最终解。


## 实例1-背包问题

这是一个求得最优解的近似解的贪心算法例子。
而如果要想求得最优解，就要用到DP策略。
场景：一个小偷去商场偷东西，在背包称重有限下，如何拿能使得获得收益越大？（每件商品只有一个，只能选择拿与不拿）

贪心策略1：每次取当前能拿得下的最值钱的商品。
贪心策略2：每次取当前重量最轻的商品。
贪心策略3：每次取性价比最高的商品。（即价格/重量的值最大的商品）


如果物品可以分割为任意大小，那么此时策略3可得最优解。否则，答案可能为近似解。
