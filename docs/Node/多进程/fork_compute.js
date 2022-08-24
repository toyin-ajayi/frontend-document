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

process.on('message', msg => {
    console.log(msg, 'process.pid', process.pid); // 子进程id
    const sum = computation('子进程');

    // 如果Node.js进程是通过进程间通信产生的，那么，process.send()方法可以用来给父进程发送消息
    process.send(sum);
})
