/**
请实现 flatten(input) 函数，input 为一个 javascript 对象（Object 或者 Array），返回值为扁平化后的结果。
 * 示例：
 *   var input = {
 *     a: 1,
 *     b: [ 1, 2, { c: true }, [ 3 ] ],
 *     d: { e: 2, f: 3 },
 *     g: null, 
 *   }
 *   var output = flatten(input);
 *   output如下
 *   {
 *     "a": 1,
 *     "b[0]": 1,
 *     "b[1]": 2,
 *     "b[2].c": true,
 *     "b[3][0]": 3,
 *     "d.e": 2,
 *     "d.f": 3,
 *     // "g": null,  值为null或者undefined，丢弃
 *  }
 */


function flat(obj) {
  var result = {};
  function recurse(src, prop) {
    var toString = Object.prototype.toString;
    if (toString.call(src) == "[object Object]") {
      var isEmpty = true;
      for (var p in src) {
        isEmpty = false;
        recurse(src[p], prop ? prop + "." + p : p);
      }
      if (isEmpty && prop) {
        result[prop] = {};
      }
    } else if (toString.call(src) == "[object Array]") {
      var len = src.length;
      if (len > 0) {
        src.forEach(function(item, index) {
          recurse(item, prop ? prop + ".[" + index + "]" : index);
        });
      } else {
        result[prop] = [];
      }
    } else {
      result[prop] = src;
    }
  }
  recurse(obj, "");

  return result;
}

var input = {
  a: 1,
  b: [1, 2, { c: true }, [3]],
  d: { e: 2, f: 3 },
  g: null
};
let x = flat(input)
console.log(x)
console
