function insertSort(arr) {
    for(let i = 1;i<arr.length;i++){// 外循环表示有序的长度
        for(let j=i;j>=0;j--){
            if(arr[j]<arr[j-1]){
                // 使用解构赋值交换
                [arr[j],arr[j-1]] = [arr[j-1],arr[j]];
            }else{
                break
            }
        }
    }
    return arr
}

// 改良一下插入，避免多次交换元素，找到最终插入的位置直接插
function insertSort2(arr) {
    for(let i = 1;i<arr.length;i++){
        let index = i 
        for(let j=i-1;j>=0;j--){
            if(arr[j]>arr[i]){
                index = j
            }
        }
        if(index === i)continue// 位置不用变
         // 直接从指定位置插入，不交换
         arr.splice(index,0,arr[i])
         // 插入一个后原来的下标会右移一位，然后把i+1从原来的位置上它删除即可
         arr.splice(i+1,1)
    }
    return arr
}

var arr=[3,44,38,5,47,15,36,26,27,2,46,4,19,50,48];
var arr2=[3,44,38,5,47,15,36,26,27,2,46,4,19,50,48];
console.log(arr)
console.log(insertSort(arr).toString())
console.log(insertSort2(arr2).toString())