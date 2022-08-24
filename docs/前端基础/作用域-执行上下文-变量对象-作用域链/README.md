## 作用域

作用域就是变量与函数的可访问范围，即作用域控制着变量与函数的可见性和生命周期。在 JavaScript 中，变量的作用域有全局作用域和局部作用域两种。JavaScript 采用词法作用域(lexical scoping)，也就是静态作用域。

### 静态作用域

函数的作用域在函数定义的时候就决定了。
js 函数有一个内部属性 [[scope]]，当函数创建的时候，就会保存所有父变量对象到其中，下文会详细描述

### 动态作用域

函数的作用域是在函数调用的时候才决定的。

### 实例

静态作用域的语言下面的代码会打出 1，因为在 foo 定义的时候，他的作用域就确定了在全局（后面讲变量对象的时候也会说 foo 是注册在全局的而不是在 bar 里面才注册）

执行 foo 函数，先从 foo 函数内部查找是否有局部变量 value，如果没有，就根据书写的位置，查找上面一层的代码，也就是 value 等于 1，所以结果会打印 1。

```
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    var value = 2;
    foo();
}

bar();
```

## 执行上下文

### JavaScript 代码执行过程

JavaScript 代码的整个执行过程，分为两个阶段，代码编译阶段与代码执行阶段。

- 编译阶段由编译器完成，将代码翻译成可执行代码，这个阶段作用域规则会确定。
- 执行阶段由引擎完成，主要任务是执行可执行代码，执行上下文在这个阶段创建和执行。

  ![](/img/blog/26/2.png)

### 执行上下文（Execution Context）

就是当前 JavaScript 代码被解析和执行时所在环境的抽象概念， JavaScript 中运行任何的代码都是在执行上下文中运行。
为了表示不同的运行环境，JavaScript 中有一个**执行上下文（Execution context，EC）**的概念。也就是说，当 JavaScript 代码执行的时候，会进入不同的执行上下文，这些执行上下文就构成了一个**执行上下文栈（Execution context stack，ECS）**

### 执行上下文总共有三种类型：

- 全局执行上下文： 这是默认的、最基础的执行上下文。不在任何函数中的代码都位于全局执行上下文中。它做了两件事：1. 创建一个全局对象，在浏览器中这个全局对象就是 window 对象。2. 将 this 指针指向这个全局对象。一个程序中只能存在一个全局执行上下文。
- 函数执行上下文： 每次调用函数时，都会为该函数创建一个新的执行上下文。每个函数都拥有自己的执行上下文，但是只有在函数被调用的时候才会被创建。一个程序中可以存在任意数量的函数执行上下文。每当一个新的执行上下文被创建，它都会按照特定的顺序执行一系列步骤，具体过程将在本文后面讨论。
- Eval 函数执行上下文： 运行在 eval 函数中的代码也获得了自己的执行上下文（不常用）

### 执行上下文创建和执行：

当一段 JavaScript 代码执行的时候，JavaScript 解释器会创建 Execution Context，其实这里会有两个阶段：

- 创建阶段（当函数被调用，但是开始执行函数内部代码之前）
  - 创建 Scope chain
  - 创建 VO/AO（variables, functions and arguments）
  - 设置 this 的值

* 激活/代码执行阶段
  - 设置变量的值、函数的引用，然后解释/执行代码

![](/img/blog/26/3.png)

### 执行上下文栈

JavaScript 引擎创建了执行上下文栈（Execution context stack，ECS）来管理执行上下文
当 JavaScript 引擎首次读取你的脚本时，它会创建一个全局执行上下文并将其推入当前的执行栈。每当发生一个函数调用，引擎都会为该函数创建一个新的执行上下文并将其推到当前执行栈的顶端。
引擎会运行执行上下文在执行栈顶端的函数，当此函数运行完成后，其对应的执行上下文将会从执行栈中弹出，上下文控制权将移到当前执行栈的下一个执行上下文。

```
let a = 'Hello World!';

function first() {
  console.log('Inside first function');
  second();
  console.log('Again inside first function');
}

function second() {
  console.log('Inside second function');
}

first();
console.log('Inside Global Execution Context');
```

![](/img/blog/26/1.png)

1. 浏览器中加载时，JavaScript 引擎会创建一个全局执行上下文并且将它推入当前的执行栈。
2. 当调用 first() 函数时，JavaScript 引擎为该函数创建了一个新的执行上下文并将其推到当前执行栈的顶端。
3. 当在 first() 函数中调用 second() 函数时，创建了一个新的执行上下文并将其推到当前执行栈的顶端。
4. 当 second() 函数执行完成后，它的执行上下文从当前执行栈中弹出，上下文控制权将移到当前执行栈的下一个执行上下文，即 first() 函数的执行上下文。
5. 当 first() 函数执行完成后，它的执行上下文从当前执行栈中弹出，上下文控制权将移到全局执行上下文。
   一旦所有代码执行完毕，Javascript 引擎把全局执行上下文从执行栈中移除。

