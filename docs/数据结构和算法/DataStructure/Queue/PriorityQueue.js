const MaxHeap = require('./MaxHeap')

function compare(a,b){
    return a>b
}
class PriorityQueue{
    constructor(max, compare) {
        this.max = max;
        this.compare = compare;
        this.maxHeap = new MaxHeap(compare);
      }
    
      getSize() {
        return this.maxHeap.size();
      }
    
      isEmpty() {
        return this.maxHeap.isEmpty();
      }
    
      getFront() {
        return this.maxHeap.findMaximum();
      }
    
      enqueue(e) {
        // 比当前最高的优先级的还要高，直接不处理，因为反正都要删除
        // 所以一般我们的事物实际优先级与队列中的优先级相反
        // 把最没有用的数据优先级设为最高，那么每次出去就是最没用的数据，保留的就是需要的
        if (this.getSize() === this.max) {
          if (this.compare(e, this.getFront())) return;
          this.dequeue();
        }
        return this.maxHeap.insert(e);
      }
    
      dequeue() {
        if (this.getSize() === 0) return null;
        // 优先队列和堆一样，每次只能删除最上面的节点（优先级最高的
        return this.maxHeap.extractMax();
      }
    }
    
    let pq = new PriorityQueue(3,compare);
    pq.enqueue(1);
    pq.enqueue(333);
    console.log(pq.dequeue());
    console.log(pq.dequeue());
    pq.enqueue(3);
    pq.enqueue(6);
    pq.enqueue(62);
    console.log(pq.dequeue());
    console.log(pq.dequeue());
    console.log(pq.dequeue());

    module.exports = PriorityQueue
    