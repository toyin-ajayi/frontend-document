> #### JavaScript 的执行机制在上篇文章中进行了深入的探讨，那么既然是一门单线程语言，如何进行良好体验的异步编程呢

## 回调函数 Callbacks

当程序跑起来时，一般情况下，应用程序（application program）会时常通过 API 调用库里所预先备好的函数。但是有些库函数（library function）却要求应用先传给它一个函数，好在合适的时候调用，以完成目标任务。这个被传入的、后又被调用的函数就称为回调函数（callback function）。

## 什么是异步

"调用"在发出之后，这个调用就直接返回了，所以没有返回结果。换句话说，当一个异步过程调用发出后，调用者不会立刻得到结果。而是在"调用"发出后，"被调用者"通过状态、通知来通知调用者，或通过回调函数处理这个调用。异步调用发出后，不影响后面代码的执行。
简单说就是一个任务分成两段，先执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段。
在异步执行的模式下，每一个异步的任务都有其自己一个或着多个回调函数，这样当前在执行的异步任务执行完之后，不会马上执行事件队列中的下一项任务，而是执行它的回调函数，而下一项任务也不会等当前这个回调函数执行完，因为它也不能确定当前的回调合适执行完毕，只要引它被触发就会执行，

## 地狱回调阶段

异步最早的解决方案是回调函数，如事件的回调，setInterval/setTimeout 中的回调。但是回调函数有一个很常见的问题，就是回调地狱的问题
下面这几种都属于回调

- 事件回调
- Node API
- setTimeout/setInterval 中的回调函数
- ajax 请求
  异步回调嵌套会导致代码难以维护，并且不方便统一处理错误，不能 try catch 会陷入回调地狱

```
fs.readFile(A, 'utf-8', function(err, data) {
    fs.readFile(B, 'utf-8', function(err, data) {
        fs.readFile(C, 'utf-8', function(err, data) {
            fs.readFile(D, 'utf-8', function(err, data) {
                //....
            });
        });
    });
});

ajax(url, () => {
    // 处理逻辑
    ajax(url1, () => {
        // 处理逻辑
        ajax(url2, () => {
            // 处理逻辑
        })
    })
})


```

## Promise 解决地狱回调阶段

Promise 一定程度上解决了回调地狱的问题，Promise 最早由社区提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了 Promise 对象。

- Promise 存在三个状态（state）pending、fulfilled、rejected
- pending（等待态）为初始态，并可以转化为 fulfilled（成功态）和 rejected（失败态）
- 成功时，不可转为其他状态，且必须有一个不可改变的值（value）
- 失败时，不可转为其他状态，且必须有一个不可改变的原因（reason）
- new Promise((resolve, reject)=>{resolve(value)}) resolve 为成功，接收参数 value，状态改变为 fulfilled，不可再次改变。
- new Promise((resolve, reject)=>{reject(reason)}) reject 为失败，接收参数 reason，状态改变为 rejected，不可再次改变。
- 若是 executor 函数报错 直接执行 reject();

### Promise 是一个构造函数，new Promise 返回一个 promise 对象

```
const promise = new Promise((resolve, reject) => {
       // 异步处理
       // 处理结束后、调用resolve 或 reject
});
```

### then 方法注册 当 resolve(成功)/reject(失败)的回调函数

```

// onFulfilled 参数是用来接收promise成功的值,
// onRejected 参数是用来接收promise失败的原因
//两个回调返回的都是promise，这样就可以链式调用
promise.then(onFulfilled, onRejected);

```

```
const promise = new Promise((resolve, reject) => {
   resolve('fulfilled'); // 状态由 pending => fulfilled
});
promise.then(result => { // onFulfilled
    console.log(result); // 'fulfilled'
}, reason => { // onRejected 不会被调用

})

```

### then 方法的链式调用

Promise 对象的 then 方法返回一个新的 Promise 对象，因此可以通过链式调用 then 方法。then 方法接收两个函数作为参数，第一个参数是 Promise 执行成功时的回调，第二个参数是 Promise 执行失败时的回调。两个函数只会有一个被调用，函数的返回值将被用作创建 then 返回的 Promise 对象。这两个参数的返回值可以是以下三种情况中的一种：

