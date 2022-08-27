## 原型链

原型链是一种机制，指的是 JavaScript 每个对象`包括原型对象`都有一个内置的
`[[proto]]`属性指向创建它的函数对象的原型对象，即 prototype 属性。原型链的存在，主要是为了实现对象的`继承`。

## 函数即对象

- js 分为**函数对**象和**普通对象**，每个对象都有\_\_proto\_\_属性，但是只有函数对象才有 prototype 属性
- Object、Function 都是 js 内置的**函数**, 类似的还有我们常用到的 Array、RegExp、Date、Boolean、Number、String

## \_\_proto\_\_

JavaScript 在创建对象的时候，都会有一个`[[proto]]`的内置属性，用于指向创建它的函数对象的`prototype`。原型对象也有`[[proto]]`属性。因此在不断的指向中，形成了原型链。

## prototype 原型对象

当定义一个函数对象的时候，会包含一个预定义的属性，叫`prototype`，这就属性称之为原型对象。
只有函数有 prototype 属性,也就是说`__proto__` 的值是它所对应的原型对象，是某个函数的`prototype`

## constructor

实例的`constructor`属性指向它的构造函数
原型对象 prototype 上的预定义的`constructor`属性，用来引用它的函数对象。这是一种循环引用。
经常会有下列的写法,加`constructor`是因为重写了原型对象，constructor 属性就消失了，需要自己手动补上。

```tsx
function F(){};
F.prototype = {
    constructor : F,
    doSomething : function(){}
}
```

JavaScript 在创建对象的时候，都会有一个`[[proto]]`的内置属性，用于指向创建它的函数对象的`prototype`。原型对象也有`[[proto]]`属性。因此在不断的指向中，形成了原型链。

## 原型链的内存结构

![](/img/blog/自己对原型链新的理解/原型链内存结构.png)

## 原型链终极探索图

注意几个指向问题,下文详细分析

- Foo.prototype 和 Function.prototype 指向 Object.prototype
- Foo()的**proto**指向 Function.prototype
- 别的函数对象 constructor 指向 Function,Function 的 constructor 指向自身
  ![](/img/blog/自己对原型链新的理解/原型链终极探索.png)

### 普通构造函数的实例对象原型链分析

这里的 myfun()相当于上图的 Foo()函数

```tsx
    function myfun(x,y){
      this.x = x
      this.y = y
      this.sum = function(){
        return x+y
      }
    }

    myfun.prototype.sum = function(){
      return this.x+this.y
    }
    myobj = new myfun(1,2)
    console.log(myobj)
```

![](/img/blog/自己对原型链新的理解/自定义构造函数的对象.png)

### 非 Function 类型函数对象的原型链分析

常用到的 Array()、RegExp()、Date()、Boolean()、Number()、String()这些构造函数其实都是有 Function 构造而来,从他们的 constructor 属性的指向可以证明,这里我分析一下 Array()的原型链.
可以看到 Array.*proto*是一个 function,也就是说 Array.*proto*指向的 Function.prototype 是一个 function,其他普通对象的原型却是一个 Object
Array.\_\_proto\_\_ -> Function.prototype
Function.prototype 是一个函数类型的对象
Function.prototype.\_\_proto\_\_指向最顶层的 Object.prototype

```tsx
console.log(Array)
```

![](/img/blog/自己对原型链新的理解/向上分析内置Array函数.png)

### Function 函数对象的原型链

在 ES6 标准中，Function 对象有两个属性：

- **length** 值为 1，这个属性的特性为`{ [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: true }`，即不可覆盖，不可被`for...in`遍历，但可以通过`Object.defineProperty`修改它的上面这些特性

