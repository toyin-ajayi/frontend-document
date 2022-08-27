> #### 最近看了很多关于 JS 运行机制的文章，每篇都获益匪浅，但各有不同，所以在这里对这几篇文章里说的很精辟的地方做一个总结，总结的文章链接见最后。[本文博客地址][1]

## CPU、进程、线程之间的关系

- `进程`是 cpu 资源分配的最小单位（是能拥有资源和独立运行的最小单位）
- `线程`是 cpu 调度的最小单位（线程是建立在进程的基础上的一次程序运行单位，一个进程中可以有多个线程）
- 不同`进程`之间也可以通信，不过代价较大
- `单线程`与`多线程`，都是指在一个`进程`内的单和多

## 了解进程和线程

- 进程是应用程序的执行实例，每一个进程都是由私有的虚拟地址空间、代码、数据和其它系统资源所组成；进程在运行过程中能够申请创建和使用系统资源（如- 独立的内存区域等），这些资源也会随着进程的终止而被销毁。
- 而线程则是进程内的一个独立执行单元，在不同的线程之间是可以共享进程资源的，所以在多线程的情况下，需要特别注意对临界资源的访问控制。
- 在系统创建进程之后就开始启动执行进程的主线程，而进程的生命周期和这个主线程的生命周期一致，主线程的退出也就意味着进程的终止和销毁。
- 主线程是由系统进程所创建的，同时用户也可以自主创建其它线程，这一系列的线程都会并发地运行于同一个进程中。

## 浏览器是多进程的

> 详情看我上篇总结浏览器执行机制的文章-[深入前端-彻底搞懂浏览器运行机制][2]

- 浏览器每打开一个标签页，就相当于创建了一个独立的浏览器进程。
- Browser 进程：浏览器的主进程（负责协调、主控），只有一个。作用有
- 第三方插件进程：每种类型的插件对应一个进程，仅当使用该插件时才创建
- GPU 进程：最多一个，用于 3D 绘制等
- 浏览器渲染进程（浏览器内核）

## javascript 是一门单线程语言

- jS 运行在浏览器中，是单线程的，但每个 tab 标签页都是一个进程，都含有不同 JS 线程分别执行，，一个 Tab 页（renderer 进程）中无论什么时候都只有一个 JS 线程在运行 JS 程序
- 既然是单线程的，在某个特定的时刻只有特定的代码能够被执行，并阻塞其它的代码。而浏览器是事件驱动的（Event driven），浏览器中很多行为是异步（Asynchronized）的，会创建事件并放入执行队列中。javascript 引擎是单线程处理它的任务队列，你可以理解成就是普通函数和回调函数构成的队列。当异步事件发生时，如（鼠标点击事件发生、定时器触发事件发生、XMLHttpRequest 完成回调触发等），将他们放入执行队列，等待当前代码执行完成。
- javascript 引擎是基于事件驱动单线程执行的，JS 引擎一直等待着任务队列中任务的到来，然后加以处理，浏览器无论什么时候都只有一个 JS 线程在运行 JS 程序。所以一切 javascript 版的"多线程"都是用单线程模拟出来的
- 为什么 JavaScript 是单线程？与它的用途有关。作为浏览器脚本语言，JavaScript 的主要用途是与用户互动，以及操作 DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，假定 JavaScript 同时有两个线程，一个线程在某个 DOM 节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？

## 任务队列

- "任务队列"是一个事件的队列（也可以理解成消息的队列），IO 设备完成一项任务，就在"任务队列"中添加一个事件，表示相关的异步任务可以进入"执行栈"了。主线程读取"任务队列"，就是读取里面有哪些事件。
- "任务队列"中的事件，除了 IO 设备的事件以外，还包括一些用户产生的事件（比如鼠标点击、页面滚动等等）,ajax 请求等。只要指定过回调函数，这些事件发生时就会进入"任务队列"，等待主线程读取。
- 所谓"回调函数"（callback），就是那些会被主线程挂起来的代码。异步任务必须指定回调函数，当主线程开始执行异步任务，就是执行对应的回调函数。
- "任务队列"是一个先进先出的数据结构，排在前面的事件，优先被主线程读取。主线程的读取过程基本上是自动的，只要执行栈一清空，"任务队列"上第一位的事件就自动进入主线程。但是，由于存在后文提到的"定时器"功能，主线程首先要检查一下执行时间，某些事件只有到了规定的时间，才能返回主线程。

## 同步和异步任务

既然 js 是单线程，那么问题来了，某一些非常耗时间的任务就会导致阻塞，难道必须等前面的任务一步一步执行玩吗？
比如我再排队就餐，前面很长的队列，我一直在那里等岂不是很傻逼，说以就会有排号系统产生，我们订餐后给我们一个号码，叫到号码直接去就行了，没交我们之前我们可以去干其他的事情。
因此聪明的程序员将任务分为两类：

- 同步任务：同步任务指的是，在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务；
- 异步任务：异步任务指的是，不进入主线程、而进入"任务队列"（Event queue）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。

