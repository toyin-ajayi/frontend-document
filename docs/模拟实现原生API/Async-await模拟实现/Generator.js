function* foo() {
  // next1
  var index = 0;
  var index2 = 1;
  console.log("begin");
  index = yield index + 1;

  // next2
  console.log("index", index);
  index2 = yield index2 + 1;

  // next3
  console.log("index2", index2);
}
// 返回的其实是一个迭代器，不会立即执行函数里面的内容
// 调用一个next后才开始执行函数,如果有yield 会执行到yield时停下(比返回yield的执行结果)，如果内部没有yield 会执行完函数
var bar = foo();

// 只有调用next才会继续执行，返回一个对象，然后到达下一个yield时停下
let one = bar.next()
let two = bar.next(one.value)
let three = bar.next(two.value)
console.log(one); // { value: 1, done: false }
console.log(two); // { value: 2, done: false }
console.log(three); // { value: undefined, done: true }没有return所以为undefined

// 还有一点需要注意这次next传入的值作为的是上次yield返回的值
// 原因：感觉是只有上次执行bar.next()才能拿到本次yield计算的结果，那就只能下次next才能带入
// 因为是带给上一次yield，所以第一个yield带成参数是无效的
