function unique(arr){
    //return [...new Set(arr)] 
    return Array.from(new Set(arr))
}


let arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
console.log(unique(arr))
console.log(unique(arr))