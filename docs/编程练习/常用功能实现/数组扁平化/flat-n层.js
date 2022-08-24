function flatN(arr, n = 1) {
    if (n <= 0) return arr.slice();
    let resArr = [];
    arr.forEach(val => {
      if (Array.isArray(val)) {
        resArr = resArr.concat(flatN(val, n - 1));
      } else {
        resArr = resArr.concat(val);
      }
    });
  
    return resArr;
  }
  
  function flatN2(arr, n = 1) {
    return n > 0
      ? arr.reduce((total, val) => {
          return total.concat(Array.isArray(val) ? flatN2(val, n-1) : val);
        }, [])
      : arr.slice();
  }
  
  let arr = [1, [2, [3, 3, [4, 4, 4], 3], 2, 2], 1, 1];
  
  
  console.log(flatN(arr));
  console.log(flatN2(arr, 2));
  console.log(flatN2(arr, 2));
  
  
  