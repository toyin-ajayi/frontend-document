const fs = require('fs')

const longComputation = () => {
    console.time('time');
    console.info('计算开始',new Date());
    let sum = 0;
    for (let i = 0; i < 1e9; i++) {
      sum += i;
    };
    console.timeEnd('time');
    console.info('计算结束',new Date());
    return sum;
  };

/* setTimeout(()=>{
    console.log('timer1')
    fs.readFile(
        './test.txt',
        (err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log('timer1:file1')
            }
        }
    )

}, 0) */


fs.readFile(
    './test.txt',
    (err,data)=>{
        if(err){
            console.log(err)
        }else{
            setTimeout(function() {
                fs.appendFileSync('message.txt', "1");
              },0);
              fs.appendFileSync('message.txt', "2");
        }
    }
)

fs.readFile(
    './test1.txt',
    (err,data)=>{
        if(err){
            console.log(err)
        }else{
            fs.appendFileSync('message.txt', "3");
        }
    }
)

setImmediate(() => console.log('set immediate1'));