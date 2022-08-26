/* 你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有满足条件且不重复的三元组。

注意：答案中不可以包含重复的三元组。

 

示例：

给定数组 nums = [-1, 0, 1, 2, -1, -4]，

满足要求的三元组集合为：
[
  [-1, 0, 1],
  [-1, -1, 2]
]
 */
var threeSum = function(nums) {
  const result = [];
  nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length; i++) {
    // 如果[-1,-1,0,1,2] => 那第一个-1其实是多余重复的 不排除出现两组[-1,0,1]
    if (i && nums[i] === nums[i - 1]) {
      continue;
    }
    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum > 0) {
        right--;
      } else if (sum < 0) {
        left++;
      } else {
          // 注意 push的时候已经把left加1了
        result.push([nums[i], nums[left++], nums[right--]]);
        // 不仅开始的时候需要去重，中间任何地方都有可能重复
        // [-2,1,1,1,1,2] left指向第二个 right指向倒数第二个于是[-2,1,1]=0
        //  如果不去中间的重复 那么[-2,1,1]会产生很多组
        while (nums[left] === nums[left - 1]) {
          left++;
        }
        // 跳过重复数字
        while (nums[right] === nums[right + 1]) {
          right--;
        }
      }
    }
  }
  return result;
};
