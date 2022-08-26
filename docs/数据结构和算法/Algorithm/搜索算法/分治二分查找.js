// 分而治之的二分法递归
function binarySearch2(arr,value,start,end){
    let low = start
    let high = end
    let mid = Math.floor((low+high)/2)
    if(arr[mid] === value){
        return mid
    }
    if(low>high)return -1
    if(value<arr[mid]){
        return binarySearch2(arr,value,low,mid-1)
    }else {
        return binarySearch2(arr,value,mid+1,high)
    }
}

let arr2 = [1,2,3,4,5,6,7,8,9]
console.log(binarySearch2(arr2,9,0,arr2.length-1))