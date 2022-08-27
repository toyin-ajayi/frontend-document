##  Map

Map对象保存键值对。任何值(对象或者原始值) 都可以作为一个键或一个值。构造函数Map可以接受一个数组作为参数。

Map和Object的区别
- Map可以是值-值映射，对象也可以作为键。而Object是字符串的键-值
- Map中的键值是有序的（FIFO 原则），而添加到对象中的键则不是。
- Map的键值对个数可以从 size 属性获取，而 Object 的键值对个数只能手动计算。
- Object 都有自己的原型，原型链上的键名有可能和你自己在对象上的设置的键名产生冲突。

### Map对象的操作方法

- set(key, val): 向Map中添加新元素
- get(key): 通过键值查找特定的数值并返回
- has(key): 判断Map对象中是否有Key所对应的值，有返回true,否则返回false
- delete(key): 通过键值从Map中移除对应的数据
- clear(): 将这个Map中的所有元素删除

### Map对象的遍历方法

- keys()：返回键名的遍历器
- values()：返回键值的遍历器
- entries()：返回键值对的遍历器
- forEach()：使用回调函数遍历每个成员

```tsx
const map = new Map([['a', 1], ['b',  2]])

for (let key of map.keys()) {
  console.log(key)
}
// "a"
// "b"

for (let item of map.entries()) {
  console.log(item)
}
// ["a", 1]
// ["b", 2]
// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value)
}
// "a" 1
// "b" 2
```

### 只有对同一个对象的引用，Map 结构才将其视为同一个键

```tsx
const k1 = ['a'];
const k2 = ['a'];

map.set(k1, 111).set(k2, 222);

map.get(k1) // 111
map.get(k2) // 222
```
Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键，因为 k1 和 k2 是两个不同的对象，放在不同的内存地址中，所以Map视为不同的键

## Set

Set对象允许你存储任何类型的值，无论是原始值或者是对象引用。它类似于数组，但是成员的值都是唯一的，没有重复的值。
Set 本身是一个构造函数，用来生成Set 数据结构。Set函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。

### Set中的特殊值

Set 对象存储的值总是唯一的，所以需要判断两个值是否恒等。有几个特殊值需要特殊对待：

+0 与 -0 在存储判断唯一性的时候是恒等的，所以会被去重（只有Object.is才能区分）
undefined 与 undefined 是恒等的，所以不重复
NaN 与 NaN 是不恒等的，但是在 Set 中认为NaN与NaN相等，所有只能存在一个，不重复。

### Set的操作的方法

- add(value)：添加某个值，返回 Set 结构本身(可以链式调用)。
- delete(value)：删除某个值，删除成功返回true，否则返回false。
- has(value)：返回一个布尔值，表示该值是否为Set的成员。
- clear()：清除所有成员，没有返回值。

### Set的遍历方法

- keys()：返回键名的遍历器。
- values()：返回键值的遍历器。
- entries()：返回键值对的遍历器。
- forEach()：使用回调函数遍历每个成员。

由于Set结构没有键名，只有键值（或者说键名和键值是同一个值），所以keys方法和values方法的行为完全一致。

```tsx
const set = new Set(['a', 'b', 'c'])

for (let item of set.keys()) {
  console.log(item)
}
// a
// b
// c
```