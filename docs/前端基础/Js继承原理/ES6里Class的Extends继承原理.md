## Class的方法都加在原型链上
JS的原型链继承的本质是根据__proto__一层一层往上找
继承的时候只需要把子类的原型对象prototype里的__proto__属性指向父类的prototype即可
这就好理解Extends在干嘛了
```
    class A {
        // constructor也是定义在A的原型链上
        constructor(x,y){
            this.x = x;
            this.y = y;
        }
        // 直接加在了function A 的原型链式
        one(){
            return 1;
        }
    }
    
    class B extends A{
        constructor(){
            //相当于A.prototype.constructor.call(this)  
            super(1,2)
        }
    }
    var x = new B()
    console.log(x)
```
 ![](/img/blog/Extends/1.png)

## 注意super关键字

- JavaScript 强制规定，如果你想在构造函数中只用this，就必须先调用 super。
- 子类 B 的构造函数中的super()，代表 B调用父类 A 的构造函数执行。
- 虽然这里的 super()代表了的 父类 A的构造函数，但是返回的却是 子类 B 的实例
- 即 super()内部的this 指的是 B。super()的参数就是转给父类构造函数的参数
- React中，super(props)的目的：在constructor中可以使用this.props。
- 组件实例化后 instance.props = props;所以render里面始终能拿到props

## 继承的时候extends干了什么

**extends在实现继承方面，本质上也是原型链继承,该方法实现了两步原型链继承** 
大多数浏览器的 ES5 实现之中，每一个对象都有\_\_proto\_\_属性，指向对应的构造函数的prototype属性。
Class 作为构造函数的语法糖，同时有prototype属性和\_\_proto\_\_属性，因此同时存在两条继承链。  
- （1）子类的\_\_proto\_\_属性，表示构造函数的继承，总是指向父类。（把子类构造函数(`Child`)的原型(`__proto__`)指向了父类构造函数(`Parent`)，）  
- （2）子类prototype属性的\_\_proto\_\_属性，表示方法的继承，总是指向父类的prototype属性。


### 第一步是将类的原型对象(prototype)里的__proto__指向父类的原型对象： 

 B.prototype = Object.create(A.prototype, {constructor:{value: B}}) 
 即将B.prototype.__proto__ =A.prototype
 
 ![](/img/blog/Extends/2.png)
 
### 第二步是将类的__proto__指向父类：
(子类是父类构建出的函数对象，需要指定对象的__proto__)
 Object.setPrototypeOf(B, A)；
 即将B.__proto__ =A (B由A构造而来)
 ![](/img/blog/Extends/3.png)
 
### 最后需要继承构造函数里的属性和方法

内部写的有点绕，但最后还是通过apply(this, arguments)来继承的
```
(function(_A) {
    //继承原型对象上的属性和方法
    _inherits(B, _A);
    
    function B() {
      _classCallCheck(this, B);
      //继承构造函数中的实例属性和方法
      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(B).apply(this, arguments)
      );
    }

    return B;
  })(A);


```
 
## babeljs对extends语法糖的部分编译结果
 
```
function _inherits(subClass, superClass) {
    //对superClass进行类型判断
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  //子类的prototype继承父类的prototype
  //也就是说执行后 subClass.prototype.__proto__ === superClass.prototype; 这条语句为true
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { 
        value: subClass, 
        writable: true, 
        configurable: true 
    }
  });
  //子类是父类构建出的函数对象，需要指定对象的__proto__
  if (superClass) _setPrototypeOf(subClass, superClass);
} 
```



## 联系寄生组合继承(call+寄生式封装)
寄生组合式继承原理：
1.  使用借用构造函数(`call`)来**继承父类this声明的属性/方法**
2.  通过寄生式封装函数设置父类prototype为子类prototype的原型来继**承父类的prototype声明的属性/方法**。
可以发现ES6类的继承其实就是基于寄生组合继承来实现的，只是比这里多了一步 Object.setPrototypeOf(subType, superType)；
```
function inheritPrototype(subType, superType){
    //原型式继承：浅拷贝superType.prototype对象作为superType.prototype为新对象的原型
    // 内部会自带_proto_指向：prototype.\_\_proto\_\_ = superType.prototype;
    var prototype = Object.create(superType.prototype); 
    // subType.prototype.\_\_proto\_\_ = superType.prototype;
    subType.prototype = prototype;               // 将子类的原型替换为这个原型
    prototype.constructor = subType;             // 修正原型的构造函数
    
}

function SuperType(name){
    this.name = name;
    this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function(){
    alert(this.name);
};

function SubType(name, age){
    SuperType.call(this, name);
    this.age = age;
}
// 核心：因为是对父类原型的复制，所以不包含父类的构造函数，也就不会调用两次父类的构造函数造成浪费
inheritPrototype(SubType, SuperType);
SubType.prototype.sayAge = function(){
    alert(this.age);
}
```