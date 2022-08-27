## Dep 「依赖管理」

Dep 依赖收集器(相当于发布订阅设计模式中的发布者，收集所有依赖然后再特定的情况去触发他们)


## 简易的实现一个响应式

### 初始化Vue

结合上面简易的代码，可以发现Vue在mount这个生命周期里会自动调用Watcher.

```tsx
  this.mount = function() {
    new Watcher(self, self.render);
  }
```
**那么就是一个组件对应一个Watcher，也就是说Vue2X的粒度是一个组件，如果数据右边这回触发这个组件的更新函数**

```tsx
const vue = new Vue({
  data() {
    return {
      text: 'hello world'
    };
  }
})

vue.mount(); // in get
vue._data.text = '123'; // in watcher update /n in get
```

## Observer 响应式的绑定

Observer中进行响应式的绑定，在数据被读的时候，触发get方法，执行Dep来收集依赖，也就是收集Watcher。Observer内部会遍历观察的对象，通过defineReactive封装的defineReactive来定义数据访问和修改的行为。



## Dep 依赖收集

new Dep()是在defineReactive内被调用，也就是说观察对象的每一个键都会创一个。也就是说一个观察的data有多少键就对应多个dep。

defineReactive内部定义这个键被get的时候就dep.depend();这个方法就是执行Dep.target.addDep(self);。

首先明确现在的Dep.target指向谁。
new Vue -> 调用observe观察data -> defineReactive -> 定义了get函数（这时还没有调用get内部的dep.depend函数） -> mount后调用Watcher -> 组件的Watcher将Dep.target指向自己 -> 访问被观察对象的属性调用get -> 调用dep.depend() -> depend:Dep.target.addDep(self); -> addDep:self.subs.push(watcher)

好的 当现在就把这个 Watcher 观察者对象收集到了Dep的内部一个数组里；为什么需要一个数组来收集呢？ 因为可能有多个实例或者组件依赖于同一组数据，那么就需要多个Watcher来更新不同的实例或者组件。

比如现在修改了data的某个值那么 set 某个key -> 触发key的对应的dep.notify(); -> notify:self.subs[i].update(); -> 调用dep内存储的watcher数组每个实例的update方法更新页面



```js
const Observer = function(data) {
  // 循环修改为每个属性添加get set
  for (let key in data) {
    defineReactive(data, key);
  }
}

const defineReactive = function(obj, key) {
  // 局部变量dep，用于get set内部调用
  const dep = new Dep();
  // 获取当前值
  let val = obj[key];
  Object.defineProperty(obj, key, {
    // 设置当前描述属性为可被循环
    enumerable: true,
    // 设置当前描述属性可被修改
    configurable: true,
    get() {
      console.log('in get');
      // 调用依赖收集器中的addSub，用于收集当前属性与Watcher中的依赖关系
      dep.depend();
      return val;
    },
    set(newVal) {
      if (newVal === val) {
        return;
      }
      val = newVal;
      // 当值发生变更时，通知依赖收集器，更新每个需要更新的Watcher，
      // 这里每个需要更新通过什么断定？dep.subs
      dep.notify();
    }
  });
}

const observe = function(data) {
  return new Observer(data);
}

const Vue = function(options) {
  const self = this;
  // 将data赋值给this._data，源码这部分用的Proxy所以我们用最简单的方式临时实现
  if (options && typeof options.data === 'function') {
    this._data = options.data.apply(this);
  }
  // 挂载函数
  this.mount = function() {
    new Watcher(self, self.render);
  }
  // 渲染函数
  this.render = function() {
    with(self) {
      _data.text;
    }
  }
  // 监听this._data
  observe(this._data);  
}

const Watcher = function(vm, fn) {
  const self = this;
  this.vm = vm;
  // 将当前Dep.target指向自己
  Dep.target = this;
  // 向Dep方法添加当前Wathcer
  this.addDep = function(dep) {
    dep.addSub(self);
  }
  // 更新方法，用于触发vm._render
  this.update = function() {
    console.log('in watcher update');
    fn();
  }
  // 这里会首次调用vm._render，从而触发text的get
  // 从而将当前的Wathcer与Dep关联起来
  this.value = fn();
  // 这里清空了Dep.target，为了防止notify触发时，不停的绑定Watcher与Dep，
  // 造成代码死循环
  Dep.target = null;
}

const Dep = function() {
  const self = this;
  // 收集目标
  this.target = null;
  // 存储收集器中需要通知的Watcher
  this.subs = [];
  // 当有目标时，绑定Dep与Wathcer的关系
  this.depend = function() {
    if (Dep.target) {
      // 这里其实可以直接写self.addSub(Dep.target)，
      // 没有这么写因为想还原源码的过程。
      Dep.target.addDep(self);
    }
  }
  // 为当前收集器添加Watcher
  this.addSub = function(watcher) {
    self.subs.push(watcher);
  }
  // 通知收集器中所的所有Wathcer，调用其update方法
  this.notify = function() {
    for (let i = 0; i < self.subs.length; i += 1) {
      self.subs[i].update();
    }
  }
}

const vue = new Vue({
  data() {
    return {
      text: 'hello world'
    };
  }
})

vue.mount(); // in get
vue._data.text = '123'; // in watcher update /n in get

```

