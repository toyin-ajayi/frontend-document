function all(numArray) {
  let memoArray = [];
    var  all =[]
  backtrack(numArray, memoArray,all);
  return all;
}


function backtrack(numArray, memoArray,all){
    if(memoArray.length===numArray.length){
        // 注意这里需要用一层浅拷贝，不然最后memoArray.pop的时候all也会改变
        all.push([...memoArray])
        return
    }
    for(let i =0;i<numArray.length;i++){
        // 每个元素只能选择一次，重复就不进入递归
        if(memoArray.includes(numArray[i]))continue
        memoArray.push(numArray[i])
        backtrack(numArray,memoArray,all)
        // 本条路径走完需要回复状态,即取消选择，下次就可以进入不同的分支
        memoArray.pop()
    }
}

const x = all([1,2,3,4,5])
x.forEach((item)=>{
console.log(item)
})

