## 设计思想


Vue： Vue 从一开始的定位就是尽可能的降低前端开发的门槛，让更多的人能够更快地上手开发。


## UI描述

template 对比 JSX：解决同一个问题的不同实现思路。他们最后都会被内部的createElement转化成虚拟DOM树。

Vue：需要经过一层模板编译，转化成AST语法树后，但在AST层面经过静态标记之后可提高diff的效率，最后编译成render方法用于生成虚拟树。

React：通过bable为内部的JSX语法包含一层React.createElement,直接生成虚拟DOM




## 逻辑复用

React： HOC=》render prop=》hooks

render prop 是一个用于告知组件需要渲染什么内容的函数 prop,Mouse是复用的逻辑，render的参数能拿到这个组件内部状态，然后传入Cat，然后让UI去渲染Cat。
```tsx
class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>移动鼠标!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```
Vue：指令Vue.directive('mouse',。。。），或者是mixin。mixin的组件，这两者的区别像是react的组件像是穿上了一层装甲变了身，vue的组件只是把东西拿过来放在口袋里本质上还是自己。



## 数据流向


双向绑定是对表单来说的，表单的双向绑定，说到底不过是 value 的单向绑定 + onChange 事件侦听的一个语法糖。这个并不是 React 和 Vue 在理念上真正的差别体现。同时，单向数据流不是 Vue 或者 React 的差别，而是 Vue 和 React 的共同默契选择。单向数据流核心是在于避免组件的自身（未来可复用）状态设计，它强调把 state hoist 出来进行集中管理。



组件间vue与react的数据流向都是单向的由父向子，并且子组件不允许改变props，两者并没有什么区别，而类似input中的v-model不过是逻辑复用的一种方式或者说是一种声明式的语法糖，同样的为组件使用v-model依然是一种语法糖，但是数据的流向仍然是清晰的单向流动。
```tsx
  <input type="text" v-model="mes">  此时mes值就与input的值进行双向绑定

    实际上上面的代码是下面代码的语法糖。

    <input  v-bind:value="mes"  v-on:input="mes= $event.target.value"/>
```



## 触发更新


Vue：响应式
React：手动setState 



## Diff 粒度
react: 在react中如果某个组件的状态发生改变，react会把此组件以及此组件的所有后代组件重新渲染，不过重新渲染并不代表会全部丢弃上一次的渲染结果，react中间还是会通过diff去比较两次的虚拟dom最后patch到真实的dom上。虽然如此，如果组件树过大，diff其实还是会有一部分的开销，因为diff的过程依然是比较以此组件为根的整颗组件树。react提供给我们的解决方案是shouldComponentUpdate，以此函数的返回结果来判断是否需要执行后面的diff、patch与update。再实际的开发过程中我们常常会用pureComponent来帮助我们做这一层逻辑判断，但需要注意的是pureComponent的shouldComponentUpdate也只是浅比较，假设比较的类型是object，如果object仅属性发生变化，但是其引用没发生变化那么shouldComponentUpdate会认为两者之间没有任何变化。


vue: vue的响应式使用的是Object.defineProperty api，并且由于在getter中实现了依赖收集，所以不会像react一样去比较整颗组件树，而是更加细粒度的去更新状态有变化的组件，同时defineProperty也不存在像shouldComponentUpdate中比较引用的问题



## context

Vue的provide与inject，不止父子传值，祖宗传值也可以。与React的Context的作用基本一样
