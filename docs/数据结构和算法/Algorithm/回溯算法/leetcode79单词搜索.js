/* 给定一个二维网格和一个单词，找出该单词是否存在于网格中。

单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。

示例:

board =
[
  ['A','B','C','E'],
  ['S','F','C','S'],
  ['A','D','E','E']
]

给定 word = "ABCCED", 返回 true.
给定 word = "SEE", 返回 true.
给定 word = "ABCB", 返回 false. */

function exist(arr,word){    
    for(let i = 0; i<arr.length;i++){
        for(let j = 0;j<arr[i].length;j++){
            if(findWord(i,j,word,arr)){
                return true
            }
        }
    }
    return false
}

function findWord(i,j,word,arr){
    if(arr[i][j]!==word[0])return false
    if(word.length === 1)return true
    // 缓存一个值，没找到时用于回溯时返回上一个状态
    let temp = arr[i][j]
    // 找到了一个匹配的,就标记为-1，避免重复
    arr[i][j] = -1 
    // 深度优先搜索，先一个方向走到死，不对再退回
    if(i>0&&findWord(i-1,j,word.slice(1),arr))return true
    if(j>0&&findWord(i,j-1,word.slice(1),arr))return true
    if(i<arr.length-1&&findWord(i+1,j,word.slice(1),arr))return true
    if(j<arr[i].length-1&&findWord(i,j+1,word.slice(1),arr))return true
    // 如果前后左右都没有通路，退回之前的状态
    arr[i][j] = temp
    return false
}

let board =
[
  ['A','B','C','E'],
  ['S','F','C','S'],
  ['A','D','E','E']
]

console.log(exist(board,"SFCSE"))
console.log(exist(board,"ABBA"))
console.log(exist(board,"BCCFB"))
console.log(exist(board,"ECBA"))
