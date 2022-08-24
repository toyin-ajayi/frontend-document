#### ['1', '2', '3'].map(parseInt)返回的啥

<details><summary><b>答案</b></summary>
<p>

// 1, NaN, NaN
parseInt() 函数解析一个字符串参数，并返回一个指定基数的整数 (数学系统的基础)。
parseInt('1', 0) //radix 为 0 时，且 string 参数不以“0x”和“0”开头时，按照 10 为基数处理。这个时候返回 1
parseInt('2', 1) //基数为 1（1 进制）表示的数中，最大值小于 2，所以无法解析，返回 NaN
parseInt('3', 2) //基数为 2（2 进制）表示的数中，最大值小于 3，所以无法解析，返回 NaN

</p>
</details>


#### 有了上道题的基础这个有输出什么

```
['10','10','10','10','10'].map(parseInt)
```

<details><summary><b>答案</b></summary>
<p>
[10, NaN, 2, 3, 4]

10 在二进制三进制四进制的情况下分布代表 2、3、4

</p>
</details>

#### 输出什么

```
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)
```

<details><summary><b>答案</b></summary>
<p>

- 输出 1
- 解释：.then 或者 .catch 的参数期望是函数，传入非函数则会发生值穿透。

</p>
</details>

#### 输出什么

```
new Promise((r, e) => {
  e('123')
})
  .then(
    function success(res) {
      throw new Error("error");
    },
    function fail1(e) {
      console.error("fail1: ", e);
    }
  )
  .catch(function fail2(e) {
    console.error("fail2: ", e);
  });

```

<details><summary><b>答案</b></summary>
<p>

- 输出 fail1: 123
- 解释：错误被 then 的第二个参数捕获，promise 的状态会变为 fulfilled，不会执行 catch 回调

</p>
</details>

#### 1. 输出什么

```
async function async1() {
  console.log("async1 start");
    // 这里也是放入下一次微任务？ 因为执行async2 拿到的是一个Promise，而CO内部需要用.then来获取resolve的值
  await async2();

  console.log("async1 end");
}

async function async2() {
  console.log("async2");
}

async1()
console.log('start')
Promise.resolve().then(()=>console.log(123))

```

<details><summary><b>答案</b></summary>
<p>
async1 start->
async2->
start->
async1 end->
123
</p>
</details>

---

#### 2. 代码输出什么

```
const myPromise = () =>
  Promise.resolve('I have resolved')

const firstFunc = () => {
    myPromise().then((res) => {
      console.log(res + ' first');
    });
    console.log('first');
}
async function secondFunc() {
  // await后面的会用 Promise.resolve来包裹 然后在.then拿到值
  // 相当于执行到await退出async函数的执行线程
    console.log(await myPromise());
    //console.log(await 1111);顺序一样
    console.log('second');
}
firstFunc();
secondFunc();

```

解析

```
await xxx
// await 下面的代码
doB()

// 相当于
new Promise(resolve => {
  // 创建 promise 实例的时候，放的是 await 前面的代码
  // await 后面的表达式相当于 resolve(xxx)
  resolve(xxx)
}).then(data => {
  // await 下面的代码
  doB()
})
```

<details><summary><b>答案</b></summary>
<p>

错误：first->'I have resolved'->second->'I have resolved first'
secondFunc()生成自动执行器后，会往下执行，取出第一个微任务
正确： first->'I have resolved first' ->'I have resolved'->second

</p>
</details>

---

#### 3. 一道面试题

```
async function async1() {
 console.log('async1 start');

 await async2();

 console.log('async1 end');
}

async function async2() {
 console.log('async2');
}

console.log('script start');

setTimeout(() => {
 console.log('setTimeout');
}, 0);

async1();

new Promise((resolve) => {
 console.log('promise1');
 resolve();
})
 .then(() => {
   console.log('promise2');
 });

console.log('script end');

```

<details><summary><b>答案</b></summary>
<p>

script start->async1 start->async2->promise1->script end->async1 end->promise2->timeOut
**不同环境可能 promise2 位置可能不同，因为新版的 V8 采用了激进优化**

</p>
</details>

---

#### 4. 下面代码的输出是什么?

```
let a = 3;
let b = new Number(3);
let c = 3;

console.log(a == b);
console.log(a === b);
console.log(b === c);

```

