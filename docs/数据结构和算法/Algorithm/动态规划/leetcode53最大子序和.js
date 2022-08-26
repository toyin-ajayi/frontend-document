/* 给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

示例:

输入: [-2,1,-3,4,-1,2,1,-5,4],
输出: 6
解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。 */



// 思路就建立动态规划的表，记录每一个坐标当前的连续串的和，然后递推
// 如果前一个点是正数，那对这一次的累加有利就算上
// 如果前一个点是负数，那对这一次无利，不累加
var maxSubArray = function(nums) {
    let len = nums.length
    // 首先第一个位置的最长肯定是自身
    let dp = [nums[0]]
    for(let i=1;i<len;i++){
        dp[i] = dp[i-1]>0?dp[i-1]+nums[i]:nums[i]
    }
    // 最关键的地方就是每一个坐标的计算值都在表里，取最大即可
    return Math.max.apply(undefined,dp)
};

console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))