// 因为V8源码数组小于10采用插入排序 大于10的时候组合插入和快排 
// 插入排序导致了没有彻底的随机
// sort机制：
// 如果 compareFunction(a, b) 小于 0 ，那么 a 会被排列到 b 之前；
// 如果 compareFunction(a, b) 等于 0 ， a 和 b 的相对位置不变。备注： ECMAScript 标准并不保证这一行为，而且也不是所有浏览器都会遵守（例如 Mozilla 在 2003 年之前的版本）；
// 如果 compareFunction(a, b) 大于 0 ， b 会被排列到 a 之前。
// compareFunction(a, b) 必须总是对相同的输入返回相同的比较结果，否则排序的结果将是不确定的。
function sort2(arr) {
  var newArr = [];
  newArr = arr.sort(function() {
    return Math.random() - 0.5;
  });
  return newArr;
}

let a = [1,2,3,4,5,6,7,8,9]

console.log(sort2(a))
console.log(sort2(a))
console.log(sort2(a))
