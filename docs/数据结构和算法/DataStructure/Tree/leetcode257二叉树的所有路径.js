/* 给定一个二叉树，返回所有从根节点到叶子节点的路径。

说明: 叶子节点是指没有子节点的节点。

示例:

输入:

   1
 /   \
2     3
 \
  5

输出: ["1->2->5", "1->3"]

解释: 所有根节点到叶子节点的路径为: 1->2->5, 1->3 */

// 和 leetcode 129极为类似 一个算和 一个原样输出
var binaryTreePaths  = function(root) {
    let list = []
    function dfs(root,arr){
        if(root){
            arr.push(root.val)
            if(!root.left && !root.right){
                list.push([...arr])
            }
            dfs (root.left,arr)
            dfs (root.right,arr)
            arr.pop()
        }
    }
    dfs(root,[])
    let numList = list.map((item)=>{
        return item.join('->')
    })
    return numList
};