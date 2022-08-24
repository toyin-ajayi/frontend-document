## 模拟实现Set

### 首先需要实现的方法

- add(value)：添加某个值，返回 Set 结构本身(可以链式调用)。
- delete(value)：删除某个值，删除成功返回true，否则返回false。
- has(value)：返回一个布尔值，表示该值是否为Set的成员。
- clear()：清除所有成员，没有返回值。
- keys()：返回键名的遍历器。
- values()：返回键值的遍历器。
- entries()：返回键值对的遍历器。
- forEach()：使用回调函数遍历每个成员。

### 返回迭代器和遍历迭代器需要的工具函数

- createIterator(arr) :创建迭代器
- forOf(Iterator,callback)：遍历迭代器

### 特别注意Set对于NaN的处理

- 我们需要将多个NaN合成一个NaN
- 内部查询NaN时不能用简单的比较，因为NaN!==NaN,我们需要用Symbol(NaN)做特殊处理
- this.SymbolNaN = Symbol(NaN)
- encodeVal 将NaN转为SymbolNaN
- decodeVal SymbolNaN转为NaN