/* 
给定一个二叉树，判断它是否是高度平衡的二叉树。

本题中，一棵高度平衡二叉树定义为：

一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过1。

示例 1:

给定二叉树 [3,9,20,null,null,15,7]

    3
   / \
  9  20
    /  \
   15   7
返回 true 。

示例 2:

给定二叉树 [1,2,2,3,3,null,null,4,4]

       1
      / \
     2   2
    / \
   3   3
  / \
 4   4
返回 false 。 */

let root = {
  val: 3,
  left: null,
  right: {
    val: 20,
    left: { 
        val: 15, 
        left: null, 
        right: null },
    right: {
        val:7,
        left:null,
        right:null
    }
  }
};

// 思路：通过求左右节点的最大深度
// 然后相减取绝对值 如果都小于1则平衡
var isBalanced = function(root) {
  let obj = { key: true };
  dfs(root, obj);
  return obj.key;
};

function dfs(node, obj) {
  if (!node) {
    return 0;
  } else {
    let left = dfs(node.left,obj);
    let right = dfs(node.right,obj);
    if (Math.abs(left - right) > 1) {
      obj.key = false;
    }
    let deep = Math.max(left, right) + 1;
    return deep;
  }
}

console.log('isBalanced(root): ', isBalanced(root));