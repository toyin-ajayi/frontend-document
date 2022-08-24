const p1 = new Promise((resolve, reject) => {
    setTimeout(() => { // 异步操作
        resolve('start')
    }, 1000);
  });
  
  p1.then((result) => {
     console.log('a', result); 
     return Promise.reject('中断后续调用'); // 此时rejected的状态将直接跳到catch里，剩下的调用不会再继续
  }).then(result => {
     console.log('b', result);
  }).then(result => {
     console.log('c', result);
  }).catch(err => {
     console.log(err);
  });
  
  