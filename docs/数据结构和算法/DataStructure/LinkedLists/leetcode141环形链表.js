/* 给定一个链表，判断链表中是否有环。

为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。

 

示例 1：

输入：head = [3,2,0,-4], pos = 1
输出：true
解释：链表中有一个环，其尾部连接到第二个节点。
*/

/* 思路：floyd判圈算法
使用两个指针slow和fast。两个指针都从链表的起始处S开始。slow每次向后移动一步，fast每次向后移动两步。若在fast到达链表尾部前slow与fast相遇了，就说明链表有环。
这里可以简单的证明一下：反证法，假如没有环，那么slow永远追不上fast，那么在fast到达链表尾部前slow不会fast相遇了。若相遇了，链表就有环。
 */

var hasCycle = function(head) {
  let slow = head;
  let fast = head;

  while (slow && fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
};

// 还有一种是用Map来存已经出现的值，然后判断是否有重复出现即可

var hasCycle = function(head) {
  if (!head) return false;

  const map = new Map();
  let node = head;
  map.set(node, true);

  while (node.next) {
    if (map.get(node.next)) {
      return true;
    }
    map.set(node.next, true);
    node = node.next;
  }
  return false;
};
