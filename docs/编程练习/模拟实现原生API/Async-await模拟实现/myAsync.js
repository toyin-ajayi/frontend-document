function spawn(genF) {
    //spawn函数就是自动执行器，跟简单版的思路是一样的，多了Promise和容错处理
    return new Promise(function(resolve, reject) {
      const gen = genF();
      function step(nextF) {
        let next;
        try {
          next = nextF();// 如果外面对await 进行了try catch 这里内部就会多一层try catch，不会触发reject
        } catch (e) {
          return reject(e);
        }
        if (next.done) {
          return resolve(next.value);// 最后一个yield(undefined)或者return的值
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

function asyncFn4(args) {
  return spawn(function*() {
/*         let a = yield 1
        console.log(a) //1 */
        let b = yield Promise.reject('reject')
        console.log(b)
  });
}

async function realAsync(){
  let b = await Promise.reject('realReject')
  console.log(b)
}

realAsync()


function asyncFn3() {
  return spawn(function*() {
        try{
          let b = yield Promise.ree()
          console.log(b)
        }catch(e){
          console.log(e)

        }
        console.log(123)
        
        
        return 'return的值应该用Promise来resolve'
  });
}

// asyncFn2() 测试返回
// asyncFn3()  测试抛出错误
  asyncFn4()
// realAsync()// 和真实的Async效果相同 



