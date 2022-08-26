/**
给定一个二叉树（具有根结点 root）， 一个目标结点 target ，和一个整数值 K 。
返回到目标结点 target 距离为 K 的所有结点的值的列表。 答案可以以任何顺序返回。
 */
/**
 *思路一：添加指向父级的引用
 *思路二：层次遍历为每一个点打上一个坐标
 */ 
/* var distanceK = function(root, target, K) {
    root.index = 0;
    let rIndex = 0;
    let lIndex = 0;
    let arr = []
    function dfs(root,index){
         if(root){
             root.index = index
             dfs(root.left,++lIndex)
             dfs(root.rIndex,--rIndex)
         }

    }
    dfs(root,0)
}; */