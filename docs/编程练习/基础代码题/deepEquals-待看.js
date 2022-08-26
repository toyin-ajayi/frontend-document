// UnderScore
var Utils = {};
Utils.keys = function(obj) {
  if (Array.isArray(obj)) return [];
  else if (Object.keys) return Object.keys(obj);
};
Utils.has = function(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
function equals(a, b, aStack, bStack) {
  var aStack = aStack ? aStack : [];
  var bStack = bStack ? bStack : [];
  //对原始类型数据进行比较,
  // 排除掉0和-0的相等性：
  if (a === b) {
    return a !== 0 || 1 / a === 1 / b;
  }
  //判断null和undefined，null==undefined->true
  if (a == null || b == null) {
    return a === b;
  }

  var className = Object.prototype.toString.call(a);
  if (className !== Object.prototype.toString.call(b)) {
    return false;
  }
  switch (className) {
    //统一转换为字符串后进行严格相等的判断：
    case "[object RegExp]":
    case "[object String]":
      return "" + a === "" + b;
    //应该把NaN看做相等，把0和-0看成不等
    case "[object Number]":
      if (+a !== +a) return +b !== +b;
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    //直接判断
    case "[object Date]":
    case "[object Boolean]":
      return +a === +b;
  }

  //对数组和对象进行判断
  var areArrays = className === "[object Array]";
  if (!areArrays) {
    if (typeof a != "object" || typeof b != "object") return false;

    var aCtor = a.constructor,
      bCtor = b.constructor;
    if (
      aCtor !== bCtor &&
      !(
        typeof aCtor === "function" &&
        aCtor instanceof aCtor &&
        typeof bCtor === "function" &&
        bCtor instanceof bCtor
      ) &&
      "constructor" in a && "constructor" in b
    ) {
      return false;
    }
  }
  var length = aStack.length;
  while (length--) {
    if (aStack[length] === a) return bStack[length] === b;
  }

  aStack.push(a);
  bStack.push(b);
  var size, result;
  if (areArrays) {
    size = a.length;
    result = size === b.length;
    if (result) {
      while (size--) {
        if (!(result = equals(a[size], b[size], aStack, bStack))) break;
      }
    }
  } else {
    var keys = Utils.keys(a),
      key;
    size = keys.length;
    result = Utils.keys(b).length === size;
    if (result) {
      while (size--) {
        key = keys[size];
        if (
          !(result =
            Utils.has(b, key) && equals(a[key], b[key], aStack, bStack))
        )
          break;
      }
    }
  }
  aStack.pop();
  bStack.pop();
  return result;
}
