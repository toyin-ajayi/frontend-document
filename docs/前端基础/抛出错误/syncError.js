function f2() {
    Promise.reject('出错了1');//UnhandledPromiseRejectionWarning
    try {
        
      Promise.reject('出错了2');//UnhandledPromiseRejectionWarning
      console.log('error')
    } catch(e) {
      console.log('catch',e)
    }
    console.log(1231)
  }
  f2()
  try{
    setTimeout( () => {
        console.log(2)
        throw new Error('bye');//这里不行
    }, 2000);
  }catch(e){
      console.log('catch2',e);
  }
console.log(123)