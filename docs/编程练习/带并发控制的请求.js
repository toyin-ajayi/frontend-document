// https://juejin.im/post/5c89d447f265da2dd37c604c#heading-0
/* 请事先一个函数，可以批量发送请求，所有url地址在urls参数中
同时可以通过max参数来控制请求的并发度
当所有请求结束后，需要执行callback回调，发请求的函数直接用fetch */
function handleFetchQueue(urls, max, callback) {
  const urlCount = urls.length;
  const requestsQueue = [];
  const results = [];
  let i = 0;
  const handleRequest = url => {
    const req = fetch(url)
      .then(res => {
        console.log("当前并发： " + requestsQueue);
        const len = results.push(res);
        if (len < urlCount && i + 1 < urlCount) {
          requestsQueue.shift();
          handleRequest(urls[++i]);
        } else if (len === urlCount) {
          "function" === typeof callback && callback(results);
        }
      })
      .catch(e => {
        results.push(e);
      });
    if (requestsQueue.push(req) < max) {
      handleRequest(urls[++i]);
    }
  };
  handleRequest(urls[i]);
}

const urls = Array.from({ length: 10 }, (v, k) => k);

const fetch = function(idx) {
  return new Promise(resolve => {
    console.log(`start request ${idx}`);
    const timeout = parseInt(Math.random() * 1e4);
    setTimeout(() => {
      console.log(`end request ${idx}`);
      resolve(idx);
    }, timeout);
  });
};

const max = 4;

const callback = () => {
  console.log("run callback");
};

handleFetchQueue(urls, max, callback);
