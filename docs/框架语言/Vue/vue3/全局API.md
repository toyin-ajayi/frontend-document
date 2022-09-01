## 全局 API


从技术上讲，Vue 2 没有“app”的概念，我们定义的应用只是通过 new Vue() 创建的根 Vue 实例。从同一个 Vue 构造函数创建的每个根实例共享相同的全局配置.

全局配置很容易意外地污染其他测试用例。用户需要仔细存储原始全局配置，并在每次测试后恢复 (例如重置 Vue.config.errorHandler)。

为了避免这些问题，在 Vue 3 中我们引入一个新的全局 API：createApp.


2.x 全局 API | 3.x 实例 API (app)
------- | -------
Vue.config | app.config
Vue.config.productionTip | removed (见下方)
Vue.config.ignoredElements | app.config.isCustomElement (见下方)
Vue.component | app.component
Vue.directive | app.directive
Vue.mixin | app.mixin
Vue.use | app.use (见下方)
Vue.prototype | app.config.globalProperties (见下方)

其他不影响全局的API通过export来导出，文档见全局 API Treeshaking。

Vue 2.x 中的这些全局 API 受此更改的影响：

Vue.nextTick
Vue.observable (用 Vue.reactive 替换)
Vue.version
Vue.compile (仅全构建)
Vue.set (仅兼容构建)
Vue.delete (仅兼容构建

## Treeshaking 优化

举个列子：Vue.nextTick() 是一个全局的 API 直接暴露在单个 Vue 对象上。事实上，实例方法 $nextTick() 只是 Vue.nextTick() 的一个便利的包裹器，回调的 this 上下文自动绑定到当前实例上，以方便使用。

但是，如果你从来没有处理过手动的 DOM 操作，也没有在你的应用中使用或测试异步组件，怎么办？或者，不管出于什么原因，你更喜欢使用老式的 window.setTimeout() 来代替呢？在这种情况下，nextTick() 的代码就会变成死代码。

如 webpack 支持 tree-shaking，这是“死代码消除”的一个花哨术语。不幸的是，由于代码是如何在以前的 Vue 版本中编写的，全局 API Vue.nextTick() 不可摇动，将包含在最终捆绑中不管它们实际在哪里使用

在 Vue 3 中，全局和内部 API 都经过了重构，并考虑到了 tree-shaking 的支持。因此，全局 API 现在只能作为 ES 模块构建的命名导出进行访问。

```js
import { nextTick } from 'vue'

nextTick(() => {
  // 一些和DOM有关的东西
})
```

通过这一更改，如果模块绑定器支持 tree-shaking，则 Vue 应用程序中未使用的全局 api 将从最终捆绑包中消除，从而获得最佳的文件大小。

## 内部帮助器

除了公共 api，许多内部组件/帮助器现在也被导出为命名导出，只有当编译器的输出是这些特性时，才允许编译器导入这些特性，例如以下模板：

```js
<transition>
  <div v-show="ok">hello</div>
</transition>
被编译为类似于以下的内容：
import { h, Transition, withDirectives, vShow } from 'vue'

export function render() {
  return h(Transition, [withDirectives(h('div', 'hello'), [[vShow, this.ok]])])
}
```
如果应用程序没有任何 Transition 组件，那么支持此功能的代码将不会出现在最终的捆绑包中。
## 挂载 App 实例

使用 createApp(/* options */) 初始化后，应用实例 app 可用 app.mount(domTarget) 挂载根组件实.

现在所有应用实例都挂载了，与其组件树一起，将具有相同的 “button-counter” 组件 和 “focus” 指令不污染全局环境

```js
import { createApp } from 'vue'
import MyApp from './MyApp.vue'

const app = createApp(MyApp)
app.component('button-counter', {
  data: () => ({
    count: 0
  }),
  template: '<button @click="count++">Clicked {{ count }} times.</button>'
})

app.directive('focus', {
  mounted: el => el.focus()
})
app.mount('#app')
```



## Vue.prototype 替换为 config.globalProperties

在 Vue 2 中， Vue.prototype 通常用于添加所有组件都能访问的 property。

在 Vue 3 等同于config.globalProperties。这些 property 将被复制到应用中作为实例化组件的一部分。

```js
// 之前 - Vue 2
Vue.prototype.$http = () => {}
// 之后 - Vue 3
const app = createApp({})
app.config.globalProperties.$http = () => {}
```

## Provide / Inject
Vue 3 应用实例还可以提供可由应用内的任何组件注入的依赖项：

```js
// 在入口
app.provide('guide', 'Vue 3 Guide')

// 在子组件
export default {
  inject: {
    book: {
      from: 'guide'
    }
  },
  template: `<div>{{ book }}</div>`
}
```
使用 provide 在编写插件时非常有用，可以替代 globalProperties

## 在应用之间共享配置

在应用之间共享配置 (如组件或指令) 的一种方法是创建工厂功能，如下所示：

```js
import { createApp } from 'vue'
import Foo from './Foo.vue'
import Bar from './Bar.vue'

const createMyApp = options => {
  const app = createApp(options)
  app.directive('focus', /* ... */)

  return app
}

createMyApp(Foo).mount('#foo')
createMyApp(Bar).mount('#bar')
```
现在，Foo 和 Bar 实例及其后代中都可以使用 focus 指令。


## 插件使用时剔除Vue


在 Vue 3 中，必须显式导入：

```js
import { nextTick } from 'vue'

const plugin = {
  install: app => {
    nextTick(() => {
      // ...
    })
  }
}
```

对于 webpack，你可以使用 externals 配置选项：

```js
// webpack.config.js
module.exports = {
  /*...*/
  externals: {
    vue: 'Vue'
  }
}
```


如果你选择的模块绑定器恰好是 Rollup，你基本上可以无偿获得相同的效果，因为默认情况下，Rollup 会将绝对模块 id (在我们的例子中为 'vue') 作为外部依赖项，而不会将它们包含在最终的 bundle 中。但是在绑定期间，它可能会抛出一个“将 vue 作为外部依赖”警告，可使用 external 选项抑制该警告.