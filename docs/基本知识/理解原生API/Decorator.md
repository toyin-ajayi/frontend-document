## 修饰器

### 修饰类

```js
@testable
class MyTestableClass {
  // ...
}

function testable(target) {
  target.isTestable = true;
}

MyTestableClass.isTestable // true
```

基本上，装饰器的行为就是下面这样。

```JS
@decorator
class A {}

// 等同于

class A {}
A = decorator(A) || A;
```

如果觉得一个参数不够用，可以在装饰器外面再封装一层函数。

```TS
function testable(isTestable) {
  return function(target) {
    target.isTestable = isTestable;
  }
}

@testable(true)
class MyTestableClass {}
MyTestableClass.isTestable // true

@testable(false)
class MyClass {}
MyClass.isTestable // false
```

### 修饰属性方法


类似于defineProperty
```TS
class Person {
  @readonly
  name() { return `${this.first} ${this.last}` }
}
```

```TS
function readonly(target, name, descriptor){
  // descriptor对象原来的值如下
  // {
  //   value: specifiedFunction,
  //   enumerable: false,
  //   configurable: true,
  //   writable: true
  // };
  descriptor.writable = false;
  return descriptor;
}

readonly(Person.prototype, 'name', descriptor);
// 类似于
Object.defineProperty(Person.prototype, 'name', descriptor);
```

### 装饰器不能用于函数

装饰器只能用于类和类的方法，不能用于函数，因为存在函数提升。


```
var counter = 0;

var add = function () {
  counter++;
};

@add
function foo() {
}
```

上面的代码，意图是执行后counter等于 1，但是实际上结果是counter等于 0。因为函数提升，使得实际执行的代码是下面这样。

```
var counter;
var add;

@add
function foo() {
}

counter = 0;

add = function () {
  counter++;
};
```