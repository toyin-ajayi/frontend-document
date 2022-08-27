## 什么是闭包

> 补充：闭包形成的本质是**内层作用域中堆地址暴露**，原因是局部作用域中访问了其他局部变量？闭包只是一个绑定了执行环境的函数仅此而已。

闭包 是指内部函数总是可以访问其所在的外部函数中声明的变量和参数，即使在其外部函数被返回（寿命终结）了之后。在某些编程语言中，这是不可能的，或者应该以特殊的方式编写函数来实现。但是如上所述，在 JavaScript 中，所有函数都是天生闭包的（只有一个例外，将在 "new Function" 语法 中讲到）。

也就是说：JavaScript 中的函数会自动通过隐藏的 [[Environment]] 属性记住创建它们的位置，所以它们都可以访问外部变量。

在面试时，前端开发者通常会被问到“什么是闭包？”，正确的回答应该是闭包的定义，并解释清楚为什么 JavaScript 中的所有函数都是闭包的，以及可能的关于 [[Environment]] 属性和词法环境原理的技术细节。


### 最原始定义

闭包(closure)，是指函数变量可以保存在函数作用域内，因此看起来是函数将变量“包裹”了起来。

```tsx
//根据定义，包含变量的函数就是闭包
function foo() {
    var a = 0;
}
cosole.log(a)
// Uncaught ReferenceError: a is not defined
```

### 《JavaScript 高级程序设计》对闭包定义

闭包是指有权访问另一个函数作用域中的变量的函数

```tsx
 //访问上层函数的作用域的内层函数就是闭包
function foo() {
    var a = 2;
    function bar() {
        console.log(a);
    }
    bar();
}
foo();
```

### 《JavaScript 权威指南》对闭包定义

函数对象可以通过作用域链相互关联起来，函数体内部变量可以保存在函数作用域内，这就是闭包。

```tsx
 var global = "global scope"; //全局变量
function checkscope() {
    var scope = "local scope"; //局部变量
    function f() {
        return scope; //在作用域中返回这个值
    };
    return f();
}
checkscope(); // 返回 "local scope"
```

### 《你不知道的 JavaScript》这样描述

当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行。

```tsx
//fn3就是fn2函数本身。执行fn3能正常输出name
//这不就是fn2能记住并访问它所在的词法作用域，而且fn2函数的运行还是在当前词法作用域之外了。
function fn1() {
	var name = 'iceman';
	function fn2() {
		console.log(name);
	}
	return fn2;
}
var fn3 = fn1();
fn3();
```

### MDN 上面这么说：

闭包是一种特殊的对象。它由两部分构成：函数，以及创建该函数的环境。环境由闭包创建时在作用域中的任何局部变量组成。
简单说就是指那些能够访问自由变量的函数。

### 严格来说，闭包需要满足三个条件：

【1】访问所在作用域；
【2】函数嵌套；
【3】在所在作用域外被调用

## 闭包的形成原理

### 先了解 JavaScript 的垃圾回收机制

Javascript 会找出不再使用的变量，不再使用意味着这个变量生命周期的结束。
Javascript 中存在两种变量——全局变量和局部变量，全部变量的声明周期会一直持续，直到页面卸载而局部变量声明在函数中，它的声明周期从执行函数开始，直到函数执行结束。在这个过程中，局部变量会在堆或栈上被分配相应的空间以存储它们的值，函数执行结束，这些局部变量也不再被使用，它们所占用的空间也就被释放。
但是有一种情况的局部变量不会随着函数的结束而被回收，那就是局部变量被函数外部的变量所使用，其中一种情况就是闭包，因为在函数执行结束后，函数外部的变量依然指向函数内的局部变量，此时的局部变量依然在被使用，所以也就不能够被回收

```tsx
var scope = 'global scope';
function checkScope() {
    var scope = 'local scope';
    return function() {
        console.log(scope);
    }
}

var result = checkScope();
result();   // local scope checkScope变量对象中的scope,非全局变量scope
```

此匿名函数的作用域链包括 checkScope 的活动对象和全局变量对象, 当 checkScope 函数执行完毕后,checkScope 的活动对象并不会被销毁,因为匿名函数的作用域链还在引用 checkScope 的活动对象,也就是 checkScope 的执行环境被销毁,但是其活动对象没有被销毁,留存在堆内存中,直到匿名函数销毁后,checkScope 的活动对象才会销毁

### 从作用域链理解闭包的形成

1. 从理论角度：所有的函数。因为它们都在创建的时候就将上层上下文的数据保存起来了。哪怕是简单的全局变量也是如此，因为函数中访问全局变量就相当于是在访问自由变量，这个时候使用最外层的作用域。
2. 从实践角度：以下函数才算是闭包：
   i. 即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）
   ii. 在代码中引用了自由变量

```tsx
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}

var foo = checkscope();
foo();

fContext = {//f函数的执行上下文
    Scope: [AO, checkscopeContext.AO, globalContext.VO],
}


```

