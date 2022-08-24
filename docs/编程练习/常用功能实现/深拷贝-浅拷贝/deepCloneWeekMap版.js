function deepClone(target, map = new WeakMap()) {
  if (typeof target === "object") {
    let cloneTarget = Array.isArray(target) ? [] : {};
    if (map.has(target)) return map.get(target);
    // 注意这里是以要克隆的对象作为键，克隆的对象为值
    // 如果以原来的对象为值，看上去的结果好像是对的，但引用指向的是之前
    map.set(target,cloneTarget);
    for (let key in target) {
      cloneTarget[key] = deepClone(target[key],map);
    }
    return cloneTarget;
  } else {
    return target;
  }
}

var a = {
  name: "jjc",
  book: {
    title: "You Don't Know JS",
    price: "45"
  },
  a1: undefined,
  a3: a
};
var b = deepClone(a);
b.book.price = 123
console.log(a)
let ax;
