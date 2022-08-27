## Symbol

### 不能使用new命令
Symbol函数前不能使用new命令，否则会报错，也就是说Symbol 是一个原始类型的值，不是对象，也不能添加属性
```tsx
let s = Symbol();
typeof s  // symbol
```
```tsx
let s1 = Symbol('a');
let s2 = Symbol('a');

s1 === s2  //false
```

### 有toString方法

```tsx
let s1 = Symbol('a');
let s2 = Symbol('b');

s1.toString()  // 'Symbol(a)'
s2.toString()  // 'Symbol(b)'
```

### 不能进行运算，但可以转为布尔值

```tsx
let s = Symbol();
  s + '2'       // Cannot convert a Symbol value to a string
  Boolean(s)    // true
  !s            // false
```

### 适合用作对象属性名

可以保证不会出现同名的属性，对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖；值得注意的是，Symbol 值作为对象属性名时，不能用点运算符，因为点运算符后面是一个字符串；

```tsx
let obj  = {
    [s] : 'hello world'
}

obj.s   // undefined
obj[s]  // hello world
```

### Symbol 作为属性名，不会被常规方法遍历得到

模拟实现Set的时候被坑了哈哈，确实不能遍历到

该属性不会出现在for...in、for...of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回，但是，它并不是私有属性，可以使用 Object.getOwnPropertySymbols 方法，可以获取指定对象的所有 Symbol 属性名；

```tsx
var obj = {};
var a = Symbol('a');
var b = Symbol('b');

for( let key in obj ){
   console.log(key)         // 只有c
}

var objectSymbols = Object.getOwnPropertySymbols(obj);

console.log(objectSymbols) // [Symbol(a), Symbol(b)] 然后变量这个数组去取obj[Symbol(a)]
```

### Symbol.for

接受一个字符串作为参数，然后搜索有没有以该参数作为名称的Symbol值。如果有，就返回这个Symbol值，否则就新建并返回一个以该字符串为名称的Symbol值

```tsx
Symbol.for("name") === Symbol.for("name")
// true

Symbol("name") === Symbol("name")
// false
```

### Symbol.keyFor

返回一个已登记的 Symbol 类型值的key，而Symbol()写法是没有登记机制的；

```tsx
var s1 = Symbol.for("name");
Symbol.keyFor(s1) // "name"

var s2 = Symbol("name");
Symbol.keyFor(s2) // undefined
```