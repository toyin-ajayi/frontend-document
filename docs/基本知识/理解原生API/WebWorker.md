## Web Worker 简介

JavaScript 语言采用的是单线程模型，也就是说，所有任务只能在一个线程上完成，一次只能做一件事。前面的任务没做完，后面的任务只能等着。随着电脑计算能力的增强，尤其是多核 CPU 的出现，单线程带来很大的不便，无法充分发挥计算机的计算能力。

Web Worker 的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。这样的好处是，一些计算密集型或高延迟的任务，被 Worker 线程负担了，主线程（通常负责 UI 交互）就会很流畅，不会被阻塞或拖慢。

## Web Worker 有以下几个使用注意点。

- 同源限制:分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源。
- DOM 限制:Worker 线程所在的全局对象，与主线程不一样，无法读取主线程所在网页的 DOM 对象，也无法使用 document、window、parent 这些对象。但是，Worker 线程可以 navigator 对象和 location 对象。
- 通信联系:Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成。
- 脚本限制:Worker 线程不能执行 alert()方法和 confirm()方法，但可以使用 XMLHttpRequest 对象发出 AJAX 请求。
- 文件限制:Worker 线程无法读取本地文件，即不能打开本机的文件系统（file://），它所加载的脚本，必须来自网络。

## 应用

JavaScript 引擎是单线程运行的，JavaScript 中耗时的 I/O 操作都被处理为异步操作，它们包括键盘、鼠标 I/O 输入输出事件、窗口大小的 resize 事件、定时器(setTimeout、setInterval)事件、Ajax 请求网络 I/O 回调等。当这些异步任务发生的时候，它们将会被放入浏览器的事件任务队列中去，等到 JavaScript 运行时执行线程空闲时候才会按照队列先进先出的原则被一一执行，但终究还是单线程。所以需要有 Worker 来开一个线程计算耗时任务

- 对于图像、视频、音频的解析处理；
- canvas 中的图像计算处理；
- 大量的 ajax 请求或者网络服务轮询；
- 大量数据的计算处理（排序、检索、过滤、分析…）；

## 如何使用

创建 Worker 时，JS 引擎向浏览器申请开一个子线程（子线程是浏览器开的，完全受主线程控制，而且不能操作 DOM）
JS 引擎线程与 worker 线程间通过特定的方式通信（postMessage API，需要通过序列化对象来与线程交互特定的数据）

```
//主线程 main.js
var worker = new Worker("worker.js");
worker.onmessage = function(event){
    // 主线程收到子线程的消息
};
// 主线程向子线程发送消息
worker.postMessage({
    type: "start",
    value: 12345
});

//web worker.js
onmessage = function(event){
   // 收到
};
postMessage({
    type: "debug",
    message: "Starting processing..."
});
```

worker 接受消息的写法有很多种

```
// 写法 1
self.addEventListener('message', function (e) {
    // ...
})

// 写法 2
this.addEventListener('message', function (e) {
    // ...
})

// 写法 3
addEventListener('message', function (e) {
    // ...
})

// 写法 4
onmessage = function (e) {
    // ...
}

```

## 对比 Service worker

Service worker 是浏览器和网络间的代理。通过拦截文档中发出的请求，service worker 可以直接请求缓存中的数据，达到离线运行的目的。

Web worker 是通常目的是让我们减轻主进程中的密集处理工作的脚本。
