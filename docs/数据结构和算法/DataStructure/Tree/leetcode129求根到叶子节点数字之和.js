/* 给定一个二叉树，它的每个结点都存放一个 0-9 的数字，每条从根到叶子节点的路径都代表一个数字。

例如，从根到叶子节点路径 1->2->3 代表数字 123。

计算从根到叶子节点生成的所有数字之和。

说明: 叶子节点是指没有子节点的节点。

示例 1:

输入: [1,2,3]
    1
   / \
  2   3
输出: 25
解释:
从根到叶子节点路径 1->2 代表数字 12.
从根到叶子节点路径 1->3 代表数字 13.
因此，数字总和 = 12 + 13 = 25.
示例 2:

输入: [4,9,0,5,1]
    4
   / \
  9   0
 / \
5   1
输出: 1026
解释:
从根到叶子节点路径 4->9->5 代表数字 495.
从根到叶子节点路径 4->9->1 代表数字 491.
从根到叶子节点路径 4->0 代表数字 40.
因此，数字总和 = 495 + 491 + 40 = 1026. */

// 思路 还是dfs 然后用一个全局list记录每次的路径数组arr
let build = require('./层次遍历的数组建立二叉树')
let root = build([4,9,0,5,1])
var sumNumbers  = function(root) {
    let list = []
    function dfs(root,arr){
        if(root){
            arr.push(root.val)  // 这里推入
            if(!root.left && !root.right){
                list.push([...arr])
            }
            dfs (root.left,arr) // 有了下面的pop就代表这里的dfs绝对不会对arr有修改，因为最后已经回溯了
            dfs (root.right,arr)
            arr.pop() // 这里推出 用于回溯  一次dfs有入就必有出，不能放到上面的if中
        }
    }
    dfs(root,[])
    let numList = list.map((item)=>{
        return Number(item.join(''))
    })
    return numList.reduce((total,val)=>{
        return total+val
    },0)
};

let x = sumNumbers(root)
console.log('x: ', x);