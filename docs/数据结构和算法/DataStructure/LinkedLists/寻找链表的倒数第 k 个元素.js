// 思路：让快指针指向第K个(下标是k-1)，然慢指针指向第一个
// 用相对论来看：以慢指针为头，快指针为尾巴的这个条链表，慢指针指向的节点始终是倒数第k个
// 然后往后遍历，快指针到头的时候，与真实链表尾巴重合，那慢指针相对于整个链表也是倒数第K个
// 理解到了可以轻松完成leetcode第19题
var kthToLast = function(head, k) {
    let fast = head
    let slow = head
    // 将fast指向第K个元素，因为第二个元素只需next一次 所以关系为k-1
    while (k-1>0) {// k>1
        fast = fast.next
        k--
    }
    // 慢指针一直是相对快指针的尾部的倒数K个，直到相对于链表尾部的K个
    while (fast.next) {
        fast = fast.next
        slow = slow.next
    }
    return slow.val
};