## Vue捕获异常 - errorHandler

在Vue中，异常可能被Vue自身给try ... catch了，不会传到window.onerror事件触发

errorHandler指定组件的渲染和观察期间未捕获错误的处理函数。这个处理函数被调用时，可获取错误信息和 Vue 实例。
```js
Vue.config.errorHandler = function (err, vm, info) {
  // handle error
  // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
  // 只在 2.2.0+ 可用
}

```
## React中捕获异常 - componentDidCatch

在React中，可以使用ErrorBoundary组件包括业务组件的方式进行异常捕获，配合React 16.0+新出的componentDidCatch API，可以实现统一的异常捕获和日志上报。

```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

```

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

## React 中性能监控


Profiler 能添加在 React 树中的任何地方来测量树中这部分渲染所带来的开销。 它需要两个 prop ：一个是 id(string)，一个是当组件树中的组件“提交”更新的时候被React调用的回调函数 onRender(function)。


多个 Profiler 组件能测量应用中的不同部分：
```
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Profiler id="Main" onRender={callback}>
      <Main {...props} />
    </Profiler>
  </App>
);
```

onRender 回调
Profiler 需要一个 onRender 函数作为参数。 React 会在 profile 包含的组件树中任何组件 “提交” 一个更新的时候调用这个函数。 它的参数描述了渲染了什么和花费了多久。

```
function onRenderCallback(
  id, // 发生提交的 Profiler 树的 “id”
  phase, // "mount" （如果组件树刚加载） 或者 "update" （如果它重渲染了）之一
  actualDuration, // 本次更新 committed 花费的渲染时间
  baseDuration, // 估计不使用 memoization 的情况下渲染整颗子树需要的时间
  startTime, // 本次更新中 React 开始渲染的时间
  commitTime, // 本次更新中 React committed 的时间
  interactions // 属于本次更新的 interactions 的集合
) {
  // 合计或记录渲染时间。。。
}
```

- id: string - 发生提交的 Profiler 树的 id。 如果有多个 profiler，它能用来分辨树的哪一部分发生了“提交”。
- phase: "mount" | "update" - 判断是组件树的第一次装载引起的重渲染，还是由 props、state 或是 hooks 改变引起的重渲染。
- actualDuration: number - 本次更新在渲染 Profiler 和它的子代上花费的时间。 这个数值表明使用 memoization 之后能表现得多好。（例如 React.memo，useMemo，shouldComponentUpdate）。 理想情况下，由于子代只会因特定的 prop 改变而重渲染，因此这个值应该在第一次装载之后显著下降。
- baseDuration: number - 在 Profiler 树中最近一次每一个组件 render 的持续时间。 这个值估计了最差的渲染时间。（例如当它是第一次加载或者组件树没有使用 memoization）。
- startTime: number - 本次更新中 React 开始渲染的时间戳。
- commitTime: number - 本次更新中 React commit 阶段结束的时间戳。 在一次 commit 中这个值在所有的 profiler 之间是共享的，可以将它们按需分组。
- interactions: Set - 当更新被制定时，“interactions” 的集合会被追踪。（例如当 render 或者 setState 被调用时）。



DevTools 将会对支持新的 profiling API 的 APP 新加一个 “Profiler” tab 列：
这个 “Profiler” 的面板在刚开始的时候是空的。你可以点击 record 按钮来启动 profile：
当你开始记录之后，DevTools 将会自动收集你 APP 在（启动之后）每一刻的性能数据。（在记录期间）你可以和平常一样使用你的 APP，当你完成 profile 之后，请点 “Stop” 按钮。


从概念上讲，React 的运行分为两个阶段：在 render 阶段会确定例如 DOM 之类的数据需要做那些变化。在这个阶段，React 将会执行（各个组件的）render 方法，之后会计算出和调用 render 方法之前有哪些变化。commit 阶段是 React 提交任何更改所在的阶段（在 React DOM 下，就是指 React 添加、修改和移除 DOM 节点的时候）。同时在这个阶段，React 会执行像 componentDidMount 和 componentDidUpdate 这类周期函数。

- https://juejin.im/post/5ba0f8e4f265da0ab915bcf2#heading-0