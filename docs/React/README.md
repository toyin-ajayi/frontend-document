### 为什么 JSX 中的组件名要以大写字母开头？

能回答出 React 如何知道要渲染的是组件还是 HTML 元素就够了。

### 为什么虚拟dom会提高性能

虚拟dom相当于在js和真实dom中间加了一个缓存，利用dom diff算法避免了没有必要的dom操作，从而提高性能。

### 简述flux 思想

Flux 的最大特点，就是数据的"单向流动"。

- 1.用户访问 View
- 2.View 发出用户的 Action
- 3.Dispatcher 收到 Action，要求 Store 进行相应的更新
- 4.Store 更新后，发出一个"change"事件
- 5.View 收到"change"事件后，更新页面

