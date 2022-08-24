(function(){
    if(true){
        var x = 123
    }
    
    console.log(x)// 123
})()

(function(){
    if(true){
        let x = 123
    }
    
    console.log(x)// ReferenceError: x is not defined
})()
