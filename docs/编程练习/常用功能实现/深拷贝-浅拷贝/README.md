## 变量类型与存储空间

### 栈内存和堆内存
![](/img/blog/29/3.png)

### 基本数据类型
string、number、null、undefined、boolean、symbol(ES6新增) 变量值存放在栈内存中，可直接访问和修改变量的值
基本数据类型不存在拷贝，好比如说你无法修改数值1的值

### 引用类型
Object Function RegExp Math Date 值为对象，存放在堆内存中
在栈内存中变量保存的是一个指针，指向对应在堆内存中的地址。
当访问引用类型的时候，要先从栈中取出该对象的地址指针，然后再从堆内存中取得所需的数据


### 图解存储空间

```tsx
let a1 = 0; // 栈内存
let a2 = "this is string" // 栈内存
let a3 = null; // 栈内存
let b = { x: 10 }; // 变量b存在于栈中，{ x: 10 }作为对象存在于堆中
let c = [1, 2, 3]; // 变量c存在于栈中，[1, 2, 3]作为对象存在于堆中
```
![](/img/blog/29/1.png)

### 引用类型的赋值

```tsx
let a = { x: 10, y: 20 }
let b = a;
b.x = 5;
console.log(a.x); // 5
```
![](/img/blog/29/2.png)



## 深拷贝和浅拷贝

### 深拷贝
将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新的区域存放新对象,且修改新对象不会影响原对象

### 浅拷贝
浅拷贝是按位拷贝对象，它会创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值；如果属性是内存地址（引用类型），拷贝的就是内存地址

### 对象的赋值
当我们把一个对象赋值给一个新的变量时，赋的其实是该对象的在栈中的地址，而不是堆中的数据。也就是两个对象指向的是同一个存储空间，无论哪个对象发生改变，其实都是改变的存储空间的内容，因此，两个对象是联动的。

### 三者对比
![](/img/blog/29/4.png)

## 浅拷贝的常用的五种方法
### Object.assign()
- Object.assign() 方法可以把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。但是 Object.assign()进行的是浅拷贝
- Object.assign 会从左往右遍历源对象(sources)的所有属性，然后用 = 赋值到目标对象(target)

```tsx
		var obj = { a: {a: "kobe", b: 39},b:1 };
		var initalObj = Object.assign({}, obj);
		initalObj.a.a = "wade";
		initalObj.b = 2;
		console.log(obj.a.a); //wade
		console.log(obj.b); //1
```
### 扩展运算符

```tsx
let obj = {a:1,b:{c:1}}
let obj2 = {...obj};
obj.a=2;
console.log(obj); //{a:2,b:{c:1}}
console.log(obj2); //{a:1,b:{c:1}}

obj.b.c = 2;
console.log(obj); //{a:2,b:{c:2}}
console.log(obj2); //{a:1,b:{c:2}}

```

### Array.prototype.slice
- slice() 方法返回一个新的数组对象，这一对象是一个由 begin和 end（不包括end）决定的原数组的浅拷贝。原始数组的基本类型不会被改变，引用类型会被改变。

```tsx
let arr = [1, 3, {
    username: ' kobe'
    }];
let arr3 = arr.slice();
arr3[0]=0;
arr3[2].username = 'wade'
console.log(arr);
```
![](/img/blog/29/5.png)

### Array.prototype.concat()

```tsx
let arr = [1, 3, {
    username: 'kobe'
    }];
let arr2=arr.concat();   
arr3[0]=0;
arr2[2].username = 'wade';
console.log(arr);
```
![](/img/blog/29/5.png)

### 手写浅拷贝

```tsx
function shallowCopy(src) {
    var dst = {};
    for (var prop in src) {
        if (src.hasOwnProperty(prop)) {
            dst[prop] = src[prop];
        }
    }
    return dst;
}

```
## 深拷贝的常用方法
### JSON.parse(JSON.stringify())
通过JSON.stringify实现深拷贝有几点要注意
- 拷贝的对象的值中如果有函数,undefined,symbol则经过JSON.stringify()序列化后的JSON字符串中这个键值对会消失
- 无法拷贝不可枚举的属性，无法拷贝对象的原型链
- 拷贝Date引用类型会变成字符串
- 拷贝RegExp引用类型会变成空对象
- 对象中含有NaN、Infinity和-Infinity，则序列化的结果会变成null
- 无法拷贝对象的循环应用(即obj[key] = obj)


```tsx
let arr = [1, 3, {
    username: ' kobe'
}];
let arr4 = JSON.parse(JSON.stringify(arr));
arr4[2].username = 'duncan'; 
console.log(arr, arr4)

```
![](/img/blog/29/6.png)

### $.extend(true, object, object1,);
[参考jQuery官方文档][1]

### 手写乞丐版深拷贝
- 首先这个deepClone函数并不能复制不可枚举的属性以及Symbol类型
- 这里只是针对Object引用类型的值做的循环迭代，而对于Array,Date,RegExp,Error,Function引用类型无法正确拷贝
- 对象成环，即循环引用 (例如：obj1.a = obj)
```tsx
function clone(target) {
    if (typeof target === 'object') {
        let cloneTarget = Array.isArray(target) ? [] : {};
        for (const key in target) {
            cloneTarget[key] = clone(target[key]);
        }
        return cloneTarget;
    } else {
        return target;
    }
};

```

### 升级版
- 用weekmap解决循环引用
- weekmap对键是弱应用也解决了垃圾回收问题
```js
function deepClone(target, map = new WeakMap()) {
  if (typeof target === "object") {
    let cloneTarget = Array.isArray(target) ? [] : {};
    if (map.has(target)) return map.get(target);
    map.set(target,cloneTarget);
    for (let key in target) {
      cloneTarget[key] = deepClone(target[key],map);
    }
    return cloneTarget;
  } else {
    return target;
  }
}
```

