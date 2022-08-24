## requestIdleCallback 和 requestAnimationFrame 有什么区别？

requestAnimationFrame 的回调会在每一帧确定执行，属于高优先级任务，而 requestIdleCallback 的回调则不一定，属于低优先级任务，在完成 Frame commit 后如果有空隙才执行。

## requestAnimationFrame 的执行时机

requestAnimationFrame 也属于异步执行的方法，但该方法既不属于宏任务，也不属于微任务。按照 MDN 中的定义：
window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行
requestAnimationFrame 是 GUI 渲染之前执行，但在微服务之后，不过 requestAnimationFrame 不一定会在当前帧必须执行，由浏览器根据当前的策略自行决定在哪一帧执行。

## requestIdleCallback 里面可以执行 DOM 修改操作吗？

强烈建议不要，从上面一帧的构成里面可以看到，requestIdleCallback 回调的执行说明前面的工作（包括样式变更以及布局计算）都已完成。如果我们在 callback 里面做 DOM 修改的话，之前所做的布局计算都会失效，而且如果下一帧里有获取布局（如 getBoundingClientRect、clientWidth）等操作的话，浏览器就不得不执行强制重排工作,这会极大的影响性能，另外由于修改 dom 操作的时间是不可预测的，因此很容易超出当前帧空闲时间的阈值，故而不推荐这么做。

## requestAnimationFrame 可以做 DOM 修改

requestAnimationFrame 里面做 dom 的修改，可以在 requestIdleCallback 里面构建 Document Fragment，然后在下一帧的 requestAnimationFrame 里面应用 Fragment。
除了不推荐 DOM 修改操作外，Promise 的 resolve(reject)操作也不建议放在里面，因为 Promise 的回调会在 idle 的回调执行完成后立刻执行，会拉长当前帧的耗时，所以不推荐。
推荐放在 requestIdleCallback 里面的应该是小块的（microTask）并且可预测时间的任务。关于 microTask 推荐

## requestAnimationFrame 与 setTimeout/setInterval

### setTimeout/setInterval

有一个显著的缺陷在于时间是不精确的，setTimeout/setInterval 只能保证延时或间隔不小于设定的时间。因为它们实际上只是把任务添加到了任务队列中，但是如果前面的任务还没有执行完成，它们必须要等待。

### requestAnimationFrame

requestAnimationFrame 才有的是系统时间间隔，保持最佳绘制效率，不会因为间隔时间过短，造成过度绘制，增加开销；也不会因为间隔时间太长，使用动画卡顿不流畅，让各种网页动画效果能够有一个统一的刷新机制，从而节省系统资源，提高系统性能，改善视觉效果。

### 综上所述

requestAnimationFrame 和 setTimeout/setInterval 在编写动画时相比，优点如下:
1.requestAnimationFrame 不需要设置时间，采用系统时间间隔，能达到最佳的动画效果。
2.requestAnimationFrame 会把每一帧中的所有 DOM 操作集中起来，在一次重绘或回流中就完成。 
3.当 requestAnimationFrame() 运行在后台标签页或者隐藏的 `<iframe>` 里时，requestAnimationFrame() 会被暂停调用以提升性能和电池寿命（大多数浏览器中）。
