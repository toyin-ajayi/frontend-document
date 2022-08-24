## async/await中的某些诡异的执行顺序

```
async function async1() {
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}
    
async function async2() {
    console.log('async2')
}
    
async1();
    
new Promise((resolve) => {
    console.log(1)
    resolve()
}).then(() => {
    console.log(2)
}).then(() => {
    console.log(3)
}).then(() => {
    console.log(4)
})
```

上面这段代码以前chrome71执行的结果：

```
async1 start
async2
1
2
3
async1 end
4
```
现在执行的结果：
```
async1 start
async2
1
async1 end
2
3
4
```
不同执行结果的原因：
新版本的V8采用了激进优化，这原本是nodejs的一个bug，最后发现这个bug的激进优化竟然可以带来性能提升，所以采用了这个改进方案。

“激进优化”，是指`await v`在语义上将等价于`Promise.resolve(v)`，而不再是现在的`new Promise(resolve => resolve(v))`

## 老版的等价代码

```
function async1(){
  console.log('async1 start')
  return new Promise(resolve => resolve(async2()))
    .then(() => {
      console.log('async1 end')
    });
}
    
function async2(){
  console.log('async2');
  return Promise.resolve();
}
    
async1();
    
new Promise((resolve) => {
    console.log(1)
    resolve()
}).then(() => {
    console.log(2)
}).then(() => {
    console.log(3)
}).then(() => {
    console.log(4)
})
```
## resolve()的转化

### resolve 一个 thenable 对象

*   对于一个对象`o`，如果`o.then`是一个`function`，那么`o`就可以被称为`thenable`对象
*   “在 Promise 中 resolve 一个 thenable 对象”，需要先将 thenable 转化为 Promsie，然后立即调用 thenable 的 then 方法
*   并且**这个过程需要作为一个 job 加入微任务队列，以保证对 then 方法的解析发生在其他上下文代码的解析之后**

PromiseResolveThenableJob：浏览器对`new Promise(resolve => resolve(thenable))`的处理
Promise resolve 的是`async2()`，而`async2()`返回了一个状态为`<resolved>: undefined`的 Promsie，**Promise 是一个 thenable 对象**。

```
let thenable = {
  then(resolve, reject) {
    console.log('in thenable');
    resolve(100);
  }
};

new Promise((r) => {
  console.log('in p0');
  r(thenable);
})
.then(() => { console.log('thenable ok') })

new Promise((r) => {
  console.log('in p1');
  r();
})
.then(() => { console.log('1') })
.then(() => { console.log('2') })
.then(() => { console.log('3') })
.then(() => { console.log('4') });
```
结果：
```
in p0
in p1
in thenable
1
thenable ok
2
3
4
```
需要注意的是执行完第一个同步任务后注册了一个thenable里的微任务，
所以执行完所以同步任务后首先执行的是`in thenable`,推迟了一个时序

### resolve 一个 Promise 实例

- promise是一个thenable对象
- 创建一个 PromiseResolveThenableJob 去处理这个 Promise 实例，**这是一个微任务**。
- Promise 实例 内部resolve 又会注册这个promise的then方法到微任务

**额外创建了两个Job，表现上就是后续代码被推迟了2个时序**

所以thenable是promise的时候：
```
new Promise((resolve) => {
    resolve(thenable)
})
```
时序上等价于：
```
new Promise((resolve) => {
    Promise.resolve().then(() => {
        thenable.then(resolve)
    })
})
```
所以老版的最终代码可已转化为：

```
function async1(){
    console.log('async1 start');
    const p = async2();
    return new Promise((resolve) => {
        Promise.resolve().then(() => {
            p.then(resolve)
        })
    })
    .then(() => {
        console.log('async1 end')
    });
}
    
function async2(){
    console.log('async2');
    return Promise.resolve();
}
    
async1();
    
new Promise((resolve) => {
    console.log(1)
    resolve()
}).then(() => {
    console.log(2)
}).then(() => {
    console.log(3)
}).then(() => {
    console.log(4)
})

```

## 新版的等价代码
采用激进优化后是`await v`在语义上将等价于`Promise.resolve(v)`，而不再是现在的`new Promise(resolve => resolve(v))`
Promise.resolve(v)和new Promise(resolve => resolve(v))的区别：
- v如果是Promise，就不再会去跑一遍这个Promise,直接将返回这个 promise
题中的代码可做如下等价转换：
```
function async1(){
    console.log('async1 start');
    const p = async2();
    return Promise.resolve(p)// 这里直接返回p不做任何处理
        .then(() => {
            console.log('async1 end')
        });
}
function async2(){
    console.log('async2');
    return Promise.resolve();
}
async1();
new Promise((resolve) => {
    console.log(1)
    resolve()
}).then(() => {
    console.log(2)
}).then(() => {
    console.log(3)
}).then(() => {
    console.log(4)
})
```
```
async1 start
async2
1
async1 end
2
3
4
```

