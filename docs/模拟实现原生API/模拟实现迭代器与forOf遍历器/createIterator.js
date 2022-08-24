function createIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length
        ? { value: array[nextIndex++], done: false }
        : { value: undefined, done: true };
    },
    [Symbol.iterator]: function() {
      console.log("返回的迭代器:", this);
      return this; // 注意这里是对象调用模式，this指向的就是上层的对象，迭代器
    }
  };
}

var iterator = createIterator([1, 2, 3]);
console.log(...iterator);

