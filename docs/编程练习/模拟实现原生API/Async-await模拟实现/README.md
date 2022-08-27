## Async/ await
>async 函数是Generator 函数的语法糖，是对Generator做了进一步的封装。


### Generator调用方式

Generator 函数的调用方法与普通函数一样，也是在函数名后面加上一对圆括号。不同的是，调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是上一章介绍的遍历器对象（Iterator Object）。
下一步，必须调用遍历器对象的next方法，使得指针移向下一个状态。也就是说，每次调用next方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个yield表达式（或return语句）为止。换言之，Generator 函数是分段执行的，yield表达式是暂停执行的标记，而next方法可以恢复执行。


### Generator的yield如何返回值

yield表达式本身没有返回值，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值。

可以在 Generator 函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。
当next方法带一个参数时，yield前面的变量就被重置为这个参数.

由于next方法的参数表示上一个yield表达式的返回值，所以在第一次使用next方法时，传递参数是无效的。

```tsx
function* foo() {
  var index = 0;
  var index2 = 1;
  console.log("begin");
  index = yield index + 1;
  console.log("index", index);
  index2 = yield index2 + 1;
  console.log("index2", index2);
}
// 返回的其实是一个迭代器，不会立即执行函数里面的内容
// 调用一个next后才开始执行函数,如果有yield 会执行到yield时停下，如果内部没有yield 会执行完函数
var bar = foo();

// 只有调用next才会继续执行，返回一个对象，然后到达下一个yield时停下
console.log(bar.next()); // { value: 1, done: false }
console.log(bar.next(2)); // { value: 2, done: false }
console.log(bar.next(3)); // { value: undefined, done: true }
```
```tsx
begin
Object {value: 1, done: false}
index 2 // 这里的2是bar.next(2)传入的2，并不是index+1的，因为index+1是明显结果是1
Object {value: 2, done: false}
index2 3
Object {value: undefined, done: true}
```

在生成器（Generator）中，return语句的作用是为最后一个.next()函数调用设置value值。
```tsx
function* generator() {
  yield 1;
  return 2;
}

let it = generator();
console.log(it.next()); // {value: 1, done: false}
console.log(it.next()); // {value: 2, done: true}
```


### 了解Co

一步一步去调用next这样也会很麻烦，这时我们可以引入co来帮我们控制
Co是一个为Node.js和浏览器打造的基于生成器的流程控制工具，借助于Promise，你可以使用更加优雅的方式编写非阻塞代码。
Co 函数库约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，而 async 函数的 await 命令后面，可以跟 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）。
说白了就是帮你自动执行你的Generator不用手动调用next

我们可以简单模拟下Co，当然async是基于Co模式的，里面还添加了报错等
```tsx
function co(it) {
    return new Promise(function (resolve, reject) {
        function step(d) {
            let { value, done } = it.next(d);
            if (!done) {
                value.then(function (data) { // 2,txt
                    step(data)
                }, reject)
            } else {
                resolve(value);
            }
        }
        step();
    });
}
```

### async函数对 Generator 函数的改进

- 1.内置执行器。Generator 函数的执行必须依靠执行器，而 async 函数自带执行器，无需手动执行 next() 方法。
- 2.更好的语义。async和await，比起星号和yield，语义更清楚了。async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果。
- 3.更广的适用性。co模块约定，yield命令后面只能是 Thunk 函数或 Promise 对象，而async函数的await命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）。
- 4.返回值是 Promise。async 函数返回值是 Promise 对象，比 Generator 函数返回的 Iterator 对象方便，可以直接使用 then() 方法进行调用。

### Async函数的特性

- 当这个 async 函数返回一个值时，Promise 的 resolve 方法会负责传递这个值；
- 当 async 函数抛出异常时，Promise 的 reject 方法也会传递这个异常值。
- async 函数中可能会有 await 表达式，这会使 async 函数暂停执行，等待 Promise 的结果出来，然后恢复async函数的执行并返回解析（resolved）。

重点：async函数会被一个Promise包裹，async返回的值会由这个Promise来resolve

### Async内部错误可以被捕获
>Promise的错误是不能被捕获的

