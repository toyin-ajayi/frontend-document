class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

let arr = [3, 9, 20, null, null, 15, 7];
function buildTree(arr) {
  // 首先建立所有数据的节点，不然在循环了去创建每次的新的会覆盖之前的
  let treeNode = arr.map(val => {
    return new TreeNode(val);
  });
  for (let i = 0; i < arr.length; i++) {
    // 只能通过公式来判断左右孩子 如果是层次遍历的数组
    let leftIndex = 2 * i + 1;
    let rightIndex = 2 * i + 2;
    // 遍历每个节点完成指向 有点像链表的操作
    if (leftIndex < arr.length && treeNode[leftIndex].val) {
      treeNode[i].left = treeNode[leftIndex];
    }
    if (rightIndex < arr.length && treeNode[rightIndex].val) {
      treeNode[i].right = treeNode[rightIndex];
    }
  }
  return treeNode[0];
}

let x = buildTree([3, 9, 20, null, null, 15, 7], root);


module.exports = buildTree

