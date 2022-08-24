function *sleep(time) {
    yield new Promise(resolve => {
        setTimeout(resolve, time)
    })
}
sleep(1000).next().value.then(() => {
    console.log(123)
})