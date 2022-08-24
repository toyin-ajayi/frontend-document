Function.prototype.myApply = function(context) {
    // 获取参数 只有这里和call有区别 其他都是一样的
    const args = arguments[1];
    // 第二个参数必须传入的是数组
    if (Object.prototype.toString.call(args)!=='[object Array]') {
      // 调用call的若不是函数则报错
      throw new TypeError("Error 第二个参数必须为数组");
    }
    // 如果是在浏览器端的非严格模式下context是undefined会转为window
    context = context || window;
    // 我们并不知道context这个上下文里已经存在了那些属性，但我们要把调用的方法添加到这个context里，所以采用symbol避免覆盖原有属性
    const func = Symbol("func");
    // this指向的是调用myCall的方法
    context[func] = this;
    // 采用对象的方法调用模式，this就指向了这个对象
    const res = context[func](...args);
    delete context[func];
    return res;
  };
  
  const name = "window";
  
  function test(adj,noun) {
    console.log(this.name + adj+noun);
  }
  
  const obj = {
    name: "简佳成"
  };
  
  test.myApply(obj, ["good",'study']);
  test.myApply(obj, "good");
  
  