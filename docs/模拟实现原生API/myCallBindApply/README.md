## bind

>bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。

### 特点1：传递参数返回函数

可以传入参数，且可以分为两次传递，调用bind的时候传一次，执行返回函数的时候还可以穿一次


```
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(this.value);
    console.log(name);
    console.log(age);

}

var bindFoo = bar.bind(foo, 'daisy');
bindFoo('18');
// 1
// daisy
// 18
```

### 特点2：bind返回的函数可以作为构造函数

一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。

```js
var value = 2;

var foo = {
    value: 1
};

function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}

bar.prototype.friend = 'kevin';

var bindFoo = bar.bind(foo, 'daisy');

var obj = new bindFoo('18');
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
// shopping
// kevin
```

### 模拟实现bind

版本一：忽略原型链共享的影响

```js
// 第一版有一个缺陷，如果我们修改resFunc的原型就会影响调用bind的函数的原型
Function.prototype.myBind = function(context){
    if (typeof this !== "function") {
        // 调用myBind的若不是函数则报错
        throw new TypeError("not a function");
      }    
    const func = this
    const args = [...arguments].slice(1)
    const resFunc =  function(){
        const newArgs = [...arguments]
        // 如果new 调用 resFunc ，则 实例.proto -> resFunc.prototype
        // 又因为我们在返回 resFunc之前使得 resFunc.prototype = func.prototype
        // 所以 实例.proto -> func.prototype  而resFunc作为构造函数时 this指向实例
        // 最后 this.proto -> func.prototype，刚好可以用 instanceof 来判断
        // this instanceof func是true，那么说明是 new 调用的resFunc，则一切操作要反应到实例(this)上
        // this instanceof func是false,说明this指向的不是实例而是window
        func.apply(this instanceof func?this:context,args.concat(args,newArgs))
    }
    // new 调用时 需要考虑原型链的指向
    // new resFunc时创建实例访问属性时，去resFunc.prototype找属性就是直接去func.prototype
    // 也就是直接赋值相当于共用一条原型链，会造成改一个另一个也会变
    resFunc.prototype = func.prototype
    return resFunc
}

```

版本二：加入中转函数优化

```js
// 使用中转函数优化
Function.prototype.myBind2 = function(context){
    if (typeof this !== "function") {
        // 调用myBind的若不是函数则报错
        throw new TypeError("not a function");
      }
    const func = this
    const args = [...arguments].slice(1)
    const resFunc =  function(){
        const newArgs = [...arguments]
        func.apply(this instanceof func?this:context,args.concat(args,newArgs))
    }
    // 建立一个中转函数           nopFunc.prototype->func.prototype 
    // 然后用new重写resFunc的原型 resFunc.prototype._proto_->nopFunc.prototype
    // 最后就是 resFunc.prototype._proto_->func.prototype 
    // new resFunc时创建实例访问属性时，实例先去resFunc.prototype找不到又会去resFunc.prototype._proto_找，也就是到了func.prototype 
    // 如果我们直接修改resFunc.prototype就不会影响func.prototype（只是修改new nopFunc()的属性，而真正的func.prototype在它的__proto__属性上） 
    let nopFunc = function(){}
    nopFunc.prototype = func.prototype
    resFunc.prototype = new nopFunc()
    return resFunc
}
```

###  总结两版

myBind返回的方法原型链和调用者共用，修改一个全得变
myBind2返回方法的原型链是new出来的对象，新开了一块内存空间，修改不会影响原函数的原型，找属性时会多走一步__proto__

## call和apply

call和apply实现方式基本一样，思路就是this的方法调用调用模式(指的是obj.fun()执行函数)，这样函数的this就会被绑定到调用对象里。

注意属性覆盖的问题，用Symbol返回一个唯一的键即可

```
Function.prototype.myCall = function(context) {
  if (typeof this !== "function") {
    // 调用call的若不是函数则报错
    throw new TypeError("Error");
  }
  // 如果是在浏览器端的非严格模式下context是undefined会转为window
  context = context || window;
  // 获取参数 arguments是类数组需要转化一下
  const args = [...arguments].slice(1);
  // 我们并不知道context这个上下文里已经存在了那些属性，但我们要把调用的方法添加到这个context里，所以采用symbol避免覆盖原有属性
  const func = Symbol("func");
  // this指向的是调用myCall的方法
  context[func] = this;
  // 采用对象的方法调用模式，this就指向了这个对象
  const res = context[func](...args);// 如果是es5 用eval('context[func]('+arg+')');
  delete context[func];
  return res;
};
```