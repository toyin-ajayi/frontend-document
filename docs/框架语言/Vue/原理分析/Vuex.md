## Vuex 思想
在解读源码之前，先来简单了解下 Vuex 的思想。
Vuex 全局维护着一个对象，使用到了单例设计模式。在这个全局对象中，所有属性都是响应式的，任意属性进行了改变，都会造成使用到该属性的组件进行更新。并且只能通过 commit 的方式改变状态，实现了单向数据流模式。


## Vuex 安装

在使用 Vuex 之前，我们都需要调用 Vue.use(Vuex) 。在调用 use 的过程中，Vue 会调用到 Vuex 的 install 函数
install 函数作用很简单

- 确保 Vuex 只安装一次
- 混入 beforeCreate 钩子函数，可以在组件中使用 this.$store

```tsx
export function install (_Vue) {
  // 确保 Vuex 只安装一次
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}

// applyMixin
export default function (Vue) {
  // 获得 Vue 版本号
  const version = Number(Vue.version.split('.')[0])
  // Vue 2.0 以上会混入 beforeCreate 函数
  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // ...
  }
  // 作用很简单，就是能让我们在组件中
  // 使用到 this.$store
    /*Vuex的init钩子，会存入每一个Vue实例等钩子列表*/
  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      /*存在store其实代表的就是Root节点，直接执行store（function时）或者使用store（非function）*/
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      /*子组件直接从父组件中获取$store，这样就保证了所有组件都公用了全局的同一份store*/
      this.$store = options.parent.$store
    }
  }
}

```

可见，store注入 vue的实例组件的方式，是通过vue的 mixin机制，借助vue组件的生命周期 钩子 beforeCreate 完成的。即 每个vue组件实例化过程中，会在 beforeCreate 钩子前调用 vuexInit 方法


## Store

```tsx
Vue.use(Vuex); // 1. vue的插件机制，安装vuex
let store = new Vuex.Store({ // 2.实例化store，调用install方法
 	state,
 	getters,
 	modules,
 	mutations,
 	actions,
 	plugins
});
new Vue({ // 3.注入store, 挂载vue实例
	store,
	render: h=>h(app)
}).$mount('#app');
```
new Vuex.Store时内部发生了什么？

首先我们需要在 Store 的构造函数中对 state 进行「响应式化」。
```tsx
constructor () {
    this._vm = new Vue({
        data: {
            $$state: this.state
        }
    })
}
```

state 会将需要的依赖收集在 Dep 中，在被修改时更新对应视图。

所以我们在去值时其实返回的是这个响应式data的值
```tsx
get state () {
    return this._vm._data.$$state
  }
```
上述代码初始化了一个vue实例 _vm，由于vue的data是响应式的，所以，$$state也是响应式的，那么当我们 在一个组件实例中 对state.xxx进行 更新时，基于vue的data的响应式机制，所有相关组件的state.xxx的值都会自动更新，UI自然也会自动更新



## commit
首先是 commit 方法，我们知道 commit 方法是用来触发 mutation 的。
从 _mutations 中取出对应的 mutation，循环执行其中的每一个 mutation。

```tsx
commit (type, payload, _options) {
    const entry = this._mutations[type];
    entry.forEach(function commitIterator (handler) {
        handler(payload);
    });
}
```


## dispatch
dispatch 同样道理，用于触发 action，可以包含异步状态。
取出 _actions 中的所有对应 action，将其执行，如果有多个则用 Promise.all 进行包装。
```tsx
dispatch (type, payload) {
    const entry = this._actions[type];

    return entry.length > 1
    ? Promise.all(entry.map(handler => handler(payload)))
    : entry[0](payload);
}
```