- **prototype** 为原型对象，（[见 ES 最新标准说明 Function.prototpye](https://tc39.github.io/ecma262/#sec-properties-of-the-function-prototype-object)）它跟一般函数的`prototype`的区别在于

  - **它不可写，不可配置，不可遍历。** 即它永远指向固定的一个对象，且是其他**所有函数的原型对象**，所有函数本身的`__proto__`指向它。
  - **它是一个函数。** 一般函数的`prototype`是一个带有`constructor`属性的普通对象，但`Function`的`prototype`是一个函数对象（`built-in function object`），**是`js`中唯一一个默认`prototype`为函数的对象**

函数和对象都有`__proto__`属性，指向构造函数的`prototype`属性所指向的对象，即它的原型对象。
而函数的`__proto__`属性（并非它的原型对象`prototype`上的`__proto__`属性）指向`Function.prototype`，所以`Function.prototype`上的属性和方法都会被函数对象([function object](https://tc39.github.io/ecma262/#function-object))所继承。
![](/img/blog/自己对原型链新的理解/Function的__proto__.png)

似乎进入了**“鸡生蛋和蛋生鸡”**的哲学范畴
`Object`本身是构造函数，继承了`Function.prototype`;
`Function`也是对象，继承了`Object.prototype`。

```tsx
Function.__proto__ === Function.prototype // true
Object.__proto__ === Function.prototype // true
Object.prototype.__proto__ === null // true
Function.prototype.__proto__ === Object.prototype // true
Object.prototype === Object.__proto__ // false

```

```tsx
Object instanceof Function // true
Function instanceof Object // true
```

完全没必要去纠结鸡生蛋还是蛋生鸡的问题,之所以`Function.__proto__ === Function.prototype`，是为了表明`Function`作为一个原生构造函数，本身也是一个函数对象(由自己构造出的实例)，让 `Function`这个构造函数 可以获取定义在 `Object.prototype` 上的方法。

```tsx
console.log(Function)
```

![](/img/blog/自己对原型链新的理解/Function的原型.png)

## 总结

### 属性

![](/img/blog/自己对原型链新的理解/总结1.png)
![](/img/blog/自己对原型链新的理解/总结2.png)
![](/img/blog/自己对原型链新的理解/总结3.png)

### 万物皆对象

** 注:全部为自己的看法,可能与标准的说法有出入,只是方便自己理解,我快晕了**
js 里万物皆为对象,最顶层为 Object 对象是一切的原型(起源) 注意这里的 Object 不是构造函 Object()是一个切实的原型对象
Object(),Function(),Array(),String()这些方法就像我们自定义的方法一样(只不过是 js 语言帮我们内置创建了这些方法来创建特殊的类,本质都是 Object)
每个方法都有(可以说是创建了)自己的 prototype(原型对象),然后这些原型对象的*proto*又都指向了最顶层的 Object 原型对象(由此可以说明是顶层对象创建了每个方法的原型对象,也就是说方法类的原型对象是顶层 Object 类的原型对象创建的实例一样)
其中的 Function 方法较为特殊,Object(),Array(),String()这些方法都是有 Function 方法构造而来
Function 构造函数本身就是 Function 的实例(像是自己构造自己得到的函数对象)，所以*proto*指向 Function 的原型对象.

### 再看一张原型链的铁三角图

**注意:一个函数存在两种状态**

- 作为构造函数时,可以去 new 一个实例对象,这个对象可以是普通对象也可以说函数对象(Function 就可以构造函数对象)
- 作为被构造的函数(实例)对象时,自己的**proto**要指向构造自己的构造函数的 prototype(就是指向原型对象)
  ![](/img/blog/自己对原型链新的理解/原型链铁三角.png)

## 参考文章

[https://juejin.im/post/5cc99fdfe51d453b440236c3](https://juejin.im/post/5cc99fdfe51d453b440236c3)
[https://segmentfault.com/a/1190000011880268](https://segmentfault.com/a/1190000011880268)
[https://segmentfault.com/a/1190000005363885](https://segmentfault.com/a/1190000005363885)
[https://juejin.im/post/5b3798f851882574c105c51c](https://juejin.im/post/5b3798f851882574c105c51c)
[https://github.com/creeperyang/blog/issues/9](https://github.com/creeperyang/blog/issues/9)