### 改递归为循环版

```tsx
function deepClone(data){
    const root = {}
    const loopList = [
        {
            parent:root,
            key:undefined,
            data:data
        }
    ]
    while(loopList.length>0){
        const node = loopList.pop()// 从后面取，后面进，进行深度优先搜索
        const {parent,key,data} = node
        let res = parent
        if(key!==undefined){
            // 如果有key，则表明 上层data[key]是一个对象，也就是传过来的data是一个对象
            // 表明的parent的key的数据需要拷贝，所以创建一个对象来拷贝它到parent[key]上
            res = parent[key] = {}
        }
        for(let key in data){
            if(typeof data[key] == 'object'){
                loopList.push({
                    parent:res,
                    key:key,
                    data:data[key]
                })
            }else{
                res[key] = data[key]
            }
        }
    }
    return root
}
```

### 皇帝版深拷贝
该实例来自ConardLi大佬的github，源地址：https://github.com/ConardLi/ConardLi.github.io/tree/master/demo/deepClone
```tsx
    const mapTag = "[object Map]";
    const setTag = "[object Set]";
    const arrayTag = "[object Array]";
    const objectTag = "[object Object]";
    const argsTag = "[object Arguments]";

    const boolTag = "[object Boolean]";
    const dateTag = "[object Date]";
    const numberTag = "[object Number]";
    const stringTag = "[object String]";
    const symbolTag = "[object Symbol]";
    const errorTag = "[object Error]";
    const regexpTag = "[object RegExp]";
    const funcTag = "[object Function]";

    const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag];

    function forEach(array, iteratee) {
      let index = -1;
      const length = array.length;
      while (++index < length) {
        iteratee(array[index], index);
      }
      return array;
    }

    function isObject(target) {
      const type = typeof target;
      return target !== null && (type === "object" || type === "function");
    }

    function getType(target) {
      return Object.prototype.toString.call(target);
    }

    function getInit(target) {
      const Ctor = target.constructor;
      return new Ctor();
    }

    function cloneSymbol(targe) {
      return Object(Symbol.prototype.valueOf.call(targe));
    }

    function cloneReg(targe) {
      const reFlags = /\w*$/;
      const result = new targe.constructor(targe.source, reFlags.exec(targe));
      result.lastIndex = targe.lastIndex;
      return result;
    }

    function cloneFunction(func) {
      const bodyReg = /(?<={)(.|\n)+(?=})/m;
      const paramReg = /(?<=\().+(?=\)\s+{)/;
      const funcString = func.toString();
      if (func.prototype) {
        const param = paramReg.exec(funcString);
        const body = bodyReg.exec(funcString);
        if (body) {
          if (param) {
            const paramArr = param[0].split(",");
            return new Function(...paramArr, body[0]);
          } else {
            return new Function(body[0]);
          }
        } else {
          return null;
        }
      } else {
        return eval(funcString);
      }
    }

    function cloneOtherType(targe, type) {
      const Ctor = targe.constructor;
      switch (type) {
        case boolTag:
        case numberTag:
        case stringTag:
        case errorTag:
        case dateTag:
          return new Ctor(targe);
        case regexpTag:
          return cloneReg(targe);
        case symbolTag:
          return cloneSymbol(targe);
        case funcTag:
          return cloneFunction(targe);
        default:
          return null;
      }
    }

    function clone(target, map = new WeakMap()) {
      // 克隆原始类型
      if (!isObject(target)) {
        return target;
      }

      // 初始化
      const type = getType(target);
      let cloneTarget;
      if (deepTag.includes(type)) {
        cloneTarget = getInit(target, type);
      } else {
        return cloneOtherType(target, type);
      }

      // 防止循环引用
      if (map.get(target)) {
        return map.get(target);
      }
      map.set(target, cloneTarget);

      // 克隆set
      if (type === setTag) {
        target.forEach(value => {
          cloneTarget.add(clone(value, map));
        });
        return cloneTarget;
      }

      // 克隆map
      if (type === mapTag) {
        target.forEach((value, key) => {
          cloneTarget.set(key, clone(value, map));
        });
        return cloneTarget;
      }

      // 克隆对象和数组
      const keys = type === arrayTag ? undefined : Object.keys(target);
      forEach(keys || target, (value, key) => {
        if (keys) {
          key = value;
        }
        cloneTarget[key] = clone(target[key], map);
      });

      return cloneTarget;
    }

    const map = new Map();
    map.set("key", "value");
    map.set("ConardLi", "code秘密花园");

    const set = new Set();
    set.add("ConardLi");
    set.add("code秘密花园");

    const target = {
      field1: 1,
      field2: undefined,
      field3: {
        child: "child"
      },
      field4: [2, 4, 8],
      empty: null,
      map,
      set,
      bool: new Boolean(true),
      num: new Number(2),
      str: new String(2),
      symbol: Object(Symbol(1)),
      date: new Date(),
      reg: /\d+/,
      error: new Error(),
      func1: () => {
        console.log("code秘密花园");
      },
      func2: function(a, b) {
        return a + b;
      }
    };

    const result = clone(target);

    console.log(target);
    console.log(result);
```

## 参考文章
https://juejin.im/post/5b5dcf8351882519790c9a2e#heading-9
https://juejin.im/post/5d6aa4f96fb9a06b112ad5b1
https://juejin.im/post/59ac1c4ef265da248e75892b#heading-13



  [1]: https://www.jquery123.com/jQuery.extend/