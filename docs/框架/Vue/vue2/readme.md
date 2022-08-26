## Vue 


### 运行时+ 编译时 vs 运行时

vue的安装版本可分为运行时 + 编译器和只包含运行时两种，这两种版本的区别在于是否含有编译器。

如果需要在客户端上编译模板 (即：将字符串传递给 template 选项，或者使用元素的 DOM 内 HTML 作为模板挂载到元素)，你将需要编译器，因此需要完整的构建版本：
```js
// 需要编译器
Vue.createApp({
  template: '<div>{{ hi }}</div>'
})

// 不需要
Vue.createApp({
  render() {
    return Vue.h('div', {}, this.hi)
  }
})
```

如果你需要在运行时处理之前编译templates，比如结合Webpack使用 vue-loader 时，*.vue 文件中的模板会在构建时预编译为 JavaScript，在最终的捆绑包中并不需要编译器compiler，因此可以只使用运行时runtime-only构建版本。因为仅仅包含运行时编译比完整版少30%的代码体积

### $event使用

子组件向父组件传值，父组件在接受子组件传过来的值时，还会附加一些其他参数

```
    <a-table :columns="columns" :dataSource="requestData" rowKey="identifier" bordered>
        <template slot="remark" slot-scope="text, record">
            <editable-cell :text="text" @change="onCellChange(requestData, record.identifier, 'remark', $event)"/>
        </template>
    </a-table>
```


### 图片地址

在 template 模板下，使用相对路径，直接写字符串；

```
// 没问题
<img src="./../assets/avatar.png" />
```

但是在 script 中，使用相对路径，需要通过 require/import 方式，主动引入，申明一个变量，然后使用这个变量。

```
<img :src="imgUrl" />
--------------------------
// require 方式
data: function() {
  return {
		imgUrl: require('./assets/包.jpg')
	}
}

// 或者通过 import 方式
import srcImg from './assets/包.jpg'
export default {
  name: 'app',
  data: function() {
    return {
      imgUrl: srcImg
    }
  }
}
```

或者如
- :src="require('assets/image/my.png')"
- :src="import('assets/image/my.png')"

### computed 相互依赖

computed 'a'中使用了 computed 'b'，b把a放到自己的deps中，b改变，遍历自己的deps，通知他们，我改变了，你们重新计算吧。

### 三位运算相当于函数被执行

```
 @click="ifConfirmTagChangeBatch ? handleBatchTagChange() : handleTagChangeConfirm()"
```

### .sync

用于组件属性的双向绑定。父组件可以监听那个事件并根据需要更新一个本地的数据 property。例如：
```
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
```
为了方便起见，我们为这种模式提供一个缩写，即 .sync 修饰符：
```
<text-document :title.sync="doc.title"></text-document>

// 子组件
this.$emit('update:title',100); //有效
```

### scoped的实现原理
> https://www.cnblogs.com/goloving/p/9119460.html
> https://www.cnblogs.com/hanshuai/p/13555225.html

vue中的scoped属性的效果主要通过PostCSS转译实现，如下是转译前的vue代码：
```Vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">hi</div>
</template>

转译后：

<style>
.example[data-v-5558831a] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-5558831a>hi</div>
</template>
```

PostCSS给一个组件中的所有dom添加了一个独一无二的动态属性，给css选择器额外添加一个对应的属性选择器，来选择组件中的dom,这种做法使得样式只作用于含有该属性的dom元素(组件内部的dom)。



总结一下scoped三条渲染规则：
- 1、给HTML的DOM节点加一个不重复data属性(形如：data-v-19fca230)来表示他的唯一性
- 2、在每句css选择器的末尾（编译后的生成的css语句）加一个当前组件的data属性选择器（如[data-v-19fca230]）来私有化样式
- 3、如果组件内部包含有其他组件，只会给其他组件的最外层标签加上当前组件的data属性

但是要注意scoped的作用域，因为权重的问题，如果是在子组件使用了scoped，那么在父组件中是不能直接修改子组件的样式的，需要在父组件中使用vue的深度作用选择器。

解决办法是使用样式穿透>>>和 /deep/，可以解决一些比如给EelementUI覆盖样式。

```
如下面的例子：
<style scoped>
  .a >>> .b { /* ... */ }
</style>
上面的代码将会被解析成如下格式，可在浏览器中查看：
.a[data-v-f3f3eg9] .b { /* ... */ }
```

换句话说 /deep/ 的效果就是让 deep 后面的选择器不被加上 data-v- 选择器。


## dart-sass

