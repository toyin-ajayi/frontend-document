
// 其实感觉这道题的意义在于让你用Promise顺序执行异步操作
function wait(arr,time){
    arr.reduce((total,value,index)=>{
        return total.then((res)=>{
            return new Promise((resolve)=>{
                setTimeout(()=>{
                    console.log(value)
                    resolve(value)
                },time)
            })
        })
    },Promise.resolve())
}


let arr = [1,2,3,4]
wait(arr,1000)