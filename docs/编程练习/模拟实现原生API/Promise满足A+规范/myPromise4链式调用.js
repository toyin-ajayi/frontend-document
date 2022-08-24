/**
 * @description 处理 then 的链式调用
 * @param {*} promise2 我们新建的一个promise 用于中转
 * @param {*} x then的回调被调用后返回的值
 * @param {*} resolve promise2的，传了进来
 * @param {*} reject promise2的，传了进来
 * @returns
 */
function resolvePromise(promise2, x, resolve, reject) {
  // 循环引用报错
  if (x === promise2) {
    // reject报错
    return reject(new TypeError("Chaining cycle detected for promise"));
  }
  // 防止多次调用
  let called;
  // x不是null 且x是对象或者函数，不满足这个条件就把x当成一个普通值
  if (x != null && (typeof x === "object" || typeof x === "function")) {
    try {
      // 进入if就表明x是一个引用类型，我们可以拿then属性来判断
      // A+规定，声明then = x的then方法
      let then = x.then;
      // 如果x有then属性，且是函数，就判定x是promise
      if (typeof then === "function") {
        // 就让then执行 第一个参数是this   后面是成功的回调 和 失败的回调
        then.call(
          x,
          y => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            //* y是上层resolve()的参数 promise是可以resolve一个thenable的对象
            // 如果一直resolve一个promise的话我们只能用递归来得到最后不是promise的一个值
            // 这个值将会被它的.then拿到，所以then回调得到的参数绝对不可能是一个promise
            resolvePromise(promise2, y, resolve, reject);
          },
          err => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            reject(err); // 失败了就失败了
          }
        );
      } else {
        resolve(x); // 直接成功即可
      }
    } catch (e) {
      // 也属于失败
      if (called) return;
      called = true;
      // 取then出错了那就不要在继续执行了
      reject(e);
    }
  } else {
    // x是一个普通值，直接resolve，也就是promise2被resolve了，且参数就是这个普通值
    resolve(x);
  }
}

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
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    };
    let reject = reason => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
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
    // *这里的逻辑很重要1.then 要链式调用必然需要返回一个新的promise2
    let promise2 = new myPromise((resolve, reject) => {
      if (this.state === "fulfilled") {
        setTimeout(() => {
          try {
            // 这里的x就是我们then回调函数的返回值，分三种情况：
            // x是普通值，则返回一个resolve状态的promise
            // x是undefined，则返回一个resolve状态的promise，参数值为undefined
            // x是promise，则将根据这个Promise的状态和值创建一个新的Promise对象返回，但要注意这个promise是可以resolve一个promise的
            // resolve一个promise（thenable）的对象，promise内部会处理直到拿到一个不是thenable的对象,这样promise后面的then才能拿到参数
            let x = onFulfilled(this.value);
            // resolvePromise函数内置了一个递归,边界条件是x.then不是方法，来处理resolve(promise)的情况
            // 终极目的就让返回的promise2能够resolve正确的参数（这个参数绝对不能是thenable的对象比如promise）
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.state === "rejected") {
        // 异步
        setTimeout(() => {
          // 如果报错
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      // 如果状态state为pending时，就表明是传入的executor中有异步方法，推迟了resolve或者reject的执行
      // 这时应该把回调方法缓存起来
      if (this.state === "pending") {
        // 注意推入的时候套了一层箭头函数，不然就直接执行了
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    return promise2;
  };
}

const myPro1 = new myPromise(resolve => {
  setTimeout(() => {
    resolve(123);
  }, 2000);
})
  .then(val => {
    console.log(val);
    return new myPromise(resolve => {
      setTimeout(() => {
        resolve(123);
      }, 2000);
    });
  })
  .then(x => console.log(x));
