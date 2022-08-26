/* 翻转一棵二叉树。

示例：

输入：

     4
   /   \
  2     7
 / \   / \
1   3 6   9
输出：

     4
   /   \
  7     2
 / \   / \
9   6 3   1 */


// 也就是分治的思想，拿到最底层的节点，然后两两交换
// 到了上层后就是一颗树的翻转
var invertTree = function(root) {
    if(root){
        let l = invertTree(root.left);
        let r = invertTree(root.right);
        root.left = r
        root.right = l
        return root
    }else{
        return null
    }
};