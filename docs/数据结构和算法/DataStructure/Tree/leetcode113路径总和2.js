/* 给定一个二叉树和一个目标和，找到所有从根节点到叶子节点路径总和等于给定目标和的路径。

说明: 叶子节点是指没有子节点的节点。

示例:
给定如下二叉树，以及目标和 sum = 22，

              5
             / \
            4   8
           /   / \
          11  13  4
         /  \    / \
        7    2  5   1
返回:

[
   [5,4,11,2],
   [5,8,4,5]
]
 */

let build = require('./层次遍历的数组建立二叉树')
let root = build([5,4,8,11,null,13,4,7,2,null,null,5,1])

// 思路：在路径求和的基础上 添加一个全局变量用来保存数组，推入list的时候需要拷贝。
//       然后用一个arr来动态记录路径，不对的话需要回溯到上一个状态
var pathSum  = function(root, sum) {
    let list = []
    function dfs(root,sum,arr){
        if(root){
            arr.push(root.val)
            if(!root.left && !root.right && sum == root.val){
                list.push([...arr])
            }
            dfs (root.left,sum-root.val,arr)
            dfs (root.right,sum-root.val,arr)
            arr.pop()
        }
    }
    dfs(root,sum,[])
    return list
};

let x = pathSum(root,22)