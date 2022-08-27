## Object.create()

### 定义

创建一个新对象，使用现有的对象来提供新创建的对象的\_\_proto\_\_

### 参数

Object.create(proto,[propertiesObject])
proto:新创建对象的原型对象
propertiesObject:可选。要添加到新对象的可枚举（新添加的属性是其自身的属性，而不是其原型链上的属性）的属性。

### 返回值

一个新对象，带着指定的原型对象和属性。

### 实例

```tsx
const person = {
  isHuman: false,
  printIntroduction: function () {
    console.log(123);
  }
};

const me = Object.create(person,{
  // foo会成为所创建对象的数据属性,且foo必须为一个对象；可设置新对象的foo属性的可读性，可配置性以及值
  foo: { 
    writable:true,
    configurable:true,
    value: "hello" 
  }
  });

me.name = "Matthew"; // "name" is a property set on "me", but not on "person"
me.isHuman = true; // inherited properties can be overwritten
console.log(me)
```

![](/img/blog/28/1.png)

## new Object()

通过构造函数来创建对象, 添加的属性是在自身实例下。
Object.create() es6创建对象的另一种方式，可以理解为继承一个对象, 添加的属性是在原型下。：

```tsx
var a = {  rep : 'apple' }
var b = new Object(a)
console.log(b) // {rep: "apple"}
console.log(b.__proto__) // {}
```

## Object.create()

```tsx
var a = { rep: 'apple' }
var b = Object.create(a)
console.log(b)  // {}
console.log(b.__proto__) // {rep: "apple"}
```

## Object.create(null)与Object.create({})还是有区别的

先看看我们经常使用的{}创建的对象是什么样子的

```tsx
var o = {a:1};
console.log(o)
```

![](/img/blog/28/2.png)

再看看使用Object.create()创建对象：
```tsx
var o = Object.create(null,{
    a:{
           writable:true,
        configurable:true,
        value:'1'
    }
})
console.log(o)

```

![](/img/blog/28/3.png)


我们再把上面的例子改为{}
```tsx
var o = Object.create({},{
    a:{
           writable:true,
        configurable:true,
        value:'1'
    }
})
console.log(o)

```

![](/img/blog/28/4.png)

创建的对象和使用{}创建对象已经很相近了，但是还是有一点区别：多了一层proto嵌套。
我们最后再来改一下：
```tsx
var o = Object.create(Object.prototype,{
    a:{
           writable:true,
        configurable:true,
        value:'1'
    }
})
console.log(o)
```

![](/img/blog/28/5.png)




