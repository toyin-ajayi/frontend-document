## nextTick 作用

在下次DOM更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后DOM。

一次事件循环中的代码执行完毕 => DOM更新（数据的变化到 DOM 的重新渲染是一个异步过程，发生在下一个 tick-微任务） => 触发nextTick的回调 => 进入下一循环

## 应用场景

### 在created 生命周期执行DOM操作
当在created()生命周期中直接执行DOM操作是不可取的，因为此时的DOM并未进行任何的渲染。所以解决办法是将DOM操作写进Vue.nextTick()的回调函数中。或者是将操作放入mounted()钩子函数中


### 在数据变化后需要进行基于DOM结构的操作
在我们更新数据后，如果还有操作要根据更新数据后的DOM结构进行，那么我们应当将这部分操作放入**Vue.nextTick()**回调函数中

## 为什么需要 nextTick 异步更新

现在有这样的一种情况，mounted 的时候 test 的值会被++循环执行 1000 次。 每次++时，都会根据响应式触发 setter->Dep->Watcher->update->run。 如果这时候没有异步更新视图，那么每次++都会直接操作 DOM 更新视图，这是非常消耗性能的。 所以 Vue 实现了一个 queue 队列，在下一个 Tick（或者是当前 Tick 的微任务阶段）的时候会统一执行 queue 中 Watcher 的 run。同时，拥有相同 id 的 Watcher 不会被重复加入到该 queue 中去，所以不会执行 1000 次 Watcher 的 run。最终更新视图只会直接将 test 对应的 DOM 的 0 变成 1000。 保证更新视图操作 DOM 的动作是在当前栈执行完以后下一个 Tick（或者是当前 Tick 的微任务阶段）的时候调用，大大优化了性能。

## 什么时候执行的 nextTick 的回调

### step1：响应式数据改变触发 Dep 里收集的 Watcher 的 update

在 Watcher 的更新函数里，最后执行的是是这个方法

```
this.deep = this.user = this.lazy = this.sync = false
...
  update () {
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }
...

```

## step2：调用 queueWatcher

```js
const queue: Array<Watcher> = []
let has: { [key: number]: ?true } = {}
let waiting = false
let flushing = false
...
 /*将一个观察者对象push进观察者队列，在队列中已经存在相同的id则该观察者对象将被跳过，除非它是在队列被刷新时推送*/
export function queueWatcher (watcher: Watcher) {
  /*获取watcher的id*/
  const id = watcher.id
  /*检验id是否存在，已经存在则直接跳过，不存在则标记哈希表has，用于下次检验*/
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      /*如果没有flush掉，直接push到队列中即可*/
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i >= 0 && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(Math.max(i, index) + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}
```

### step3 注册 nextTick 的回调 flushSchedulerQueue

nextTick(flushSchedulerQueue)中的 flushSchedulerQueue 函数其实就是 watcher 的视图更新:

```
function flushSchedulerQueue () {
  flushing = true
  let watcher, id
    /*
    给queue排序，这样做可以保证：
    1.组件更新的顺序是从父组件到子组件的顺序，因为父组件总是比子组件先创建。
    2.一个组件的user watchers比render watcher先运行，因为user watchers往往比render watcher更早创建
    3.如果一个组件在父组件watcher运行期间被销毁，它的watcher执行将被跳过。
  */
  queue.sort((a, b) => a.id - b.id)
  ...
   /*这里不用index = queue.length;index > 0; index--的方式写是因为不要将length进行缓存，因为在执行处理现有watcher对象期间，更多的watcher对象可能会被push进queue*/
 for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    id = watcher.id
    has[id] = null
    watcher.run()
    ...
  }
}
```

## nextTick 是如何实现的

/_
延迟一个任务使其异步执行，在下一个 tick 时执行，一个立即执行函数，返回一个 function
这个函数的作用是在 task 或者 microtask 中推入一个 timerFunc，在当前调用栈执行完以后以此执行直到执行到 timerFunc
目的是延迟到当前调用栈执行完以后执行
_/

在 Vue 源码 2.5+ 后，nextTick 的实现单独有一个 JS 文件来维护它，它的源码并不多，总共也就 100 多行。接下来我们来看一下它的实现，在 src/core/util/next-tick.js 中：

```
import { noop } from 'shared/util'
import { handleError } from './error'
import { isIOS, isNative } from './env'

const callbacks = []
let pending = false

function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

let microTimerFunc
let macroTimerFunc
let useMacroTask = false


if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  const channel = new MessageChannel()
  const port = channel.port2
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () => {
    port.postMessage(1)
  }
} else {
  /* istanbul ignore next */
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

// Determine microtask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  microTimerFunc = () => {
    p.then(flushCallbacks)
    if (isIOS) setTimeout(noop)
  }
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc
}

export function withMacroTask (fn: Function): Function {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true
    const res = fn.apply(null, arguments)
    useMacroTask = false
    return res
  })
}

export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimerFunc()
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```

### 实现过程

micro task 的实现，则检测浏览器是否原生支持 Promise，不支持的话直接指向 macro task 的实现。

对于 macro task 的实现，优先检测是否支持原生 setImmediate，这是一个高版本 IE 和 Edge 才支持的特性，不支持的话再去检测是否支持原生的 MessageChannel，如果也不支持的话就会降级为 setTimeout 0

### 为什么会优先使用微任务

根据 HTML Standard，在每个 task 运行完以后，UI 都会重渲染，那么在 microtask 中就完成数据更新，当前 task 结束就可以得到最新的 UI 了。
反之如果新建一个 task 来做数据更新，那么渲染就会进行两次。

## 练习题

为什么第一个nexTick里DOM内容没有改变：修改的update还是是在this.msg重新设置时的回调里执行的，这个回调也是再nextTick里调用，源码里是按照顺序push进一个queue里，所以是按照代码的顺序执行回调，所以在msg修改前的代码里去获取新的值是不行的

```js
export default {
  name: "App",
  data() {
    return {
      msg: "Hello World",
    };
  },
  methods: {
    change() {
      this.$nextTick((C) => {
        console.log("nextTick:", this.$refs.msg.innerText); // Hello World  
      });
      this.msg = " Hello Vue ";
      console.log(" sync : ", this.$refs.msg.innerText);
      this.$nextTick().then((O) => {
        console.log("nextTick with promise:", this.Srefs.msg.innerText);// Hello Vue
      });
    },
  },
};
```



```
var vm = new Vue({
    el: '#example',
    data: {
        msg: 'begin',
    },
    mounted () {
      this.msg = 'end'
      console.log('1')
      setTimeout(() => { // macroTask
         console.log('3')
      }, 0)
      Promise.resolve().then(function () { //microTask
        console.log('promise!')
      })
      this.$nextTick(function () {
        console.log('2')
      })
  }
})

```

：1、promise、2、3。
