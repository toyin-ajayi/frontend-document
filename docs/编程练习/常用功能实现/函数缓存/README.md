## 纯函数
函数式编程风格中有一个“纯函数”的概念，纯函数是一种无副作用的函数，除此之外纯函数还有一个显著的特点：对于同样的输入参数，总是返回同样的结果。
## 性能提升 
在平时的开发过程中，我们也应该尽量把无副作用的“纯计算”提取出来实现成“纯函数”，尤其是涉及到大量重复计算的过程，使用纯函数+函数缓存的方式能够大幅提高程序的执行效率。 
## Memoize
我们可以创建一个独立的函数来记忆任何函数。我们将此函数称为memoize。在传入相同的参数时直接返回上次缓存的结果，这样在计算大量有重复数据时，可以提供性能，
```tsx
        function memoize(func) {
          const cache = {};
          return function(...args) {
            const key = JSON.stringify(args)
            if(!cache.hasOwnProperty(key)) {
              cache[key] = func.apply(this, args)
            }
            return cache[key]
          }
        }
		
		function sum(n1, n2) {
		  const sum = n1 + n2
		  console.log(`${n1}+${n2}=${sum}`)
		  return sum
		}
		const memoizedSum = memoize(sum)
		memoizedSum(1, 2) // 会打印出：1+2=3
		memoizedSum(1, 2) // 没有输出
```
memoizedSum在第一次执行时将执行结果缓存在了闭包中的缓存对象cache中，因此第二次执行时，由于输入参数相同，直接返回了缓存的结果。
## 更好的选择是使用ES6+支持的Map对象

```tsx
		const memoize2 = fn => {
		  const cache = new Map();
		  const cached = function(...val) {
		    return cache.has(val) ? cache.get(val) : cache.set(val, fn.apply(this, val)) && cache.get(val);
		  };
		  cached.cache = cache;
		  return cached;
		};
```
或者
```tsx
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


```

## 看个函数缓存优化递归的题
```tsx
给定不同面额的硬币 coins 和一个总金额 amount。
编写一个函数来计算可以凑成总金额所需的最少的硬币个数。
如果没有任何一种硬币组合能组成总金额，返回  -1。
你可以认为每种硬币的数量是无限的。

示例 1:

输入: coins = [1, 2, 5], amount = 11
输出: 3
解释: 11 = 5 + 5 + 1

```
因为递归往下运算会出现不同节点函数参数相同的情况，这种情况是不需要反复计算的
将递归的入口改为缓存的函数，有相同的参数直接返回结果就行了
```tsx

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
const memoMinCoin = memo(minCoin)
let coins = [1, 2, 5], amount = 11
const count = memoMinCoin(coins, amount);
```
