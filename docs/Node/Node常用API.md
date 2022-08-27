
## path.resolve()
给定的路径序列从右到左进行处理，每个后续的`path`前置，直到构造出一个绝对路径。
如果在处理完所有给定的`path`片段之后还未生成绝对路径，则再加上当前工作目录。
如果参数为空这返回当前工作目录。

例如，给定的路径片段序列：`/foo`、`/bar`、`baz`，调用`path.resolve('/foo', '/bar', 'baz')`将返回`/bar/baz`。


将相对路径转化为绝对路径：
```tsx
const {resolve} = require('path');
console.log(resolve('./'));
```

## path.join()
用于连接路径。会把全部给定的 path 片段连接到一起，并规范化生成的路径。

```tsx
path.join('/foo', 'bar', './baz');
// '/foo/bar/baz'

path.join('/foo', 'bar', '/baz', '..');
// '/foo/bar'
```
## join VS resolve
join是把各个path片段连接在一起， resolve把‘／’当成根目录
```tsx
path.join('/a', '/b'); 
// /a/b
path.resolve('/a', '/b');
// /b

```
## 路径相关API


* __dirname: 总是返回被执行的 js 所在文件夹的绝对路径
* __filename: 总是返回被执行的 js 的绝对路径
* process.cwd(): 总是返回运行 node 命令时所在的文件夹的绝对路径（进程的当前工作目录）
* ./: 跟 process.cwd() 一样，返回 node 命令时所在的文件夹的绝对路径

根目录ES6-lottery 目录下运行 node syntax/nodejs/2.path.js，我们再来看看输出结果:

```tsx
const path = require('path')
console.log('__dirname：', __dirname)
console.log('__filename：', __filename)
console.log('process.cwd()：', process.cwd())
console.log('./：', path.resolve('./'))

__dirname：     /Users/jawil/Desktop/nodejs/demo/ES6-lottery/syntax/nodejs
__filename：    /Users/jawil/Desktop/nodejs/demo/ES6-lottery/syntax/nodejs/2.path.js
process.cwd()： /Users/jawil/Desktop/nodejs/demo/ES6-lottery
./：            /Users/jawil/Desktop/nodejs/demo/ES6-lottery

```
## node模块化

### module.exports与exports

- exports 是module.exports一个辅助工具，快捷写法
- exports 直接赋的值，无法绑定到 module.exports，只能通过exports.a = 'a'
- module.exports 是真正的接口
- module.exports和exports指向同一个内存空间

## fs模块

### fs.readFile fs.writeFile 读写文件

```tsx
fs.readFile('./big.file', (err, buffer) => {
  zlib.gzip(buffer, (err, buffer) => {
    fs.writeFile('big' + '.gz', buffer, err => {
      console.log('File successfully compressed');
    });
  });
});
```

### fs.stat 获取文件信息
```tsx
 fs.stat(pathsToCheck[i], function(err, stats) {
    console.log(stats.isDirectory());
    console.log(stats);
  });

true
Stats {
  dev: 16777220,
  mode: 16877,
  nlink: 3,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214262,
  size: 96,
  blocks: 0,
  atimeMs: 1561174653071.963,
  mtimeMs: 1561174614583.3518,
  ctimeMs: 1561174626623.5366,
  birthtimeMs: 1561174126937.2893,
  atime: 2019-06-22T03:37:33.072Z,
  mtime: 2019-06-22T03:36:54.583Z,
  ctime: 2019-06-22T03:37:06.624Z,
  birthtime: 2019-06-22T03:28:46.937Z
}
```

### fs.access 测试权限

```tsx
// 检查当前目录中是否存在该文件。
fs.access(file, fs.constants.F_OK, (err) => {
  console.log(`${file} ${err ? '不存在' : '存在'}`);
});

// 检查文件是否可读。
fs.access(file, fs.constants.R_OK, (err) => {
  console.log(`${file} ${err ? '不可读' : '可读'}`);
});

```

### fs.appendFile 追加文件

```tsx
fs.appendFile('message.txt', '追加的数据', (err) => {
  if (err) throw err;
  console.log('数据已追加到文件');
});
```

## url.parse(urlString[, parseQueryString])

```tsx
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

```tsx
使用 WHATWG 的 API 解析 URL 字符串：

const myURL =
  new URL('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash');
使用遗留的 API 解析 URL 字符串：
// 常用myURL.query 来获取字段
const url = require('url');
const myURL =
  url.parse('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash');
```

- url.hash
- url.host
- url.hostname
- url.href
- url.origin
- url.password
- url.pathname
- url.port
- url.protocol

特殊协议
- url.search
- url.searchParams
- url.username
- url.toString()
- url.toJSON()

```tsx
const myURL = new URL('https://example.org/?abc=123');
console.log(myURL.searchParams.get('abc'));
// 打印 123
```

## path.parse(path)

```tsx
// 将路径字符串转换为路径对象
const pathObj = path.parse('E:\\a\\b\\c\\d\\index.html')
console.log(pathObj)
/* 输出
 * { 
 *  root: 'E:\\', // 文件根目录
 *  dir: 'E:\\a\\b\\c\\d', // 不带文件名的文件路径
 *  base: 'index.html', // 文件名
 *  ext: '.html', // 文件后缀
 *  name: 'index' // 不带后缀的文件名
 * }
 */

```

## path.dirname()、basename()、extname()方法

- dirname 获得路径当中最后一段文件或文件夹所在的路径
- basename()方法 获得路径中的最后一段
- extname()方法 获取扩展名

```tsx
const {basename, dirname, extname} = require('path');
const filePath = '/usr/local/bin/no.txt';

console.log(basename(filePath));
console.log(dirname(filePath));
console.log(extname(filePath));

console.log(basename(filePath,extname(filePath))); // 相当于获取文件名


no.txt
/usr/local/bin
.txt
no
```