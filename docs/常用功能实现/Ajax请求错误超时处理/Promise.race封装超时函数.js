function delayPromise(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}

function timeoutPromise(promise, ms) {
  var timeout = delayPromise(ms).then(function() {
    throw new Error("Operation timed out after " + ms + " ms");
  });
  return Promise.race([promise, timeout]);
}

let promise1 = new Promise(r => {
  setTimeout(() => {
    r("123");
  }, 2000);
});

timeoutPromise(promise1, 1000)
  .then(res => console.log(res))
  .catch(err => console.log(err));//? 这个回调可以递归重试 没有验证
timeoutPromise(promise1, 3000)
  .then(res => console.log(res))
  .catch(err => console.log(err));