![](/img/blog/23/2.png)

## 任务有更精细的定义：

  - macro-task(宏任务)：包括整体代码script（同步宏任务），setTimeout、setInterval（异步宏任务）、I/O(xhr)、UI 交互事件（优先级较高）、postMessage、MessageChannel、setImmediate(Node.js 环境)。
  - micro-task(微任务)：Promise，process.nextTick，ajax请求（异步微任务）,MutationObserver
  ![](/img/blog/23/1.png)

## 为什么区分宏任务和微任务 - 权衡效率和实时性

那该如何权衡效率和实时性呢？针对这种情况，微任务就应用而生了

### 效率
通常我们把消息队列中的任务称为宏任务，每个宏任务中都包含了一个微任务队列，在执行宏任务的过程中，如果 DOM 有变化，那么就会将该变化添加到微任务列表中，这样就不会影响到宏任务的继续执行，因此也就解决了执行效率的问题。

### 实时性
等宏任务中的主要功能都直接完成之后，这时候，渲染引擎并不着急去执行下一个宏任务，而是执行当前宏任务中的微任务，因为 DOM 变化的事件都保存在这些微任务队列中，这样也就解决了实时性问题。

### macrotask（又称之为宏任务）

可以理解是每次执行栈执行的代码就是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行）
每一个 task 会从头到尾将这个任务执行完毕，不会执行其它
浏览器为了能够使得 JS 内部 task 与 DOM 任务能够有序的执行，会在一个 task 执行结束后，在下一个 task 执行开始前，对页面进行重新渲染
（task->渲染->task->...）

### microtask（又称为微任务），可以理解是在当前 task 执行结束后立即执行的任务

也就是说，在当前 task 任务后，下一个 task 之前，在渲染之前
所以它的响应速度相比 setTimeout（setTimeout 是 task）会更快，因为无需等渲染
也就是说，在某一个 macrotask 执行完后，就会将在它执行期间产生的所有 microtask 都执行完毕（在渲染前）
![](/img/blog/23/3.png)

## 执行机制与事件循环

主线程运行的时候，产生堆（heap）和栈（stack），栈中的代码调用各种外部 API，它们在"任务队列"中加入各种事件（click，load，done）。只要栈中的代码执行完毕，主线程就会去读取"任务队列"，依次执行那些事件所对应的回调函数。

那怎么知道主线程执行栈为执行完毕？js 引擎存在 monitoring process 进程，会持续不断的检查主线程执行栈是否为空，一旦为空，就会去 Event Queue 那里检查是否有等待被调用的函数。

第一轮事件循环：
主线程执行 js 整段代码（宏任务），将 ajax、setTimeout、promise 等回调函数注册到 Event Queue，并区分宏任务和微任务。
主线程提取并执行 Event Queue 中的 ajax、promise 等所有微任务，并注册微任务中的异步任务到 Event Queue。
第二轮事件循环：
主线程提取 Event Queue 中的第一个宏任务（通常是 setTimeout）。
主线程执行 setTimeout 宏任务，并注册 setTimeout 代码中的异步任务到 Event Queue（如果有）。
执行 Event Queue 中的所有微任务，并注册微任务中的异步任务到 Event Queue（如果有）。
类似的循环：宏任务每执行完一个，就清空一次事件队列中的微任务。

**注意：事件队列中分“宏任务队列”和“微任务队列”，每执行一次任务都可能注册新的宏任务或微任务到相应的任务队列中，只要遵循“每执行一个宏任务，就会清空一次事件队列中的所有微任务”这一循环规则，就不会弄乱。**

![](/img/blog/23/5.png)

## 说了那么多来点实例吧

### ajax 普通异步请求实例

```tsx
let data = [];
$.ajax({
    url:www.javascript.com,
    data:data,
    success:() => {
        console.log('发送成功!');
    }
})
console.log('代码执行结束');

```

1.执行整个代码，遇到 ajax 异步操作
2.ajax 进入 Event Table，注册回调函数 success。 3.执行 console.log('代码执行结束')。 4.执行 ajax 异步操作
5.ajax 事件完成，回调函数 success 进入 Event Queue。 5.主线程从 Event Queue 读取回调函数 success 并执行。

### Promise 的链式 then() 是怎样执行的

```tsx
new Promise((r) => {
    r();
})
.then(() => console.log(1))
.then(() => console.log(2))
.then(() => console.log(3))

new Promise((r) => {
    r();
})
.then(() => console.log(4))
.then(() => console.log(5))
.then(() => console.log(6))
```

执行的结果是 1 4 2 5 3 6

- Promise 多个`then()`链式调用，并不是连续的创建了多个微任务并推入微任务队列，因为`then()`的返回值必然是一个 Promise，而后续的`then()`是上一步`then()`返回的 Promise 的回调
- 传入 Promise 构造器的执行器函数内部的同步代码执行到`resolve()`，将 Promise 的状态改变为`<resolved>: undefined`, 然后 then 中传入的回调函数`console.log('1')`作为一个微任务被推入微任务队列
- 第二个`then()`中传入的回调函数`console.log('2')`此时还没有被推入微任务队列，只有上一个`then()`中的`console.log('1')`执行完毕后，`console.log('2')`才会被推入微任务队列

