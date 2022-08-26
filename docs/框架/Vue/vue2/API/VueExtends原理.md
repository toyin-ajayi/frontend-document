## Vue.extend原理

Vue.extend的作用是创建一个继承自Vue类的子类，可接收的参数是一个包含组件选项的对象。

既然是Vue类的子类，那么除了它本身独有的一些属性方法，还有一些是从Vue类中继承而来，所以创建子类的过程其实就是一边给子类上添加上独有的属性，一边将父类的公共属性复制到子类上。接下来，我们就来看看源码是如何实现这个过程的。


该API的定义位于源码的src/core/global-api/extend.js中，如下：

- extendOptions：用户传入的一个包含组件选项的对象参数；
- Super：指向父类，即基础 Vue类；
- SuperId：父类的cid属性，无论是基础 Vue类还是从基础 Vue类继承而来的类，都有一个cid属性，作为该类的唯一标识；
- cachedCtors：缓存池，用于缓存创建出来的类；
```
Vue.extend = function (extendOptions: Object): Function {
    extendOptions = extendOptions || {}
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
        return cachedCtors[SuperId]
    }

    const name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production' && name) {
        validateComponentName(name)
    }

    const Sub = function VueComponent (options) {
        this._init(options)
    }
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.cid = cid++
    Sub.options = mergeOptions(
        Super.options,
        extendOptions
    )
    Sub['super'] = Super

    if (Sub.options.props) {
        initProps(Sub)
    }
    if (Sub.options.computed) {
        initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // 将父类中的一些属性复制到子类中，如下
    ASSET_TYPES.forEach(function (type) {
        Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
        Sub.options.components[name] = Sub
    }

    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor
    cachedCtors[SuperId] = Sub
    return Sub
}
```

其实总体来讲，整个过程就是先创建一个类Sub，接着通过原型继承的方式将该类继承基础Vue类，然后给Sub类添加一些属性以及将父类的某些属性复制到Sub类上，最后将Sub类返回。

## 如何将Vue的模板组件全局话

首先要了解模板组件是如何更新的。

模板组件编译出来的对象变量通过上下文的$options中取出，并使用Vue.extends(vue/src/core/global-api/extend.js)通过该对象构建出一个新的Vue对象。


好了，如果我们现在自己来通过Vue.extends构造一个构造函数，然后挂载到全局不就行了。

```
// 创建构造器
var Profile = Vue.extend({
  template: '<p>{{extendData}}</br>实例传入的数据为:{{propsExtend}}</p>',//template对应的标签最外层必须只有一个标签
  data: function () {
    return {
      extendData: '这是extend扩展的数据',
    }
  },
  props:['propsExtend']
})
// 创建 Profile 实例，并挂载到一个元素上。可以通过propsData传参.
new Profile({propsData:{propsExtend:'我是实例传入的数据'}}).$mount('#app-extend')
```