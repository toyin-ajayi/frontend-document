// 第一版有一个缺陷，如果我们修改resFunc的原型就会影响调用bind的函数的原型
Function.prototype.myBind = function(context) {
  if (typeof this !== "function") {
    // 调用myBind的若不是函数则报错
    throw new TypeError("not a function");
  }
  const func = this;
  const args = [...arguments].slice(1);
  const resFunc = function() {
    const newArgs = [...arguments];
    // 如果new 调用 resFunc ，则 实例.proto -> resFunc.prototype
    // 又因为我们在返回 resFunc之前使得 resFunc.prototype = func.prototype
    // 所以 实例.proto -> func.prototype  而resFunc作为构造函数时 this指向实例
    // 最后 this.proto -> func.prototype，刚好可以用 instanceof 来判断
    // this instanceof func是true，那么说明是 new 调用的resFunc，则一切操作要反应到实例(this)上
    // this instanceof func是false,说明this指向的不是实例而是window
    func.apply(this instanceof func ? this : context, args.concat(newArgs));
  };
  // new 调用时 需要考虑原型链的指向
  // new resFunc时创建实例访问属性时，去resFunc.prototype找属性就是直接去func.prototype
  // 也就是直接赋值相当于共用一条原型链，会造成改一个另一个也会变
  resFunc.prototype = func.prototype;
  return resFunc;
};


// 使用中转函数优化
Function.prototype.myBind2 = function(context) {
  if (typeof this !== "function") {
    throw new TypeError("not a function");
  }
  const func = this;
  const args = [...arguments].slice(1);
  const resFunc = function() {
    const newArgs = [...arguments];
    func.apply(this instanceof func ? this : context, args.concat(newArgs));
  };
  // 建立一个中转函数           nopFunc.prototype->func.prototype
  // 然后用new重写resFunc的原型 resFunc.prototype._proto_->nopFunc.prototype
  // 最后就是 resFunc.prototype._proto_->func.prototype
  // new resFunc时创建实例访问属性时，实例先去resFunc.prototype找不到又会去resFunc.prototype._proto_找，也就是到了func.prototype
  // 如果我们直接修改resFunc.prototype就不会影响func.prototype
  let nopFunc = function() {};
  nopFunc.prototype = func.prototype;
  resFunc.prototype = new nopFunc();
  return resFunc;
};


// 把中转函数优化位Object.create
Function.prototype.myBind3 = function(context) {
  if (typeof this !== "function") {
    throw new TypeError("not a function");
  }
  const func = this;
  const args = [...arguments].slice(1);
  const resFunc = function() {
    const newArgs = [...arguments];
    func.apply(this instanceof func ? this : context, args.concat(newArgs));
  };
  resFunc.prototype = Object.create(func.prototype);// 修改resFunc.prototype就不会影响func.prototype
  return resFunc;
};

// 总结三版
// myBind返回的方法原型链和调用者共用，修改一个全得变
// myBind2返回方法的原型链是new出来的对象，新开了一块内存空间，修改不会影响原函数的原型，找属性时会多走一步__proto__
// myBind3 Object.create 在完成返回方法的原型指向调用的方法时，帮我们完成了中转

var value = 2;

var foo = {
  value: 1
};

function bar(name, age) {
  this.habit = "shopping";
  console.log(this.value);
  console.log(name);
  console.log(age);
}

bar.prototype.friend = "kevin";

var bindFoo = bar.myBind(foo, "daisy");

var obj = new bindFoo("18");
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend); //kevin

function doit() {
  console.log(this.value);
}
doit.bind(foo)();
