/* 给定一个非空的整数数组，返回其中出现频率前 k 高的元素。
示例 1:

输入: nums = [1,1,1,2,2,3], k = 2
输出: [1,2]
示例 2:

输入: nums = [1], k = 1
输出: [1]
说明：

你可以假设给定的 k 总是合理的，且 1 ≤ k ≤ 数组中不相同的元素的个数。
你的算法的时间复杂度必须优于 O(n log n) , n 是数组的大小。 */


const PriorityQueue = require("./PriorityQueue");
var topKFrequent = function(nums, k) {
  let map = new Map();
  nums.forEach(element => {
    if (map.has(element)) {
      map.set(element, map.get(element) + 1);
    } else {
      map.set(element, 1);
    }
  });
  // 算法的时间复杂度必须优于 O(n log n) , n 是数组的大小。
  // 堆排序在这里是 O(n log k) ，因为只需要维护k长度的堆即可，结合到优先队列
  // 以高频率为高优先级，那么队首始终是高频率的元素，因此每次出队是踢出出现频率最高的元素
  // 所以我们得以低频率为高优先级以踢出
  const PriorityQueue1 = new PriorityQueue(k,(key1,key2)=>map.get(key1)<map.get(key2));
  let arr = Array.from(map.keys());
  let arr2 = Array.from(map.entries());
  for (let i = 0; i < arr.length; i++) {
    PriorityQueue1.enqueue(arr[i])
  }
  return PriorityQueue1.maxHeap.heap.reverse()
};
console.log(topKFrequent([1, 1, 1, 2, 2, 3,3,3,3], 2));
