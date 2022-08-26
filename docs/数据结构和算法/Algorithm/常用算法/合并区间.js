/* 给出一个区间的集合，请合并所有重叠的区间。

示例 1:

输入: [[1,3],[2,6],[8,10],[15,18]]
输出: [[1,6],[8,10],[15,18]]
解释: 区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
示例 2:

输入: [[1,4],[4,5]]
输出: [[1,5]]
解释: 区间 [1,4] 和 [4,5] 可被视为重叠区间。
 */

/* 思路:
先按首位置进行排序;

接下来,如何判断两个区间是否重叠呢?比如 a = [1,4],b = [2,3]

当 a[1] >= b[0] 说明两个区间有重叠.

但是如何把这个区间找出来呢?

左边位置一定是确定，就是 a[0]，而右边位置是 max(a[1], b[1])

所以,我们就能找出整个区间为:[1,4]
 */

var merge = function(intervals) {
    if(intervals.length==1)return intervals
  let arr = intervals;
  arr.sort((a, b) => {
    return a[0] - b[0];
  });
  let res = [];
  let len = arr.length;
  let i=0
  while(i<len){
      let left = arr[i][0]
      let right = arr[i][1]
      // 内部在嵌套一个循环但共用一个i指针，直到右边界小才跳出
      while(i<len-1 && right>=arr[i+1][0]){
        i++
        right = Math.max(right,arr[i][1])

      }
      res.push([left,right])
      i++
  }
  return res
};

let x = merge([[1,4],[2,6],[8,10]]);
console.log(x);
console.log(x);
