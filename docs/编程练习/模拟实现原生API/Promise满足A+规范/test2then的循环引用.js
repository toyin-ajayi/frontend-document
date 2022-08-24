let p = new Promise(resolve => {
    resolve(0);
  });
  var p2 = p.then(data => {
    // 循环引用，自己等待自己完成，一辈子完不成
    return p2;
  })