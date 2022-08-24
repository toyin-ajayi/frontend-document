## instanceof

instanceof 的运算规则很复杂：
```
假设instanceof运算符左边是L，右边是R
L instanceof R //instanceof运算时，通过判断L的原型链上是否存在R.prototype
L.__proto__.__proto__ ..... === R.prototype ？ //递归查找,找到顶层为止,如果存在返回true 否则返回false
```
一句话理解 instanceof 的运算规则为：

instanceof 检测左侧的 `__proto__` 原型链上，是否存在右侧的 prototype 原型。

我的理解就是：

判断右侧的构造函数能不能一步一步构造出的左侧这个实例.
用于测试构造函数的prototype属性是否出现在对象的原型链中的任何位置.

```
[] instanceof Array // true
[] instanceof Object // true Object->Array->[]
function(){}  instanceof Object // true
```