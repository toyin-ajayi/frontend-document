async function sleep(ms,fn){
    
    await new Promise((resolve)=>setTimeout(resolve,ms));
    fn()
}

sleep(2000,function(){
    console.log(123)
})
