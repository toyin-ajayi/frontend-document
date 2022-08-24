var arr = [1, [2, [3, 4]]];

function flatten(arr) {
  while (arr.some(item => Array.isArray(item))) {
    // concat可以连接普通数字和数组 
    // 不断调用合并数字和数组即可
    arr = [].concat(...arr);
    console.log(arr)
  }
  return arr;
}

console.log(flatten(arr));

let x = [].concat(1,[2])
console.log(x)
console.log(x)
