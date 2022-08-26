let buildTree = require("./层次遍历的数组建立二叉树");
let root = buildTree([1,2,2,3,4,4,3])


/* 
给定一个二叉树，检查它是否是镜像对称的。

例如，二叉树 [1,2,2,3,4,4,3] 是对称的。

    1
   / \
  2   2
 / \ / \
3  4 4  3
但是下面这个 [1,2,2,null,3,null,3] 则不是镜像对称的:

    1
   / \
  2   2
   \   \
   3    3
说明:

如果你可以运用递归和迭代两种方法解决这个问题，会很加分。 
*/


// 解法一层次遍历判断回文 
/* 当前解法是错误的：没有考虑null的情况 [1,2,2,null,3,null,3]
     1
    / \
    2   2
    \   \
    3    3 
    这种情况判断不了，最好不要层次遍历，要用的话null需要特殊替换
*/

var isSymmetricError = function(root) {
    let arr = [root]
    let memoArr = []
    let index = 0
    // 关键就是用count记录一层的节点个数，然后阻断arr继续遍历，不然arr是会到整个树遍历玩
    while(arr.length>0){
        let count = arr.length
        memoArr[index] = []
        while(count--){
            let node = arr.shift()
            memoArr[index].push(node.val)
            if(node.left){
                arr.push(node.left)
            }
            if(node.right){
                arr.push(node.right)
            }
        }
        index++
    }

    return memoArr.every((arr)=>{
        let s = arr.join('')
        return arr.reverse().join('') == s
    })

};

// 修改上一版 添加对null的标记，就是效率有点低。。
/* 
执行用时 :112 ms, 在所有 JavaScript 提交中击败了6.19%的用户
内存消耗 :37.1 MB, 在所有 JavaScript 提交中击败了5.09%的用户
*/
var isSymmetric = function(root) {
    let arr = [root]
    let memoArr = []
    let index = 0
    // 关键就是用count记录一层的节点个数，然后阻断arr继续遍历，不然arr是会到整个树遍历玩
    while(arr.length>0){
        let count = arr.length
        memoArr[index] = []
        while(count--){
            let node = arr.shift()
            // n是添加的对null的标记 不然[1,2,2,null,3,null,3]也会对称
            if(node == 'n'){
                memoArr[index].push(node)
            }else if(node){
                memoArr[index].push(node.val)
                if(node.left){
                    arr.push(node.left)
                }else{
                    arr.push('n')
                }
                if(node.right){
                    arr.push(node.right)
                }else{
                    arr.push('n')
                }
            }
        }
        index++
    }

    return memoArr.every((arr)=>{
        let s = arr.join('')
        return arr.reverse().join('') == s
    })

};

console.log(isSymmetric(root))


// 解法二 交叉递归 参考的一位大佬的  这种递归设计当时真的没想到 效率的话还是比较低
var isSymmetric2 = function(root) {
    if (!root) {
        return true;
    }
    // 递归函数，左子树和右子树相等性判断；
    function leftIsSameToRight(left, right) {
        // 左右右一方为空，那就判断左右是否全为空
        if (left === null || right===null) {
            return left === null && right===null
        }
        // 如果当前两个节点值相等，则继续判断子树是否交叉相等；
        return left.val === right.val ?
           // 这里是深度优先 拿到最下层的最左和最右子树
            leftIsSameToRight(left.left, right.right) && leftIsSameToRight(left.right, right.left):
            false;
    }
    return leftIsSameToRight(root.left, root.right);
}

