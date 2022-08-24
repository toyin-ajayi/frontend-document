## classList

DOM 元素有个classlist接口，可以操作这个元素的类名。

classList 属性返回元素的类名，作为 DOMTokenList 对象。

该属性用于在元素中添加，移除及切换 CSS 类。

classList 属性是只读的，但你可以使用 add() 和 remove() 方法修改它。
```
value
item: ƒ item()
contains: ƒ contains()
add: ƒ add()
remove: ƒ remove()
toggle: ƒ toggle()
replace: ƒ replace()
supports: ƒ supports()
toString: ƒ toString()
entries: ƒ entries()
forEach: ƒ forEach()
keys: ƒ keys()
values: ƒ values()

DOM.classList.add('white_active');
```

## 参考

https://www.runoob.com/jsref/prop-element-classlist.html