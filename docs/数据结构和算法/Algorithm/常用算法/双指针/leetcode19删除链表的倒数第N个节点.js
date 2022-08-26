// 最寻找倒数第K个的基础上修改一下 寻找倒数第K+1个就行了
// 然后把倒数第K+1个指向倒数第K-1个
function ListNode(val) {
  this.val = val;
  this.next = null;
}

var removeNthFromEnd = function(head, k) {
  // 因为头部节点也可以删除，需要增加一个头部之前的元素，让其next为null即可,不然无法操作头部 
  let preHead = new ListNode(-1);
  preHead.next = head
  let fast = preHead;
  let slow = preHead;
  // k+1>1 表示倒数第k+1个
  while (k > 0) {
    fast = fast.next;
    k--;
  }
  while (fast.next) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  // preHead.next即指向表头
  return preHead.next;
};
