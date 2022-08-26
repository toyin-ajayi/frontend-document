/** 
 * 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。
 * 有效字符串需满足：
 * 左括号必须用相同类型的右括号闭合。
 * 左括号必须以正确的顺序闭合。
 * 注意空字符串可被认为是有效字符串。

示例 2:

输入: "()[]{}"
输出: true
示例 3:

输入: "(]"
输出: false
{[}]
"{[]()}"
*/

/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
  let left = ["{", "[", "("];
  let arr = [];
  for(let i=0;i<s.length;i++){
      if(left.includes(s[i])||arr.length==0){
          arr.push(s[i])
      }else{
          let x = arr.pop()
          if(!(s[i] == get(x))){
              return false
          }
      }
  }
  if(arr.length==0){
      return true
  }else{
      return false
  }
};

function get(char) {
  switch (char) {
    case "(":
      return ")";
    case "[":
      return "]";
    case "{":
      return "}";
  }
}


console.log(isValid("{"))


