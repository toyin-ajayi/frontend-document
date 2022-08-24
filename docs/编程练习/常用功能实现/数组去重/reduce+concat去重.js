function unique(arr){
    return arr.reduce((total,val,index)=>{
        return total.includes(val)?total:[...total,val]
    },[])
}
let arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
console.log(unique(arr))
123