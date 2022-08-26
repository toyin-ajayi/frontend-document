// 排序的数组必须是整数才行
// 空间复杂度比其他的排序要高，尤其是一个数很大，其他数很小的时候，会浪费很多空间
function countingSort(arr) {
    // max 函数不能穿数组，得用apply
    let maxValue = Math.max.apply(null,arr)
    let minValue = Math.min.apply(null,arr)
    let arrLen = arr.length
    let bucket = new Array(maxValue-minValue+1)
    let sortedIndex = 0
    let bucketLen = maxValue + 1

    for (var i = 0; i < arrLen; i++) {
        if (!bucket[arr[i]]) {
            bucket[arr[i]-minValue] = 0;
        }
        bucket[arr[i]-minValue]++;
    }

    for (var j = 0; j < bucketLen; j++) {
        while(bucket[j] > 0) {
            arr[sortedIndex++] = j+minValue;
            bucket[j]--;
        }
    }

    return arr;
}

var arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
const arred = countingSort(arr);

console.log(arred)