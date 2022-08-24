## 为什么要用流

与其他数据处理方法相比，流有两个主要优势：

1.  **内存效率：** 不需要加载大量的数据到内存就可以处理
2.  **时间效率：** 一旦有了数据就开始处理，而不必等待传输完所有数据

## Nodejs 有四种流

Node.js 中有四种基本的流类型：

- Writable - 可写入数据的流（例如 fs.createWriteStream()）。
- Readable - 可读取数据的流（例如 fs.createReadStream()）。
- Duplex - 可读又可写的流（例如 net.Socket）。
- Transform - 在读写过程中可以修改或转换数据的 Duplex 流（例如 zlib.createDeflate()）。

此外，该模块还包括实用函数 stream.pipeline()、stream.finished() 和 stream.Readable.from()。

## 可写流

- 客户端的 HTTP 请求
- 服务器的 HTTP 响应
- fs 的写入流
- zlib 流
- crypto 流
- TCP socket
- 子进程 stdin
- process.stdout、process.stderr // 标准输出。该对象的 write 方法等同于 console.log，可用在标准输出向用户显示内容。

## 可读流

- 客户端的 HTTP 响应
- 服务器的 HTTP 请求
- fs 的读取流
- zlib 流
- crypto 流
- TCP socket
- 子进程 stdout 与 stderr
- process.stdin

## 双工流

Duplex 流的例子包括：

- TCP socket
- zlib 流
- crypto 流

## stream.Transform 类

转换流（Transform）是一种 Duplex 流，但它的输出与输入是相关联的。 与 Duplex 流一样， Transform 流也同时实现了 Readable 和 Writable 接口。

Transform 流的例子包括：

- zlib 流
- crypto 流

```
const fs = require('fs')
const zlib = require('zlib')

const src = fs.createReadStream('./test.js')
const writeDesc = fs.createWriteStream('./test.gz')
src.pipe(zlib.createGzip()).pipe(writeDesc)
```

zlib.createGzip()就是一个中间转换流。

glup这个打包工具也是大量使用转换流来进行操作的。

## 流事件和方法

<img src="./img/../../img/流的方法和事件.png" />

```
let readStream=fs.createReadStream('./test/b.js');
//读取文件发生错误事件
readStream.on('error', (err) => {
    console.log('发生异常:', err);
});
//已打开要读取的文件事件
readStream.on('open', (fd) => {
    console.log('文件已打开:', fd);
});
//文件已经就位，可用于读取事件
readStream.on('ready', () => {
    console.log('文件已准备好..');
});
 
//文件读取中事件·····
readStream.on('data', (chunk) => {
    console.log('读取文件数据:', chunk);
});
 
//文件读取完成事件
readStream.on('end', () => {
    console.log('读取已完成..');
});
 
//文件已关闭事件
readStream.on('close', () => {
    console.log('文件已关闭！');
})

```

## pipe方法

pipe方法和如下等价
```
readable.on(" data", (chunk) => {
  writable.write(chunk);
});
readable.on(" end", () => {
  writable.end();
});

```

