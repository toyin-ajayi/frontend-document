/* 请判断一个链表是否为回文链表。

示例 1:

输入: 1->2
输出: false
示例 2:

输入: 1->2->2->1
输出: true
进阶：
你能否用 O(n) 时间复杂度和 O(1) 空间复杂度解决此题？
 */



let LinkedList = require("./linkedList");
let listA = new LinkedList();
[1,2,3,2,1].forEach(val => {
    listA.append(val);
});


// 要求O(1)空间复杂度 又不能开数组来存，，。。
var isPalindrome = function(head) {
    // 判断空 和 只有一个元素 为回文
    if(!head||!head.next){
        return true
    }
    // 这里是快慢指针取得中间值
    let slow=head,fast=head
    // 引入pre 与 slow 形成双指针的反转链表算法
    let pre=null,temp=null;
    // 1. 慢指针遍历时 顺便翻转前半部分链表
    // 2. 快指针为null时，慢指针到一半位置 停止即可
    while(fast && fast.next){
        // 让fast先指向后面的节点 前面要反转 不能影响到fast
        fast = fast.next.next

        // 先把下一个节点的指针拿到  避免指向之前的节点后 无法向后变量
        // 而且 temp 在结束的时候 刚好是第二个链表的head
        temp = slow.next
        slow.next = pre
        // 注意 这里结束的时候 pre前半截链表的头部
        pre = slow
        slow = temp
    }

    // 如果链表长度是奇数 1->2->3->2->1  反转后的情况是
    // null<-1<-2  3->2->1   pre 指向2 fast指向末尾的1  temp指向3
    // 想同步temp需要在向前取一位，变成2
    if(fast != null ) {
        temp = temp.next;
    }
    while(pre != null && temp != null) {
        if(pre.val != temp.val) {
            return false;
        }
        pre = pre.next;
        temp = temp.next;
    }
    return true;
};

console.log(isPalindrome(listA.head))