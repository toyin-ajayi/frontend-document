## js 中的错误类型

执行代码期间可能会发生的错误有多种类型。每种错误都有对应的错误类型，而当错误发生时，就 会抛出相应类型的错误对象。
javascript 规范中总共有 8 中错误类型构造函数：

- Error -- 错误对象
- SyntaxError --解析过程语法错误
- TypeError -- 不属于有效类型
- ReferenceError -- 无效引用
- RangeError -- 数值超出有效范围
- URIError -- 解析 URI 编码出错
- EvalError -- 调用 eval 函数错误
- InternalError -- Javascript 引擎内部错误的异常抛出， "递归太多"(非标准方法生产环境禁用)

## Error 类

Error 是错误的基类，其他类型都继承 Error 这个类，可以使用 ES6 中提供的 Object.getPrototypeOf()来判断，一个类是否继承了另一个类。

```tsx
console.log(Object.getPrototypeOf(SyntaxError) === Error);    // true
console.log(Object.getPrototypeOf(TypeError) === Error);   // true
console.log(Object.getPrototypeOf(ReferenceError) === Error);   // true
console.log(Object.getPrototypeOf(RangeError) === Error);   // true
console.log(Object.getPrototypeOf(URIError) === Error);   // true
console.log(Object.getPrototypeOf(EvalError) === Error);   // true
```

## 抛出错误

```tsx
throw new Error('这里抛出的是错误信息')
```

比如我们函数的参数没传对就可以判断：

```tsx
  if (typeof xxx !== "xxx") {
    throw new TypeError("Error");// 抛出指定的错误
  }
```

## 捕获错误

抛出错误代码不会向下执行，如果我们想要代码继续执行，就需要捕获这个错误。
在 try…catch 中，try 中一旦出现错误则其他语句不能执行，如果不出现错误则 catch 中的语句不会执行。
Javascript 参考其他编程语言，也提供了一种 finally 语句：不管 try 中的语句有没有错误，在最后都会执行 finally 中的语句。

```tsx
try{
    throw new Error('这里抛出的是错误信息')
    alert('这里不会执行')
}catch(err){
    alert(err.name + ' '+ err.message)
}finally{
    alert('这里始终会执行')
}
```

## 自定义错误类型

需要自定义一个构造函数，然后让原型继承继承 Error.prototype 即可。

```tsx
function MyErrorType(message){
    this.message = message || '错误';
    this.name = 'MyErrorType';
    this.stack = (new Error()).stack;  // 错误位置和调用栈
}

MyErrorType.prototype = Object.create(Error.prototype);
MyErrorType.prototype.constructor = MyErrorType;

throw new MyErrorType('自定义错误类型抛出错误')
```

## 异步错误无法抛出

### setTimeout

```tsx
  try{
    setTimeout( () => {
        console.log(2)
        throw new Error('bye');//这里不行
    }, 2000);
  }catch(e){
      console.log('catch2',e);
  }
```

### Promise

网上说 Promise.reject 是异步的所以无法捕获，但我感觉 Promise.reject 是静态方法，他的执行是同步啊。

自己的理解：Promise.reject 只是 Promise 的方法而已，其内部并没有显式的 throw Error 啊，肯定不能抛出

```tsx
function f2() {
    Promise.reject('出错了1');//UnhandledPromiseRejectionWarning
    try {

      Promise.reject('出错了2');//UnhandledPromiseRejectionWarning
      console.log('error')
    } catch(e) {
      console.log('catch',e)
    }
    console.log(1231)
  }
```

### Async

这里有可以抛出错误原因是 async 底层是递归调用 Generator 返回的迭代器，如果有错误或触发 then 的 reject 回调，然后在 reject 回调里

```tsx
async function f() {
  try {
    await Promise.reject('出错了')
  } catch(e) {
    console.log(e)
  }
}
```

ASync 部分模拟的源码：调用生成器接口，gen.throw(e);显式抛出错误,
gen是外层变量个人猜测gen抛错会直接抛出到外层的try catch，所以ASYNC外面可以捕获错误。
如果外面没有try catch，那么会被内部try catch捕捉到，并且执行reject方法，然后接受代码执行，返回onRejected状态的Promise，注意是spawn函数的返回，也就是说spawn函数中间有一个reject状态的promise下面的代码就不会执行了

```tsx
// spawn(CO)自动执行时

const gen = genF();
      function step(nextF) {
        let next;
        try {
          next = nextF();
        } catch (e) {
          return reject(e);
        }
      ····
      ····

      }
        Promise.resolve(next.value).then(
          function(v) {
            step(function() {
              return gen.next(v);
            });
          },
          function(e) {
            step(function() {
              return gen.throw(e);
            });
          }
        );
```
