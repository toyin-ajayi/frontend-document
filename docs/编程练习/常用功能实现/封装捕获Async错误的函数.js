async function catchError(asyncFn){
    try{
        let res = await asyncFn()
        return [false,res]
    }catch(err){
        return [err,false]
    }
}


async function errFn(){
    await Promise.reject('123')
}

async function func() {
    let [err, res] = await catchError(errFn)
    if (err) {
    console.log(err)
    }

}
func()