## 真实的渲染情况 - Vue挂载初始化值
>Vue源码了的流程已经和上面的简化版响应式差不多了，有几个地方还需结合源码看下稍微有点区别。 一个是Vue的初始化并挂载到页面，还有一个就是在哪里new watcher的


Vue 中有两个 $mount 函数，第一个的作用是给第二个 调用......如果大家看源码，不要搞混了喂
```tsx
Vue.prototype.$mount = function(el) {    

    return mountComponent(this, query(el))

};

var mount = Vue.prototype.$mount;

Vue.prototype.$mount = function(el) {

    ...解析模板，生成模板渲染函数，保存渲染函数到 options    

    return mount.call(this, el)

}
```

## Watcher -  数据与视图如何联系

可以发现Vue初始化的时候并没有直接调用` vm._update(vm._render(), hydrating)`，而是将其封装成一个回调函数传入Watcher，之后重新设置数据就可以调用这个更新函数来更新页面初始化了页面的数据，也就是或这个时候你模板你的{{name}}里的变量已经变成了值，触发了get把，然后再去把这里 new 的 Watcher 放入Dep的队列里
```tsx
export function mountComponent(
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  // ...
  let updateComponent
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {} else {
    // 组件渲染，该回调会在初始化和数据变化时调用
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }
  // 实例化渲染 Watcher
  new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before() {
        if (vm._isMounted) {
          callHook(vm, 'beforeUpdate')
        }
      }
    },
    true /* isRenderWatcher */
  )
  return vm
}

```

## 源码中Watcher会在构造函数值调用渲染方法

渲染watcher，Watcher 在这里起到两个作用，一个是初始化的时候会执行回调函数，另一个是当 vm 实例中的监测的数据发生变化的时候执行回调函数


- 在Watcher的构造函数中定义了getter函数：this.getter = expOrFn。这个expOrFn 是updateComponent方法


- 在Watcher.prototype.get()方法中通过this.getter.call(vm, vm)来调用updateComponent方法