```tsx
let last;
async function throwError() {  
    await Promise.reject('error');//这里就是异常    
    last = await '没有执行'; 
}
throwError().then(success => console.log('成功', success,last))
            .catch(error => console.log('失败',error,last))
```
![](/img/blog/JavaScript异步编程/1.png)

上面函数，执行的到`await`排除一个错误后，就停止往下执行，导致`last`没有赋值报错。
`async`里如果有多个await函数的时候，如果其中任一一个抛出异常或者报错了，都会导致函数停止执行，直接`reject`;
怎么处理呢，可以用`try/catch`，遇到函数的时候，可以将错误抛出，并且继续往下执行。
```tsx
let last;
async function throwError() {  
    try{  
       await Promise.reject('error');    
       last = await '没有执行'; 
    }catch(error){
        console.log('has Error stop');
    }
}
throwError().then(success => console.log('成功', last))
            .catch(error => console.log('失败',last))

```
![](/img/blog/JavaScript异步编程/2.png)



### Co模式+Promise+Generator实现Async

spawn函数是重点，他有以下几个重要功能：

- 自动执行Generator返回的迭代器（递归实现）
- 解决yield本身并无返回值的问题（给next传参实现）
- 解析yield后面的普通值或者是promise（Promise.resolve+then解析）
- 使asyncFn返回的值变成一个Promise对象，并resolve最后的返回值
- 捕获迭代器执行的异常情况,try catch 迭代器每一项的执行，如果报错直接reject，外层Promise直接返回，终止了递归，整个async函数终止，返回reject状态的Promise

```tsx
function spawn(genF) {
    //spawn函数就是自动执行器，跟简单版的思路是一样的，多了Promise和容错处理
    return new Promise(function(resolve, reject) {
      const gen = genF();
      function step(nextF) {
        let next;
        try {
          next = nextF();
        } catch (e) {
          return reject(e);
        }
        if (next.done) {
          return resolve(next.value);// 最后一个yield（undefined）或者return的值
        }
        // 没有结束就要用then来解析出值
        // 将所有值promise化（如果next.value是promise直接返回这个promise）
        // 然后用.then的回调就可以解析到上层promise resolve的值(这就是为什么await可以解析promise值的原因，底层是通过then来获取的)
        Promise.resolve(next.value).then(
          // 在then里面递归调用step就实现了为什么只有上面的await解析到了promise的resolve才会往下执行
          function(v) {
            step(function() {
              // v是解析到的上一次next调用返回的值，这里把参数带给上一次的yield
              return gen.next(v);
            });
          },
          function(e) {
            step(function() {
              return gen.throw(e);
            });
          }
        );
      }
      step(function() {
        // 第一次调用无需带给yield返回值 因为没有上一次yield
        return gen.next(undefined);
      });
    });
  }
  

function asyncFn(args) {
  return spawn(function*() {
        let a = yield 1
        console.log(a) //1
        let b = yield Promise.resolve('resolve的Promise')
        console.log(b)
        return 'return的值应该用Promise来resolve'
  });
}

function asyncFn2(){
  return spawn(function*() {
    // 解析asyncFn()返回的值（默认要被promise包裹）
    let a = yield asyncFn()
    console.log(a)// return的值应该用Promise来resolve
});
}
asyncFn2()
```

为什么await会等到后面的promise在resolve后才往下执行，因为可以看出整个代码是在Generator里执行,Generator不会主动执行,，所以在.then里调用了gen.next(v)，才会往下走。感觉就像是把Promise的链式调用通过Generator和递归美化成了更加接近同步的写法。

为什么可以从外部捕获await后面的错误？ 因为await出错无非就是Promise.reject，然后调用这个回调函数
```tsx
 function(e) {
            step(function() {
              return gen.throw(e);
            });
          }
```
但是我们再外部try catch了 这个gen抛出的错误就不会被内部判断错误的程序中断,也就是这里感知不到我们gen.throw(e)，因为已经被catch了
```tsx
function step(nextF) {
        let next;
        try {
          next = nextF();
        } catch (e) {
          return reject(e);
        }
}
```
