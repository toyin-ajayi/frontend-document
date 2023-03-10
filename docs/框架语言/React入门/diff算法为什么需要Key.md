## diff算法为什么需要Key

### 没有key的情况

```tsx

<ul>
  <li>1</li>
  <li>2</li>
</ul>

```

头部插入

```tsx

<ul>
  <li>3</li>
  <li>1</li>
  <li>2</li>
</ul>

```

对比两棵树发现 li 第一个和第二个 li 都是改变了的，但`<li>1</li>`只是改变了位置而已，第三个元素`<li>2</li>`则被当作新增的节点。 

明明只需要更新 1 个节点，现在更新了 3 个。这样的情况效率是非常低的。

### 有key之后

```tsx

<ul>
  <li key="first">1</li>
  <li key="second">2</li>
</ul>

```
插入之后变为:

```tsx

<ul>
  <li key="third">3</li>
  <li key="first">1</li>
  <li key="second">2</li>
</ul>

```
现在 React 通过 key 就可以发现1和2原来已经存在，只是位置不同，不需要更新整个节点

## 为什么不推荐使用数组下标作为 Key

比如使用我再数组头部插入了一个元素，那全部元素对应的下标都变了，也都会触发更新

