## 可迭代协议和迭代器协议

[参考 MDN：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)

### 可迭代协议

可迭代协议允许 JavaScript 对象去定义或定制它们的迭代行为, 例如（定义）在一个 for..of 结构中什么值可以被循环（得到）。一些内置类型都是内置的可迭代类型并且有默认的迭代行为, 比如 Array or Map, 另一些类型则不是 (比如 Object) 。
为了变成可迭代对象， 一个对象必须实现 @@iterator 方法, 意思是这个对象（或者它原型链 prototype chain 上的某个对象）必须有一个名字是 **Symbol.iterator** 的属性。
当一个对象需要被迭代的时候（比如开始用于一个 for..of 循环中），它的@@iterator 方法被调用并且无参数，然后返回一个用于在迭代中获得值的迭代器

### 迭代器协议

该迭代器协议定义了一种标准的方式来产生一个有限或无限序列的值，并且当所有的值都已经被迭代后，就会有一个默认的返回值。
当一个对象只有满足下述条件才会被认为是一个迭代器：
它**实现了一个 next() 的方法**并且拥有以下含义
返回一个对象的无参函数，被返回对象拥有两个属性：

- `done`(boolean)
  - true:迭代器已经超过了可迭代次数。这种情况下,value 的值可以被省略
  - 如果迭代器可以产生序列中的下一个值，则为 false。这等效于没有指定 done 这个属性。
- `value`\- 迭代器返回的任何 JavaScript 值。done 为 true 时可省略。
  next 方法必须要返回一一个对象，该对象有两个必要的属性： done 和 value，如果返回一个非对象值（比如 false 和 undefined)  会展示一个  [`TypeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError "TypeError（类型错误） 对象用来表示值的类型非预期类型时发生的错误。")("iterator.next() returned a non-object value") 的错误

```tsx
var myIterator = {
    next: function() {
        // ...
    },
    [Symbol.iterator]: function() { return this }
}
```

## 可迭代对象(Iterable)

- 满足可迭代协议的对象是可迭代对象。
- 可迭代协议: 对象的[Symbol.iterator]值是一个无参函数，该函数返回一个迭代器(Iterator)。
- 原生具备 Iterator 接口的数据结构如下。 - Array - Map - Set - String - TypedArray - 函数的 arguments 对象 - NodeList 对象

```tsx

   // for...of会获取可迭代对象的[Symbol.iterator]()，对该迭代器逐次调用next()
   // 直到迭代器返回对象的done属性为true时，遍历结束
    for (let value of ["a", "b", "c"]) {
      console.log(value);
    }
```

## 手写一个迭代器(Iterator)

```tsx
    /*
        这是一个手写的迭代器(Iterator)
        满足迭代器协议的对象。
        迭代器协议: 对象的next方法是一个无参函数，它返回一个对象，该对象拥有done和value两个属性：
    */
    var it = makeIterator(["a", "b"]);

    it.next(); // { value: "a", done: false }
    it.next(); // { value: "b", done: false }
    it.next(); // { value: undefined, done: true }

    function makeIterator(array) {
      var nextIndex = 0;
      return {
        next: function() {
          return nextIndex < array.length
            ? { value: array[nextIndex++], done: false }
            : { value: undefined, done: true };
        },
      };
    }
```

## 使自己迭代器可迭代（迭代器返回可迭代对象(Iterable)）

一个良好的迭代即实现了迭代器协议，又实现了可迭代协议，方式就是可迭代协议返回的是自身

```tsx
    /*
        使迭代器可迭代
        makeIterator函数生成的迭代器并没有实现可迭代协议
        所以不能在for...of等语法中使用。
        可以为该对象实现可迭代协议，在[Symbol.iterator]函数中返回该迭代器自身
        从新名了下函数名称createIterator
    */
    function createIterator(array) {
      var nextIndex = 0;
      return {
        next: function() {
          return nextIndex < array.length
            ? { value: array[nextIndex++], done: false }
            : { value: undefined, done: true };
        },
        [Symbol.iterator]: function () {
            console.log("返回的迭代器:",this)
            return this // 注意这里是对象调用模式，this指向的就是上层的对象，迭代器
        }
      };
    }

    var iterator = createIterator([1, 2, 3]);
    console.log(...iterator)
```

## 什么是生成器(Generator)

上面的函数看出，手动写个`iterator`太麻烦了，所以`ES6`推出`generator`，方便创建`iterator`。也就是说，`generator`就是一个返回值为迭代器`iterator`的函数。（感觉就是我们上面函数的语法糖）
[生成器对象既是迭代器，又是可迭代对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#%E7%94%9F%E6%88%90%E5%99%A8%E5%AF%B9%E8%B1%A1%E5%88%B0%E5%BA%95%E6%98%AF%E4%B8%80%E4%B8%AA%E8%BF%AD%E4%BB%A3%E5%99%A8%E8%BF%98%E6%98%AF%E4%B8%80%E4%B8%AA%E5%8F%AF%E8%BF%AD%E4%BB%A3%E5%AF%B9%E8%B1%A1)

```tsx
function *aGeneratorfunction(){
  yield 1
  yield 2
  yield 3
};

var aGeneratorObject = aGeneratorfunction()

// 满足迭代器协议，是迭代器
aGeneratorObject.next()   // {value: 1, done: false}
aGeneratorObject.next()   // {value: 2, done: false}
aGeneratorObject.next()   // {value: 3, done: false}
aGeneratorObject.next()   // {value: undefined, done: true}

// [Symbol.iterator]是一个无参函数，该函数执行后返回生成器对象本身（是迭代器），所以是可迭代对象
aGeneratorObject[Symbol.iterator]() === aGeneratorObject   // true

// 可以被迭代
var aGeneratorObject1 = aGeneratorfunction()
[...aGeneratorObject1]   // [1, 2, 3]
```

## 在生成器中 return

遍历返回对象的 done 值为 true 时迭代即结束，不对该 value 处理（return 会把 done 置为 true）

```tsx
function *createIterator() {
  yield 1;
  return 42;
  yield 2;
}

let iterator = createIterator();
iterator.next();   // {value: 1, done: false}
iterator.next();   // {value: 42, done: true}
iterator.next();   // {value: undefined, done: true}
```

```tsx
let iterator1 = createIterator();
console.log(...iterator);   // 1
```

## 生成器委托 yield\*

```tsx
function* g1() {
  yield 1;
  yield 2;
}

function* g2() {
  yield* g1();
  yield* [3, 4];
  yield* "56";
  yield* arguments;
}

var generator = g2(7, 8);
console.log(...generator);   // 1 2 3 4 "5" "6" 7 8
```

## for of

除了迭代器之外，我们还需要一个可以遍历迭代器对象的方式，ES6 提供了 for of 语句。那如何实现自己的 forOf。

其实原理很简单，通过 Symbol.iterator 属性获取迭代器对象，然后 while 遍历 next 就行了

```tsx
function forOf(obj, cb) {
    let iterable, result;

    if (typeof obj[Symbol.iterator] !== "function")
        throw new TypeError(result + " is not iterable");
    if (typeof cb !== "function") throw new TypeError("cb must be callable");

    iterable = obj[Symbol.iterator]();

    result = iterable.next();
    while (!result.done) {
        cb(result.value);
        result = iterable.next();
    }
}

```
