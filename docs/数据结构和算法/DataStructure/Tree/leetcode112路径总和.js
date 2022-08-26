/* 给定一个二叉树和一个目标和，判断该树中是否存在根节点到叶子节点的路径，这条路径上所有节点值相加等于目标和。

说明: 叶子节点是指没有子节点的节点。

示例: 
给定如下二叉树，以及目标和 sum = 22，

              5
             / \
            4   8
           /   / \
          11  13  4
         /  \      \
        7    2      1
返回 true, 因为存在目标和为 22 的根节点到叶子节点的路径 5->4->11->2。 */


var hasPathSum = function(root, sum) {
    if(root){
        if(!root.left && !root.right)return sum == root.val
        let l = hasPathSum(root.left,sum-root.val)
        let r = hasPathSum(root.right,sum-root.val)
        return l||r
    }else{
        // 进入这里的节点一定不是叶子节点 是单边节点
        return false
    }
};

let root = {
  val: 3,
  left: null,
  right: {
    val: 20,
    left: {
      val: 15,
      left: null,
      right: null
    },
    right: {
      val: 7,
      left: null,
      right: null
    }
  }
};

let flag = hasPathSum(root, 3);
console.log(flag);