<details><summary><b>答案</b></summary>
<p>

`new Number()` 是一个内建的函数构造器。虽然它看着像是一个 number，但它实际上并不是一个真实的 number：它有一堆额外的功能并且它是一个对象。

当我们使用 `==` 操作符时，它只会检查两者是否拥有相同的*值*。因为它们的值都是 `3`，因此返回 `true`。

然后，当我们使用 `===` 操作符时，两者的值以及*类型*都应该是相同的。`new Number()` 是一个对象而不是 number，因此返回 `false`。

</p>
</details>

---

#### 8. 输出是什么？

```javascript
class Chameleon {
  static colorChange(newColor) {
    this.newColor = newColor;
    return this.newColor;
  }

  constructor({ newColor = "green" } = {}) {
    this.newColor = newColor;
  }
}

const freddie = new Chameleon({ newColor: "purple" });
freddie.colorChange("orange");
```

- A: `orange`
- B: `purple`
- C: `green`
- D: `TypeError`

<details><summary><b>答案</b></summary>
<p>

#### 答案: D

`colorChange` 是一个静态方法。静态方法被设计为只能被创建它们的构造器使用（也就是 `Chameleon`），并且不能传递给实例。因为 `freddie` 是一个实例，静态方法不能被实例使用，因此抛出了 `TypeError` 错误。

</p>
</details>

---

#### 所有对象都有原型?

<details><summary><b>答案</b></summary>
<p>

#### 错误

基础对象没有
基础对象指原型链终点的对象。基础对象的原型是 null。

</p>
</details>

---

###### 17. 输出是什么？

```javascript
function getPersonInfo(one, two, three) {
  console.log(one);
  console.log(two);
  console.log(three);
}

const person = "Lydia";
const age = 21;

getPersonInfo`${person} is ${age} years old`;
```

- A: `"Lydia"` `21` `["", " is ", " years old"]`
- B: `["", " is ", " years old"]` `"Lydia"` `21`
- C: `"Lydia"` `["", " is ", " years old"]` `21`

<details><summary><b>答案</b></summary>
<p>

#### 答案: B

如果使用标记模板字面量，第一个参数的值总是包含字符串的数组。其余的参数获取的是传递的表达式的值！

</p>
</details>

---

##### 输出什么

```
var count = 0;

console.log(typeof count === "number");

console.log(!!typeof count === "number");

```

<details><summary><b>答案</b></summary>
<p>

第一个 true，第二个 false

- 这里涉及到就是优先级和布尔值的问题
- typeof count 就是字符串"number"
- !!是转为布尔值(三目运算符的变种),非空字符串布尔值为 true
- 最后才=== 比较 , true === "number" , return false

</p>
</details>

##### 输出什么

```
// 全局执行的
if(!("a" in window)){
    var a = 10;
}
console.log(a);
```

<details><summary><b>答案</b></summary>
<p>

输出 undefined，根本不会进入 if 语句
JavaScript 引擎首先会扫描所有的变量声明，然后将这些变量声明移动到顶部，if 内部也不例外，如果按照下面这么写很有可能出 BUG，因为`"a" in window`是 true，a 先被扫描注册到了全局

</p>
</details>

##### 输出什么

```
// 变种题
(function(){
 var  x = c =  b = {a:1}
})()

console.log(x.a);
console.log(c,b)

```

<details><summary><b>答案</b></summary>
<p>

- 首先`x.a`会报错 error , x is not defined：外面拿不到函数内部的变量
- 排除报错后 打出{a: 1} {a: 1}：c 和 b 并不是被 var 声明的函数作用域变量，而是没有声明，直接被挂载到了全局

```
(function()
  var x; /* 局部变量,外部没法访问*/
  b = {a:1}; /* 全局变量,window.b被赋值, 外部可以访问到*/
  c = b // 同b变量一样被挂载到全局
  x = c;
})()
```

</p>
</details>

##### 输出什么

```
function foo(something){
  this.a = something;
}

var obj1 = {
  foo:foo
};

var obj2 = {};

obj1.foo(2)

console.log(obj1.a)

var  bar = new obj1.foo(4);
console.log(obj1.a);
console.log(bar.a);

```

<details><summary><b>答案</b></summary>
<p>

