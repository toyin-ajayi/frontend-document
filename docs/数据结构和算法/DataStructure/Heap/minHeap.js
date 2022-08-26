
class MinHeap {
    /**
     * 最小堆(完全二叉树，往左边满足)————每个的节点元素值不大于其子节点
     * 公式1：左侧节点 = 2 * index + 1
     * 公式2：右侧节点 = 2 * index + 2
     * 公式3：父节点 = Math.floor((index - 1) / 2);
     * 验证 ：
     * 1,2 -> 0 节点 
     * 3,4 -> 1节点
     * 为了让计算结果一样，我们必须让右孩子的舍弃小数，所以需要-1除2
     */
    constructor() {
      this.heap = [];
    }
    // 返回右孩子
    getLeftIndex(index) {
      return (2 * index) + 1;
    }
    // 返回又孩子
    getRightIndex(index) {
      return (2 * index) + 2;
    }
    // 返回父节点
    getParentIndex(index) {
      if (index === 0) {
        return undefined;
      }
      return Math.floor((index - 1) / 2);
    }
    size() {
      return this.heap.length;
    }
    isEmpty() {
      return this.size() <= 0;
    }
    clear() {
      this.heap = [];
    }
    findMinimum() {
      return this.isEmpty() ? undefined : this.heap[0];
    }
    insert(value) {
      if (value != null) {
        const index = this.heap.length;
        this.heap.push(value);
        this.siftUp(index);
        return true;
      }
      return false;
    }
    swap(array, a, b) {
        [array[a], array[b]] = [array[b], array[a]];
      }


    // 向上比较，如果小的得上移
    siftUp(index) {
      let parent = this.getParentIndex(index);
      while (
        index > 0 &&
        this.heap[parent]>this.heap[index]
      ) {
        this.swap(this.heap,parent,index)
        index = parent;
        parent = this.getParentIndex(index);
      }
    }

    // 由于是数组模拟的最小堆，我们必须每次都要判断是否越界
    shiftDown(index){
        let minNode = index
        const left = this.getLeftIndex(index)
        const right = this.getRightIndex(index)
        const size = this.size()
        if(left<size && this.heap[left]<this.heap[minNode]){
            minNode = left
        }
        if(right<size && this.heap[minNode]>this.heap[right]){
            minNode = right
        }
        if(minNode!== index){
            this.swap(this.heap,index,minNode)
            this.shiftDown(minNode)
        }
        
    }

    // 移出小顶堆
    extractMin(){
        // 如果只有一个节点被移出，不需要处理下移问题
        if(this.size()===1)return this.heap.shift()
        const removeValue =  this.heap[0]
        // 移除头部后，使用末尾元素填充头部，开始头部下沉操作
        this.heap[0] = this.heap.pop();
        this.shiftDown(0)
        return removeValue
    }
  }

  const MinHeap1 = new MinHeap()
  MinHeap1.insert(10)
  MinHeap1.insert(8)
  MinHeap1.insert(6)
  MinHeap1.insert(3)
  MinHeap1.insert(2)
  MinHeap1.insert(18)
  MinHeap1.insert(15)

  console.log(MinHeap1.extractMin())
  console.log(MinHeap1.extractMin())
  console.log(MinHeap1.extractMin())
  console.log(MinHeap1.extractMin())
  console.log(MinHeap1.extractMin())
  console.log(MinHeap1.extractMin())
  console.log(MinHeap1.extractMin())

