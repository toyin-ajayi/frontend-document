class MaxHeap {
    /**
     * 重之前写的最大堆那里直接拖过加一个compare方法
     * 通过外面来确定优先队列最大值的确定方法
     */
    constructor(compare) {
      this.heap = [];
      this.compare = compare;
    }
    // 返回左孩子
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
    findMaximum() {
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


    // 向上比较，如果大的得上移
    siftUp(index) {
      let parent = this.getParentIndex(index);
      while (
        index > 0 &&!this.compare(this.heap[parent],this.heap[index])
        
      ) {
        this.swap(this.heap,parent,index)
        index = parent;
        parent = this.getParentIndex(index);
      }
    }

    // 下层，小的往下交换，堆顶就是最大的
    shiftDown(index){
        let maxNode = index
        const left = this.getLeftIndex(index)
        const right = this.getRightIndex(index)
        const size = this.size()
        // 由于是数组模拟的最大堆，我们必须每次都要判断是否越界
        if(left<size && this.compare( this.heap[left],this.heap[maxNode])){
            maxNode = left
        }
        if(right<size && !this.compare(this.heap[maxNode],this.heap[right])){
            maxNode = right
        }
        if(maxNode!== index){
            this.swap(this.heap,index,maxNode)
            this.shiftDown(maxNode)
        }
        
    }

    // 移出大顶堆
    extractMax(){
        // 如果只有一个节点被移出，不需要处理下移问题
        if(this.size()===1)return this.heap.shift()
        const removeValue =  this.heap[0]
        // 移除头部后，使用末尾元素填充头部，开始头部下沉操作
        this.heap[0] = this.heap.pop();
        this.shiftDown(0)
        return removeValue
    }
  }


 module.exports = MaxHeap;