## 浏览器 esmodule
> https://juejin.cn/post/6943233321765715976

### import 的机制

当 JS 引擎执行一个 ESM，大概有以下4个步骤：
- Parsing: 读取模块的代码并检查语法错误
- Loading: 递归的加载所有导入的模块，建立 module graph
- Linking: 对于每个新加载的模块，都会创建一个模块实例 Module.Instantiate，并使用该模块中所有导出的内容的 内存地址 对 import 进行映射。
- Run time: 最后，运行每个新加载模块的主体代码，此时，import 已经处理完成了。

所以，所有模块的**静态依赖**在该模块代码执行前都必须下载、解析并进行 Linking。 一个应用程序可能有几百个依赖，如果某个依赖加载出错了，则不会运行任何代码。

### defer

ESM 默认是通过 defer 的方式加载的，所以是不需要在 script 标签上加 defer 属性的。

- 默认的` <script> `标签加载资源会阻塞 HTML 解析
- defer 是“渲染完再执行”.
- async 是“下载完就执行”。

### modulepreload和preload

浏览器在没有运行我们的代码之前，是没办法发现我们要预加载现代还是传统的Javascript资源的。
preload 预加载js资源时，没办法指明这个js资源用不用es module。
所以新增了一个 modulepreload 在预加载时就声明按es module来处理这个资源， 旧浏览器会忽略这条规则，然而目前只有Chrome支持这么做.
通过这种方式，浏览器可以预加载甚至预编译 ESM 及其依赖。
```js
<link rel="modulepreload" href="lib.mjs">
<link rel="modulepreload" href="main.mjs">
<script type="module" src="main.mjs"></script>
<script nomodule src="fallback.js"></script>

```

这对依赖比较多，层级比较深的应用很有帮助。但是如果不使用 rel="modulepreload"，那么浏览器需要实际加载 ESM 的时候通过多个 HTTP 请求构建 module graph，如果把所有的模块都进行预加载，可以大大节省依赖加载的时间。

## 实例
浏览器加载 ES6 模块，也使用`<script>`标签，但是要加入type="module"属性。

平时的写法
```js
    <script type="text/javascript">
        let goodsName = 'huawei mate30 pro'
        let qty = 5;
    </script>

```
全局作用域下声明变量，会让goodsName和qty成为全局变量，但如果type属性改成module 浏览器就会将代码视为 ES Modules 处理，代码如下：

```js
    <script type="module">
        // 引入moduleA.js的模块的成员属性
        // 利用as避免与当前模块的变量名冲突
        import getData,{goodsName as name} from './moduleA.js'
        let goodsName = 'huawei mate30 pro'
        let qty = 5 // 局部变量
    </script>

      <div id="container">my name is {name}</div>
        <script type="module">
           import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'
           new Vue({
             el: '#container',
             data:{
                name: 'Bob'
             }
           })
        </script>
```
也可以通过script标签来直接引入相对路径或者绝对路径的模块
```js
//html
<script type="module" src="/index.js"></script>

//index.js
 import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'
 new Vue({
    el: '#container',
    data:{
    name: 'Bob'
    }
 })

```
## 有效的module路径定义

```js
// 被支持的几种路径写法

import module from 'http://XXX/module.js'
import module from '/XXX/module.js'
import module from './XXX/module.js'
import module from '../XXX/module.js'

// 不被支持的写法
import module from 'XXX'
import module from 'XXX/module.js'

```
在webpack打包的文件中，引用全局包是通过import module from 'XXX'来实现的。
这个实际是一个简写，webpack会根据这个路径去node_modules中找到对应的module并引入进来。
但是原生支持的module是不存在node_modules一说的。
所以，在使用原生module的时候一定要切记，from后边的路径一定要是一个有效的URL，以及一定不能省略文件后缀（是的，即使是远端文件也是可以使用的，而不像webpack需要将本地文件打包到一起）。

