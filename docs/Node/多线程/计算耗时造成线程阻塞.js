const http = require('http');
const longComputation = () => {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) {
    sum += i;
  };
  return sum;
};
const server = http.createServer();
server.on('request', (req, res) => {
  if (req.url === '/compute') {
    console.time('time');
    console.info('计算开始',new Date());
    const sum = longComputation();
    console.timeEnd('time');
    console.info('计算结束',new Date());
    return res.end(`Sum is ${sum}`);
  } else {
    res.end('Ok')
  }
});

server.listen(3000,()=>{
    process.title='程序员成长指北测试进程';
    
});
