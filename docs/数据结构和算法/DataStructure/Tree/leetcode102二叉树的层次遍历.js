let buildTree = require("./层次遍历的数组建立二叉树");

var levelOrder = function(root) {
  if (!root) return [];
  let arr = [];
  let queue = [root];
  let i = 0;
  // 外层是队列元素,保证每次queue都只有一层的元素在
  while (queue.length > 0) {
    arr[i] = [];
    // count第i层的节点数量
    let count = queue.length;
    while (count--) {
      // 这层有多少个有出队多少次
      const front = queue.shift();
      arr[i].push(front.val);
      // 每次出一个后若其有子元素得进队，就完成一层的更新
      if (front.left) queue.push(front.left);
      if (front.right) queue.push(front.right);
    }
    i++;
  }
  return arr;
};

let x = buildTree([3, 9, 20, null, null, 15, 7], root);
let arr1 = levelOrder(x);
console.log("arr: ", arr1);
