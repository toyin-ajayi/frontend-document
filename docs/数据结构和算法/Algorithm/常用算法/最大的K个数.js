/*
 * 求最大的几个数，建立最小堆，超出heap，每次踢出去最小的，剩下的就是最大的
 * 公式1：index的左侧节点 = 2 * index + 1
 * 公式2：index的右侧节点 = 2 * index + 2
 * 公式3：index的父节点 = Math.floor((index - 1) / 2);
 * 公式4：第一个非叶子节点 = Math.floor(arr.length/2)-1 （堆排序用于构建大根堆 */



function swap(array, a, b) {
  [array[a], array[b]] = [array[b], array[a]];
}

// 返回父节点
function getParentIndex(index) {
  if (index === 0) {
    return undefined;
  }
  return Math.floor((index - 1) / 2);
}

// 向上比较，如果小的得上移
function shiftUp(index,heap) {
  let parent = getParentIndex(index);
  while (index > 0 && heap[parent] > heap[index]) {
    swap(heap, parent, index);
    index = parent;
    parent = getParentIndex(index);
  }
}

// 由于是数组模拟的最小堆，我们必须每次都要判断是否越界
function shiftDown(index,heap) {
  let minNode = index;
  const left = 2 * index + 1;
  const right = 2 * index + 2;
  const size = heap.length;
  if (left < size && heap[left] < heap[minNode]) {
    minNode = left;
  }
  if (right < size && heap[minNode] > heap[right]) {
    minNode = right;
  }
  if (minNode !== index) {
    swap(heap, index, minNode);
    shiftDown(minNode,heap);
  }
}

// 移出小顶堆
function extractMin(heap) {
  // 如果只有一个节点被移出，不需要处理下移问题
  if ( heap.length=== 1) return heap.shift();
  const removeValue = heap[0];
  // 移除头部后，使用末尾元素填充头部，开始头部下沉操作
  heap[0] = heap.pop();
  shiftDown(0,heap);
  return removeValue;
}


function find(arr,k) {
    let heap = [];
    for (let i = 0; i < arr.length; i++) {
        if(heap.length>=k){
            if(arr[i]>heap[0]){
              extractMin(heap)
              heap.push(arr[i]);
              shiftUp(i,heap);
            }
        }else{
          heap.push(arr[i]);
          shiftUp(i,heap);
        }
    }
    console.log(heap)
    console.log(heap)
  }
  
  find([1,3,5,7,2,4,6,8],3)