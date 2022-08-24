
setImmediate(function immediate () {
    console.log('immediate');
  });

process.nextTick(()=>{
    console.log("nextTick")
})

setTimeout(()=>{
    console.log('timer1')

    Promise.resolve().then(function() {
        console.log('timer1:promise1')
    })

    process.nextTick(()=>{
        console.log("timer1:nextTick")
    })

}, 0)

setTimeout(()=>{
    console.log('timer2')

    Promise.resolve().then(function() {
        console.log('timer2:promise2')
    })
}, 0)

setTimeout(function() {
    console.log('timeout');
  },0);

Promise.resolve().then(function() {
    console.log('promise')
})
console.log("loop begin")