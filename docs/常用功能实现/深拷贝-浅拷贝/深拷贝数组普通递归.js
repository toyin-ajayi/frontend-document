function deepCloneArray(arr){
    let newArray = []
    for(let i = 0;i<arr.length;i++){
        let val = arr[i]
        if(Array.isArray(val)){
            newArray.push(deepCloneArray(val))
        }else{
            newArray.push(val)
        }
    }
    return newArray
}
var arr=[
    0,
    [1,1,1],
    [2,2,2],
    [3,3,4],
]
var arr2 = deepCloneArray(arr)
arr2[0]=-1;
arr2[1][0]=11;
arr2[2][0].name=22;
console.log(arr2)
console.log(arr)