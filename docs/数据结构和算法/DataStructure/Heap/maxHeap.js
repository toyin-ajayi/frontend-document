
class MaxHeap {
    /**
     * 最大堆(完全二叉树，往左边满足)————每个的节点元素值不小于其子节点
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
        this.heap.push(value);
        const index = this.heap.length-1;
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
        index > 0 &&
        this.heap[parent]<this.heap[index]
      ) {
        this.swap(this.heap,parent,index)
        index = parent;
        parent = this.getParentIndex(index);
      }
    }

    // 由于是数组模拟的最大堆，我们必须每次都要判断是否越界
    shiftDown(index){
        let maxNode = index
        const left = this.getLeftIndex(index)
        const right = this.getRightIndex(index)
        const size = this.size()
        if(left<size && this.heap[left]>this.heap[maxNode]){
            maxNode = left
        }
        if(right<size && this.heap[maxNode]<this.heap[right]){
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

  const MaxHeap1 = new MaxHeap()
  MaxHeap1.insert(10)
  MaxHeap1.insert(8)
  MaxHeap1.insert(6)
  MaxHeap1.insert(3)
  MaxHeap1.insert(2)
  MaxHeap1.insert(18)
  MaxHeap1.insert(15)

  console.log(MaxHeap1.extractMax())
  console.log(MaxHeap1.extractMax())
  console.log(MaxHeap1.extractMax())
  console.log(MaxHeap1.extractMax())
  console.log(MaxHeap1.extractMax())
  console.log(MaxHeap1.extractMax())
  console.log(MaxHeap1.extractMax())

module.exports = MaxHeap