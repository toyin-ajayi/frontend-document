
class myPromise {
  constructor(executor) {
    // 首先一个promise默认是pending状态
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;

    // 可看test.js里，真正的promise可以同时注册多个.then回调
    // 所以这里用数组来存储，最后遍历执行，类似于发布订阅
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    // 实例不调用的方法全部放到constructor里
    let resolve = value => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.onResolvedCallbacks.forEach(fn=>fn());
      }
    };
    let reject = reason => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn=>fn());
      }
    };

    // promise 会接受一个函数然后调用它
    // 如果executor执行报错，直接执行reject
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then = (onFulfilled, onRejected) => {
    if (this.state === "fulfilled") {
      onFulfilled(this.value);
    }
    if (this.state === "rejected") {
      onRejected(this.reason);
    }
     // 如果状态state为pending时，就表明是传入的executor中有异步方法，推迟了resolve或者reject的执行
     // 这时应该把回调方法缓存起来
     if (this.state === 'pending') {
       // 注意推入的时候套了一层箭头函数，不然就直接执行了
      this.onResolvedCallbacks.push(()=>{
        onFulfilled(this.value);
      })
      this.onRejectedCallbacks.push(()=>{
        onRejected(this.reason);
      })
    }
  };
}

const myPro1 = new myPromise(resolve => {
  setTimeout(() => {
    resolve(123);
  }, 2000);
}).then(val => console.log('2ms后打印的',val));


// 有个小问题 then回调如果直接注册是同步任务，234会先打出来
// 而真实的promise是先执行'同步任务应该先执行'

const myPro2 = new myPromise(resolve => {
  resolve(234);
}).then(val => console.log(val));
console.log('同步任务应该先执行')
