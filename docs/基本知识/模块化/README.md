## 模块化的好处:

避免命名冲突(减少命名空间污染)
更好的分离, 按需加载
更高复用性
高可维护性

## 函数

最起初，实现模块化的方式使用函数进行封装。将不同功能的代码实现封装到不同的函数中。通常一个文件就是一个模块，有自己的作用域，只向外暴露特定的变量和函数。
```
function a(){
  // 功能二
}
function b(){
  // 功能一
}

```

## 立即执行函数

立即执行函数中的匿名函数中有独立的 词法作用域，避免了外界访问此作用域的变量。通过函数作用域解决了命名冲突、污染全局作用域的问题 。
```
// module.js文件
(function(window) {
  let name = 'xiaolu'
  // 暴露的接口来访问数据
  function a() {
    console.log(`name:${name}`)
  }
  //暴露接口
  window.myModule = { a } 
})(window)

```

```
<script type="text/javascript" src="module.js"></script>
<script type="text/javascript">
    myModule.name = 'xixi' // 无法访问
    myModule.foo()  // name:xiaolu
</script>

```

## ES6 Module

import命令会被 JavaScript 引擎静态分析，在编译时就引入模块代码 .主要有两个命令组成：export和import:
- 命令
  - export：规定模块对外接口

    - 默认导出：export default Person(导入时可指定模块任意名称，无需知晓内部真实名称)
    - 单独导出：export const name = "Bruce"(导出声明)
    - 按需导出：export { age, name, sex }(导出语句，推荐)
    - 改名导出：export { name as newName }


  - import：导入模块内部功能

    - 默认导入：import Person from "person"
    - 整体导入：import * as Person from "person"
    - 按需导入：import { age, name, sex } from "person"
    - 改名导入：import { name as newName } from "person"
    - 自执导入：import "person"
    - 复合导入：import Person, { name } from "person"


  - 复合模式：export命令和import命令结合在一起写成一行，变量实质没有被导入当前模块，相当于对外转发接口，导致当前模块无法直接使用其导入变量

    - 默认导入导出：export { default } from "person"
    - 整体导入导出：export * from "person"
    - 按需导入导出：export { age, name, sex } from "person"
    - 改名导入导出：export { name as newName } from "person"
    - 具名改默认导入导出：export { name as default } from "person"
    - 默认改具名导入导出：export { default as name } from "person"




- 继承：默认导出和改名导出结合使用可使模块具备继承性
- 设计思想：尽量地静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量
- 严格模式：ES6模块自动采用严格模式(不管模块头部是否添加use strict)

```
// 指定指定的值暴露对外的接口
export let counter = 3;
export function incCounter() {
  counter++;
}

// 加载模块中的某个值
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
// ES6 模块不同的是，静态加载完毕之后，每执行到模块中的方法，就去模块内调用（外部的变量总是与模块进行绑定的），而且值不会被缓存。
console.log(counter); // 4
```

## 传统模块scrip标签

- 传统加载：通过`<script>`进行同步或异步加载脚本
  - 同步加载：`<script src=""></script>`
  - Defer异步加载：`<script src="" defer></script>`(顺序加载，渲染完再执行)
  - Async异步加载：`<script src="" async></script>`(乱序加载，下载完就执行)
- 模块加载：`<script type="module" src=""></script>`(默认是Defer异步加载)

## CommonJS

CommonJS 的规范主要用在 Node.js 中，为模块提供了四个接口：module、exports、require、global。
CommonJS 用同步的方式加载模块（服务器端），在浏览器端使用的是异步加载模块。

加载机制：
CommonJS 模块的加载机制是，输入的是被输出的值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
特点：

所有代码都运行在模块作用域，不会污染全局作用域。
模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
模块加载的顺序，按照其在代码中出现的顺序。

```
// lib.js
var counter = 3;
function incCounter() {
    counter++;
}
// 对外暴露接口
module.exports = {
    counter: counter,
    incCounter: incCounter,
};

```

```
// 加载外部模块
var mod = require('./lib');

console.log(mod.counter);  // 3
mod.incCounter();
// 原始类型的值被缓存，所以就没有被改变（commonJS 不会随着执行而去模块随时调用）
console.log(mod.counter); // 3

```

### 特点

- 所有代码都运行在模块作用域中，不会污染全局变量；
- 模块按照在代码中的顺序，依次同步加载；
- 模块会在运行时加载且执行，执行得到对象A，后续通过require获取的都是对对象A值的拷贝（换句话说，模块可以多次加载，在第一次加载时执行并缓存其结果，后续加载会直接返回该结果），要想模块再次运行，必须清除缓存

