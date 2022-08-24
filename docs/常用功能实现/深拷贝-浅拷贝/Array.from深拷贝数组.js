function deepCloneArray(arr){
    if(Array.isArray(arr)){
        return Array.from(arr,deepCloneArray)//递归入口
    }else{
        return arr
    }
}

var arr=[
    0,
    [1,1,1],
    [2,2,2],
    [3,3,4],
    2,
    3
]
var arr2 = deepCloneArray(arr)

arr2[0]=-1;
arr2[1][0]=11;
arr2[2][0].name=22;
console.log(arr2)
console.log(arr)