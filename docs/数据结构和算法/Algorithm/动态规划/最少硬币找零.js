/* 给定不同面额的硬币 coins 和一个总金额 amount。编写一个函数来计算可以凑成总金额所需的最少的硬币个数。如果没有任何一种硬币组合能组成总金额，返回  -1。你可以认为每种硬币的数量是无限的。

示例 1:

输入: coins = [1, 2, 5], amount = 11
输出: 3
解释: 11 = 5 + 5 + 1 */

function minCoin(coins, amount) {
  // 如果amount为0表示刚刚把钱兑换完 返回0
  if (amount === 0) {
    return 0;
  }
  // 设置一个最大值，保存下面循环的三个节点的最小值
  let minValue = Number.MAX_SAFE_INTEGER;
  // amount不为0，那么需要递归往下计算
  for (var coin of coins) {
    // 如果换的量比所有面值都小就进下次循环
    // 比面值大才进入下面的递归才分
    if (amount - coin >= 0) {
      const count = memoMinCoin(coins, amount - coin);
      // 子问题有解，需要判断和同一层的节点谁的解最小
      if (count != -1) {
        minValue = Math.min(count+1, minValue);
      }
    }
  }
  // amount-coin<0 ,要拆分的面值比任何硬币都小 无解
  // 上面的逻辑如果无解的话minValue会是最大整数，这里需要处理
  return minValue==Number.MAX_SAFE_INTEGER?-1:minValue;
}

// 记录重复计算的值
function memo(func){
  const cache = new Map();
  return function(...arg){
      if(cache.has(arg)){
          return cache.get(arg)
      }else{
          const res = func.call(this,...arg)
          cache.set(arg,res)
          return res
      }
  }
}

const memoMinCoin = memo(minCoin)


let coins = [1, 2, 5], amount = 11
const count = memoMinCoin(coins, amount);

//const  coins = [2],amount = 3;
console.log(count);

// 动态规划
function minCoinDP(coins,amount){
  // 因为要循环求min 这里把规划表填充一个最大值
  let dpArray = Array(amount+1).fill(amount+1);
  dpArray[0] = 0
  for(let i =1;i<=amount;i++){
    // 有几种面值就有几条路径可以到达
    for(let coin of coins){
      // 比当前容量小才比较
      if(coin<=i){
        dpArray[i] = Math.min(dpArray[i],dpArray[i-coin]+1)
      }
    }
  }
  // 如果第amount个不是初始值，则能分解，且为最优解
  return dpArray[amount] == amount+1?-1:dpArray[amount]
}

console.log(minCoinDP(coins, amount))