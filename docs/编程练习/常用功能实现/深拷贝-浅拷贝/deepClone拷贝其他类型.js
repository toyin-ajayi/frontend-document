function copyFunction(ori, type, copy = () => {}) {
  const fun = eval(ori.toString());
  fun.prototype = ori.prototype;
  return fun;
}

function getType(target) {
  return Object.prototype.toString.call(target);
}

function cloneReg(targe) {
  const reFlags = /\w*$/;
  const result = new targe.constructor(targe.source, reFlags.exec(targe));
  result.lastIndex = targe.lastIndex;
  return result;
}

// !只是方法 代码应该有问题
function deepClone(target, map = new WeakMap()) {
  if (getType(target, "[object Date]")) {
    return new Date(target.getTime());
  } else if (getType(target, "[object Function]")) {
    return copyFunction(target);
  } else if (getType(target, "[object RegExp]")) {
    return cloneReg(target);
  } else if (typeof target === "object") {
    let symKeys = Object.getOwnPropertySymbols(target); // 查找
    if (symKeys.length) {
      // 查找成功
      symKeys.forEach(symKey => {
        if (isObject(target[symKey])) {
          target[symKey] = cloneDeep4(target[symKey], hash);
        } else {
          target[symKey] = target[symKey];
        }
      });
    }

    let cloneTarget = Array.isArray(target) ? [] : {};
    if (map.has(target)) return map.get(target);
    map.set(target, cloneTarget);
    for (let key in target) {
      cloneTarget[key] = deepClone(target[key], map);
    }
    return cloneTarget;
  } else {
    return target;
  }
}
