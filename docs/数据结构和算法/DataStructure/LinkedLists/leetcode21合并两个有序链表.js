/* 将两个有序链表合并为一个新的有序链表并返回。
新链表是通过拼接给定的两个链表的所有节点组成的。 
示例：

输入：0->2->4, 1->3->4
输出：0->1->2->3->4->4 */


let LinkedList = require('./linkedList')
let LinkedList1= new LinkedList()
LinkedList1.append(0);// 0
LinkedList1.append(1);// 0 1
LinkedList1.append(3);// 0 1 3
LinkedList1.append(6);// 0 1 3
LinkedList1.append(19);// 0 1 3

let LinkedList2= new LinkedList()
LinkedList2.append(2);// 
LinkedList2.append(4);// 
LinkedList2.append(7);// 
LinkedList2.append(9);// 
LinkedList2.append(12);// 


//反转递归 算法复杂度O(m+n)  还有一种循环思路是再建一个用于存储，然后按大小推入就了
var mergeTwoLists = function(l1, l2) {  

    function merge(l1,l2){
        if(l1 === null) return l2
        if(l2 === null) return l1
        if(l1.value>l2.value){// 提交改为val
            // l2可能连续比l1小，所以如果小就一直递归往后取，跳出条件为l2大的时候
            l2.next = merge(l1,l2.next)
            // 每次返l2级保证了l2在不跳出if时l2的next的指向
            // 又保证了下面跳出if时的l1能更改正确指向
            return l2
        }else{
            // 上面l2大的时候进入，然后l1又可能连续比这个l2小，往后取
            l1.next = merge(l1.next,l2)
            // 这里的l1就是刚好比l2小的
            return l1
        }
    }

    return merge(l1,l2)
    
};

let sortList = mergeTwoLists(LinkedList1.head,LinkedList2.head)
while(sortList){
    console.log(sortList)
    sortList = sortList.next
}