### CommonJS和ES6 模块的区别

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
  - 所谓值的拷贝，原始类型的值被缓存，不随模块内部的改变而改变。
  - CommonJS一旦输出一个值，模块内部的变化就影响不到这个值
  - ES6 模块是动态引用，不缓存值，模块内外是绑定的，而且是只读引用，不能修改值。
  - ES6 的 js 引擎对脚本静态分析的时候，遇到加载命令模块 import ，就会生成一个只读引用，当真正用到模块里边的值的时候，就会去模块内部去取。

- CommonJS是运行时加载，ESM是编译时加载
  - CommonJS 模块就是对象；是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”。
  - ESM加载模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成


## 还有不常用的AMD和CMD和CMD

### AMD和require.js

AMD规范采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。这里介绍用require.js实现AMD规范的模块化：用require.config()指定引用路径等，用define()定义模块，用require()加载模块。

**AMD 的特点就和它的名字一样，模块的加载过程是异步的，它大大的利用了浏览器的并发请求能力，让模块的依赖过程的阻塞变得更少了。requireJs 就是 AMD 模块化规范的实现。** 

如果一个文件只有一个模块好像可以省略名字，模块的名字即为文件的名字
```
/* 
* a.js 
* 创建一个名为“a”的模块
*/

define('a', function(require, exports, module) {   
  exports.getTime = function() {   
    return new Date();   
  }  
});

/* 
*  b.js 
*  创建一个名为“b”的模块，同时使用依赖require、exports和名为“a”的模块：
*/
define('b', ['require', 'exports', 'a'], function(require, exports, a) {   exports.test = function() {
    return {   
      now: a.getTime()    
    };   
  }  
});

/* main.js */
require(['b'], function(b) {   
  console.log(b.test());  
});
```

还有可以配置一些路径的解析

```
require.config({
  baseUrl: "js/lib",
  paths: {
    "jquery": "jquery.min",  //实际路径为js/lib/jquery.min.js
    "underscore": "underscore.min",
  }
});

```
### CMD和sea.js

它是类似于 CommonJs 模块化规范，但是运行于浏览器之上的。CMD 规范尽量保持简单，并与 CommonJS 的 Modules 规范保持了很大的兼容性。通过 CMD 规范书写的模块，可以很容易在 Node.js 中运行。在 CMD 规范中，一个模块就是一个文件。
require.js在申明依赖的模块时会在第一之间加载并执行模块内的代码，
CMD（Common Module Definiton）是另一种js模块化方案，它与AMD很类似，不同点在于：AMD 推崇依赖前置、提前执行，CMD推崇依赖就近、延迟执行。此规范其实是在sea.js推广过程中产生的。


- 所有代码都运行在模块作用域中，不会污染全局变量；
- 模块会被异步加载；
- 模块加载完成后，不会执行其回调函数，而是等到主函数运行且需要的执行依赖的时候才运行依赖函数（依赖后置、按需加载）；

```
/** CMD写法 **/
define(function(require, exports, module) {
    var a = require('./a'); //在需要时申明
    a.doSomething();
    if (false) {
        var b = require('./b');
        b.doSomething();
    }
});

/** sea.js **/
// 定义模块 math.js
define(function(require, exports, module) {
    var $ = require('jquery.js');
    var add = function(a,b){
        return a+b;
    }
    exports.add = add;
});
// 加载模块
seajs.use(['math.js'], function(math){
    var sum = math.add(1+2);
});

```

### UMD

UMD Universal Module Definition模块是一种通用的模式，用于兼容AMD和CommonJS的规范。它可以通过运行时或者编译时让同一个代码模块在使用 CommonJs、CMD 甚至是 AMD 的项目中运行。UMD 规范将浏览器端、服务器端甚至是 APP 端都大统一了

UMD模块的顶端通常都会有如下的代码，用来判断模块加载器环境。

```js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // 全局变量
    root.returnExports = factory(root.jQuery);
  }
}(this, function ($) {
  // ...
}));

```

在前端和后端node都适用（“通用”因此得名）
与 CJS 或 AMD 不同，UMD 更像是一种配置多个模块系统的模式。这里可以找到更多的模式
当使用 Rollup/Webpack 之类的打包器时，UMD 通常用作备用模块


## 总结

- 由于 ESM 具有简单的语法，异步特性和可摇树性，因此它是最好的模块化方案
- UMD 随处可见，通常在 ESM 不起作用的情况下用作备用
- CJS 是同步的，适合后端
- AMD 是异步的，适合前端