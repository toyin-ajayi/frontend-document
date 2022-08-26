/*  编写一个程序，找到两个单链表相交的起始节点。
注意：

如果两个链表没有交点，返回 null.
在返回结果后，两个链表仍须保持原有的结构。
可假定整个链表结构中没有循环。
程序尽量满足 O(n) 时间复杂度，且仅用 O(1) 内存
 */

/* 
// 测试用例错的 没法测相交。。。。
let LinkedList = require("./linkedList");
let listA = new LinkedList();
[4,1,8,4,5].forEach(val => {
    listA.append(val);
});
let listB = new LinkedList();
[5,0,1,8,4,5].forEach(val => {
    listB.append(val);
}); */


// 用来Map就是空间O(n)复杂度 O(1)的意思就是不重新开辟空间
var getIntersectionNode = function(headA, headB) {
    let mapA = new Map()
    while(headA){
        mapA.set(headA,headA)
        headA = headA.next
    }
    while(headB){
        if(mapA.has(headB)){
            return mapA.get(headB)
        }
        headB = headB.next
    }
    return null
};



// 现在有一长一短的两个链表相交
// 首先我们可以把这两个链表相互拼接
// 长的遍历完了继续遍历短的，短的遍历完了遍历长度，那么总遍历长度是一样的
// 如果链表相交，那么在最后的路程里两个指针是指向同一个节点，一起走的
// https://leetcode-cn.com/problems/intersection-of-two-linked-lists/solution/lian-biao-xiang-jiao-shuang-zhi-zhen-onshi-jian-fu/
var getIntersectionNode = function(headA, headB) {
    if (headA == null || headB == null) return null;
    let pA = headA, pB = headB;
    while (pA != pB) {
        pA = pA == null ? headB : pA.next;
        pB = pB == null ? headA : pB.next;
    }
    return pA;

};