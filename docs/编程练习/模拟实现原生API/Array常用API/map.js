Array.prototype.MyMap = function(fn, context) {
  var arr = Array.prototype.slice.call(this); //由于是ES5所以就不用...展开符了
  var mappedArr = [];
  for (var i = 0; i < arr.length; i++) {
    mappedArr.push(fn.call(context, arr[i], i, this));
  }
  return mappedArr;
};



Array.prototype.myMap2 = function(callback, context) {
  if (typeof callback !== "function") return;
  return this.reduce(function(prev, current, index, srcArray) {
    let result = callback.call(context, current, index, srcArray);
    prev = prev.concat(result);
    return prev;
  }, []);
};
