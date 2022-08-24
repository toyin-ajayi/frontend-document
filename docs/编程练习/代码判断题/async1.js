const myPromise = () =>
  Promise.resolve('I have resolved')

const firstFunc = () => {
    myPromise().then((res) => {
      console.log(res + ' first');
    });
    console.log('first');
}
async function secondFunc() {
  // await后面的会用 Promise.resolve来包裹 然后在.then拿到值
  // 相当于执行到await退出async函数的执行线程
    console.log(await myPromise());
    //console.log(await 1111);顺序一样
    console.log('second');
}
firstFunc();
secondFunc();
//错误：secondFunc()生成自动执行器后，会往下执行，取出第一个微任务
// 错误：first->'I have resolved'->second->'I have resolved first' 
// 正确： first->'I have resolved first' ->'I have resolved'->second



