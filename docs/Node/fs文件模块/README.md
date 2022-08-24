## fs-extra

fs-extra是对fs原生模块的一个扩展，全部以Promise的形式重构模块，可以更好的与async await函数配合。

- https://juejin.im/post/5b52fd21e51d4519234468f1#heading-19

## fs模块

### 读写文件


```
// -- 异步读取文件
fs.readFile(filePath,'utf8',function(err,data){
    console.log(data);
    // 如果不加编码读出来是<Buffer 3c 21  3c ... 791 more bytes> buffer表示的二进制数据
    // 加了编码读成字符串
});

// -- 同步读取文件
const fileResult=fs.readFileSync(filePath,'utf8');
console.log(fileResult);// 

```
### 文件写入fs.writeFile(file, data[, options], callback)

```
file <string> | <Buffer> | <URL> | <integer> 文件名或文件描述符。
data <string> | <Buffer> | <TypedArray> | <DataView>
options <Object> | <string>

encoding <string> | <null> 默认值: 'utf8'。
mode <integer> 默认值: 0o666。
flag <string> 参阅支持的文件系统标志。默认值: 'w'。
```
```
// 写入文件内容（如果文件不存在会创建一个文件）
// 写入时会先清空文件
fs.writeFile(filePath, 'data', function(err) {
    if (err) {
        throw err;
    }
    // 写入成功后读取测试
    var data=fs.readFileSync(filePath, 'utf-8');
    console.log('new data -->'+data);
});

// 通过文件写入并且利用flag也可以实现文件追加
fs.writeFile(filePath, '追加的数据', {'flag':'a'},function(err) {
	    if (err) {
	        throw err;
	    }
	    console.log('success');
	    var data=fs.readFileSync(filePath, 'utf-8')
	    // 写入成功后读取测试
	    console.log('追加后的数据 -->'+data);
	});

```

### 文件追加-appendFile

### 拷贝文件-copyFile

```
// 将filePath文件内容拷贝到filePath1文件内容
fs.copyFileSync(filePath, filePath1);
let data = fs.readFileSync(filePath1, 'utf8');

console.log(data); 
```
### 删除文件-unlink

```
// -- 异步文件删除
fs.unlink(filePath,function(err){
	if(err) return;
});
// -- 同步删除文件
fs.unlinkSync(filePath,function(err){
    if(err) return;
});

```

### 指定位置读写文件操作

要先用fs.open来打开文件，然后才可以用fs.read去读，或者用fs.write去写文件，最后，你需要用fs.close去关掉文件。
fs.open(path,flags,[mode],callback)
- path 文件路径
- flags打开文件的方式
  * r ：读取文件，文件不存在时报错；
  * r+ ：读取并写入文件，文件不存在时报错；
  * rs ：以同步方式读取文件，文件不存在时报错；
  * rs+ ：以同步方式读取并写入文件，文件不存在时报错；
  * w ：写入文件，文件不存在则创建，存在则清空；
  * wx ：和w一样，但是文件存在时会报错；
  * w+ ：读取并写入文件，文件不存在则创建，存在则清空；
  * wx+ ：和w+一样，但是文件存在时会报错；
  * a ：以追加方式写入文件，文件不存在则创建；
  * ax ：和a一样，但是文件存在时会报错；
  * a+ ：读取并追加写入文件，文件不存在则创建；
  * ax+ ：和a+一样，但是文件存在时会报错。  
- [mode] 是文件的权限（可行参数，默认值是0666）
- callback 回调函数
  - fd：文件描述符

```
var fs = require('fs'); // 引入fs模块
 
// 打开文件
fs.open('./text.txt', 'r', function(err, fd) {
    if (err) {
        throw err;
    }
    console.log('open file success.');
    // 一个 Buffer 对象，v8 引擎分配的一段内存，存储将要写入文件数据的 Buffer；
    var buffer = new Buffer(255);
    // 读取文件
    fs.read(fd, buffer, 0, 10, 0, function(err, bytesRead, buffer) {
        if (err) {
            throw err;
        }
        // 打印出buffer中存入的数据
        console.log(bytesRead, buffer.slice(0, bytesRead).toString());
 
        // 关闭文件
        fs.close(fd);
    });
});
```

### 监视文件

fs.watch('./watchdir', console.log); // 稳定且快

## 目录(文件夹)操作

- fs.mkdir(path, [options], callback) 创建文件夹
- fs.rmdir(path,callback) 删除文件夹
- fs.readdir读取目录
