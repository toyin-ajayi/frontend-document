## New干了什么

- (1) 创建一个新对象；
- (2) 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象） ；
- (3) 执行构造函数中的代码（为这个新对象添加属性） ；
- (4) 绑定原型；
- (5) 返回新对象。

注意：

- 如果构造函数有返回的值并且为基本类型的话则没有影响，返回值毫无意义；
- 如果返回值的类型为object，那这个返回值会被正常使用

```tsx
function Test(name) {
  this.name = name
  return 1
}
const t = new Test('jjc')
console.log(t.name) // 'jjc'


function Test(name) {
  this.name = name
  console.log(this) // Test { name: 'jjc' }
  return { age: 26 }
}
const t = new Test('jjc')
console.log(t) // { age: 26 }
console.log(t.name) // 'undefined'

```

## 实现方式
因为 new 是关键字，所以无法直接覆盖，所以我们写一个函数，命名为 myNew，来模拟 new 的效果。用的时候是这样的：
```tsx
function person() {
    ……
}

// 使用 new
var person = new person(……);
// 使用 objectFactory
var person = myNew(person, ……)
```
## 实现过程
因为 new 的结果是一个新对象，所以在模拟实现的时候，我们也要建立一个新对象，假设这个对象叫 obj，因为 obj 会具有 Otaku 构造函数里的属性，想想经典继承的例子，我们可以使用 Otaku.apply(obj, arguments)来给 obj 添加新的属性。

```tsx
function myNew() {
//用new Object() 的方式新建了一个对象 obj
    var obj = new Object(),
//取出传入的构造函数。此外因为shift会修改原数组，所以arguments会被去除第一个参数
    Constructor = [].shift.call(arguments);
//将 obj 的原型指向构造函数，这样 obj 就可以访问到构造函数原型中的属性
    obj.__proto__ = Constructor.prototype;
//使用 apply，改变构造函数 this 的指向到新建的obj对象，并执行了Constructor，这样obj就会被添加属性
     var ret = Constructor.apply(obj, arguments);
//判断返回的值是不是一个对象，如果是一个对象，我们就返回这个对象，如果不是，我们原样返回    
    return typeof ret === 'object' ? ret : obj;
};

```

## 验证myNew

```tsx
function person(name, age) {
    this.name = name;
    this.age = age;

    this.habit = 'Games';
}

person.prototype.strength = 60;

person.prototype.sayYourName = function () {
    console.log('I am ' + this.name);
}


var person = myNew(person, 'Kevin', '18')

console.log(person.name) // Kevin
console.log(person.habit) // Games
console.log(person.strength) // 60

person.sayYourName(); // I am Kevin


```

## New的其他简洁写法

```tsx
function myNew(Con, ...args) {
  let obj = {}
//等同于 obj.__proto__ = Con.prototype
  Object.setPrototypeOf(obj, Con.prototype)
  let result = Con.apply(obj, args)
  return result instanceof Object ? result : obj
}

```

