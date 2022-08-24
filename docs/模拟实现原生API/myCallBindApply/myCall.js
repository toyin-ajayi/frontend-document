Function.prototype.myCall = function(context) {
  if (typeof this !== "function") {
    // 调用call的若不是函数则报错
    throw new TypeError("Error");
  }
  // 如果是在浏览器端的非严格模式下context是undefined会转为window
  context = context || window;
  // 获取参数 arguments是类数组需要转化一下
  const args = [...arguments].slice(1);
  // 我们并不知道context这个上下文里已经存在了那些属性，但我们要把调用的方法添加到这个context里，所以采用symbol避免覆盖原有属性
  const func = Symbol("func");
  // this指向的是调用myCall的方法
  context[func] = this;
  // 采用对象的方法调用模式，this就指向了这个对象
  const res = context[func](...args);// 如果是es5 用eval('context[func]('+arg+')');
  delete context[func];
  return res;
};

const name = "window";

function test(adj) {
  console.log(this.name + adj);
}

const obj = {
  name: "简佳成"
};

test.myCall(obj, "good");
test.myCall(undefined, "good");

