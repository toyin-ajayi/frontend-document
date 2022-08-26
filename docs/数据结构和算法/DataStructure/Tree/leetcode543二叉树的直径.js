/* 

给定一棵二叉树，你需要计算它的直径长度。
一棵二叉树的直径长度是任意两个结点路径长度中的最大值。
这条路径可能穿过根结点。
示例 :
给定二叉树

          1
         / \
        2   3
       / \     
      4   5    
返回 3, 它的长度是路径 [4,2,1,3] 或者 [5,2,1,3]。 */

// 思路是计算任意一个点的左子树深度和又子树深度
// 左右深度相加后就是这个节点的直径，然后和其他点的比较，取较大的
var diameterOfBinaryTree = function(root) {
  let obj = { key: 0 };
  dfs(root, obj);
  return obj.key;
};

function dfs(node, obj) {
  if (!node) {
    return 0;
  } else {
    let left = dfs(node.left, obj);
    let right = dfs(node.right, obj);
    obj.key = Math.max(left + right, obj.key);
    let deep = Math.max(left, right) + 1;
    return deep;
  }
}
