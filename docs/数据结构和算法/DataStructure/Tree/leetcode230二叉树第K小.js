/* 给定一个二叉搜索树，编写一个函数 kthSmallest 来查找其中第 k 个最小的元素。

说明：
你可以假设 k 总是有效的，1 ≤ k ≤ 二叉搜索树元素个数。 */


// 中序遍历就是从小到大排的
var kthSmallest = function(root, k) {
  let i = 0;
  let val = null;
  travel(root);
  return val;

  function travel(node) {
    node.left && travel(node.left);

    if (++i === k) {
      val = node.val;
      return;
    }

    node.right && travel(node.right);
  }
};
