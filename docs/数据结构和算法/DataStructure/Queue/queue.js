// TODO:完成优先队列,最高优先级的先出
class Queue {
  constructor(...item) {
    this.reserve = false;
    this.queue = [...item];
  }

  // 进入队列
  enqueue(...item) {
    this.reserve ? this.queue.push(...item) : this.queue.unshift(...item);
  }

  // 出队
  dequeue() {
    this.reserve ? this.queue.shift() : this.queue.pop();
  }
}
let queue1 = new Queue(1,2,3)

queue1.enqueue(4)
queue1.dequeue()
console.log(queue1.queue)//Array(3) [4, 1, 2]