- `return`了一个值，那么`then`返回的 Promise 将会成为接受(`resolved`)状态，并且将返回的值作为接受状态的回调函数的参数值。
- 没有返回任何值(，默认返回`undefined`)，那么`then`返回的 Promise 将会成为接受(`resolved`)状态，并且该接受状态的回调函数的参数值为`undefined`。
- 抛出(`throw`)一个错误，那么`then`返回的 Promise 将会成为拒绝状态，并且将抛出的错误作为拒绝状态的回调函数的参数值。
- return 另一个 Promise，then 方法将根据这个 Promise 的状态和值创建一个新的 Promise 对象返回。
  - 返回一个已经是接受状态的 Promise，那么`then`返回的 Promise 也会成为接受状态，并且将那个 Promise 的接受状态的回调函数的参数值作为该被返回的 Promise 的接受状态回调函数的参数值。
  - 返回一个已经是拒绝状态的 Promise，那么`then`返回的 Promise 也会成为拒绝状态，并且将那个 Promise 的拒绝状态的回调函数的参数值作为该被返回的 Promise 的拒绝状态回调函数的参数值。
  - 返回一个未定状态（`pending`）的 Promise，那么`then`返回 Promise 的状态也是未定的，并且它的终态与那个 Promise 的终态相同；同时，它变为终态时调用的回调函数参数与那个 Promise 变为终态时的回调函数的参数是相同的。

### 解决层层回调问题

```
//对应上面第一个node读取文件的例子
function read(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf8', (err, data) => {
            if(err) reject(err);
            resolve(data);
        });
    });
}
read(A).then(data => {
    return read(B);
}).then(data => {
    return read(C);
}).then(data => {
    return read(D);
}).catch(reason => {
    console.log(reason);
});
```

```
//对应第二个ajax请求例子
ajax(url)
  .then(res => {
      console.log(res)
      return ajax(url1)
  }).then(res => {
      console.log(res)
      return ajax(url2)
  }).then(res => console.log(res))
```

可以看到，Promise 在一定程度上其实改善了回调函数的书写方式，最明显的一点就是去除了横向扩展，无论有再多的业务依赖，通过多个 then(...)来获取数据，让代码只在纵向进行扩展；另外一点就是逻辑性更明显了，将异步业务提取成单个函数，整个流程可以看到是一步步向下执行的，依赖层级也很清晰，最后需要的数据是在整个代码的最后一步获得。
所以，Promise 在一定程度上解决了回调函数的书写结构问题，但回调函数依然在主流程上存在，只不过都放到了 then(...)里面，和我们大脑顺序线性的思维逻辑还是有出入的。

### catch 方法

catch() 方法返回一个 Promise，并且处理拒绝的情况。它的行为与调用 Promise.prototype.then(undefined, onRejected) 相同。 (事实上, calling obj.catch(onRejected) 内部 calls obj.then(undefined, onRejected)).

```
p.catch(onRejected);

p.catch(function(reason) {
   // 拒绝
});
```

onRejected
当 Promise 被 rejected 时,被调用的一个 Function。 该函数拥有一个参数：
reason rejection 的原因。
如果 onRejected 抛出一个错误或返回一个本身失败的 Promise ， 通过 catch() 返回的 Promise 被 rejected；否则，它将显示为成功（resolved）。

### Promise 缺点

- 无法取消 Promise
- 当处于 pending 状态时，无法得知目前进展到哪一个阶段
- 错误不能被 try catch（try..catch 结构，它只能是同步的，无法用于异步代码模式）
-

执行`f2()`，无法通过 try/catch 捕获 promise.reject，控制台抛出`Uncaught (in promise)`

```
function f2() {
  try {
    Promise.reject('出错了');
  } catch(e) {
    console.log(e)
  }
}

```

改成 await/async 后，执行`f()`就能在 catch 中捕获到错误了，并不会抛出`Uncaught (in promise)`

```
async function f() {
  try {
    await Promise.reject('出错了')
  } catch(e) {
    console.log(e)
  }
}
```

**可以这么理解，promise 中的错误发生在未来，所以无法现在捕获**

## 生成器 Generators/ yield

### 什么是 Generator

Generator 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同
Generator 函数有多种理解角度。语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。
执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。形式上，Generator 函数是一个普通函数，但是有两个特征。

- 一是，function 关键字与函数名之间有一个星号；
- 二是，函数体内部使用 yield 表达式，定义不同的内部状态

### Generator 调用方式

Generator 函数的调用方法与普通函数一样，也是在函数名后面加上一对圆括号。不同的是，调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是上一章介绍的遍历器对象（Iterator Object）。
下一步，必须调用遍历器对象的 next 方法，使得指针移向下一个状态。也就是说，每次调用 next 方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个 yield 表达式（或 return 语句）为止。换言之，Generator 函数是分段执行的，yield 表达式是暂停执行的标记，而 next 方法可以恢复执行。

```
function* foo () {
  var index = 0;
  while (index < 2) {
    yield index++; //暂停函数执行，并执行yield后的操作
  }
}
var bar =  foo(); // 返回的其实是一个迭代器

console.log(bar.next());    // { value: 0, done: false }
console.log(bar.next());    // { value: 1, done: false }
console.log(bar.next());    // { value: undefined, done: true }
```

