## Async/Await 真的只是简单的语法糖吗

并不是，与直接使用 Promise 相比，使用Async/Await不仅可以提高代码的可读性，同时也可以优化 JavaScript 引擎的执行方式

Async/Await 与 Promise 最大区别在于：await b()会暂停所在的 async 函数的执行；而 Promise.then(b)将 b 函数加入回调链中之后，会继续执行当前函数。对于堆栈来说，这个不同点非常关键。

当一个 Promise 链抛出一个未处理的错误时，无论我们使用 await b()还是 Promise.then(b)，JavaScript 引擎都需要打印错误信息及其堆栈。对于 JavaScript 引擎来说，两者获取堆栈的方式是不同的。


## Promise.then(b)

函数 c()会在异步函数 b()成功 resolve 之后执行：

```tsx
const a = () => {
    b().then(() => c());
};
```
当调用 a()函数时，这些事情同步发生：

- b()函数被调用，它会返回一个 Promise，这个 Promise 会在未来的某个时刻 resolve。
- .then()回调函数(实际调用了 c()函数)被添加到回调链。

现在假设JS引擎只帮助我们做上面的两点事情：

- a()函数不会被暂停，那么a()函数内的代码就执行完了之后，也就是当异步函数 b()resolve 时，a()函数的作用域已经不存在了。

- 假设 b()或者 c()抛出了一个错误，则堆栈信息中应该包含 a()函数，因为它们都是在 a()函数内被调用。对 a()函数的任何引用都不存在了，要如何生成包含 a()的堆栈信息呢？

## 保存堆栈信息

为了解决这个问题，JavaScript 引擎需要做一些额外的工作：它会及时记录并且保存堆栈信息。对于 V8 引擎来说，堆栈信息附加在了 b()函数所返回的 Promise 并在 Promise 链中传递，这样 c()函数也能在需要的时候获取堆栈信息。

记录堆栈信息需要时间，这样会降低性能；而保存堆栈信息需要占用额外的内存。

## 对比await写法

我们可以使用 Async/Await 实现同样的代码，同步函数 c()会等到异步函数 b()执行结束之后再执行：
```tsx
const a = async () => {
    await b();
    c();
};
```

- 使用 await 时，无需存储当前的堆栈信息，因为存储 b()到 a()的指针就足够了。
- 当等待 b()函数执行时，a()函数被暂停了，因此 a()函数的作用域还在内存可以访问。
- 如果 b()函数抛出一个错误，堆栈信息可以通过指针迅速生成。如果 c()函数抛出一个错误，堆栈信息也可以像同步函数一样生成，因为 c()函数是在 a()函数中执行的。
- 不论是 b()还是 c()，我们都不需要去存储堆栈信息，因为堆栈信息可以在需要的时候立即生成。而存储指针，显然比存储堆栈更加节省内存。

## 为什么推荐用Async/await

- 简洁易用，而且写法也更易理解，接近同步的写法
- 错误处理，Promise内部错误外部无法感知
- 方便拿到中间值，而是用回调
- 方便调试
- 错误栈信息：await不仅能减小开销，而且能确定到行，Promise如果有多个then不会报出具体位置

```tsx
const makeRequest = () => {
    return callAPromise()
        .then(() => callAPromise())
        .then(() => callAPromise())
        .then(() => callAPromise())
        .then(() => callAPromise())
        .then(() => {
            throw new Error("oops");
        });
};

makeRequest().catch(err => {
    console.log(err);
    // output
    // Error: oops at callAPromise.then.then.then.then.then (index.js:8:13)
});
```