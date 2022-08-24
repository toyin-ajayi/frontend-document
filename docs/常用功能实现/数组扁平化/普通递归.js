const flatten = (arr) => {
  let result = [];
  arr.forEach((item, i, arr) => {
    if (Array.isArray(item)) {
      result = result.concat(flatten(item));
    } else {
      result.push(arr[i])
    }
  })
  return result;
};

const arr = [1, [2, [3, 4]]];
console.log(flatten(arr));


function deepClone(obj){
  if(typeof obj === 'object'){
    const target = Array.isArray(obj)?[]:{};
    for(let key in obj){
      target[key] = deepClone(obj[key])
    }
  }else{
    return obj[key]
  }
}
