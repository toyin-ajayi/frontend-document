/* var handler = {
  get: function(target, name) {
    if (name === "prototype") {
      return Object.prototype;
    }
    return "Hello, " + name;
  },

  apply: function(target, thisBinding, args) {
    return args[0];
  },

  construct: function(target, args) {
    return { value: args[1] };
  }
};

var fproxy = new Proxy(function(x, y) {
  return x + y;
}, handler);

fproxy(1, 2); // 1
new fproxy(1, 2); // {value: 2}
console.log(fproxy.prototype === Object.prototype); // true
console.log(fproxy.foo === "Hello, foo"); // true */

const target = {
  name: "lorry"
};

const handler = {
  get(trapTarget, property, reciever) {
    console.log(trapTarget === target);
    console.log(reciever === proxy);
    console.log(property);
    return "重写的名字";
    //  我们执行部分操作，要返回目标对象的值，不做改变
    //  return trapTarget[property]
  }
};

const proxy = new Proxy(target, handler);

console.log(target.name); // lorry
console.log(proxy.name); // override name
