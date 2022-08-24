// 对输入的字符串，去除其中的字符'b'以及连续出现的'a'和'c'，例如：

// 'aacbd' -> 'ad'
// 'aabcd' -> 'ad'
// 'aaabbccc' -> ''

function fn(str) {
    let res = str.replace(/b+/g, '');
    // 先匹配 再进入循环 最后替换 没有匹配的就返回了
    while(res.match(/(ac)+/)) {
      res = res.replace(/ac/, '')
    }
    return res;
  }
  
