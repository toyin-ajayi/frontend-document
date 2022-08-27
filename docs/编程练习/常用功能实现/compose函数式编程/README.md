## compose 函数

compose 就是执行一系列的任务（函数），比如有以下任务队列,每一个 step 都是一个步骤，按照步骤一步一步的执行到结尾(step4 是头部第一个元素，step1 是尾部)

```tsx
let tasks = [step1, step2, step3, step4]
```

compose 大致的使用，总结下来要注意的有以下几点

- compose 的参数是函数，返回的也是一个函数
- 因为除了第一个函数的接受参数，其他函数的接受参数都是上一个函数的返回值，所以初始函数的参数是多元的，而其他函数的接受值是一元的
- compsoe 函数可以接受任意的参数，所有的参数都是函数，且执行方向是自右向左的，初始函数一定放到参数的最右面
- 所有函数的执行都是同步的

## 实现 compose 的三种思路

### 面向过程

- 使用递归的过程思想，不断的检测队列中是否还有任务
- 如果有任务就执行，并把执行结果往后传递
- 这里是一个局部的思维，无法预知任务何时结

```tsx
const compose = function(...args) {
  let length = args.length
  let count = length - 1
  let result
  return function f1 (...arg1) {
    result = args[count].apply(this, arg1)
    if (count <= 0) {
      count = length - 1
      return result
    }
    count--
    return f1.call(null, result)
  }
}
```

### Promise 实现

ES6 引入了 Promise，Promise 可以指定一个 sequence，来规定一个执行 then 的过程，then 函数会等到执行完成后，再执行下一个 then 的处理。启动 sequence 可以使用
Promise.resolve()这个函数。构建 sequence 可以使用 reduce.
**相当于用 reduce 帮我们创建了一个链式的.then**

```tsx
const compose = function(...args) {
  let init = args.pop()
  return function(...arg) {
    return args.reverse().reduce(function(sequence, func) {
      return sequence.then(function(result) {
        return func.call(null, result)
      })
    }, Promise.resolve(init.apply(null, arg)))
  }
}
```

### Generator

Generator 主要使用 yield 来构建协程，采用中断，处理，再中断的流程。可以事先规定好协程的执行顺序，然后再下次处理的时候进行参数（结果）交接，有一点要注意的是，由于执行的第一个 next 是不能传递参数的，所以第一个函数的执行需要手动调用，再空耗一个 next，后面的就可以同步执行了。

```tsx
function* iterateSteps(steps) {
  let n
  for (let i = 0; i < steps.length; i++) {
    if (n) {
      n = yield steps[i].call(null, n)
    } else {
      n = yield
    }
  }
}

const compose = function(...steps) {
  let g = iterateSteps(steps)
  return function(...args) {
    let val = steps.pop().apply(null, args)
    // 这里是第一个值
    console.log(val)
    // 因为无法传参数 所以无所谓执行 就是空耗一个yield
    g.next()
    return steps.reverse.reduce((val, val1) => g.next(val).value, val)
  }
}
```

### 还有一种 reduce 直接实现

其实 compose 函数做的事就是把 var a = fn1(fn2(fn3(fn4(x)))) 这种嵌套的调用方式改成 var a = compose(fn1,fn2,fn3,fn4)(x) 的方式调用。

```tsx
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

```

看一下 compose(fn1, fn2, fn3, fn4)根据 compose 的源码, 其实执行的就是： [fn1,fn2,fn3.fn4].reduce((a, b) => (...args) => a(b(...args)))

```tsx
import {compose} from 'redux'
let x = 10
function fn1 (x) {return x + 1}
function fn2(x) {return x + 2}
function fn3(x) {return x + 3}
function fn4(x) {return x + 4}

// 假设我这里想求得这样的值
let a = fn1(fn2(fn3(fn4(x)))) // 10 + 4 + 3 + 2 + 1 = 20

// 根据compose的功能，我们可以把上面的这条式子改成如下：
let composeFn = compose(fn1, fn2, fn3, fn4)
let b = composeFn(x) // 理论上也应该得到20

```

| 第几轮循环 | a 的值                              | b 的值 | 返回的值                                 |
| ---------- | ----------------------------------- | ------ | ---------------------------------------- |
| 第一轮循环 | fn1                                 | fn2    | (...args) => fn1(fn2(...args))           |
| 第二轮循环 | (...args) => fn1(fn2(...args))      | fn3    | (...args) => fn1(fn2(fn3(...args)))      |
| 第三轮循环 | (...args) => fn1(fn2(fn3(...args))) | fn4    | (...args) => fn1(fn2(fn3(fn4(...args)))) |


### reduce 改成普通写法

cache就相当于上面的a，记录上一次的调用函数，然后把下一次的作为参数再穿进去
```tsx
let cache;

function compose(...fns) {
  let ff = fns[0]
  for (let i = 1; i < fns.length; i ++) {
    if (cache) {
      cache = (...args) => cache(fns[i](...args));
    } else {
      cache = (...args) => ff(fns[i](...args));
    }
  }
  return cache;  
}
```