```
// 伪代码

ECStack = [
    globalContext
];

// first()
ECStack.push(<first> functionContext);

// fun1中竟然调用了fun2，还要创建fun2的执行上下文
ECStack.push(<second> functionContext);


// second()执行完毕
ECStack.pop(second);

// first()执行完毕
ECStack.pop(first);


// 当整个应用程序结束的时候，ECStack 才会被清空，所以程序结束之前， ECStack 最底部永远有个 globalContext：
```

## 变量对象

### 什么是变量对象

- 变量对象是与执行上下文相关的数据作用域，存储了在上下文中定义的变量和函数声明。

### 什么是全局对象

- 全局对象是预定义的对象，作为 JavaScript 的全局函数和全局属性的占位符。通过使用全局对象，可以访问所有其他所有预定义的对象、函数和属性。
- 在顶层 JavaScript 代码中，可以用关键字 this 引用全局对象。因为全局对象是作用域链的头，这意味着所有非限定性的变量和函数名都会作为该对象的属性来查询。
- 例如，当 JavaScript 代码引用 parseInt() 函数时，它引用的是全局对象的 parseInt 属性。全局对象是作用域链的头，还意味着在顶层 JavaScript 代码中声明的所有变量都将成为全局对象的属性。
- 可以通过 this 引用，在客户端 JavaScript 中，全局对象就是 Window 对象。

```
console.log(this);// this 引用，在客户端 JavaScript 中，全局对象就是 Window 对象。

console.log(this instanceof Object);//全局对象是由 Object 构造函数实例化的一个对象。

console.log(Math.random());//.预定义了一堆，嗯，一大堆函数和属性。
console.log(this.Math.random());

var a = 1;//作为全局变量的宿主。
console.log(this.a);
```

## 函数上下文

在函数上下文中，我们用活动对象(activation object, AO)来表示变量对象。
变量对象 VO 和活动对象 AO 是同一个对象在不同阶段的表现形式。当进入执行环境的创捷阶段时，变量对象被创建，这时变量对象的属性无法被访问。进入执行阶段后，变量对象被激活变成活动对象，此时活动对象的属性可以被访问。

## 函数执行过程

### 进入函数执行上下文创建阶段

当进入执行上下文时，这时候还没有执行代码，在这个阶段中，执行上下文会分别创建变量对象，建立作用域链，以及确定 this 的指向。
变量对象会包括：

1. 函数的所有形参 (如果是函数上下文)
2. 函数声明
3. 变量声明

```
function foo(a) {
  var b = 2;
  var c=3;
  function c() {}
  var d = function() {};

  b = 3;

}

foo(1);
```

创建阶段 JavaScript 解释器主要做了下面的事情：

- 根据函数参数，创建并初始化 arguments 对象，及形参属性
- 函数的所有形参由名称和对应值组成的一个变量对象的属性被创建
- 检查上下文中的函数声明
  - 将函数名作为变量对象的属性，函数引用作为值。
  - 如果该函数名在变量对象中已存在，则覆盖已存在的函数引用。
- 检查上下文的变量声明
  - 将变量名作为变量对象的属性，值设置为 undefined。
  - 如果该变量名在变量对象中已存在，为防止与函数名冲突，则跳过，不进行任何操作。

```
VO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,//注意a已经初始化了
    b: undefined,
    c: reference to function c(){},//如果重名后跳过了变量var c=3，只有函数c
    d: undefined
}
```

### 进入函数执行上下文代码执行阶段

上下文创建完成之后，就会开始执行代码，这个时候，会完成变量赋值，函数引用，以及执行其他代码。
注意：在创建阶段函数的变量的值就是函数引用，在这个阶段就被同名的变量又重新赋值了

```
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: 3,
    c: 3,//执行阶段c又会重新被赋值
    d: reference to FunctionExpression "d"
}
```

### 函数提升和变量提升实例

这就是常说的什么函数声明提升优先于变量声明提升
提升只是说法，其本质就是执行执行上下文的创建和执行产生的影响

```
function test(arg){
  console.log(arg);  // function arg(){console.log('hello world') }
  var arg = 'hello';
  function arg(){
    console.log('hello world')
  }
  console.log(arg); // hello
}
test('hi');

```

第一个 console.log 有值因为函数在上下文创建的时候就已经给了函数引用作为值，
而变量这是先给的 undefined 作为初值，
在代码执行阶段变量又会重新赋值，同名变量 hello 覆盖了函数

