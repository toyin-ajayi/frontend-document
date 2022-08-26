// 实验一下数组分治  中间递归划 直到只有一个元素
// 最终返回应该是
function mergeSortTest(arr) {
  if (arr.length > 1) {
    let mid = Math.floor(arr.length / 2);
    let left = mergeSortTest(arr.slice(0, mid));
    let right = mergeSortTest(arr.slice(mid));
    return [[...left], [...right]];
  } else {
    return [...arr];
  }
}

// 在上面的基础上 最后添加排序 然后向上合并
function mergeSort(arr) {
  if (arr.length > 1) {
    let mid = Math.floor(arr.length / 2);
    let left = mergeSort(arr.slice(0, mid));
    let right = mergeSort(arr.slice(mid));
    // 最后肯定会拆分为left[3] right[44] 这种
    return merge(left,right);
  } else {
    return arr;
  }
}

function merge(left, right) {
  let newArr = [];
  while (left.length && right.length) {
    if (left[0] > right[0]) {
      newArr.push(right[0]);
      right.shift();
    } else {
      newArr.push(left[0]);
      left.shift();
    }
  }
  if (!left.length) {
      // concat不会修改源数组，需要重新赋值
    newArr = newArr.concat(right);
  } else {
    newArr = newArr.concat(left);
  }
  return newArr;
}

// 先测试一下递归分治划分的数组是否成功
var arrTest = [1,2,3,4,5,6,7,8]
var divideArr =  mergeSortTest(arrTest) 
console.log(JSON.stringify(divideArr))// [[[[1],[2]],[[3],[4]]],[[[5],[6]],[[7],[8]]]] 对的


var arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
const arred = mergeSort(arr);
console.log(arred.toString());

