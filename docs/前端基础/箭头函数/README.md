## 普通函数和箭头函数的区别

### 没有 this

箭头函数没有 this，所以需要通过查找作用域链来确定 this 的值。

这就意味着如果箭头函数被非箭头函数包含，this 绑定的就是最近一层非箭头函数的 this。


### 没有 arguments

箭头函数可以访问外围函数的 arguments 对象：

```tsx
function constant() {
    return () => arguments[0]
}

var result = constant(1);
console.log(result()); // 1

```


### 不能通过 new 关键字调用


JavaScript 函数有两个内部方法：[[Call]] 和 [[Construct]]。
当通过 new 调用函数时，执行 [[Construct]] 方法，创建一个实例对象，然后再执行函数体，将 this 绑定到实例上。当直接调用的时候，执行 [[Call]] 方法，直接执行函数体。
箭头函数并没有 [[Construct]] 方法，不能被用作构造函数，如果通过 new 的方式调用，会报错。
```tsx
var Foo = () => {};
var foo = new Foo(); // TypeError: Foo is not a constructor

```

### 没有原型 prototype

由于不能使用 new 调用箭头函数，所以也没有构建原型的需求，于是箭头函数也不存在 prototype 这个属性。
```tsx
var Foo = () => {};
console.log(Foo.prototype); // undefined

```

### 没有 super


连原型都没有，自然也不能通过 super 来访问原型的属性，所以箭头函数也是没有 super 的


### 没有 new.target

new.target是ES6新引入的属性，普通函数如果通过new调用，new.target会返回该函数的引用。
箭头函数的this指向普通函数，它的new.target就是指向该普通函数的引用。
```tsx
new bb();
function bb() {
  let a = () => {
    console.log(new.target); // 指向函数bb：function bb(){...}而不是a函数
  };
  a();
}

```


## 箭头函数的继承性

this、arguments、new.target、super 这些值由外围最近一层非箭头函数决定。

被继承的普通函数的this等这些属性的指向改变，箭头函数的指向会跟着改变


## 注意点

###  箭头函数外层没有普通函数

严格模式和非严格模式下它的this都会指向window(全局对象)

### 对象嵌套

对象嵌套的话没有发生作用域链的嵌套，不能方法在对象里嵌套多少层this总是指向对象外面的函数或者全局
```tsx
var obj = {
  i: 10,
  b: () => console.log(this.i, this),
  c: {
      d: () => console.log(this.i, this),
  }
}
obj.b();
// Window
obj.c.d();
// 虽然是链式调用但是是对象，Window

```

### 不能直接修改箭头函数的this指向

```tsx
let fnObj = { msg: '尝试直接修改箭头函数的this指向' };
function foo() {
    let a = ()=>{
        console.log(this)
    }
  a.call(fnObj); // this指向是全局，无法绑定this
}
foo()

```