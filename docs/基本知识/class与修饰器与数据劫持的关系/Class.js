class Person {
  static sayHello() {
    return "hello";
  }
}

Person.sayHello(); // 'hello'

var kevin = new Person();
kevin.sayHello(); // TypeError: kevin.sayHello is not a function

// 与下面等价

function Person() {}

Person.sayHello = function() {
  return "hello";
};

Person.sayHello(); // 'hello'

var kevin = new Person();
kevin.sayHello(); // TypeError: kevin.sayHello is not a function

/* ******************************************** */

class Person {}

Person.name = "kevin";

class Person {
  static name = "kevin";
}

//对应到 ES5 都是

function Person() {};

Person.name = 'kevin';


/* ******************************************** */

/* _createClass是一个闭包+立即执行函数，以这种方式模拟一个作用域，将defineProperties私有化。
这个函数的主要作用是通过Object.defineProperty给类添加方法，
其中将静态方法添加到构造函数上，将非静态的方法添加到构造函数的原型对象上。 */
var _createClass = function () { 
    function defineProperties(target, props) { 
        for (var i = 0; i < props.length; i++) { 
            var descriptor = props[i]; 
            descriptor.enumerable = descriptor.enumerable || false; 
            descriptor.configurable = true; 
            if ("value" in descriptor) 
                descriptor.writable = true; 
            Object.defineProperty(target, descriptor.key, descriptor); 
        } 
    } 
    return function (Constructor, protoProps, staticProps) { 
        if (protoProps) defineProperties(Constructor.prototype, protoProps); //非静态函数 -> 原型
        if (staticProps) defineProperties(Constructor, staticProps); return Constructor; // 静态函数 -> 构造函数
    }; 
}();




