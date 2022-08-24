## 原型链
当读取实例的属性时，如果找不到，就会查找与对象关联的原型中的属性，如果还查不到，就去找原型的原型，一直找到最顶层为止。
如果让原型对象指向另一个类型的实例.....有趣的事情便发生了.
即: Person.prototype = animal2
鉴于上述游戏规则生效,如果试图引用Person构造的实例person1的某个属性:
1).首先会在person1内部属性中找一遍;
2).接着会在person1.__proto__(Person.prototype)中找一遍,而Person.prototype 实际上是animal2, 也就是说在animal2中寻找该属性p1;
3).如果animal2中还是没有,此时程序不会灰心,它会继续在animal2.__proto__(Animal.prototype)中寻找...直至Object的原型对象

搜索轨迹: person1--> animal2--> Animal.prototype-->Object.prototype

这种搜索的轨迹,形似一条长链, 又因prototype在这个游戏规则中充当链接的作用,于是我们把这种实例与原型的链条称作原型链 . 

### 基础版图片

![123](/img/blog/27/1.png) 


### 延伸版图片

![123](/img/blog/27/8.png)


## JavaScript继承

> 继承意味着复制操作，然而 JavaScript 默认并不会复制对象的属性，相反，JavaScript 只是在两个对象之间创建一个关联，这样，一个对象就可以通过委托访问另一个对象的属性和函数，所以与其叫继承，委托的说法反而更准确些。
——《你不知道的JavaScript》
## 基于原型链
不同于其它大部分语言，JavaScript是基于原型的对象系统，而不是基于类。
基于原型的面向对象设计方法总共有三种。

- 拼接继承： 是直接从一个对象拷贝属性到另一个对象的模式。被拷贝的原型通常被称为mixins。ES6为这个模式提供了一个方便的工具Object.assign()。在ES6之前，一般使用Underscore/Lodash提供的.extend()，或者 jQuery 中的$.extend(), 来实现。上面那个对象组合的例子，采用的就是拼接继承的方式。

- 原型代理：JavaScript中，一个对象可能包含一个指向原型的引用，该原型被称为代理。如果某个属性不存在于当前对象中，就会查找其代理原型。代理原型本身也会有自己的代理原型。这样就形成了一条原型链，沿着代理链向上查找，直到找到该属性，或者找到根代理Object.prototype为止。原型就是这样，通过使用new关键字来创建实例以及Constructor.prototype前后勾连成一条继承链。当然，也可以使用Object.create()来达到同样的目的，或者把它和拼接继承混用，从而可以把多个原型精简为单一代理，也可以做到在对象实例创建后继续扩展。

- 函数继承：在JavaScript中，任何函数都可以用来创建对象。如果一个函数既不是构造函数，也不是 class，它就被称为工厂函数。函数继承的工作原理是：由工厂函数创建对象，并向该对象直接添加属性，借此来扩展对象（使用拼接继承）。函数继承的概念最先由道格拉斯·克罗克福德提出，不过这种继承方式在JavaScript中却早已有之。

## 借助构造函数实现继承（经典继承）

```
 function Parent1() {
   this.name = 'parent1';
 }
 
 Parent1.prototype.say = function () {}
 
 function Child1() {
   Parent1.call(this);
   this.type = 'child';
 }

 console.log(new Child1);

```
![](/img/blog/27/2.png)
这个主要是借用call 来改变this的指向，通过 call 调用 Parent ，此时 Parent 中的 this 是指 Child1。
有个缺点，从打印结果看出 Child并没有say方法，所以这种只能继承父类的实例属性和方法，不能继承原型属性/方法。
注意 constructor 属性， new 操作为了记录「临时对象是由哪个函数创建的」，所以预先给「Child.prototype」加了一个 constructor 属性：

## 借助原型链实现继承

```
function Parent2() {
  this.name = 'parent2';
  this.play = [1, 2, 3];
}

function Child2() {
  this.type = 'child2';
}
Child2.prototype = new Parent2();

console.log(new Child2);


```
![](/img/blog/27/3.png)

通过一讲的，我们知道要共享莫些属性，需要 对象.__proto__ = 父亲对象的.prototype,但实际上我们是不能直接 操作__proto__，
这时我们可以借用 new 来做，所以Child2.prototype = new Parent2(); <=> Child2.prototype.__proto__ = Parent2.prototype; 这样我们借助  new 这个语法糖，就可以实现原型链继承。
缺点：给 s1.play新增一个值 ，s2 也跟着改了。所以这个是原型链继承的缺点，原因是 s1.__pro__ 和 s2.__pro__指向同一个地址即父类Child2的prototype。

## 组合继承

是指将原型链和构造函数的相结合，发挥二者之长的一种继承模式。其思路是使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。这样，即通过在原型上定义方法实现了函数复用，又能够保证每个实例都有它自己的属性。