```
console.log(obj1.a) // 2 , 方法调用模式 改变this执行到调用对象

var  bar = new obj1.foo(4); // 这里产生了一个实例
console.log(obj1.a); // 2 // 不会被修改
console.log(bar.a); // 4;  new的绑定比隐式和显式绑定优先级更高
```

</p>
</details>

###### 29. 输出是什么？

```javascript
const a = {};
const b = { key: "b" };
const c = { key: "c" };

a[b] = 123;
a[c] = 456;

console.log(a[b]);
```

- A: `123`
- B: `456`
- C: `undefined`
- D: `ReferenceError`

<details><summary><b>答案</b></summary>
<p>

#### 答案: B

对象的键被自动转换为字符串。我们试图将一个对象 `b` 设置为对象 `a` 的键，且相应的值为 `123`。

然而，当字符串化一个对象时，它会变成 `"[object Object]"`。因此这里说的是，`a["[object Object]"] = 123`。然后，我们再一次做了同样的事情，`c` 是另外一个对象，这里也有隐式字符串化，于是，`a["[object Object]"] = 456`。

然后，我们打印 `a[b]`，也就是 `a["[object Object]"]`。之前刚设置为 `456`，因此返回的是 `456`。

</p>
</details>

---

###### 38. 输出是什么？

```javascript
(() => {
  let x, y;
  try {
    throw new Error();
  } catch (x) {
    (x = 1), (y = 2);
    console.log(x);
  }
  console.log(x);
  console.log(y);
})();
```

- A: `1` `undefined` `2`
- B: `undefined` `undefined` `undefined`
- C: `1` `1` `2`
- D: `1` `undefined` `undefined`

<details><summary><b>答案</b></summary>
<p>

#### 答案: A

`catch` 代码块接收参数 `x`。当我们传递参数时，这与之前定义的变量 `x` 不同 。这个 `x` 是属于 `catch` 块级作用域的。

然后，我们将块级作用域中的变量赋值为 `1`，同时也设置了变量 `y` 的值。现在，我们打印块级作用域中的变量 `x`，值为 `1`。

`catch` 块之外的变量 `x` 的值仍为 `undefined`， `y` 的值为 `2`。当我们在 `catch` 块之外执行 `console.log(x)` 时，返回 `undefined`，`y` 返回 `2`。

</p>
</details>

---

#### 输出什么?

```javascript
[1, 2, 3, 4].reduce((x, y) => console.log(x, y));
```

<details><summary><b>答案</b></summary>
<p>

1 2 and undefined 3 and undefined 4

reducer 函数还有一个可选参数 initialValue, 该参数将作为第一次调用回调函数时的第一个参数的值。如果没有提供 initialValue，则将使用数组中的第一个元素。
相当于从第二个元素开始遍历

</p>
</details>

---

###### 20. 输出是什么？

```javascript
function getAge() {
  "use strict";
  age = 21;
  console.log(age);
}

getAge();
```

- A: `21`
- B: `undefined`
- C: `ReferenceError`
- D: `TypeError`

<details><summary><b>答案</b></summary>
<p>

#### 答案: C

使用 `"use strict"`，你可以确保不会意外地声明全局变量。我们从来没有声明变量 `age`，因为我们使用 `"use strict"`，它将抛出一个引用错误。如果我们不使用 `"use strict"`，它就会工作，因为属性 `age` 会被添加到全局对象中了。

</p>
</details>

---

###### 24. 输出是什么？

```javascript
const obj = { 1: "a", 2: "b", 3: "c" };
const set = new Set([1, 2, 3, 4, 5]);

obj.hasOwnProperty("1");
obj.hasOwnProperty(1);
set.has("1");
set.has(1);
```

- A: `false` `true` `false` `true`
- B: `false` `true` `true` `true`
- C: `true` `true` `false` `true`
- D: `true` `true` `true` `true`

<details><summary><b>答案</b></summary>
<p>

#### 答案: C

所有对象的键（不包括 Symbol）在底层都是字符串，即使你自己没有将其作为字符串输入。这就是为什么 `obj.hasOwnProperty('1')` 也返回 `true`。

对于集合，它不是这样工作的。在我们的集合中没有 `'1'`：`set.has('1')` 返回 `false`。它有数字类型为 `1`，`set.has(1)` 返回 `true`。

</p>
</details>

---
