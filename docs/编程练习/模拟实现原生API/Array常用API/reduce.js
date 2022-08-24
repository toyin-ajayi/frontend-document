Array.prototype.myReduce = function(fn, initialValue) {
  var arr = Array.prototype.slice.call(this);
  var res, startIndex;
  // 如果没传初始值，会把第一个参数当成初始值
  res = initialValue ? initialValue : arr[0];
  startIndex = initialValue ? 0 : 1;
  for (var i = startIndex; i < arr.length; i++) {
    res = fn.call(null, res, arr[i], i, this);
  }
  return res;
};

let sum = [0, 1, 2, 3].myReduce(function(a, b) {
  return a + b;
}, 0);

console.log(sum);

Array.prototype.myNewReduce = function(fn, initialValue) {
  let arr = [...this];
  if (arr.length <= 0) {
    throw Error("数组不能为空");
  }
  let total = initialValue;
  let currentValue = arr[0];
  //如果 initialValue 在调用 reduce 时被提供，那么第一个 total 将等于 initialValue，此时 currentValue 等于数组中的第一个值；
  //如果 initialValue 未被提供，那么 total 等于数组中的第一个值，currentValue 等于数组中的第二个值。此时如果数组为空，那么将抛出 TypeError。
  if (!initialValue) {
    total = arr[0];
    currentValue = arr[1];
  }
  for (let currentIndex = 0; i < arr.length; currentIndex++) {
    total = fn(total, currentValue, currentIndex, arr);
  }
  return total;
};

let sum2 = [0, 1, 2, 3].myReduce(function(a, b) {
  return a + b;
}, 0);

console.log(sum2);
