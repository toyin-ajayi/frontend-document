/* 给定一个链表，旋转链表，将链表每个节点向右移动 k 个位置，其中 k 是非负数。

示例 1:

输入: 1->2->3->4->5->NULL, k = 2
输出: 4->5->1->2->3->NULL
解释:
向右旋转 1 步: 5->1->2->3->4->NULL
向右旋转 2 步: 4->5->1->2->3->NULL
示例 2:

输入: 0->1->2->NULL, k = 4
输出: 2->0->1->NULL
解释:
向右旋转 1 步: 2->0->1->NULL
向右旋转 2 步: 1->2->0->NULL
向右旋转 3 步: 0->1->2->NULL
向右旋转 4 步: 2->0->1->NULL */


// 继续在寻找倒数第k个元素上修改，我们增加一个len来计算链表的长度
// 注意len在每次fast往后指的时候都len++就可以计算总长度了（相当于一次循环就可以确定长度和位置）
let LinkedList = require("./linkedList");
let list = new LinkedList();
[1].forEach(val => {
  list.append(val);
});

var rotateRight = function(head, k) {
  if (k == 0||!head) {
    return head;
  }
  // next 表示当前链表的末尾
  let next = head;
  // 遍历计算长度
  let len = 1;
  while (next.next) {
    next = next.next;
    len++;
  }
  // 取余计算真正需要移动的部分
  k = k % len;
  // 如何是0就不用滑动，没有需要切断的地方，不然后面newHead = tail.next;会指向null，无法操作
  if(k == 0)return head
  // 移动k 就是把倒数第k当成尾部  然后把真正的尾部连接到头部
  let index = len - k;
  // 计算需要切断的地方
  let tail = head;
  while (index - 1 > 0) {
    tail = tail.next;
    index--;
  }
  // 记录新的表头
  let newHead = tail.next;
  // 连接
  tail.next = null;
  next.next = head;

  return newHead;
};

rotateRight(list.head, 2);
