class myPromise {
  constructor(executor) {
    // 首先一个promise默认是pending状态
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;

    // 实例不调用的方法全部放到constructor里
    let resolve = value => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
      }
    };
    let reject = reason => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
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
    // onFulfilled如果不是函数，让它变成直接返回value的函数
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : value => value;
    // onRejected如果不是函数，就忽略onRejected，直接扔出错误
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : err => {
            throw err;
          };

    if (this.state === "fulfilled") {
      onFulfilled(this.value);
    }
    if (this.state === "rejected") {
      onRejected(this.reason);
    }
  };
}

const myPro1 = new myPromise(resolve => {
  resolve(111);
}).then(val => console.log(val));

// 第一版 then的时候 还没resolve导致 state依然是pending
// then里面不会触发任何回调
const myPro2 = new myPromise(resolve => {
  setTimeout(() => {
    resolve(123);
  }, 2000);
}).then(val => console.log(val));
