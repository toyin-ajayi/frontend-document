const arr = [1,2,[4,5,6,[7,8],[9,10]],11]

function flat(arr){
    return arr.reduce((total,val,index)=>{
        return Array.isArray(val)?total.concat(flat(val)):total.concat(val)
    },[])
}



function flat2(arr,newArr=[]){
    arr.forEach(val => {
        if(Array.isArray(val)){
            flat2(val,newArr)
        }else{
            newArr.push(val)
        }
    });
    return newArr
}
console.log(flat2(arr))
