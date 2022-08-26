function bigAdd(a, b) {
  let maxLen = Math.max(a.length, b.length);
  // 将字符串短的按照长度大的用0填充 
  a = a.padStart(maxLen, "0");
  b = b.padStart(maxLen, "0");
  // 从个位相加 先翻转转换类型
  let arrA = a
    .split("")
    .reverse()
    .map(val => Number(val));
  let arrB = b
    .split("")
    .reverse()
    .map(val => Number(val));
  console.log(arrA, arrB);
  let pro = 0; // 进位
  let sum = ""; // 总数 用字符串表示
  for (let i = 0; i < maxLen; i++) {
    let x = arrA[i] + arrB[i] + pro;
    if (x >= 10) {
      pro = 1;
      x -= 10;
    } else {
      pro = 0;
    }
    sum = x + sum;
  }
  // 最后可能还进了一位
  if (pro == 1) {
    sum = pro + sum;
  }
  return sum;
}

console.log(bigAdd("91274874912641", "1204782174891"));