### 了解 Co

可以看到上个例子当中我们需要一步一步去调用 next 这样也会很麻烦，这时我们可以引入 co 来帮我们控制
Co 是一个为 Node.js 和浏览器打造的基于生成器的流程控制工具，借助于 Promise，你可以使用更加优雅的方式编写非阻塞代码。
Co 函数库约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，而 async 函数的 await 命令后面，可以跟 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）。
说白了就是帮你自动执行你的 Generator 不用手动调用 next

可以简单实现下：

```
function co(it) {
    return new Promise(function (resolve, reject) {
        function step(d) {
            let { value, done } = it.next(d);
            if (!done) {
                value.then(function (data) { // 2,txt
                    step(data)
                }, reject)
            } else {
                resolve(value);
            }
        }
        step();
    });
}

```

比如我们有个生成器函数是 r(),直接扔进 co 里自动执行

```
function* r() {
    let content1 = yield read('1.txt', 'utf8');
    let content2 = yield read(content1, 'utf8');
    return content2;
}
co(r()).then(function (data) {
    console.log(data)
})

```

### 解决异步问题

我们可以通过 Generator 函数解决回调地狱的问题，可以把之前的回调地狱例子改写为如下代码：

```
const co = require('co');
co(
function* read() {
    yield readFile(A, 'utf-8');
    yield readFile(B, 'utf-8');
    yield readFile(C, 'utf-8');
    //....
}
).then(data => {
    //code
}).catch(err => {
    //code
});

```

```
function *fetch() {
    yield ajax(url, () => {})
    yield ajax(url1, () => {})
    yield ajax(url2, () => {})
}
let it = fetch()
let result1 = it.next()
let result2 = it.next()
let result3 = it.next()

```

## 终极解决方案 Async/ await

> async 函数是 Generator 函数的语法糖，是对 Generator 做了进一步的封装。

### async 函数对 Generator 函数的改进

- 1.`内置执行器`。Generator 函数的执行必须依靠执行器，而 async 函数自带执行器，无需手动执行 next() 方法。
- 2.`更好的语义`。async 和 await，比起星号和 yield，语义更清楚了。async 表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待结果。
- 3.`更广的适用性`。co 模块约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，而 async 函数的 await 命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）。
- 4.`返回值是 Promise`。async 函数返回值是 Promise 对象，比 Generator 函数返回的 Iterator 对象方便，可以直接使用 then() 方法进行调用。

### Co+Promise+Generator 实现 Async

async 重点是自带了执行器，相当于把我们要额外做的(写执行器/依赖 co 模块)都封装了在内部。比如：

```
async function fn(args) {
 // ...
}
```

等同于：

```
function fn(args) {
 return spawn(function* () {
   // ...
 });
}
function spawn(genF) { //spawn函数就是自动执行器，跟简单版的思路是一样的，多了Promise和容错处理
 return new Promise(function(resolve, reject) {
   const gen = genF();
   function step(nextF) {
     let next;
     try {
       next = nextF();
     } catch(e) {
       return reject(e);
     }
     if(next.done) {
       return resolve(next.value);
     }
     // 没有结束，递归调用step
     Promise.resolve(next.value).then(function(v) {
       step(function() { return gen.next(v); });
     }, function(e) {
       step(function() { return gen.throw(e); });
     });
   }
   step(function() { return gen.next(undefined); });
 });
}
```

这样就不难理解为什么 await 函数会等到后面跟 promise 在 resolve 后才会执行，因为可以看出整个代码是在 Generator 里执行，这样在 resolve 里调用了 gen.next(v)，才会往下走。
**注意一个细节：await 下一行的代码相当注册在 await 后面跟的 promise 的.then 回调里，这里和事件循环有关后面举例说明**

### Async 特点

- 当调用一个 async 函数时，会返回一个 Promise 对象。

```
    async function async1() {
      return "1"
    }
    console.log(async1()) // -> Promise {<resolved>: "1"}
```

- 当这个 async 函数返回一个值时，Promise 的 resolve 方法会负责传递这个值；
- 当 async 函数抛出异常时，Promise 的 reject 方法也会传递这个异常值。
- async 函数中可能会有 await 表达式，这会使 async 函数暂停执行，等待 Promise 的结果出来，然后恢复 async 函数的执行并返回解析（resolved）。
- 内置执行器。 Generator 函数的执行必须靠执行器，所以才有了 co 函数库，而 async 函数自带执行器。也就是说，async 函数的执行，与普通函数一模一样，只要一行。
- 更广的适用性。co 模块约定，yield 命令后面只能是 Thunk 函数或 Promise 对象。而 async 函数的 await 命令后面则可以是 Promise 或者 原始类型的值（Number，string，boolean，但这时等同于同步操作）

