const fs = require('fs');
//将一个文件读到另一个文件
const inputFile = fs.createReadStream('input.txt');
inputFile.on('data',(data)=>{
    console.log(data)
})
const outputFile = fs.createWriteStream('output.txt');

// 当建立管道时，才发生了流的流动
inputFile.pipe(outputFile);

/* 
pipe相当于下面代码
readable.on('data', (chunk) => {
    outputFile.write(chunk);
  });
  
  readable.on('end', () => {
    outputFile.end();
  }); */