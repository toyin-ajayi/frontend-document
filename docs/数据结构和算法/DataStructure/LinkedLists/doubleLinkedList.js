class doubleLinkedListNode {
  constructor(value, next = null, prev = null) {
    this.value = value;
    this.next = next;
    this.prev = prev;
  }
}

class doubleLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // 头插
  append(value) {
    let node = new doubleLinkedListNode(value);
    // 注意判断链表为空的特殊情况
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this.length++
  }

  // 尾插
  prepend(value) {
    let node = new doubleLinkedListNode(value);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }
    this.length++
  }

  // 按索引插入 注意索引为0或length-1的时候需要更改head和tail指针，这里直接调用封装好的append和prepend来处理
  appendAt(index, value) {
    if (index < 0 || index > this.length - 1) {
      throw new Error("插入索引越界");
      console.log("123");
      return null;
    }
    let node = new doubleLinkedListNode(value);
    let current = this.head;
    let previous = null;
    if (index === 0) {
      this.prepend(value);
    } else if (index === this.length - 1) {
        this.append(value)
    } else {
      while (index > 0) {
        previous = current;
        current = current.next;
        index--;
      }
      previous.next = node;
      node.prev = previous;
      node.next = current;
      current.prev = node;
    }
    this.length++
    return this
  }

  // 末尾删除
  pop(){
      if(this.length===1){
          this.empty()
          return this
      }
      let tailPointer = this.tail;// 指向最后一个节点的指针，用于断除prev指向
      this.tail = this.tail.prev// 这里虽然对this.tail重新赋值，但tailPointer指针指向的地址不会变（最后一个节点没有被修改，只是指向它的指针this.tail指向了其他地方
      tailPointer.prev = null;
      this.tail.next = null;
      this.length--
      return this
  }

  // 头部删除
  shift(){
    if(this.length===1){
        this.empty()
        return this
    }
    let headPointer = this.head
    this.head = this.head.next
    this.head.prev = null
    headPointer.next = null
    this.length--
    return this
  }

  // 置空
  empty(){
      this.head = null;
      this.tail = null;
      this.length = 0;
      return this
  }

  // 按照索引删除
  removeAt(index){
    if (index < 0 || index > this.length - 1) {
        throw new Error("删除索引越界");
        console.log("123");
        return null;
      }
      if(index===0){
          this.shift()
      }else if(index === this.length-1){
          this.pop()
      }else{
          let previous = null
          let current = this.head
          let next = null
        while (index > 0) {
            previous = current;
            current = current.next;
            index--;
          }
          next = current.next
          previous.next = next;
          next.prev = previous;
          // 其实这里应该不用特意置为null，js的引用计数已经为0 所以current会被垃圾处理
          current.next = null;
          current.prev = null;
          this.length--
      }
      return this
  }

  // 翻转链表
  reverse(){
    let current = this.head;
    let prev = null,next = null;
    while(current){
      prev = current.prev;
      next = current.next;
      current.prev = next;
      current.next = prev;
      prev = current // 结束循环时用于head指针的指向
      current = next;
    }
    this.tail = this.head
    this.head = prev
    return this
  }

  // 交换两个节点  之前想改变两个节点的next、prev指针来实现，这样复杂了，直接改变value即可
  swap(one,two){
    let minIndex = Math.min(one,two)
    let maxIndex = Math.max(one,two)
    let current = this.head,firstNode=null,tempValue;
    for(let i = 0;i<maxIndex;i++){
      if(i===minIndex){
        firstNode = current
      }
      current = current.next
    }
    tempValue = current.value
    current.value = firstNode.value
    firstNode.value = tempValue

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
    console.log(this.toArray().join(" <=> "));
  }
}

let doubleLinkedList1 = new doubleLinkedList();

doubleLinkedList1.append(1);
doubleLinkedList1.append(2);
doubleLinkedList1.append(3);
doubleLinkedList1.print();//1 <=> 2 <=> 3

doubleLinkedList1.prepend(0);
doubleLinkedList1.print();//0 <=> 1 <=> 2 <=> 3

doubleLinkedList1.appendAt(1,'插入的1');
doubleLinkedList1.print();//0 <=> 插入的1 <=> 1 <=> 2 <=> 3

doubleLinkedList1.removeAt(0);
doubleLinkedList1.print();//插入的1 <=> 1 <=> 2 <=> 3

doubleLinkedList1.removeAt(doubleLinkedList1.length-1);
doubleLinkedList1.print();//插入的1 <=> 1 <=> 2

doubleLinkedList1.removeAt(1);
doubleLinkedList1.print();//插入的1 <=> 2

doubleLinkedList1.appendAt(0,0);
doubleLinkedList1.print();//0 <=> 插入的1 <=> 2

doubleLinkedList1.reverse()
doubleLinkedList1.print()//2 <=> 插入的1 <=> 0

doubleLinkedList1.swap(0,2)
doubleLinkedList1.print()// 0 <=> 插入的1 <=> 2

doubleLinkedList1.empty()
doubleLinkedList1.print();
