// Async函数只是再函数体内等待，主线程不会等待
// 所以得用while来真正阻塞线程

class ChainCalls{
    constructor(){

    }
    eat(x){
        let time = Date.now()
        console.log(time,'eat'+x)
        return this
    }
    reade(x){
        let time = Date.now()
        console.log(time,'reade'+x)
        return this
    }
    run(x){
        let time = Date.now()
        console.log(time,'run'+x)
        return this
    }
    sleep(time){
        let memoTime = Date.now()
        while(Date.now()<memoTime+time){}
        return this
    }   
}

function CodingMan(){
    return new ChainCalls()
}

CodingMan().eat('饭').sleep(3000).reade('book').sleep(1000).run('跑圈圈')