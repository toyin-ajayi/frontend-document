const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
//master进程内部启动了一个TCP服务器，而真正监听端口的只有这个服务器，然后启动sever转发给工作进程，关闭server（参考node深入浅出245页）
// 父进程（即 master 进程）负责监听端口，接收到新的请求后将其分发给下面的 worker 进程,不负责处理业务逻辑
  console.log(`主进程 ${process.pid} 正在运行`);

  // 衍生工作进程。
  for (let i = 0; i < numCPUs; i++) {
      console.log(i)
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
  });
} else {
  // 工作进程可以共享任何 TCP 连接。
  // 在本例子中，共享的是 HTTP 服务器。
  http.createServer((req, res) => {
    if(req.url.indexOf('pid')>0){
      console.log("当前响应：",process.pid)
      res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
      res.end('你好世界\n');
      console.log(new Date())
    }

  }).listen(8001);

  console.log(`else工作进程 ${process.pid} 已启动`);
}
