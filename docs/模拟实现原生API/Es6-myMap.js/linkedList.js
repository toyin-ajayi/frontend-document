
class LinkedListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // 头插
  prepend(value) {
    let newNode = new LinkedListNode(value, this.head);
    this.head = newNode;
    // 如果是首次插入需要把表尾初始化
    if (this.tail === null) {
      this.tail = newNode;
    }
    this.length++;
    return this;
  }

  // 尾插
  append(value) {
    let newNode = new LinkedListNode(value);
    // 首先判断表头是否为空
    if (this.head === null) {
      // 如果为空则是空链表，把表头表未都设成插入的这个node
      this.head = newNode;
      this.tail = newNode;
      this.length++;
      return this;
    }
    // 不是空链表让末尾的节点的next指针指向插入的节点，并将表末尾重新赋值成这个节点
    this.tail.next = newNode;
    this.tail = newNode;
    this.length++;
    return this;
  }

  // 按照索引插入 比如index=2，应该在下标为2之前插入
  insert(index, value) {
    if (index < 0 || index > this.length) {
        console.log(index,this.length)
      throw new Error("插入索引越界");
      console.log("123");
      return null;
    }
    // 如果在第一位插入直接调用头插
    if (index === 0) {
      this.prepend(value);
    } else if (index === this.length) {
        // 如果index刚好长度（超出下标一位，就直接尾插
      this.append(value);
    } else {
      let newNode = new LinkedListNode(value);
      let current = this.head;
      let previous = null;
      while (index > 0) {
        previous = current;
        current = current.next;
        index--;
      }
      previous.next = newNode;
      newNode.next = current;
    }
    this.length++;
    return this;
  }

  empty(){
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // 由于单链表删除末尾节点肯定是需要遍历到前一位节点的那和使用removeAt(length-1)效率是一样的这里就不额外写头删和尾删了直接调removeAt

  removeAt(index) {
    if (index < 0 || index > this.length - 1) {
        
      throw new Error("删除索引越界");
      console.log("123");
      return null;
    }

    // 首先对删除最后一个元素时做特殊处理
    if(this.length === 1){
      this.empty()
      return this
    }

    let current = this.head;
    let previous = null;
    let next = null;
    // while 循环后 current 就是下标为 index 的节点
    while (index > 0) {
      previous = current;
      current = current.next;
      index--;
    }

    if (current === this.tail) {
      // 如果删除的是最后一个节点
      this.tail = previous;
      previous.next = null;
    } else if (current === this.head) {
      // 如果删除的是第一个节点
      next = current.next;
      this.head = next;
      current.next = null;
    } else {
      // current就是下标为index的节点 将前面的节点指向后面的节点 后再将current.next置空脱离引用
      next = current.next;
      previous.next = next;
      current.next = null;
    }

    this.length--;
    return this;
  }

  /**
   * 翻转单向链表
   * 思路：
   * 表头先不变，将表头的下一个节点挪到头部作为头节点(不要改变表头的指向，一直指向原来的第一个节点)
   * 然后将表头指向被挪节点的后一个节点
   * 当基准节点的next为null，则其已经成为最后一个节点
   */
  reverse(){
    // 把基准节点的地址赋值给head指针
    let newHead = this.head
    // 循环体保证this.head不被重新赋值 而是用newHead指针指向最新的表头即可
    // 注意我们的head指针被重新赋值被不会影响this.head,因为它只是一个地址而已
    while(this.head.next){
      let current = this.head.next
      this.head.next = current.next
      current.next = newHead
      newHead = current
    }
    // 翻转后需要重新设置表头和表尾变量
    this.tail = this.head
    this.head = newHead
    return this
  }

  // indexOf 需要穿一个怎么比较两个节点相同的回调
  indexOf(callback){
    let current = this.head
    let index = 0
    while(current){
      if(callback(current.value)){
        break
      }
      current = current.next
      index++
    }
    return index===this.length?-1:index
  }

  // indexOf 需要穿一个怎么比较两个节点相同的回调
  findNode(callback){
    let current = this.head
    while(current){
      if(callback(current.value)){
        break
      }
      current = current.next
    }
    return current
  }

  toArray() {
    const list = [];
    let currentNode = this.head;
    while (currentNode) {
      list.push(currentNode.value);
      currentNode = currentNode.next;
    }
    return list;
  }

  print() {
    console.log(this.toArray().join(" => "));
  }

}
module.exports = LinkedList
let LinkedList1 = new LinkedList();

LinkedList1.append(0);// 0
LinkedList1.append(1);// 0 1
LinkedList1.append(3);// 0 1 3
LinkedList1.insert(2, 2);//0 1 2 3
LinkedList1.prepend("begin");// begin 0 1 2 3
LinkedList1.removeAt(4);//begin 0 1 2
LinkedList1.removeAt(0);// 0 1 2
LinkedList1.print();//0 => 1 => 2
LinkedList1.reverse();
LinkedList1.print();//2 => 1 => 0
console.log(LinkedList1.indexOf(node=>node === 1))
console.log(LinkedList1.indexOf(node=>node === 2))
console.log(LinkedList1.indexOf(node=>node === 5))
console.log(LinkedList1.findNode(node=>node === 0))
