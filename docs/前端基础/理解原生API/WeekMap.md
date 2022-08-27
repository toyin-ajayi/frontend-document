## WeakMap

WeakMap结构与Map结构类似，也是用于生成键值对的集合。

首先，WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名。

Symbol值作为 WeakMap 的键名，都会报错。

## 作用

WeakMap的设计目的在于，有时我们想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用。

```tsx
const e1 = document.getElementById('foo');
const e2 = document.getElementById('bar');
const arr = [
  [e1, 'foo 元素'],
  [e2, 'bar 元素'],
];
```

e1和e2是两个对象，我们通过arr数组对这两个对象添加一些文字说明。这就形成了arr对e1和e2的引用。(`arr[0][0]->e1`)

一旦不再需要这两个对象，我们就必须手动删除这个引用，否则垃圾回收机制就不会释放e1和e2占用的内存。

```tsx
// 不需要 e1 和 e2 的时候
// 必须手动删除引用
arr [0] = null;
arr [1] = null;
```


## 键名所引用的对象都是弱引用

上面的列子一旦忘了手动删除引用，就会造成内存泄露。
WeakMap 就是为了解决这个问题而诞生的，它的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。

基本上，如果你要往对象上添加数据，又不想干扰垃圾回收机制，就可以使用 WeakMap。

## 对比Map和WeekMap

虽然我们手动将obj，进行释放，然是**target依然对obj(键)**存在强引用关系，所以这部分内存依然无法被释放。
```tsx
let obj = { name : 'jjc'}
const target = new Map();
target.set(obj,'123');
obj = null;
```

如果是WeakMap的话，target和obj存在的就是弱引用关系，当下一次垃圾回收机制执行时，这块内存就会被释放掉。
```tsx
let obj = { name : 'jjc'}
const target = new WeakMap();
target.set(obj,'123');
obj = null;

```
可以将WeekMap用到深拷贝和让DOM作为键添加映射信息时