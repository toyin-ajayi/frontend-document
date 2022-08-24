## 块级作用域

在一个代码块（括在一对花括号中的一组语句）中定义的所有变量在代码块的外部是不可见的。
比如在If语句，switch语句，循环语句等语句块中定义变量，这意味着变量不能在语句块之外被访问。
但是和函数一样可以访问上层作用域

## 临时死区

临时死区(Temporal Dead Zone)，简写为 TDZ。

let 和 const 声明的变量不会被提升到作用域顶部，如果在声明之前访问这些变量，会导致报错：
```
console.log(typeof value); // Uncaught ReferenceError: value is not defined
let value = 1;

```

这是因为 JavaScript 引擎在扫描代码发现变量声明时，要么将它们提升到作用域顶部(遇到 var 声明)，要么将声明放在 TDZ 中(遇到 let 和 const 声明)。访问 TDZ 中的变量会触发运行时错误。只有执行过变量声明语句后，变量才会从 TDZ 中移出，然后方可访问。

```
var value = "global";

// 例子1
(function() {
    console.log(value);//Uncaught ReferenceError: value is not defined

    let value = 'local';
}());

// 例子2
{
    console.log(value);//Uncaught ReferenceError: value is not defined

    const value = 'local';
};

```

## let 与 for循环的问题

看一下用var和let的对比
```
var funcs = [];
for (var i = 0; i < 3; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // 3

```

```
var funcs = [];
for (let i = 0; i < 3; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // 0

```

let 不提升，不能重复声明，不能绑定全局作用域等等特性，可是为什么在这里就能正确打印出 i 值呢？
如果是不重复声明，在循环第二次的时候，又用 let 声明了 i，应该报错呀，就算因为某种原因，重复声明不报错，一遍一遍迭代，i 的值最终还是应该是 3 呀，还有人说 for 循环的
设置循环变量的那部分是一个单独的作用域，就比如：

```
for (let i = 0; i < 3; i++) {
  let i = 'abc';// 没有跳出循环
  console.log(i);
}
// abc
// abc
// abc

```

果我们把 let 改成 var 

```
for (var i = 0; i < 3; i++) {
  var i = 'abc';// i被覆盖了 跳出循环
  console.log(i);
}
// abc

```
从这个例子我们就应该可以猜想，for(){}循环如果()里用的let，应该是做了特殊处理的


### 原因： ECMAScript 规范特殊定义过

let 声明在循环内部的行为是标准中专门定义的，不一定就与 let 的不提升特性有关。
所以for 循环中使用 let 和 var，底层会使用不同的处理方式。
可以说for循环用let的时候在圆括号内建立了一个隐藏作用域。

### 如何理解和模拟let的隐藏作用域

每次迭代循环时都创建一个新变量，并以之前迭代中同名变量的值将其初始化。
执行函数的时候，根据词法作用域就可以找到正确的值，其实你也可以理解为 let 声明模仿了闭包的做法来简化循环过程

```
var funcs = [];
for (let i = 0; i < 3; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // 0

```

相当于：

```
// 伪代码
(let i = 0) {
    funcs[0] = function() {
        console.log(i)
    };
}

(let i = 1) {
    funcs[1] = function() {
        console.log(i)
    };
}

(let i = 2) {
    funcs[2] = function() {
        console.log(i)
    };
};

```

### const在for循环中无法使用（ for in 中可以）

，因为虽然我们每次都创建了一个新的变量，然而我们却在迭代中尝试修改 const 的值，所以最终会报错。

## 总结一下 let 和 const

共同点：
- 暂时性死区
- 不会被提升
- 重复声明报错
- 不绑定全局作用域
- 块级作用域
- 函数参数变量是默认声明的，所以不可以使用let和const再次声明

细小区别：

- let可以先声明稍后再赋值
- const在 声明之后必须马上赋值，否则会报错
- const声明后无法修改，引用类型的地址无法修改内部指向可以修改




