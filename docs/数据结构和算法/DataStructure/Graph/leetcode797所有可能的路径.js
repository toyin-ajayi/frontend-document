/* 给一个有 n 个结点的有向无环图，找到所有从 0 到 n-1 的路径并输出（不要求按顺序）

二维数组的第 i 个数组中的单元都表示有向图中 i 号结点所能到达的下一些结点（译者注：有向图是有方向的，即规定了a→b你就不能从b→a）空就是没有下一个结点了。

示例:
输入: [[1,2], [3], [3], []] 
输出: [[0,1,3],[0,2,3]] 
解释: 图是这样的:
0--->1
|    |
v    v
2--->3
这有两条路: 0 -> 1 -> 3 和 0 -> 2 -> 3.
提示:

结点的数量会在范围 [2, 15] 内。
你可以把路径以任意顺序输出，但在路径内的结点的顺序必须保证。 */

// 其实这个题还有很多种考法，比如问你一个点到另一个点的路径有几条，或者寻找值K的路径，以及最短路径都可以这么解只是效率可能会低一点

/**
 * @description 深度优先搜索+回溯版
 * @param {number[][]} graph
 * @return {number[][]}
 */
var allPathsSourceTarget = function(graph) {
    let arr = []
    
    /**
     * @param {Array} node 第i个节点的邻接点
     * @param {number} index 节点的索引
     * @param {Array} memo 记录路径的数组
     */
    function dfs(node,index,memo){
        memo.push(index)
        if(index === graph.length-1){
            arr.push([...memo])
            return
        }
        for(let i = 0;i<node.length;i++){
            dfs(graph[node[i]],node[i],memo)
            memo.pop()
        }
    }
     dfs(graph[0],0,[])
    return arr
};

allPathsSourceTarget([[1,2], [3], [3], []])


/**
 * @description 深度优先搜索+暴力拷贝
 * @param {number[][]} graph
 * @return {number[][]}
 */
var allPathsSourceTarget2 = function(graph) {
    let res = []
    const dfs = (arr, i) => {
      if (graph[i].length == 0) {
        res.push(arr)
        return
      }
      for (let j = 0; j < graph[i].length; j++) {
        dfs([...arr, graph[i][j]], graph[i][j])
      }
    }
    dfs([0], 0)
    return res
  }

  console.log(allPathsSourceTarget2([[1,2], [3], [3], []]))
  allPathsSourceTarget2([[1,2], [3], [3], []])