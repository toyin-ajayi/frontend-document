Array.prototype.myForEach = function(fn){
    const arr = this
    for(let i =0;i<arr.length;i++){
        fn(arr[i],i,arr)
    }
}

const arr = [1,2,3,4]
arr.myForEach((val,index)=>{
    console.log(val,index)
})