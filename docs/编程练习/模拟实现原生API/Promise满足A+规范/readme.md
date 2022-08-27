## Promise

>概念参考自 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise

Promise 一定程度上解决了回调地狱的问题，Promise 最早由社区提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了Promise对象。

### 基本状态

- Promise存在三个状态（state）pending、fulfilled、rejected
- pending（等待态）为初始态，并可以转化为fulfilled（成功态）和rejected（失败态）
- 成功时，不可转为其他状态，且必须有一个不可改变的值（value）
- 失败时，不可转为其他状态，且必须有一个不可改变的原因（reason）
- new Promise((resolve, reject)=>{resolve(value)}) resolve为成功，接收参数- value，状态改变为fulfilled，不可再次改变。
- new Promise((resolve, reject)=>{reject(reason)}) reject为失败，接收参数- reason，状态改变为rejected，不可再次改变。
- 若是executor函数报错 直接执行reject();


Promise 是一个构造函数，new Promise 返回一个 promise对象
```tsx
const promise = new Promise((resolve, reject) => {
   resolve('fulfilled'); // 状态由 pending => fulfilled
});
promise.then(result => { // onFulfilled
    console.log(result); // 'fulfilled' 
}, reason => { // onRejected 不会被调用
    
})
```

### then方法的链式调用


Promise对象的then方法返回一个新的Promise对象，因此可以通过链式调用then方法。then方法接收两个函数作为参数，第一个参数是Promise执行成功时的回调，第二个参数是Promise执行失败时的回调。两个函数只会有一个被调用，函数的返回值将被用作创建then返回的Promise对象。这两个参数的返回值可以是以下三种情况中的一种：

- return了一个值，那么then返回的 Promise 将会成为接受(resolved)状态，并且将返回的值作为接受状态的回调函数的参数值。
- 没有返回任何值(，默认返回undefined)，那么then返回的 Promise 将会成为接受(resolved)状态，并且该接受状态的回调函数的参数值为undefined。
- 抛出(throw)一个错误，那么then返回的 Promise 将会成为拒绝状态，并且将抛出的错误作为拒绝状态的回调函数的参数值。
- return 另一个 Promise，then方法将根据这个Promise的状态和值创建一个新的Promise对象返回。

  - 返回一个已经是接受状态的 Promise，那么then返回的 Promise 也会成为接受状态，并且将那个 Promise 的接受状态的回调函数的参数值作为该被返回的Promise的接受状态回调函数的参数值。
  - 返回一个已经是拒绝状态的 Promise，那么then返回的 Promise 也会成为拒绝状态，并且将那个 Promise 的拒绝状态的回调函数的参数值作为该被返回的Promise的拒绝状态回调函数的参数值。
  - 返回一个未定状态（pending）的 Promise，那么then返回 Promise 的状态也是未定的，并且它的终态与那个 Promise 的终态相同；同时，它变为终态时调用的回调函数参数与那个 Promise 变为终态时的回调函数的参数是相同的。


## 如何实现一个Promise

### A+规范

这里有一个中文翻译版：https://malcolmyu.github.io/2015/06/12/Promises-A-Plus/

### 实现基本状态管理

没啥好说的，基础版本很简单

参考：[myPromise1同步then.js](./myPromise1同步then.js)

### 如何实现then的异步调用

then的两个参数onFulfilled,onRejected，如果他们是函数，则必须分别在fulfilled，rejected后被调用，value或reason依次作为他们的第一个参数。如果resolve在setTimeOut里面执行，就无法在第一时间改变状态，如何满足异步的触发呢？

思路就基于发布订阅的模式，如果Promise状态为pending那么有then回调函数就用一个箭头函数包裹这个该调用的函数，然后放入到一个缓存队列里，然后当上层resolve后，状态由pending改为fulfilled,然后去取队列里的所有方法，遍历执行。

中间注意储存函数在队列里时，其参数是this.value,也就是说参数被储存在属性上，在resolve时被重新赋值，拿到真正的参数

参考：[myPromise2异步then.js](./myPromise2异步then.js)

### onFulfilled,onRejected如何注册微任务

[myPromise2异步then.js](./myPromise2异步then.js)中：
// 有个小问题 then回调如果直接注册是同步任务，234会先打出来
// 而真实的promise是先执行'同步任务应该先执行'
```tsx
const myPro2 = new myPromise(resolve => {
  resolve(234);
}).then(val => console.log(val));
console.log('同步任务应该先执行')

```

A+规范规定onFulfilled或onRejected不能同步被调用，必须异步调用，也就是我们常说的注册微任务。

但浏览器端对微任务queueMicrotask不太支持，只有chrome能用(测了下node也行)，所以我们一般用setTimeout宏任务来模拟，node环境下可以使用nextTick。
```tsx
        // 一般浏览器
        setTimeout(() => {
          onRejected(this.reason);
        }, 0);
        // chrome 支持queueMicrotask，node也支持 
    
        queueMicrotask(()=>{
          onRejected(this.reason);
        })
        // node环境可以直接使用nextTick注册微任务
        process.nextTick(()=>{
          onRejected(this.reason);
      })
```

参考：[myPromise3模拟微任务.js](./myPromise3模拟微任务.js)


### 如何链式执行

实现链式调用需要在上一调用时就返回一个Promise，then函数里返回的情况要符合PromiseA+规范，分为三种情况，我们可以通过一个resolvePromise方法来处理，注意resolve一个promise需要经过特殊处理，代码里说明了。

如果resolve的这个值是thenable（即带有"then" 方法)），返回的promise会“跟随”这个thenable的对象，采用它的最终状态；否则返回的promise将以此值完成。此函数将类promise对象的多层嵌套展平。


参考：[myPromise4链式调用.js](./myPromise4链式调用.js)

### 添加常用方法
>参考MDN：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve

#### Promise.resolve

如果该值为promise，返回这个promise；如果不是就new 一个 Promise 来包裹他然后返回。

#### Promise.reject

Promise.reject()方法返回一个带有拒绝原因的Promise对象

#### Promise.race

类方法，多个 Promise 任务同时执行，返回最先执行结束的 Promise 任务的结果，不管这个 Promise 结果是成功还是失败。

#### Promise.all

类方法，多个 Promise 任务同时执行。
如果全部成功执行，则以数组的方式返回所有 Promise 任务的执行结果。 如果有一个 Promise 任务 rejected，则只返回 rejected 任务的结果。

#### Promise.prototype.catch

实例方法，捕获异常，函数形式：fn(err){}, err 是 catch 注册 之前的回调抛出的异常信息。catch() 方法返回一个Promise，并且处理拒绝的情况。它的行为与调用Promise.prototype.then(undefined, onRejected) 相同。

为什么catch可以捕捉异常，并且使得Promise从reject变为resolve状态？
以前没注意，其实就是catch的时候直接去调then里面的回调onRejected方法，then是需要返回Promise的，而onReject就是new 了一个 Promise来处理，其实是两个不同的Promise，new 的这个Promise里如果没有异常会用 resolve(err) 来产生一个 fulfilled 状态的Promise，并且返回

#### Promise.prototype.finally 
>https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/109

finally 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作.
注意finally其实并不一定是这个promise链的最后一环，相对而言，其实done才是。
因为finally可能之后还有then和catch等等，所以其必须要返回一个promise对象。

参考：[myPromise5添加静态方法.js](./myPromise5添加静态方法.js)

