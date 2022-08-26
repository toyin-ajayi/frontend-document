var findKthLargest = function (nums, k) {
    k = nums.length - k
    let l = 0, r = nums.length - 1
    while (l < r) {
      let res = partition(nums, l, r)
      if (res === k) break
      else if (res > k) r = res - 1
      else l = res + 1
    }
    return nums[k]
  };
  
  
  const partition = (nums, i, j) => {
    let l = i, r = j + 1
    while (true) {
      while (l < j && nums[++l] < nums[i]);
      while (r > i && nums[--r] > nums[i]);
      if (l >= r) break;
      [nums[l], nums[r]] = [nums[r], nums[l]]
    }
    [nums[i], nums[r]] = [nums[r], nums[i]]
    return r
  }

  const arr = [3,1,6,4,5,2]
  // 第二大 也就是第 6-2 小
  console.log(findKthLargest(arr,2))


  