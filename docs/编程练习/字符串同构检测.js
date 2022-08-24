/* 判断一个给定的字符串是否是同构的。

难度：中等

如果两个字符串是同构的，那么字符串 A 中所有出现的字符都可以用另一个字符替换，以便获得字符串 B，而且必须保留字符的顺序。字符串 A 中的每个字符必须与字符串 B 的每个字符一对一对应。

paper 和 title 将返回 true。
egg 和 sad 将返回 false。
dgg 和 add 将返回 true。
 */

// 思路：用map来映射 dgg与add 就是 {d：a,g:d}
// 如果后面字符在map中出现那么其值必须和map对应，不然就是false


function isIsomorphic(firstString, secondString) {

  // 检查长度是否相等，如果不相等, 它们不可能是同构的
  if (firstString.length !== secondString.length) return false

  var letterMap = {};

  for (var i = 0; i < firstString.length; i++) {
    var letterA = firstString[i],
        letterB = secondString[i];

    // 如果 letterA 不存在, 创建一个 map，并将 letterB 赋值给它
    if (letterMap[letterA] === undefined) {
      letterMap[letterA] = letterB;
    } else if (letterMap[letterA] !== letterB) {
      // 如果 letterA 在 map 中已存在, 但不是与 letterB 对应，
      // 那么这意味着 letterA 与多个字符相对应。
      return false;
    }
  }
  // 迭代完毕，如果满足条件，那么返回 true。
  // 它们是同构的。
  return true;
}


isIsomorphic("egg", 'add'); // true
isIsomorphic("paper", 'title'); // true
isIsomorphic("kick", 'side'); // false