### 普通微任务宏任务实例

```tsx
setTimeout(function(){
    console.log('定时器开始啦')
});

new Promise(function(resolve){
    console.log('马上执行for循环啦');
    for(var i = 0; i < 10000; i++){
        i == 99 && resolve();
    }
}).then(function(){
    console.log('执行then函数啦')
});

console.log('代码执行结束');

```

- 1.整段代码作为宏任务执行，遇到 setTimeout 宏任务分配到宏任务 Event Queue 中 
- 2.遇到 promise 内部为同步方法直接执行-“马上执行 for 循环啦” 
- 3.注册 then 回调到 Eventqueen 
- 4.主代码宏任务执行完毕-“代码执行结束” 
- 5.主代码宏任务结束被 monitoring process 进程监听到，主任务执行 Event Queue 的微任务 
- 6.微任务执行完毕-“执行 then 函数啦” 
- 7.执行宏任务 console.log('定时器开始啦')

### async/await 执行顺序

```tsx
// 1 2 6 4 3 5
//console.log(3)其实是在async2函数返回的Promise的then语句中执行的
async function async1() {
  console.log(1);
  const result = await async2();
  console.log(3);
}

async function async2() {
  console.log(2);
}
//console.log(async2())

Promise.resolve().then(() => {
  console.log(4);
});

setTimeout(() => {
  console.log(5);
});

async1();
console.log(6);
```

### 地狱模式：promise 和 settimeout 事件循环实例

```tsx
console.log('1');
// 1 6 7 2 4 5 9 10 11 8 3
// 记作 set1
setTimeout(function () {
    console.log('2');
    // set4
    setTimeout(function() {
        console.log('3');
    });
    // pro2
    new Promise(function (resolve) {
        console.log('4');
        resolve();
    }).then(function () {
        console.log('5')
    })
})

// 记作 pro1
new Promise(function (resolve) {
    console.log('6');
    resolve();
}).then(function () {
    console.log('7');
    // set3
    setTimeout(function() {
        console.log('8');
    });
})

// 记作 set2
setTimeout(function () {
    console.log('9');
    // 记作 pro3
    new Promise(function (resolve) {
        console.log('10');
        resolve();
    }).then(function () {
        console.log('11');
    })
})

```

#### 第一轮事件循环

1.整体 script 作为第一个宏任务进入主线程，遇到 console.log，输出 1。

![](/img/blog/23/6.png)

2.遇到 set1，其回调函数被分发到宏任务 Event Queue 中。

![](/img/blog/23/7.png)

3.遇到 pro1，new Promise 直接执行，输出 6。then 被分发到微任务 Event Queue 中。

![](/img/blog/23/8.png)

4.遇到了 set2，其回调函数被分发到宏任务 Event Queue 中。

![](/img/blog/23/9.png)

5. 主线程的整段 js 代码（宏任务）执行完，开始清空所有微任务；主线程执行微任务 pro1，输出 7；遇到 set3，注册回调函数。

![](/img/blog/23/10.png)

#### 第二轮事件循环

1.主线程执行队列中第一个宏任务 set1，输出 2；代码中遇到了 set4，注册回调；又遇到了 pro2，new promise()直接执行输出 4，并注册回调；

![](/img/blog/23/11.png)

2.set1 宏任务执行完毕，开始清空微任务，主线程执行微任务 pro2，输出 5。

![](/img/blog/23/12.png)

#### 第三轮事件循环

1.主线程执行队列中第一个宏任务 set2，输出 9；代码中遇到了 pro3，new promise()直接输出 10，并注册回调；

2.set2 宏任务执行完毕，开始情况微任务，主线程执行微任务 pro3，输出 11。

类似循环...

所以最后输出结果为 1、6、7、2、4、5、9、10、11、8、3。

## 参考文章

- https://www.cnblogs.com/Mainz/p/3552717.html
- http://www.ruanyifeng.com/blog/2014/10/event-loop.html
- https://juejin.im/post/5b4dfb94f265da0f955cc606
- https://juejin.im/post/5b879a9f6fb9a01a0f24a5e1
- https://juejin.im/post/59e85eebf265da430d571f89#heading-1

[1]: https://www.jianjiacheng.com/2019/07/06/JavaScript/%E6%B7%B1%E5%85%A5%E5%89%8D%E7%AB%AF-%E5%BD%BB%E5%BA%95%E6%90%9E%E6%87%82JS%E7%9A%84%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6/
[2]: https://www.jianjiacheng.com/2019/07/06/%E6%B5%8F%E8%A7%88%E5%99%A8/%E6%B7%B1%E5%85%A5%E5%89%8D%E7%AB%AF-%E5%BD%BB%E5%BA%95%E6%90%9E%E6%87%82%E6%B5%8F%E8%A7%88%E5%99%A8%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6/
