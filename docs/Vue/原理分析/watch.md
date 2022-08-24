## watch的使用

能使用watch属性的场景基本上都可以使用computed属性，而且computed属性开销小，性能高，因此能使用computed就尽量使用computed属性

但是当您想要执行异步或昂贵的操作以响应不断变化的数据

## 监听的数据改变的时，watch 如何工作




watch 在一开始初始化的时候，会 读取 一遍 监听的数据的值，于是，此时 那个数据就收集到 watch 的 watcher 了

然后 你给 watch 设置的 handler ，watch 会放入 watcher 的更新函数中

当 数据改变时，通知 watch 的 watcher 进行更新，于是 你设置的 handler 就被调用了

## 设置 immediate 时，watch 如何工作


当你设置了 immediate 时，就不需要在 数据改变的时候 才会触发。

而是在 初始化 watch 时，在读取了 监听的数据的值 之后，便立即调用一遍你设置的监听回调，然后传入刚读取的值


## 设置了 deep 时， watch 如何工作


我们都知道 watch 有一个 deep 选项，是用来深度监听的。

Vue在设置响应式数据的时候， 遇到值是对象的，会递归遍历，把对象内所有的属性都设置为响应式，就是每个属性都设置 get 和 set，于是每个属性都有自己的一个依赖收集器

首先，再次说明，watch初始化的时候，会先读取一遍监听数据的值


## 源码分析

上边提到了在new Vue()的时候调用了_init方法完成了初始化。在这当中有调用了initWatch方法，定义在src/core/instance/state.js中：

```
function initWatch (vm, watch) {
  // 遍历watch属性
  for (var key in watch) {
    var handler = watch[key];
    // 如果是数组，那么再遍历一次
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        // 调用createWatcher
        createWatcher(vm, key, handler[i]);
      }
    } else {
      // 同上
      createWatcher(vm, key, handler);
    }
  }
}
```
遍历watch对象，并将每个watch[key]赋值给handler，如果是数组则遍历电影createWatcher方法，否则直接调用createWatcher方法。接下来看一下createWatcher方法的定义：

```
function createWatcher (vm, expOrFn, handler, options) {
  if (isPlainObject(handler)) { // 如果是对象，参数移位
    options = handler  
    handler = handler.handler
  }
  if (typeof handler === 'string') {  // 如果是字符串，表示为方法名
    handler = vm[handler]  // 获取methods内的方法
  }
  return vm.$watch(expOrFn, handler, options)  // 封装
}


```

通过代码可以发现，createWatcher方法`vm.$watch(keyOrFn, handler, options) `函数，调用了`Vue.prototype.$watch`方法，定义在src/core/instance/state.js中：
```

Vue.prototype.$watch = function(expOrFn, cb, options = {}) {
  const vm = this
  if (isPlainObject(cb)) {  // 如果cb是对象，当手动创建监听属性时
    return createWatcher(vm, expOrFn, cb, options)
  }
  
  options.user = true  // user-watcher的标志位，传入Watcher类中
  //这里注意 new了一个Watcher，cb是之前的handler，expOrFn是之前的key
  const watcher = new Watcher(vm, expOrFn, cb, options)  // 实例化user-watcher
  
  if (options.immediate) {  // 立即执行
    cb.call(vm, watcher.value)  // 以当前值立即执行一次回调函数
  }  // watcher.value为实例化后返回的值
  
  return function unwatchFn () {  // 返回一个函数，执行取消监听
    watcher.teardown()
  }
}
```

- watch 最终会调用Vue.prototype.watch 方法是用户可以直接调用的，它可以传递一个对象，也可以传递函数。
- 接着执行 const watcher = new Watcher(vm, expOrFn, cb, options) 实例化了一个 watcher，这里需要注意一点这是一个 user watcher，因为 options.user = true。
- 通过实例化 watcher 的方式，一旦我们 watch 的数据发送变化，它最终会执行 watcher 的 run 方法，执行回调函数 cb，并且如果我们设置了 immediate 为 true，则直接会执行回调函数 cb
。即设置immediate属性为true的时候，第一次watch绑定的时候就可以执行。
- 最后返回了一个 unwatchFn 方法，它会调用 teardown 方法去移除这个 watcher。


