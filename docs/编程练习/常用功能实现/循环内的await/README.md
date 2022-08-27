## 循环内执行异步会发生什么情况

forEach 或 for 循环内部的异步不能保证按照顺序执行

```tsx
async function test() {
	let arr = [4, 2, 1]
	arr.forEach(async item => {
		const res = await handle(item)
		console.log(res)
	})
	console.log('结束')
}

function handle(x) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(x)
		}, 1000 * x)
	})
}

test()

```

```tsx
结束
1
2
4

```

### forEach
forEach 只是简单的执行了下回调函数而已，虽然callback是async函数，但却没有await它，也就是说callback执行不受限制，for几个就会立马执行几个，内部才有await等待。 
并且你在 callback 中即使使用 break 也并不能结束遍历。
```tsx
// 核心逻辑
for (var i = 0; i < length; i++) {
  if (i in array) {
    var element = array[i];
    callback(element, i, array);
  }
}

```

### 解决方案

for...of并不像forEach那么简单粗暴的方式去遍历执行，而是采用一种特别的手段——迭代器去遍历。

```tsx
async function test() {
  let arr = [4, 2, 1]
  for(const item of arr) {
	const res = await handle(item)
	console.log(res)
  }
	console.log('结束')
}
```
