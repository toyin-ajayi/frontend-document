## Promise.resolve方法的参数分成四种情况。
### **参数是一个 Promise 实例**

如果参数是 Promise 实例，那么Promise.resolve将不做任何修改、原封不动地返回这个实例。
**这是一个特殊的情况会和另一种new Promise(r => r(v))产生不一样的效果，最后说明**

### **参数是一个thenable对象**

thenable对象指的是具有then方法的对象，比如下面这个对象

```
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};

```

Promise.resolve方法会将这个对象转为 Promise 对象，然后就立即执行thenable对象的then方法。

```
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};

let p1 = Promise.resolve(thenable);
p1.then(function(value) {
  console.log(value);  // 42
});

```

thenable对象的then方法执行后，对象p1的状态就变为resolved，从而立即执行最后那个then方法指定的回调函数，输出 42

### **参数不是具有then方法的对象，或根本就不是对象**

如果参数是一个原始值，或者是一个不具有then方法的对象，则Promise.resolve方法返回一个**新的 Promise 对象**，状态为resolved。

```
const p = Promise.resolve('Hello');

p.then(function (s){
  console.log(s)
});
// Hello
```

由于字符串Hello不属于异步操作（判断方法是字符串对象不具有 then 方法），返回 Promise 实例的状态从一生成就是resolved，所以回调函数会执行。Promise.resolve方法的参数，会同时传给回调函数

### **不带有任何参数**

Promise.resolve方法允许调用时不带参数，直接返回一个resolved状态的 Promise 对象。

```
setTimeout(function () {
  console.log('three');
}, 0);

Promise.resolve().then(function () {
  console.log('two');
});

console.log('one');

// one
// two
// three

```

.then()函数里不返回值或者返回的不是promise，那么 `then` 返回的 Promise 将会成为接受状态（resolve）
```
Promise.resolve().then(() => console.log(2)).then(() => console.log(3));
console.log(1); // 1, 2, 3
```
需要注意的是，**立即resolve的 Promise 对象，是在本轮“事件循环”（event loop）的结束时执行执行，不是马上执行,也不是在下一轮“事件循环”的开始时执行**
原因：传递到 `then()` 中的函数被置入了一个微任务队列，而不是立即执行，这意味着它是在 JavaScript 事件队列的所有运行时结束了，事件队列被清空之后，才开始执行

## `Promise.resolve(v)`不等于`new Promise(r => r(v))`

**当v是一个Promise实例的时候就会出现一些不同的地方**

```
    // v是一个实例化的promise，且状态为fulfilled
    let v = new Promise(resolve => {
      console.log("begin");
      resolve("then");
    });

    // 在promise里面resolve一个状态为fulfilled的promise

    // 模式一 new Promise里的resolve()
    // begin->1->2->3->then->4 可以发现then推迟了两个时序
    // 推迟原因：浏览器会创建一个 PromiseResolveThenableJob 去处理这个 Promise 实例，这是一个微任务。
    // 等到下次循环到来这个微任务会执行，也就是PromiseResolveThenableJob 执行中的时候，因为这个Promise 实例是fulfilled状态，所以又会注册一个它的.then()回调
    // 又等一次循环到这个Promise 实例它的.then()回调执行后，才会注册下面的这个.then(),于是就被推迟了两个时序
    new Promise(resolve => {
      resolve(v);
    }).then((v)=>{
        console.log(v)
    });

    //  模式二 Promise.resolve(v)直接创建
    // begin->1->then->2->3->4 可以发现then的执行时间正常了，第一个执行的微任务就是下面这个.then
    // 原因：Promise.resolve()API如果参数是promise会直接返回这个promise实例，不会做任何处理
/*     Promise.resolve(v).then((v)=>{
        console.log(v)
    }); */

    new Promise(resolve => {
      console.log(1);
      resolve();
    })
      .then(() => {
        console.log(2);
      })
      .then(() => {
        console.log(3);
      })
      .then(() => {
        console.log(4);
      });
```

## resolve()本质作用

- resolve()是用来表示promise的状态为fullfilled，相当于只是定义了一个有状态的Promise，但是并没有调用它；

- promise调用then的前提是promise的状态为fullfilled；

- 只有promise调用then的时候，then里面的函数才会被推入微任务中；