开发过程中都长期被 node-sass 的安装所折磨，在国内由于网络原因导致 node-sass 需要的二进制文件下载不下来而 build 失败（sass_binary_site + npm 源已经能解决这个问题），或者是切换了 Node.js 版本发现 node-sass 需要进行 npm rebuild（多见于使用 n 作为 node 版本管理工具的情况），又或者在 windows 上需要无尽的前置依赖。
Node-sass 之所以有这么多问题是由于它的核心 LibSass。LibSass 是长期以来 Sass 的主流实现，但是它是用 C/C++ 编写的，其他语言需要使用的时候就需要有一个 bridge。在 node 环境里，这个 bridge 就是 node-sass，它的主要功能就是作为使用 js 去调用 LibSass，而上面总是 build 失败的二进制文件就是 LibSass 的本体。
并且最重要的是 LibSass 已经被官方宣布废弃 ，即使会有长期的维护，也不会有新功能的更新了。


Dart Sass 是 Sass 的主要实现版本，这意味着它集成新 功能要早于任何其它的实现版本。Dart Sass 速度快、易于安装，并且 可以被编译成纯 JavaScript 代码，这使得它很容易集成到现代 web 的开发流程中。

Dart Sass 的独立命令行可执行文件是跑在高速的 Dart 虚拟机（VM）上来编译你的样式代码的，如果您在Dart-VM内运行Dart-Sass,它的运行速度很快；而且它可以被编译成纯JS并在 npm 上作为 sass 软件包 发布.作为编译版本的dart-sass，相较于node-sass执行速度慢，但是它很容易集成到现有的工作流中来。


dart-sass 不支持/deep/，改为::v-deep

### props 与 data

从prop获取了初始值，后面就会作为局部变量了，你修改prop不会改变这个局部变量的值。

Vue初始化时会递归地遍历data所有的属性，并使用Object.defineProperty把这些属性全部转为getter/setter，用于实现双向绑定,既然因为data深拷贝的原因，data无法随着props的变化而更新，我们很自然的就想到Vue中有监听作用的两个功能：watch、computed。

### Vue2.4中$attrs和$listeners的使用
> https://blog.csdn.net/songxiugongwang/article/details/84001967

将inheritAttrs: false,禁止掉默认不传递的行为，将inheritAttrs的值设为false, 这些默认的行为会禁止掉。但是通过实例属性$attrs ,可以将这些特性生效，且可以通过v-bind 绑定到子组件的非根元素上。



$listeners属性
Vue 提供了一个 $listeners 属性，它是一个对象，里面包含了作用在这个组件上的所有监听器。

这时，可以使用 $listeners 属性，在组件的$listeners 属性里面写好所有将会需要的监听器（原生事件），这些监听器就可以直接绑定在组件的子元素上（不是根元素）。


假设有父组件Parent和子组件Child
```
// Parent
<template>
  ...
  <child v-on:event-one="methodOne" v-on:event-two="methodTwo" />
  ...
</template>
```
那么你在使用Child时，传入的所有v-on事件都可以在$listeners对象中找到。
```
// Child
created () {
  console.log(this.$listeners) // { 'event-one': f(), 'event-two': f() }
}
```
所以，官方示例中的computed -> inputListeners就是把用户使用base-input组件时传入的v-on方法收集起来了。
然后通过v-on="inputListeners"的形式，转发给了input框。

注：v-on="{a: f()}"等价于v-on:a="f()"

所以官网才会说base-input是一个透明包裹器，因为它确实只是转发了父组件传入的参数给input元素

### Vue-loader 与 vue-template-compiler

- vue-loader：解析和转换 .vue 文件，提取出其中的逻辑代码 script、样式代码 style、以及 HTML 模版 template，再分别把它们交给对应的 Loader 去处理。

- css-loade：加载由 vue-loader 提取出的 CSS 代码。

- vue-template-compiler：把 vue-loader 提取出的 HTML 模版编译成对应的可执行的 JavaScript 代码

总结：vue-loader的作用就是提取

### Vue router base

页面基础路径

```
  return new Router({
    routes,
    mode: 'history', 
    base: '/base/' // 两边斜杠要加
  })

   <router-link to="/login">login</router-link>
// 此时，控制台对应的 a标签显示
   <a data-v-06ebb29e="" href="/base/app" class="router-link-exact-active router-link-active">app</a>
```
### Vue JSX 语法报错
> Duplicate declaration “h“ (This is an error on an internal node.

我自己加了个@vue/babel-preset-jsx插件，结构居然不能解析jsx，查了下发现新的版本已经内置了jsx了所以babel里再有的话就有问题了

