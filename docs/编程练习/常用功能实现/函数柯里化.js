// 参数复用、提前返回和延迟执行
// ES5
function curry(func, allArg) {
  const argLen = func.length;
  // 没有默认参数，只能自己手动加
  allArg = allArg ? allArg : [];
  return function() {
    const arg = Array.prototype.slice.call(arguments);
    allArg = allArg.concat(arg);
    if (allArg.length < argLen) {
      // 如果调用的参数不够 就再次调用curry返回这个匿名函数
      return curry.call(this, func, allArg);
    } else {
      return func.apply(this, allArg);
    }
  };
}

function sum(x, y, z, a) {
  return x + y + z + a;
}

const doSum = curry(sum);
console.log(doSum(1)(2)(3)(4));

// ES6 初级版
const curry2 = (func, arr = []) => {
  return (...args) => {
    if ([...args, ...arr].length !== func.length) {
      return curry(func, [...args, ...arr]);
    } else {
      return func(...[...args, ...arr]);
    }
  };
};

let curryTest = curry2((a, b, c, d) => a + b + c + d);
console.log(curryTest(1, 2, 3)(4)); //返回10

// ES6+自动执行的函数
const curry3 = (fn, arr = []) => (...args) =>
  (arg => (arg.length === fn.length ? fn(...arg) : curry(fn, arg)))([
    ...arr,
    ...args
  ]);


let curryTest2 = curry3((a, b, c, d) => a + b + c + d);
console.log(curryTest2(1, 2, 3)(4)); //返回10