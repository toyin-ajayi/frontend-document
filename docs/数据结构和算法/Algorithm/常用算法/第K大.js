function partition(arr, left, right) {
  let pivot = arr[left];
  while (left < right) {
    while (left < right && arr[right] >= pivot) right--;
    arr[left] = arr[right];
    while (left < right && arr[left] < pivot) left++;
    arr[right] = arr[left];
  }
  arr[left] = pivot;
  return left;
}

var findKthLargest = function (nums, k) {
  k = nums.length - k;
  let l = 0,
    r = nums.length - 1;
  while (l < r) {
    let res = partition2(nums, l, r);
    if (res === k) break;
    // 分隔
    else if (res > k) r = res - 1;
    else l = res + 1;
  }
  return nums[k];
};

const arr = [3, 1, 6, 4, 5, 2];
// 第二大 也就是第 6-2 小
console.log(findKthLargest(arr, 6));

function partition2(nums, l, r) {
    const target = nums[l];
    // 因为l前比target小 r后比target大 不能交叉
    while(l<r){
        // 这里两个while是一种交叉 右末跳左初，左初跳右末，缩小包围圈
        while(l<r && nums[r]>=target)r--;
        nums[l] = nums[r];
        while(l<r && nums[l]<target)l++;
        nums[r] = nums[l];
    }
    // 多次循环后 l>=r时 l 即为target 的位置 左小右大
    nums[l] = target;
    return l;

}


function findKthLargest2(nums,k) {
    var k = nums.length-k;
    let l = 0,r = nums.length-1;
    while(l<r){
        const res = partition2(nums,l,r);
        if(res === k)return nums[k];
        else if(res>k){
            // 这里排好的是第res小的位置，第k小的位置就应该在左边即l，res-1
            r =res-1
        }else {
            l = res+1
        }
    }
    return nums[k];

}