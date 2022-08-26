/* 在一个字符串 str 中查找字符串 s，暴力算法从每个 str[i] 开始匹配s，
如果遇到不匹配的字符就回到 i+1 的位置上继续从头匹配，所以时间复杂度是 0(n * m)。
KMP 算法则是在每次遇到不匹配的字符时，不去回溯 i，
而是根据不匹配时 j 的 next 值去回溯模式串 s。
所以 KMP 算法的时间复杂度是 O(n + m)。 */

// http://www.ruanyifeng.com/blog/2013/05/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm.html
// 计算next数组，next[i]表示str[i]前面字符串的最长公共前后缀
// 如 abcdabe，next[6]=2，最长公共前后缀是ab。
function getNext(str) {
  let len = str.length;
  // i表示str的下标
  let i = 0,
    j = -1;
  let next = [];
  // next[0]前面没有字符串了，所以置为-1
  next[0] = -1;
  // 因为if中是先i++再给next[i]赋值，所以循环到len-1就够了
  while (i < len - 1) {
    if (j === -1 || str[i] === str[j]) {
      i++;
      j++;
      next[i] = j;
    } else {
      j = next[j];
    }
  }
  return next;
}

function kmp(str, s) {
  let next = getNext(s);
  let len1 = str.length,
    len2 = s.length;
  let i = 0,
    j = 0;
  while (i < len1 && j < len2) {
    if (j === -1 || str[i] === s[j]) {
      i++;
      j++;
    } else {
      j = next[j];
    }
  }
  // 匹配成功，返回在str中第一次出现s的下标
  if (j === len2) return i - j;
  // 没有匹配到就返回-1
  return -1;
}
