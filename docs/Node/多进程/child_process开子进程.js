const http = require('http');
const fork = require('child_process').fork;
const  fs = require('fs');

const computation = (type) => {
    let sum = 0;
    console.info(type,'计算开始',new Date());
    console.time(type+'计算耗时');

    for (let i = 0; i < 1e10; i++) {
        sum += i
    };

    console.info(type,'计算结束',new Date());
    console.timeEnd(type+'计算耗时');
    return sum;
};

const server = http.createServer((req, res) => {
    if(req.url == '/compute'){
/*         测试vscode调试路径的
        fs.readFile('./主进程.js', (err, data) => {
            if(err) {
              console.log(err);
              res.end(`ok`);
              return false;
            } else {
              console.log("读取文件成功！");
              console.log(data);
            }
          }) */
        const compute = fork('./fork_compute.js');
        compute.send('开启一个新的子进程');

        const sum = computation("主进程");


        // 当一个子进程使用 process.send() 发送消息时会触发 'message' 事件
        compute.on('message', sum => {
            res.end(`Sum is ${sum}`);
            compute.kill();
        });

        // 子进程监听到一些错误消息退出
        compute.on('close', (code, signal) => {
            console.log(`收到close事件，子进程收到信号 ${signal} 而终止，退出码 ${code}`);
            compute.kill();
        })
    }else{
        res.end(`ok`);
    }
});

server.listen(3000, () => {
    console.log(`server started`);
});
