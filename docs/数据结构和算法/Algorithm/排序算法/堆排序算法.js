function swap(arr, a, b) {
  [arr[a], arr[b]] = [arr[b], arr[a]];
}

// 下沉操作,如果它比孩子小就下沉,以保证大的节点往上
function shiftDown(arr, index, size) {
  let maxNode = index;
  const left = 2 * index + 1;
  const right = 2 * index + 2;
  if (left < size && arr[left] > arr[maxNode]) {
    maxNode = left;
  }
  if (right < size && arr[maxNode] < arr[right]) {
    maxNode = right;
  }
  if (maxNode !== index) {
    swap(arr, index, maxNode);
    shiftDown(arr, maxNode, size);
  }
}

/**
 * 可以更根据已有的非最大堆数组创建最大堆
 * 之前数据结构里是有空数组构建的最大堆，采用的是尾部追加然后上浮
 * 这里直接可以拿到最后一个叶子节点，往前遍历下沉，就可以保证堆顶一定是最大的元素
 * 公式:数组的最后一个非叶子节点 = Math.floor(arr.length/2)-1
 */
function creatHeap(arr) {
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    shiftDown(arr, i, arr.length);
  }
}

/**
 * 完成对排序的调度
 */
function heapSort(arr) {
  // 首先创建最大堆
  creatHeap(arr);

  for (let i = arr.length - 1; i > 0; i--) {
    // 将最大堆的堆顶交换到数组尾部，每次确定一位
    swap(arr, i, 0);
    // 这里出入i是让以排好序的堆尾不在参与下沉
    shiftDown(arr, 0, i);
  }
  return arr;
}

const arr = [8, 23, 42, 22, 4, 8, 5, 6, 7, 26, 34];

console.log(heapSort(arr).toString()); //4,5,6,7,8,8,22,23,26,34,42
