## Mobx

### 核心组成

Observable 。用来包装一个属性为 被观察者
autorun 。用来包装一个方法为 观察者

### 依赖收集 autoRun

autorun 是个神奇的函数，被他包装过的方法，就会变为观察者函数，并且这里有一个很重要的特性，这个函数只会观察自己依赖到的设为 observable 的值。

假设person对象身上有很多个属性是 observable 的，修改这些属性值的时候不会触发 autorun 包装过的函数，只有修改 name 属性的时候才会触发。
```tsx
autorun(function(){
    console.log(person.name);
});

```

### autoRun 的用途
使用 autoRun 实现 mobx-react 非常简单，核心思想是将组件外面包上 autoRun，这样代码中用到的所有属性都会像上面 Demo 一样，与当前组件绑定，一旦任何值发生了修改，就直接 forceUpdate，而且精确命中，效率最高。

## 如何实现依赖收集

observable 包装原生值，get 钩子收集依赖，set 钩子触发改变。
autorun 包装观察者函数，在包装时会提前执行一次，并且触发其中涉及到的 observable 值的 get 钩子收集依赖，将当前的观察者函数对应到每个 observable 值上。

### dependenceManager
当一个被 observable 包装的属性值发生 set 行为的时候，就会触发 dependenceManager.trigger(obID); 从而触发遍历对应的监听函数列表，并且执行，这就是 autorun 的基本原理。

Mobx是通过代理变量的getter和setter来实现的变量更新功能。首先先代理变量的getter函数，然后通过预执行一遍autorun中回调，从而触发getter函数，来实现观察值的收集，依次来代理setter。之后只要setter触发便执行收集好的回调就ok了。

dependenceManager，这个工具类中管理了一个依赖的 map，结构是一个全局唯一的 ID 和 对应的监听的函数的数组。


使用proxy可以很轻易的拦截get

将刚才压栈的函数“借用”,现在还不能真正弹出栈他,定义一个WeakMap()用来存储 {“对象” : “值”} 这样的数据结构再合适不过了

判断一下如果fn不为空,说明现在还在handler收集阶段(正在运行autorun),而不是平时的get调用时期

我不清楚真正的mobx内部的唯一标识符是怎么生成的,所以我使用WeakMap,将对象(内存地址总是唯一的)作为唯一标识符,与其对应的回调函数绑定起来
具体源码如下：
```tsx
const dependenceManager = new WeakMap();

get: function (target, key, receiver) {
    const fn = stack.slice(-1)[0];
    if (fn) {
        dependenceManager.set(target, {
            ...dependenceManager.get(target),
            [key]: fn
        });
    }
    if (typeof target[key] === 'object' && target[key] !== null) {
        return new Proxy(target[key], handler);
    }
    return Reflect.get(target, key, receiver);
},
set: function (target, key, value, receiver) {
    target[key] = value;
    trigger(target, key, value);
}

const trigger = function (target, key, value,) {
    const mapValue = dependenceManager.get(target);
    mapValue[key] && mapValue[key]();
};
```

```tsx
dependenceManager.beginCollect(handler);// dependenceManager 标记现在开始收集依赖
handler();
dependenceManager.endCollect();// 标记当前收集结束
```

## MobX 与 React 集成

mobx-react 提供了一个observer方法， 它是一个高阶组件，它接收 React 组件并返回一个新的 React 组件，返回的新组件能响应（通过observable定义的）状态的变化，即组件能在可观察状态变化时自动更新。observer方法是对 MobX 提供的autorun方法和 React 组件更新机制的封装，以便于在 React 中使用，你依然可以在 React 中使用autorun来更新组件。

```tsx
import React, { useMemo } from "react";
import { observable } from "mobx";
import { observer,  useLocalStore } from "mobx-react";

const Counter = () => {
  const store = useLocalStore(() => ({
    count: 0
  }));
  // 等价于下面
  // const store = useMemo(() => observable({ count: 0 }), []);
  return <button onClick={() => store.count++}>{store.count}</button>;
};

export default observer(Counter);
```


