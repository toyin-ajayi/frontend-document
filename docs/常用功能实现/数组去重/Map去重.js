function unique(arr){
    const map = new Map()
    const arrUnique = []
    arr.forEach((val)=>{
        if(!map.has(val)){
            map.set(val,true)
            arrUnique.push(val)
        }
    })
    return arrUnique
}


let arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
console.log(unique(arr))
console.log(unique(arr))