## 重点是new Watcher中的处理

```
// 简化成一个类
class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm
    vm._watchers.push(this)  // 添加到当前实例的watchers内
    
    if(options) {
      this.deep = !!options.deep  // 是否深度监听
      this.user = !!options.user  // 是否是user-wathcer
      this.sync = !!options.sync  // 是否同步更新
    }
    
    this.active = true  // // 派发更新的标志位
    this.cb = cb  // 回调函数
    
    if (typeof expOrFn === 'function') {  // 如果expOrFn是函数
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)  // 如果是字符串对象路径形式，返回闭包函数
    }

    this.value = this.lazy
            ? undefined
            : this.get();
    
    ...
    
}


```

## 链式访问属性的特殊处理 data.a.b.c
如果是字符就去匹配这个可以对应的方法
```
const bailRE = /[^\w.$]/  // 得是对象路径形式，如info.name

function parsePath (path) {
  if (bailRE.test(path)) return // 不匹配对象路径形式，再见
  
  const segments = path.split('.')  // 按照点分割为数组
  
  return function (obj) {  // 闭包返回一个函数
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]  // 依次读取到实例下对象末端的值
    }
    return obj
  }
}
```

根据key提取到的这个getter方法，其实是key路径最后的那个属性的值，也就是属性变了执行的方法.
```
Watcher.prototype.get = function get () {     //第3135行
  pushTarget(this);                                 //将当前用户watch保存到Dep.target总=中
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);               //执行用户wathcer的getter()方法，此方法会将当前用户watcher作为订阅者订阅起来
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    if (this.deep) {
      traverse(value);
    }
    popTarget();                                    //恢复之前的watcher
    this.cleanupDeps();
  }
  return value
};

```




## new Watcher 的简化版

- 就是初始化话的时候去访问已经响应式的watch的key值
- 然后触发响应式的依赖收集，但此时全局的Dep.target在new Watch的时候指向的是此时的user watcher

```
var Watcher = function (vm, key, cb, opt) {  

    this.vm = vm;    

    this.deep = opt.deep;    

    this.cb = cb;  

    // 这里省略处理 xx.xx.xx 这种较复杂的key
    this.getter = function(obj) {        

        return obj[key]

    };    

    // this.get 作用就是执行 this.getter函数

    this.value = this.get();
};
```

## 重中之重是 this.get() 会初始化的时候调用

在vm._init方法中，initWatch是在initData之后，initData中defineReactive(vm.data)已经为data的所有可达属性重写了set和get方法，是可以收集watcher的。

所以 Watch 在结尾会立即执行一次 watcher.get，其中便会执行 getter，便会根据你监听的key，去实例上读取并返回，存放在 watcher.value 上(触发响应式依赖收集)


每个 data 数据都已经是响应式的当 watch.getter 执行，而读取了 vm.name 的时候，name的依赖收集器就会收集到 watch-watcher

## 更新
get方法闭包中的dep收集这个新new出来的watcher，那么以后vm.name的set方法被调用的时候，就会通过dep.notify调用所收集的watcher的update方法，从而调用run方法，进而调用cb方法。
于是 name 变化的时候，会可以通知到 watch，监听就成功了

```
Watcher.prototype.update = function update () {
    /* istanbul ignore else */
    console.error('watch-update!!!');
    if (this.lazy) {
//computed属性的watcher的lazy为true
      console.log('lazy...');
      this.dirty = true;
    } else if (this.sync) {
// //如果this.sync为true，则直接运行this.run获取结果 
      console.log('sync...');
      this.run();
    } else {
////this.sync为false，调用queueWatcher()函数把所有要执行update()的watch push到队列中
      console.log('other...');
      queueWatcher(this);
    }
  };

 ```

```

 Watcher.prototype.run = function run () {
    if (this.active) {
      var value = this.get();
      if (
        value !== this.value ||
        //对于引用类型，值相同，可能指向的内存地址不同
        isObject(value) ||
        this.deep
      ) {
        // set new value
        var oldValue = this.value;
        //其实执行的是 this.value=this.get();
        this.value = value;
          this.cb.call(this.vm, value, oldValue)；
      }
    }
  };
  ```