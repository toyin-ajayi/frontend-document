## 先看一个例子————优化后的组合继承

```
function Super(name){
    this.name = name;
    this.colors = ["red", "blue", "green"];
}

Super.prototype.sayName = function (){
    alert(this.name);
};

function Sub(name, age){
    Super.call(this, name);    //继承了Super 属性
    this.age = age;
}

function F(){
}
F.prototype = Super.prototype; 
Sub.prototype = new F();    // 继承了Super 原型链上的方法

Sub.prototype.constructor = Sub;
Sub.prototype.sayAge = function (){
    alert(this.age);
};

var instance1 = new Sub("Luke", 18);
console.log(instance1 )
instance1.colors.push("black");
alert(instance1.colors);    //"red, blue, green, black"
instance1.sayName();    //"Luke"
instance1.sayAge()    //18

var instance2 = new Sub("Jack", 20);
alert(instance2.colors);    //"red, blue, green"
instance2.sayName();    //"Jack"
instance2.sayAge()    //20


```
![](/img/blog/27/6.png)

### 疑问
为什么要这么写？
```
function F(){
}
F.prototype = Super.prototype; 
Sub.prototype = new F();    // 继承了Super 原型链上的方法
```
而不是

```
Sub.prototype = Super.prototype; 
```

### 原因

上面的写发可以避免重复执行构造函数里属性的赋值，且可以区分对象是直接由它的子类实例化还是父类

下面的方法没有办法区分一个对象是直接由它的子类实例化还是父类
下面这是第一个方法无法判断
```
instance1 instanceof Sub//true
instance1 instanceof Super//true

```
我们还有一个方法判断来判断对象是否是类的实例，那就是用 constructor,我在控制台打印以下内容也无法分辨：
![](/img/blog/27/7.png)

## 最后有了Object.create来规范原型的继承

上面的封装一下
```
function F(){
}
F.prototype = Super.prototype; 
Sub.prototype = new F();    // 继承了Super 原型链上的方法
```
改为
```
function myCreateObject(obj){
	function F(){}
	F.prototype = obj;//重写F的原型，将他指向传入的obj，这就相当于继承自obj
	return new F();//返回F的实例对象
}
```
调用Sub.prototype = myCreateObject(Super.prototype)与Object.create的效果基本一致
最后别忘了更改constructor的指向Sub.prototype.constructor = Sub;
