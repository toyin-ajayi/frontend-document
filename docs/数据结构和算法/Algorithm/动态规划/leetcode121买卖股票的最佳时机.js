/* 给定一个数组，它的第 i 个元素是一支给定股票第 i 天的价格。

如果你最多只允许完成一笔交易（即买入和卖出一支股票一次），设计一个算法来计算你所能获取的最大利润。

注意你不能在买入股票前卖出股票。

示例 1:

输入: [7,1,5,3,6,4]
输出: 5
解释: 在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
     注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格。
示例 2:

输入: [7,6,4,3,1]
输出: 0
解释: 在这种情况下, 没有交易完成, 所以最大利润为 0。 */

// 枚举它们在价格数组上可能出现的所有位置
var maxProfit1 = function(prices) {
        let len = prices.length;
        if (len < 2) {
            return 0;
        }
        // 有可能不做交易，因此结果的初始值设置为 0 
        let res = 0;
        for (let i = 0; i < len - 1; i++) {
            for (let j = i + 1; j < len; j++) {
                res = Math.max(res, prices[j] - prices[i]);
            }
        }
        return res;
    }

// 解法2 对暴力枚举法优化
// 其实只需要关心之前（不包括现在）看到的最低股价，于是在遍历的过程中，记录下之前看到的最低股价，就可以省去内层循环。
// 往后遍历存一个最小购入值，和当前的最大利润
// 往后遍历用售价去和之前的最小值相减，看看能不能得到更大的收益
var maxProfit2 = function(prices) {
    let min = Number.MAX_SAFE_letEGER
    let res = 0
    for(let i=0;i<prices.length;i++){
        min = Math.min(prices[i],min)
        res = Math.max(res,prices[i]-min)
    }
    return res
};