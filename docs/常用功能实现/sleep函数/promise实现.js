function sleep(ms) {
  var temple = new Promise(resolve => {
    setTimeout(resolve, ms);
  });
  return temple;
}
sleep(3000).then(function() {
  console.log(222)
});
console.log(12323)
//先输出了12323，延迟3000ms后输出222,表明只是基于事件循环的回调，让方法延缓执行，并不能影响主线程
