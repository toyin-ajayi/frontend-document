async function async1() {
  console.log("async1 start");
    // 这里也是放入下一次微任务？ 因为执行async2 拿到的是一个Promise，而CO内部需要用.then来获取resolve的值
  await async2();

  console.log("async1 end");
}

async function async2() {
  console.log("async2");
}

async1()
console.log('start')
Promise.resolve().then(()=>console.log(123))