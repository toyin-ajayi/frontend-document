function binarySearch(arr,value){
    arr.sort()
    let low = 0
    let high = arr.length-1
    while(low<=high){
        let mid = Math.floor((low+high)/2)
        if(arr[mid] === value){
            return mid
        }
        if(value<arr[mid]){
            high = mid-1
        }else{
            low = mid+1
        }
    }
    return -1
}




let arr = [8,4,2,6,3,6,1]
console.log(binarySearch(arr,8))
console.log(binarySearch(arr,1))

