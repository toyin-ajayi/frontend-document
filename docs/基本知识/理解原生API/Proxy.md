## Proxy

使用 defineProperty 只能重定义属性的读取（get）和设置（set）行为，
到了 ES6，提供了 Proxy，可以重定义更多的行为，比如 in、delete、函数调用等更多行为。
一般代理的目的，是为了拓展对象的能力

## 术语

- handler：包含捕捉器（trap）的占位符对象，可译为处理器对象。
- traps提供属性访问的方法。如get、set、has、deleteProperty等
- target 被 Proxy 代理虚拟化的对象。它常被作为代理的存储后端。根据目标验证关于对象不可扩展性或不可配置属性的不变量（保持不变的语义）。

## Proxy参数

- target参数表示所要拦截的目标对象
- handler参数也是一个对象，用来定制拦截行为

```
var proxy = new Proxy(target, handler);
```

## 定制拦截行为

- get(target, propKey, receiver)：拦截对象属性的读取，比如proxy.foo和proxy['foo']。
- set(target, propKey, value, receiver)：拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
- has(target, propKey)：拦截propKey in proxy的操作，返回一个布尔值。
- deleteProperty(target, propKey)：拦截delete proxy[propKey]的操作，返回一个布尔值。
- ownKeys(target)：拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
- getOwnPropertyDescriptor(target, propKey)：拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
- defineProperty(target, propKey, propDesc)：拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
- preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值。
- getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象。
- isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值。
- setPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
- construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。

### 代理对象

- target 参数表示所要拦截的目标对象
- property 你访问的键名
- receiver 是当前代理对象，注意，这是一个已经代理后的对象,一般情况下就是 Proxy 实例

```
const target = {
  name: "lorry"
};

const handler = {
  get(trapTarget, property, reciever) {
    console.log(trapTarget === target);
    console.log(reciever === proxy);
    console.log(property);
    return "重写的名字";
    //  我们执行部分操作，要返回目标对象的值，不做改变
    //  return trapTarget[property]
  }
};

const proxy = new Proxy(target, handler);

console.log(target.name); // lorry
console.log(proxy.name); // override name
```

### 代理函数
```
var handler = {
  get: function(target, name) {
    if (name === 'prototype') {
      return Object.prototype;
    }
    return 'Hello, ' + name;
  },

  apply: function(target, thisBinding, args) {
    return args[0];
  },

  construct: function(target, args) {
    return {value: args[1]};
  }
};

var fproxy = new Proxy(function(x, y) {
  return x + y;
}, handler);

fproxy(1, 2) // 1
new fproxy(1, 2) // {value: 2}
fproxy.prototype === Object.prototype // true
fproxy.foo === "Hello, foo" // true
```

## trap 默认行为


```js
let data = [1,2,3]
let p = new Proxy(data, {
  get(target, key, receiver) {
    return target[key]
  },
  set(target, key, value, receiver) {
    console.log('set value')
    target[key] = value // 这里会触发两次 第二次会报错
  }
})

p.push(4) // VM438:12 Uncaught TypeError: 'set' on proxy: trap returned falsish for property '3'

```

实际上，当代理对象是数组，通过 push 操作，并不只是操作当前数据，push 操作还触发数组本身其他属性更改。



```js
let data = [1,2,3]
let p = new Proxy(data, {
  get(target, key, receiver) {
    return target[key]
  },
  set(target, key, value, receiver) {
    console.log('set value')
    target[key] = value // 这里会触发两次 第二次会报错
+   return true // 添加这个数组在修改length时的默认行为才能成功
  }
})

// get value: push
// get value: length
// set value: 3 1
// set value: length 4
```


先看 set 操作，从打印输出可以看出，push 操作除了给数组的第 3 位下标设置值 1 ，还给数组的 length 值更改为 4。 同时这个操作还触发了 get 去获取 push 和 length 两个属性。


我们可以通过 Reflect 来返回 trap 相应的默认行为，它的参数和trap的参数刚好一一对应，如果我们需要保留默认行为时，直接使用Reflect操作会比较方便。

```js
let data = [1,2,3]
let p = new Proxy(data, {
  get(target, key, receiver) {
    console.log('get value:', key)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    console.log('set value:', key, value)
    return Reflect.set(target, key, value, receiver)
  }
})

p.push(1)

// get value: push
// get value: length
// set value: 3 1
// set value: length 4

```