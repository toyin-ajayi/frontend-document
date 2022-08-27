## module 对象

如果想查看当前模块，可以直接使用console直接打印一下module对象。

```tsx
console.dir(module);
// 打印结果：
Module {
  id: '.',
  exports: {},
  parent: null,
  filename: '/Users/flydragon/Desktop/work/gitdata/nodedemos/demos/02console.js',
  loaded: false,
  children: [],
  paths:
   [ '/Users/flydragon/Desktop/work/gitdata/nodedemos/demos/node_modules',
     '/Users/flydragon/Desktop/work/gitdata/nodedemos/node_modules',
     '/Users/flydragon/Desktop/work/gitdata/node_modules',
     '/Users/flydragon/Desktop/work/node_modules',
     '/Users/flydragon/Desktop/node_modules',
     '/Users/flydragon/node_modules',
     '/Users/node_modules',
     '/node_modules' ] }
```

在每个模块中，module 的自由变量是一个指向表示当前模块的对象的引用。 为了方便，module.exports 也可以通过全局模块的 exports 对象访问。

module.exports === exports

好比在每一个模块定义最开始的地方写了这么一句代码：var exports = module.exports
```tsx
// 模块的构造函数
function Module(id, parent) {
  this.id = id;
  this.exports = {};   // 模块实例的exports属性初始化！！！module.exports === exports
  this.parent = parent;
  updateChildren(parent, this, false);
  this.filename = null;
  this.loaded = false;
  this.children = [];
}
```

要注意的一点就是： 最终模块会把module.exports作为对外的接口。所以，module.exports的引用地址发生了改变，在改变之前通过exports属性设置的都会被遗弃。


## require方法
require是模块的引入规则，通过exports或者module.exports抛出一个模块，通过require方法传入模块标识符，然后node根据一定的规则引入该模块，我们就可以使用模块中定义的方法和属性。

node中引入模块的机制
1、在node中引入模块，需要经历3个步骤：
（1）路径分析

（2）文件定位

（3）编译执行

2、在node中，模块分为两种：
（1）node提供的模块，例如http模块，fs模块等，称为核心模块。核心模块在node源代码编译过程中就有编译了二进制文件，在node进程启动的时候，部分核心模块就直接加载进内存中，因此这部分模块是不用经历上述的(2),(3)步骤，而且在路径分析中优先判断，因此加载速度是最快的。

（2）用户自己编写的模块，称为文件模块。文件模块是需要按需加载的，需要经历上述的三个步骤，速度较慢。

3、优先从缓存中加载
浏览器会缓存静态脚本文件以提高页面性能一样，Node对引入过的模块也会进行缓存。与浏览器不同的是：Node缓存的是编译执行之后的对象而不是静态文件。
```tsx
console.log('模块requireA开始加载...')
exports = function() {
    console.log('Hi')
}
console.log('模块requireA加载完毕')
init.js

var mod1 = require('./requireA')
var mod2 = require('./requireA')
console.log(mod1 === mod2) // true
```

## require.context

如页面需要导入多个组件,可以用正则去匹配所有适合的文件，批量操作
```tsx
const path = require('path')
const files = require.context('@/components/home', false, /\.vue$/)
const modules = {}
files.keys().forEach(key => {
  const name = path.basename(key, '.vue')
  modules[name] = files(key).default || files(key)
})
components:modules

```