/* 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。

你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。

示例:

给定 nums = [2, 7, 11, 15], target = 9

因为 nums[0] + nums[1] = 2 + 7 = 9
所以返回 [0, 1] */


var twoSum = function(nums, target) {
    let res = []
    // 首先nums存入hash表
    let map = new Map()
    // 先变成一个查找的过程 查找有没有 target-val在表里
    for(let i=0;i<nums.length;i++){
        if(map.has(target-nums[i])){
            res = [map.get(target-nums[i]),i]
            return res
            
        }else{
            map.set(nums[i],i)
        }
    }
    return res
};

console.log(twoSum([3,2,1,4,5,8,7,6],9))

// 修改一下 找所以满足条件的元素  这是字节的面试题
var twoSumAll = function(nums, target) {
    let res = []
    // 首先nums存入hash表
    let map = new Map()
    // 先变成一个查找的过程 查找有没有 target-val在表里
    for(let i=0;i<nums.length;i++){
        if(map.has(target-nums[i])){
            res.push([map.get(target-nums[i]),i])
            
        }else{
            map.set(nums[i],i)
        }
    }
    return res
};
console.log(twoSumAll([3,2,1,4,5,8,7,6],9))
console.log(twoSumAll([3,2,1,4,5,8,7,6],9))