### 初级版
```
function Super(name){
    this.name = name;
    this.colors = ["red", "blue", "green"];
}

Super.prototype.sayName = function (){
    alert(this.name);
};

function Sub(name, age){
    Super.call(this, name);    //继承了Super 属性 (第二次调用Sup构造函数)
    this.age = age;
}

// 继承了Super 原型链上的方法 (第一次调用Sup构造函数) 注意后面需要改造这里，因为我们只想要方法，却生成了属性
Sub.prototype = new Super();    

Sub.prototype.constructor = Sub;// 
Sub.prototype.sayAge = function (){
    alert(this.age);
};

var instance1 = new Sub("Luke", 18);
instance1.colors.push("black");
alert(instance1.colors);    //"red, blue, green, black"
instance1.sayName();    //"Luke"
instance1.sayAge()    //18

var instance2 = new Sub("Jack", 20);
alert(instance2.colors);    //"red, blue, green"
instance2.sayName();    //"Jack"
instance2.sayAge()    //20
```
![](/img/blog/27/5.png)

### 优化后的组合继承

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

### 疑问1
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
下面的方法没有办法区分一个对象是直接由它的子类实例化还是父类呢？
下面这是第一个方法无法判断
```
instance1 instanceof Sub//true
instance1 instanceof Super//true

```
我们还有一个方法判断来判断对象是否是类的实例，那就是用 constructor,我在控制台打印以下内容也无法分辨：
![](/img/blog/27/7.png)


### 疑问2
为什么不用
```
Sub.prototype.__proto__ = Super.prototype
```
避免修改__proto__属性的最明显的原因是可移植性的问题。并不是所有的平台都支持修改对象原型的特性，所以无法编写可移植的代码。

避免修改__proto__属性的另一个原因是性能问题。所有现代的js引擎都深度优化了获取和设置对象属性的行为，因为这些都是一些常见的js操作。这些优化都是基于引擎对对象结构的认识上。当更改了对象的内部结构（如添加或删除该对象或其原型链中的对象的属性），将会使一些优化失效。修改__proto__属性实际上改变了继承结构本身，这可能是最具破坏性的修改。

避免修改__proto__属性的最大的原因是为了保持行为的可预测性。对象的原型链通过其一套确定的属性及属性值来定义它的行为。修改对象的原型链就像对其进行“大脑移植”，这会交换对象的整个层次结构。在某些情况下这样的操作可能是有用的，但是保持继承层次结构的相对稳定是一个基本的原则。

## 原型继承
借助原型可以基于已有的对象创建新对象， 同时还不必因此创建自定义类型
在myCreateObject()函数内部, 先创建一个临时性的构造函数, 然后将传入的对象作为这个构造函数的原型,最后返回了这个临时类型的一个新实例.

```
function myCreateObject(o){
	function F(){}
	F.prototype = o;//重写F的原型，将他指向传入的o，这就相当于继承自o
	return new F();//返回F的实例对象
}
var person = {
	friends : ["Van","Louis","Nick"]
};
var anotherPerson = myCreateObject(person);
anotherPerson.friends.push("Rob");
var yetAnotherPerson = myCreateObject(person);
yetAnotherPerson.friends.push("Style");
alert(person.friends);//"Van,Louis,Nick,Rob,Style"

```
从本质上讲, myCreateObject() 对传入其中的对象执行了一次浅复制.所用的子类都指向传入的person对象  

object.create() 方法规范化了上面的原型式继承.  上篇文章有这个方法的详细解释
```
var person = {
	friends : ["Van","Louis","Nick"]
};
var anotherPerson = Object.create(person);
anotherPerson.friends.push("Rob");
var yetAnotherPerson = Object.create(person);
yetAnotherPerson.friends.push("Style");
alert(person.friends);//"Van,Louis,Nick,Rob,Style"
console.log(anotherPerson)
```
![](/img/blog/27/4.png)

缺点：

原型链继承多个实例的引用类型属性指向相同，存在篡改的可能。
无法传递参数

## 寄生式继承(封装继承过程)
>创建一个**仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象**，最后返回对象。

核心：在原型式继承的基础上，增强对象，返回构造函数
函数的主要作用是为构造函数新增属性和方法，以增强函数
```
function createAnother(original){
  var clone = myCreateObject(original); // 通过调用 myCreateObject() 函数创建一个新对象，myCreateObject是一个任何能够返回对象的函数
  clone.sayHi = function(){  // 以某种方式来增强对象
    alert("hi");
  };
  return clone; // 返回这个对象
}

var person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"]
};
var anotherPerson = createAnother(person);
anotherPerson.sayHi(); //"hi"
```
缺点（同原型式继承）：
原型链继承多个实例的引用类型属性指向相同，存在篡改的可能。
无法传递参数

## 寄生组合继承(call+寄生式封装)
寄生组合式继承原理：
1.  使用借用构造函数(`call`)来**继承父类this声明的属性/方法**
2.  通过寄生式封装函数设置父类prototype为子类prototype的原型来继**承父类的prototype声明的属性/方法**。
组合继承有一个会两次调用父类的构造函数造成浪费的缺点，寄生组合继承就可以解决这个问题。
```
function inheritPrototype(subType, superType){
    //原型式继承：浅拷贝superType.prototype对象作为superType.prototype为新对象的原型
    // 内部会自带_proto_指向：prototype.__proto__ = superType.prototype;
    var prototype = Object.create(superType.prototype); 
    // subType.prototype.__proto__ = superType.prototype;
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

优缺点：这是一种完美的继承方式。
Object.create可以用如下函数代替

```
function myCreateObject(o){
	function F(){}
	F.prototype = o;//重写F的原型，将他指向传入的o，这就相当于继承自o
	return new F();//new里面就会把实例的__proto__指向F.prototype，达到和Object.create一样的效果
}
```





