## JavaScript 数据类型

ECMAScript 标准规定了 7 种数据类型，其把这 7 种数据类型又分为两种：原始类型和对象类型。

### 原始类型

- Null：只包含一个值：null
- Undefined：只包含一个值：undefined
- Boolean：包含两个值：true 和 false
- Number：整数或浮点数，还有一些特殊值（-Infinity、+Infinity、NaN）
- String：一串表示文本值的字符序列
- Symbol：一种实例是唯一且不可改变的数据类型

### 对象类型

Object：自己分一类丝毫不过分，除了常用的 Object，Array、Function 等都属于特殊的对象

### 为什么区分原始类型和对象类型

#### 不可变性

在 ECMAScript 标准中，它们被定义为 primitive values，即原始值，代表值本身是不可被改变的。我们在调用操作字符串的方法时，没有任何方法是可以直接改变字符串的,都是返回一个新的字符串。

#### 可变性

引用类型在堆内存中： -存储的值大小不定，可动态调整 -空间较大，运行效率低 -无法直接操作其内部存储，使用引用地址读取 -通过代码进行分配空间

## 变量类型与存储空间

### 栈内存和堆内存

![](/img/blog/29/3.png)

### 基本数据类型

string、number、null、undefined、boolean、symbol(ES6 新增) 变量值存放在栈内存中，可直接访问和修改变量的值
基本数据类型不存在拷贝，好比如说你无法修改数值 1 的值

### 引用类型

Object Function RegExp Math Date 值为对象，存放在堆内存中
在栈内存中变量保存的是一个指针，指向对应在堆内存中的地址。
当访问引用类型的时候，要先从栈中取出该对象的地址指针，然后再从堆内存中取得所需的数据

### 图解存储空间

```
let a1 = 0; // 栈内存
let a2 = "this is string" // 栈内存
let a3 = null; // 栈内存
let b = { x: 10 }; // 变量b存在于栈中，{ x: 10 }作为对象存在于堆中
let c = [1, 2, 3]; // 变量c存在于栈中，[1, 2, 3]作为对象存在于堆中
```

![](/img/blog/29/1.png)

### 引用类型的赋值

```
let a = { x: 10, y: 20 }
let b = a;
b.x = 5;
console.log(a.x); // 5
```

![](/img/blog/29/2.png)


## 还有一种比较特殊的包装类型

为什么可以在一个基本类型字符串上调用方法？
```
String.prototype.giveLydiaPizza = () => {
  return "Just give Lydia pizza already!";
};

const name = "Lydia";

name.giveLydiaPizza();

```

原因是基本类型的值被临时转换或强制转换为对象，因此name变量的行为类似于对象。 除null和undefined之外的每个基本类型都有自己包装对象。也就是：String，Number，Boolean，Symbol和BigInt。

- 创建一个String的包装类型实例
- 在实例上调用giveLydiaPizza方法
- 销毁实例