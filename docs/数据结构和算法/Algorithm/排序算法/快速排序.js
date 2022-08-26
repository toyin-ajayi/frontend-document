// 第一版非原地排序，空间复杂度较高
// 思想比较是一致的，比较好理解但不推荐使用
function quickSortRecursion (arr) {
    if (!arr || arr.length < 2) return arr;
    const pivot = arr.pop();
    let left = arr.filter(item => item < pivot);
    let right = arr.filter(item => item >= pivot);
    return quickSortRecursion(left).concat([pivot], quickSortRecursion(right));
  }
 

/**
 * @description 快排过渡方法，用于理解快排中基准元素的比较行为
 * 设立一个基准元素target，元素<target就移动到它左边，元素>target移动它的右边 => 可以简化为找出target在排好序数组的位置
 * 然后相同的递归调用左边和右边，直到把所有元素都放到对应的位置，就完成了排序算法
 * 原地快排就是在不占用其他内存的情况下，尽快的找出target该放入的位置
 * 这里假设第一个元素是target
 */

function targetToIndex(arr){
    // 先声明两个指针，方便从开始和最后扫描
    let left = 0
    let right = arr.length-1
    let target = arr[0]
    // 
    while(left<right){
        // 从最后扫描，直到找到比target小的，就赋值给左边(小的放前面)
        while(left<right&&arr[right]>target){ //!:这里必须加上left<right，内部越位就完了
            right--
        }
        // 注意这里没有用交换，是直接赋值，交换需要中间变量temp，就不是原地排序了
        // right 这个位置被拿去赋值了，下次就填充right这里，并且需要填充的在右边，所以下次得从左边开始遍历
        arr[left] = arr[right]

        // 从前面扫描，直到比target大了，就赋值给刚刚记录的right
        while(left<right&&arr[left]<target){
            left++
        }
        arr[right] = arr[left]
    }
    // 最后left和right会相交，这是就target真正的位置。
    // 右边小的安排在了左边，左边大的安排在了右边，最后剩下的位置刚好安排target
    arr[left] = target
    return arr

}

const arr = [6,3,8,2,5,9,4,5,1,7]
const firstIndex = targetToIndex(arr) 
console.log(firstIndex) //[1, 3, 5, 2, 5, 4, 6, 9,8,7] 现在6的位置已经是对的了

/**
 * @description 最终原地快排
 * 快速排序也利用了分治的思想，在上面的targetToIndex加入递归找到每个元素的位置即可
 * 上面的方法找到第一个元素的位置的时候，也确定了其它元素的区域
 * 比target小的只能在左边排，大的在右边排，这样就把排序的难度降低了
 * 然后在利用递归的思想就可以送到每一个元素该去它该去的地方，这是一种大而化小，分而治之的思想
 */
function quickSort(arr,start,end){
    if(end<start)return
    // 先声明两个指针，方便从开始和最后扫描
    let left = start
    let right = end
    let target = arr[left]
    while(left<right){
        while(left<right&&arr[right]>target){ 
            right--
        }
        arr[left] = arr[right]
        while(left<right&&arr[left]<target){
            left++
        }
        arr[right] = arr[left]
    }
    arr[left] = target
    // 继续递归排好基准元素左边
    quickSort(arr,start,left-1)
    // 排好基准元素左边
    quickSort(arr,left+1,end)
    return arr
}

var arr2 = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
quickSort(arr2,0,arr2.length-1)
console.log(arr2.toString())