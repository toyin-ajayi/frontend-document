function sleep(ms) {
  var start = Date.now();
  var  expire = start + ms;
  while (Date.now() < expire);// while阻塞线程
  return;
}
sleep(3000)
console.log("1111");