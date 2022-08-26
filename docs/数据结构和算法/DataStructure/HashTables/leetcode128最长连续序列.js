/* 给定一个未排序的整数数组，找出最长连续序列的长度。

要求算法的时间复杂度为 O(n)。

示例:

输入: [100, 4, 200, 1, 3, 2]
输出: 4
解释: 最长连续序列是 [1, 2, 3, 4]。它的长度为 4。 */

//要求算法的时间复杂度为 O(n) 所以建表或者动态规划 这里建表
function longestConsecutive(nums) {
  let set = new Set();
  nums.forEach((val, index) => {
    set.add(val);
  });
  let long = 0;
  set.forEach((value, num) => {
    // 这一步优化很关键，如果这个表里有比这个数小1的，那从这个数开始计算连续的长度肯定不是最长的
    if (set.has(num-1)) return
    let nowLen = 1;
    let currentNum = num;
    while (set.has(++currentNum)) {
      nowLen++;
    }
    long = Math.max(nowLen, long);
  });
  return long;
}
let x = [0,-1]

console.log(longestConsecutive(x));