### 注意一些if语句的块级作用域

如上的分析，JavaScript引擎首先会扫描所有的变量声明，然后将这些变量声明移动到顶部，if内部也不例外，如果按照下面这么写很有可能出BUG，因为`"a" in window`是true，a先被扫描注册到了全局
```
// 不会进入if语句
if(!("a" in window)){
    var a = 10;
    console.log(123)
}
console.log(a); // undefined
```
这时候有两种改进写法，一种是直接用let a = 10,还可以

```
if(window.a==undefined){
    var a = 10;
    console.log(123)
}
console.log(a); // 10
```

### 上下文总结

全局上下文的变量对象初始化是全局对象

函数上下文创建阶段函数先注册重名覆盖，变量后注册重名跳过

函数上下文的变量对象初始化只包括 Arguments 对象

在进入执行上下文时会给变量对象添加形参、函数声明、变量声明等初始的属性值,也就是初始化变量对象

在代码执行阶段，会再次修改变量对象的属性值（这时函数就不会重新赋值了）

## 作用域链

### 什么是作用域链

#### 定义

作用域链，是由当前环境与上层环境的一系列变量对象组成，它保证了当前执行环境对符合访问权限的变量和函数的有序访问。

#### 形成

上文的作用域中讲到过函数的作用域在函数定义的时候就决定了，因为函数有一个内部属性 [[scope]]，当函数创建的时候，就会保存所有父变量对象到其中，当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从自己的 scope 中保存的父级(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做作用域链。

### 区分作用域与作用域链

#### 作用域

在 JavaScript 中，我们可以将作用域定义为一套规则,这套规则用来管理引擎如何在当前作用域以及嵌套的子作用域中根据标识符名称进行变量查找。

#### 两者的区别

- 作用域是一套规则，那么作用域链是什么呢？是这套规则的具体实现。
- 作用域规则在代码编译阶段就确定了，而作用域链是在执行上下文的创建阶段生成的

### 举个例子

```
var a = 20;

function test() {
    var b = 10;
   //function innerTest() {
   //     var c = 10;
   //     return b + c;
   //}
    return b;
}

test();
```

执行过程
1.test 函数在全局上下文中被创建，保存全局上下文的变量对象组成的作用域链到内部属性[[scope]]

```
test.[[scope]] = [
    globalContext.VO
];
```

2.创建 test 函数执行上下文，test 函数执行上下文被压入执行上下文栈

```
ECStack = [
    testContext,
    globalContext
];
```

3.test 函数并不立刻执行，开始做准备工作，第一步：复制[[scope]]属性到函数上下文，创建了作用域链

```
testContext = {
    Scope: testscope.[[scope]],
}
```

4.第二步：用 arguments 创建活动对象，随后初始化活动对象，加入形参、函数声明、变量声明

```
testscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        b: undefined
    }，
    Scope: testscope.[[scope]],
}
```

5.第三步：将活动对象压入 testscope 作用域链顶端

```
testscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        b: undefined
    },
    Scope: [AO, [[Scope]]]//用Scope简写testscope.[[scope]]
}
```

6.准备工作做完，开始执行函数，随着函数的执行，修改 AO 的属性值

```
testscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        b: 10
    },
    Scope: [AO, [[Scope]]]
}
```

7.查找到 b 的值，返回后函数执行完毕，函数上下文从执行上下文栈中弹出

```
ECStack = [
    globalContext
];
```

8.如果 test 内部含有 innerTest 函数，则在该 innerTest 函数创建时将 test 上下文中的作用域链传入(testscopeContext.Scope)
然后后循环执行和 test 相同的步骤

```
var a = 20;

function test() {
    var b = 10;
   function innerTest() {
        var c = 10;
        return b + c;
   }
    return b;
}

test();
```

全局，函数 test，函数 innerTest 的执行上下文先后创建。我们设定他们的变量对象分别为 VO(global)，VO(test), VO(innerTest)。而 innerTest 的作用域链，则同时包含了这三个变量对象，所以 innerTest 的执行上下文可如下表示。

```
innerTestContext  = {
    AO: {...},  // 变量对象
    Scope: [VO(innerTest), VO(test), VO(global)], // 作用域链
}
```

![](/img/blog/26/4.png)

因为变量对象在执行上下文进入执行阶段时，就变成了活动对象，因此图中使用了 AO 来表示。Active Object
作用域链是由一系列变量对象组成，我们可以在这个单向通道中，查询变量对象中的标识符，这样就可以访问到上一层作用域中的变量了。

## 参考文章

- https://github.com/mqyqingfeng/Blog/issues/3
- https://www.jianshu.com/p/21a16d44f150
- https://juejin.im/post/5bdfd3e151882516c6432c32
