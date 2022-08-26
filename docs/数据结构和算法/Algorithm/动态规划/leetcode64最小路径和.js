/* 
    给定一个包含非负整数的 m x n 网格，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。
    说明：每次只能向下或者向右移动一步。
    示例:
    输入:
    [
      [1,3,1],
      [1,5,1],
      [4,2,1]
    ]
    输出: 7
    解释: 因为路径 1→3→1→1→1 的总和最小。 
*/

function minPath(arr) {
  let cache = [];
  // 第一个[0][0]点最短路径是自身的值
  // 第一行每个点位距离起的的最短路径 = 左边一个点到起的的最短路径+该点的值
  for (let i = 1; i < arr[0].length; i++) {
    arr[0][i] += arr[0][i - 1];
  }
  // 第一列每个点位距离起的的最短路径 = 上边边一个点到起的的最短路径+该点的值
  for (let i = 1; i < arr.length; i++) {
    arr[i][0] += arr[i - 1][0];
  }
  // 然从[1][1]点向外递推
  for (let i = 1; i < arr.length; i++) {
    for (let j = 1; j < arr[0].length; j++) {
      // 只需要判断重上边过来最短还是从左边过来最短
      console.log(arr)
      arr[i][j] += Math.min(arr[i - 1][j], arr[i][j - 1]);
    }
  }
  return arr.pop().pop();
}

const arr = [[1,2,5],[3,2,1]]
/* const arr = [
  [1, 3, 1],
  [1, 5, 1],
  [4, 2, 1]
]; */


console.log(minPath(arr));
