/* 反转一个单链表。

示例:

输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL
进阶:
你可以迭代或递归地反转链表。你能否用两种方法解决这道题？
 */
var reverseList = function(head) {
  let pre = null,
    temp = null,
    cur = head;
  while (cur) {
    // 这里要更改cur的next指向 需要先保存一份
    // 避免下次循环时获取不到下一个节点
    temp = cur.next;
    // 让后面的节点指向前面
    cur.next = pre;
    // 往后平移
    pre = cur;
    cur = temp;
  }
  // 最后cur指向空 pre就是头节点
  return pre;
};

/**
 * 翻转单向链表
 * 思路：头插法
 * 表头先不变，将表头的下一个节点挪到头部指向头节点(不要改变表头的指向，一直指向原来的第一个节点)
 * 然后将表头基准节点指向被挪节点的后一个节点
 * 当基准节点的next为null，则其已经成为最后一个节点
 */
var reverseList2 = function(head) {
    // 把基准节点的地址赋值给head指针
    let newHead = head;
    // 循环体保证this.head不被重新赋值 而是用newHead指针指向最新的表头即可
    // 注意我们的head指针被重新赋值被不会影响this.head,因为它只是一个地址而已
    while (head&&head.next) {
      let current = head.next;
      head.next = current.next;
      current.next = newHead;
      newHead = current;
    }
    // 翻转后需要重新设置表头和表尾变量
    this.tail = head;
    head = newHead;
    return head;
  };