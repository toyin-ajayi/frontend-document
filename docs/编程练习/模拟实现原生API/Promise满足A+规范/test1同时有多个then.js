let one = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(123)
    },2000)
})
one.then((x)=>{
    console.log(x)
    return 321
}).then((x)=>{
    console.log(x)
})

one.then((x)=>{
    console.log(x)
})