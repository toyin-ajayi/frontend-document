## MutationObserver 前世今生

为了与内置控件一起良好地工作，这些控件必须能够适应内容更改、响应事件和用户交互。因此，Web 应用需要监视 DOM 变化并及时地做出响应。

2000 年的时候引入了 Mutation Event，Mutation Event 采用了观察者的设计模式，当 DOM 有变动时就会立刻触发相应的事件，这种方式属于同步回调。

采用 Mutation Event 解决了实时性的问题，因为 DOM 一旦发生变化，就会立即调用 JavaScript 接口。但也正是这种实时性造成了严重的性能问题，因为每次 DOM 变动，渲染引擎都会去调用 JavaScript，这样会产生较大的性能开销。比如利用 JavaScript 动态创建或动态修改 50 个节点内容，就会触发 50 次回调，而且每个回调函数都需要一定的执行时间，这里我们假设每次回调的执行时间是 4 毫秒，那么 50 次回调的执行时间就是 200 毫秒，若此时浏览器正在执行一个动画效果，由于 Mutation Event 触发回调事件，就会导致动画的卡顿。



## MutationObserver
MutationObserver  是现代浏览器提供的用来检测 DOM 变化的网页接口。你可以使用这个接口来监听新增或者删除节点，属性更改，或者文本节点的内容更改。


MutationObserver 将响应函数改成异步调用，可以不用在每次 DOM 变化都触发异步调用，而是等多次 DOM 变化后，一次触发异步调用，并且还会使用一个数据结构来记录这期间所有的 DOM 变化。这样即使频繁地操纵 DOM，也不会对性能造成太大的影响。

在每次 DOM 节点发生变化的时候，渲染引擎将变化记录封装成微任务，并将微任务添加进当前的微任务队列中。这样当执行到检查点的时候，V8 引擎就会按照顺序执行微任务了。

## 微任务
这个API归属于微任务，也就是说是异步的，这样设计也是为了应付Dom变动频繁的特点，防止频繁变动占用js执行栈造成页面卡顿。比如说：如果不是异步当DOM变动触发观察者的回调函数执行，就会堵塞后续代码的执行；是异步的话，在响应时间内比如说插入1000个p元素，那么MutationObserver会把这些响应合并成一次。


## MutationObserver的回调函数

通过往构造函数 MutationObserver 中传入一个函数作为参数来初始化一个 MutationObserver 实例，该函数会在每次发生 DOM 发生变化的时候调用。

MutationObserver 的函数的第一个参数即为单个批处理中的 DOM 变化集。每个变化包含了变化的类型和所发生的更改。
```tsx
var mutationObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    console.log(mutation);
  });
});


```

## 创建的实例对象拥有三个方法：

observe－开始进行监听。接收两个参数－要观察的 DOM 节点以及一个配置对象。
disconnect－停止监听变化。
takeRecords－触发回调前返回最新的批量 DOM 变化。
```tsx

var observer = new MutationObserver(callback);

// 开始监听页面根元素 HTML 变化。
mutationObserver.observe(document.documentElement, {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true
});

```