对的，就是因为这个作用域链，f 函数在声明的时候压入了上层的变量对象，f 函数依然可以读取到 checkscopeContext.AO 的值，并且如果当 f 函数引用了 checkscopeContext.AO 中的值的时候，即使 checkscopeContext 被销毁了，但是 JavaScript 依然会让 checkscopeContext.AO 活在内存中（和垃圾回收机制有关下文会说），f 函数依然可以通过 f 函数的作用域链找到它，正是因为 JavaScript 做到了这一点，从而实现了闭包这个概念。

## 如何释放闭包存储的变量
并且根据垃圾回收机制，被另一个作用域引用的变量不会被回收。
所以，除非内部的匿名函数解除对活动变量的引用（解除对匿名函数的引用），才可以释放内存。

```tsx
// 简写了上面的代码
var foo = checkscope();
foo();
foo = null
```

## 闭包的作用-模仿块级作用域，封装私有变量

> 任何在函数中定义的变量，都可以认为是私有变量，因为不能在函数外部访问这些变量。
> 私有变量包括函数的参数、局部变量和函数内定义的其他函数。

```tsx
function module() {
	var arr = [];
	function add(val) {
		if (typeof val == 'number') {
			arr.push(val);
		}
	}
	function get(index) {
		if (index < arr.length) {
			return arr[index]
		} else {
			return null;
		}
	}
	return {
		add: add,
		get: get
	}
}
var mod1 = module();
mod1.add(1);
mod1.add(2);
mod1.add('xxx');
console.log(mod1.get(2));//外部是无法直接拿到arr的只能通过get来拿
```

## 闭包的作用-使变量保存在内存中不被销毁

### 实例 1-计数器

我们来实现一个计数器，每调用一次计数器返回值加一：

```tsx
var counter = 0;
function add() {
   return counter += 1;
}
add();
add();
add();// 计数器现在为 3

```

问题：

- 全局变量容易被其他代码改变
- 如果我需要同时用两个计数器，但这种写法只能满足一个使用，另一个还想用的话就要再写个 counter2 函数，再定义一个 counter2 的全局变量。
  那我们把 counter 放在 add 函数里面不就好了么？

```tsx
function add() {
    var counter = 0;
    return counter += 1;
}
add();
add();
add();// 本意是想输出 3, 但输出的都是 1

```

所以这样做的话，每次调用 add 函数，counter 的值都要被初始化为 0，还是达不到我们的目的。

使用闭包来写就会解决这些问题

```tsx
function add() {
    var index = 1;
    function counter() {
        return index ++;
    }
    return counter;
}

// test
var addA = add() ;
var addB = add() ;
addA();        // 1
addA();        // 2
addB();        // 1
addB();        // 2
```

### 实例 2-延时打印

这样打印出来的全部都是 10，原因是 for 循环是同步的会在延时 1000 毫秒的过程中一直执行
等 function 执行的时候变量 i 指向的是同一个内存地址，且值已经变成的 10

```tsx
for (var i = 1; i <= 10; i++) {
	setTimeout(function () {
		console.log(i);
	}, 1000);
}
```

改进，用自执行的函数创建简单的闭包，让每一次 for 循环的 i 都在不同的内存地址中且不被销毁

```tsx
for (var i = 1; i <= 10; i++) {
	(function () {
		var j = i;
		setTimeout(function () {
			console.log(j);
		}, 1000);
	})();
}

```

错误写法：

```tsx
    for (var i = 1; i <= 10; i++) {
    (function () {
        setTimeout(function () {
        // 这样虽然也是闭包，但没有缓存i的值到作用域
        // 导致1000ms到时，然后还是去外层作用域链找i的值，已经变成了11
            console.log(i);
        }, 1000);
    })();
}
```

优化写法：

```tsx
for (var i = 1; i <= 10; i++) {
	(function (j) {
		setTimeout(function () {
			console.log(j);
		}, 1000);
	})(i);
}
```

ES6 写法：

```tsx
for (let i = 1; i <= 10; i++) {
	setTimeout(function () {
		console.log(i);
	}, 1000);
}
```

for 循环里面用 let，（）会生成一个隐藏作用域，产生多个不同的块级作用域，类似于闭包,如下：

```tsx
// 伪代码
(let i = 0) {
	setTimeout(function () {
		console.log(i);
	}, 1000);
}

(let i = 1) {
	setTimeout(function () {
		console.log(i);
	}, 1000);
}

(let i = 2) {
	setTimeout(function () {
		console.log(i);
	}, 1000);
};
......
......

```

## 联系 Static 静态变量

闭包的作用主要就是让变量的值始终保持在内存中。
C++或 C 语言还有 Java 中都有 static 静态变量也是让变量始终保存在内存中。
这样来看好像闭包好像有点 static 静态变量的意思。

## 总结

闭包就是子函数可以有权访问父函数的变量、父函数的父函数的变量、一直到全局变量。
归根结底,就是利用 js 得词法(静态)作用域,即作用域链在函数创建的时候就确定了。
子函数如果不被销毁,整条作用域链上的变量仍然保存在内存中,这样就形成了闭包
