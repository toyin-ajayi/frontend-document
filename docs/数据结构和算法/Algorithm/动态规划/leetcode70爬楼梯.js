/* 
假设你正在爬楼梯。需要 n 阶你才能到达楼顶。

每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

注意：给定 n 是一个正整数。

示例 1：

输入： 2
输出： 2
解释： 有两种方法可以爬到楼顶。
1.  1 阶 + 1 阶
2.  2 阶
示例 2：

输入： 3
输出： 3
解释： 有三种方法可以爬到楼顶。
1.  1 阶 + 1 阶 + 1 阶
2.  1 阶 + 2 阶
3.  2 阶 + 1 阶 
*/


function climbStairs(n){
    if(n===1){
        return 1
    }
    if(n===2){
        return 2
    }
    return memoClimbStairs(n-1)+memoClimbStairs(n-2)
}


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

const memoClimbStairs = memo(climbStairs)


console.log(memoClimbStairs(10))
console.log(climbStairs(10))


function fastClimbStairs(n){
    if(n=== 1){
        return 1
    }
    if(n===2){
        return 2
    }
    let a = 1;
    let b = 2;
    let res = 0;
    // 输入3 只用计算一次 
    for(let i = 3;i<=n;i++){
        res = a + b;
        a = b;
        b = res;
      
    }
    return res
}
console.log(fastClimbStairs(5))