### await 特点

- await 操作符用于等待一个 Promise 对象。它只能在异步函数 async function 中使用。
- [return_value] = await expression;
- await 表达式会暂停当前 async function 的执行，等待 Promise 处理完成。若 Promise 正常处理(fulfilled)，其回调的 resolve 函数参数作为 await 表达式的值，继续执行 async function。
- 另外，如果 await 操作符后的表达式的值不是一个 Promise，则返回该值本身。
- 若 Promise 处理异常(rejected)，await 表达式会把 Promise 的异常原因抛出。可以用 catch 在外部捕获

**重点：遇到 await 表达式时，会让 async 函数 暂停执行，等到 await 后面的语句（Promise）状态发生改变（resolved 或者 rejected）之后，再恢复 async 函数的执行（再之后 await 下面的语句），并返回解析值（Promise 的值）**

### await 让出线程

很多人以为await会一直等待之后的表达式执行完之后才会继续执行后面的代码，实际上await是一个让出线程的标志。

await后面的函数会先执行一遍(比如await Fn()的Fn ,并非是下一行代码)，然后就会跳出整个async函数来执行后面js栈的代码。

等本轮事件循环执行完了之后又会跳回到async函数中等待await后面表达式的返回值，如果返回值为非promise则继续执行async函数后面的代码，否则将返回的promise放入Promise队列（Promise的Job Queue）

等下轮事件来的时候这个Promise是resolve的，其then回调又会被放入任务队列继续等待，然后再次跳出 async1函数 继续下一个任务。


### async await 异常处理

```
let last;
async function throwError() {
    await Promise.reject('error');//这里就是异常
    last = await '没有执行';
}
throwError().then(success => console.log('成功', success,last))
            .catch(error => console.log('失败',error,last))
```

![](/img/blog/JavaScript异步编程/1.png)

上面函数，执行的到`await`排除一个错误后，就停止往下执行，导致`last`没有赋值报错。
`async`里如果有多个 await 函数的时候，如果其中任一一个抛出异常或者报错了，都会导致函数停止执行，直接`reject`;
怎么处理呢，可以用`try/catch`，遇到函数的时候，可以将错误抛出，并且继续往下执行。

```
let last;
async function throwError() {
    try{
       await Promise.reject('error');
       last = await '没有执行';
    }catch(error){
        console.log('has Error stop');
    }
}
throwError().then(success => console.log('成功', last))
            .catch(error => console.log('失败',last))

```

![](/img/blog/JavaScript异步编程/2.png)

### Async 执行方式

简单说 , async/awit 就是对上面 gennerator 自动化流程的封装 , 让每一个异步任务都是自动化的执行 , 当第一个异步任务 readFile(A)执行完如上一点说明的, async 内部自己执行 next(),调用第二个任务 readFile(B);

```
这里引入ES6阮一峰老师的例子
const fs = require('fs');

const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};


async function read() {
    await readFile(A);//执行到这里停止往下执行，等待readFile内部resolve（data）后，再往下执行
    await readFile(B);
    await readFile(C);
    //code
}

//这里可用于捕获错误
read().then((data) => {
    //code
}).catch(err => {
    //code
});
```

### 注意 await 下面的代码执行的时机

```
async function async1() {
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}

async function async2() {
    console.log('async2')
}

async1();

new Promise((resolve) => {
    console.log(1)
    resolve()
}).then(() => {
    console.log(2)
}).then(() => {
    console.log(3)
}).then(() => {
    console.log(4)
})
```

执行顺序：

```
async1 start
async2
1
async1 end//注册在async2()的.then里，推迟了一个时序
2
3
4
```

新版 V8 中执行的时序等价于(激进优化后与老版不同)：

```
function async1(){
    console.log('async1 start');
    const p = async2();
    return Promise.resolve(p)
        .then(() => {
            console.log('async1 end')
        });
}

function async2(){
    console.log('async2');
    return Promise.resolve();
}

async1();

new Promise((resolve) => {
    console.log(1)
    resolve()
}).then(() => {
    console.log(2)
}).then(() => {
    console.log(3)
}).then(() => {
    console.log(4)
})
```

## 参考文章

- http://es6.ruanyifeng.com/
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise
- https://juejin.im/post/5aa7868b6fb9a028dd4de672
- https://juejin.im/post/5b83cb5ae51d4538cc3ec354
- https://juejin.im/post/596e142d5188254b532ce2da
