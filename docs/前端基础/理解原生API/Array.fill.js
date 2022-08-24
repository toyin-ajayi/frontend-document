const LEN = 3;
const obj = {};

const arr = Array(LEN).fill(1);
const arr2 = new Array(LEN).fill(1);
const arr3 = new Array(LEN).fill(obj);// 这里的每个obj其实指向一个地方

/* 根据EMACScript标准：
调用Array()和new Array()是等同的。 */

console.log(new Map([['a', 1], ['b',  2]]))
console