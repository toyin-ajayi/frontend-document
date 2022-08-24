Array.prototype.myFilter = function(fn){
    const arr = this
    const filterArr = []
    for(let item of arr){
        console.log(item)
        if(fn(item)){
            filterArr.push(item)
        }
    }
    return filterArr
}

const arr = [1,2,3,4,5]
const newArr = arr.myFilter((x)=>x>3)
console.log(newArr)