## 私有属性的特点

私有属性的特点：不会暴露在外，不能通过this直接访问。子类不能继承私有属性

## 约定命名

目前使用最广的方式：约定命名，又称为：自己骗自己或者潜规则。


## 闭包

闭包在很多时候被拿来解决模块化问题，显而易见，私有变量本质上也是一种模块化问题，所以，我们也可以使用闭包来解决私有变量的问题。

我们在构造函数中定义一个局部变量，然后通过方法引用，该变量就成为了真正的私有变量。
```tsx
class A {
    constructor (x) {
        let _x = x
        this.showX = function () {
            return _x
        }
    }
}

let a = new A(1)
// 无法访问
a._x		// undefined
// 可以访问
a.showX()	// 1
```

有个很大的问题，在这种情况下，引用私有变量的方法不能定义在原型链上，只能定义在构造函数中，也就是实例上。这导致了两个缺点：

- 增加了额外的性能开销
- 构造函数包含了方法，较为臃肿，对后续维护造成了一定的麻烦

## 进阶版闭包

然在构造函数内部定义闭包那么麻烦，那我放在 class 外面不就可以了吗？

我们可以通过 IIFE （立即执行函数表达式） 建立一个闭包，在其中建立一个变量以及 class ，通过 class 引用变量实现私有变量。

```tsx
// 利用闭包生成IIFE，返回类A
const A = (function() {
    // 定义私有变量_x
    let _x

    class A {
        constructor (x) {
            // 初始化私有变量_x
            _x = x
        }

        showX () {
            return _x
        }
    }

    return A
})()

let a = new A(1)

// 无法访问
a._x		// undefined
// 可以访问
a.showX()	//1

```

## Symbol

这种方式利用的是 Symbol 的唯一性—— 敌人最大的优势是知道我方key值，我把key值弄成唯一的，敌人不就无法访问了吗？

```tsx
// 定义symbol
const _x = Symbol('x')

class A {
    constructor (x) {
        // 利用symbol声明私有变量
        this[_x] = x
    }
    showX () {
        return this[_x]
    }
}

let a = new A(1)

// 自行定义一个相同的Symbol
const x = Symbol('x')
// 无法访问
a[x]		// undefined
// 可以访问
a.showX()	//1

```

##  WeakMap实现私有属性

与Symbol实现的私有属性相同，由于都在constructor中，所以仅实现了私有属性的不暴露，但是没有实现不可继承。
```tsx
const privateData = new WeakMap();

class Person {
    constructor() {
        this.name="name"
        privateData.set(this, { age: "age" });
    }

    getName() {
        return privateData.get(this).name;
    }
    getAge() {
        return privateData.get(this).age;
    }
}

 class Student extends Person{
    constructor(){
        super()
    }
 }
 let student=new Student()
 console.log(student)
console.log(student.getAge())
```