Computed values 和 Reactions 都可以视作是从 State 中派生出的，State 变化时触发 Computed values 的重新计算和 Reations 的重新运行。为了让派生能自动的进行，MobX 通过Object.definePropery或Proxy方式拦截对象的读写操作，从而允许用户以自然的方式来修改状态，MobX 负责更新派生的内容。

MobX 提供了几个核心 API 来帮助定义状态（observable）、响应状态（autorun, computed）和修改状态（action），通过这些 API 可以让程序立即具备响应式能力。这些 API 接口并不复杂，但要熟练使用

MobX 可以单独使用，也可以与任何流行的 UI 框架一起使用，Github 上可以找到 MobX 与流行框架的绑定实现。不过 MobX 最常见的是与 React 一起使用，mobx-react 是流行的 MobX 和 React 的绑定实现库


## mobx-react


整体思路是复写 render 方法：

在第一次执行时，通过 observe 包裹住原始 render 方法执行，因此绑定了依赖，将此时 render 结果直接返回即可。
非第一次执行，是由第一次执行时 observe 自动触发的（或者 state、props 传参变化，这些不管），此时可以确定是由数据流变动导致的刷新，因此可以调用 componentWillReact 生命周期。然后调用 forceUpdate 生命周期，因为重写了 render 的缘故，视图不会自动刷新。
由 state、props 变化导致的刷新，只要返回原始 render 即可。


在 mobx-react 中，可以使用 @observer 对 react 对象进行包装，使其 render 方法成为一个观察者。

```tsx
// 伪代码
var ReactMixin = {
    componentWillMount: function() {
        autorun(() => {
            this.render();
            this.forceUpdate();
        });
    }
};
function observer(target) {
    const targetCWM = target.prototype.componentWillMount;
    target.prototype.componentWillMount = function() {
        targetCWM && targetCWM.call(this);
        ReactMixin.componentWillMount.call(this);
    };
}
```

这里给 react 组件的 prototype 做了一次 mixin，为其加入了一个 autorun，autorun的作用就是绑定组件 render 方法和其依赖的值的观察关系。当依赖的值发生变化的时候会触发 autorun 的参数 handler，handler中会强制执行 render() 方法和 forceUpdate()

这里每次都强制重新渲染，没有做很好的优化，在mobx中有个方法：isObjectShallowModified 来判断是否需要强制重新渲染，可以考虑直接引入进来。


mobx-react的工作原理基本梳理清楚了，大致用一下几句话来概括

1.observe组件第一次渲染的时候，会创建Reaction，组件的render处于当前这个Reaction的上下文中，并通过track建立render中用到的observable建立关系

2.当observable属性修改的时候，会触发onInvalidate方法，实际上就是组件的forceupdate,然后触发组件渲染，又回到了第一步



### action
在 Mobx 中是可以直接修改可观察数据，来进行更新组件的，但不建议这样做。如果在任何地方都修改可观察数据，将导致页面状态难以管理。

## 实践
- 官方文档 https://mobx-react.js.org/recipes-migration
- Mobx+ClassComponet入门 https://www.jianshu.com/p/3d4e85f60141
- Mobx+ClassComponet项目 https://github.com/manyuewuxin/mengya
- Mobx+Hooks入门 https://juejin.im/post/5e5b7630f265da575d20e3ba#heading-6
- Mobx+TS+Hooks https://github.com/beichensky/react-zhaopin-app

### 参考
- https://github.com/xinyu198736/s-mobx/blob/master/doc/readme.md
- https://github.com/xinyu198736/s-mobx/blob/master/doc/readme.md
- https://juejin.im/post/58c0f2d5a22b9d005892658b
- https://zhuanlan.zhihu.com/p/27551105
- https://juejin.im/post/5d1dcc2e51882579d9188b3a