- 然后执行vm._update(vm._render, hydrating)。
```tsx
let uid = 0

 /*
    一个解析表达式，进行依赖收集的观察者，同时在表达式数据变更时触发回调函数。它被用于$watch api以及指令
 */
export default class Watcher {
  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: Object
  ) {
    this.vm = vm
    /*_watchers存放订阅者实例*/
    vm._watchers.push(this)
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    /*把表达式expOrFn解析成getter*/
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function () {}
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get()
  }

   /*获得getter的值并且重新进行依赖收集*/
  get () {
    /*将自身watcher观察者实例设置给Dep.target，用以依赖收集。*/
    pushTarget(this)
    let value
    const vm = this.vm

    /*
      执行了getter操作，看似执行了渲染操作，其实是执行了依赖收集。
      在将Dep.target设置为自生观察者实例以后，执行getter操作。
      譬如说现在的的data中可能有a、b、c三个数据，getter渲染需要依赖a跟c，
      那么在执行getter的时候就会触发a跟c两个数据的getter函数，
      在getter函数中即可判断Dep.target是否存在然后完成依赖收集，
      将该观察者对象放入闭包中的Dep的subs中去。
    */
    if (this.user) {
      try {
        value = this.getter.call(vm, vm)
      } catch (e) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      }
    } else {
      value = this.getter.call(vm, vm)
    }

    /*如果存在deep，则触发每个深层对象的依赖，追踪其变化*/
    if (this.deep) {
      /*递归每一个对象或者数组，触发它们的getter，使得对象或数组的每一个成员都被依赖收集，形成一个“深（deep）”依赖关系*/
      traverse(value)
    }

    /*将观察者实例从target栈中取出并设置给Dep.target*/
    popTarget()
    this.cleanupDeps()
    return value
  }

   /*添加一个依赖关系到Deps集合中*/
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

   /*清理依赖收集*/
  cleanupDeps () {
    /*移除所有观察者对象*/
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

   /*
      调度者接口，当依赖发生改变的时候进行回调。
   */
  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      /*同步则执行run直接渲染视图*/
      this.run()
    } else {
      /*异步推送到观察者队列中，下一个tick时调用。*/
      queueWatcher(this)
    }
  }


   /*
      调度者工作接口，将被调度者回调。
    */
  run () {
    if (this.active) {
      /* get操作在获取value本身也会执行getter从而调用update更新视图 */
      const value = this.get()
      if (
        value !== this.value ||
        /*
            即便值相同，拥有Deep属性的观察者以及在对象／数组上的观察者应该被触发更新，因为它们的值可能发生改变。
        */
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        /*设置新的值*/
        this.value = value

        /*触发回调*/
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

   /*获取观察者的值*/
  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

   /*收集该watcher的所有deps依赖*/
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }
}

```


在执行new Watcher会有一个求值的操作，这里的求值是一个函数表达式,也就是执行updateComponent，执行updateComponent后，会再执行vm._render(),传参数给vm._update(vm._render(), hydrating),收集完依赖以后才结束
vm._render在做什么？vm._update在做什么？
```tsx
  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const {
      render,
      staticRenderFns,
      _parentVnode
    } = vm.$options
    // ...
    let vnode
    try {
      // vm._renderProxy我们直接当成vm，其实就是为了开发环境报warning用的
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {

    }

    // set parent
    vnode.parent = _parentVnode
    return vnode
  }
```

render函数来自options，然后返回了vnode,options上的render就是来自模板编译解析出来的render方法

数据到视图的整体流程
所以到这里我们就可以得出一个数据到视图的整体流程的结论了

- 在组件级别，vue会执行一个new Watcher
- new Watcher首先会有一个求值的操作，它的求值就是执行一个函数，这个函数会执行- render，其中可能会有编译模板成render函数的操作，然后生成vnode(virtual dom)，再将virtual dom应用到视图中
- 其中将virtual dom应用到视图中（这里涉及到diff后文会讲），一定会对其中的表达式求值(比如{{message}},我们肯定会取到它的值再去渲染的），这里会触发到相应的getter操作完成依赖的收集
- 当数据变化的时候，就会notify到这个组件级别的Watcher,然后它还会去求值，从而重新收集依赖，并且重新渲染视图




## vm._update

这个函数的作用是，对比 vnode，挂载更新DOM
1、如果存在旧 vnode，那么会对比旧 vnode 和 刚传入的新 vnode，不断地 patch 得到最小变化单位，从而只更新这部分DOM
2、如果不存在旧 vnode，那么就直接把 vnode 转换为 dom 挂载到页面
其中，生成DOM 和 挂载DOM 用到的方法是 createElm
方法很简单，无非就是通过 标签名创建DOM，然后插入到页面中

## 数组如何更新

重新Array原型链上的方法，在一些改变原数组的方法上手动触发dep.notify