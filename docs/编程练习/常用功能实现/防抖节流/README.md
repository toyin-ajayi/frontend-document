## 1.函数的节流

> 当持续触发事件时，保证一定时间段内只调用一次事件处理函数。也就是一个函数执行一次后，只有大于设定的执行周期后才会执行第二次。
> 记忆法：联系到水流的流量，我想让你 1s 只流出多少水你就只能流多少水，多的水流只能等到下个周期才能流出。
> 应用场景：如用户不断滑动滚轮，规定 1s 只能真正下滑一次，你滑再多也没用，只能等到下个周期你再滑才有用。

### 实现原理：

A：用函数的闭包来锁住上一执行的时间，在用这一次执行的时间相比，大于设定的间隔时间则执行
B：也可以直接把 lasTime 放到全局去，不用闭包但这样就不好在事件监听的时候传递参数 delay 只能写死

### 避免 this 的指向丢失：

1.throttle 函数在全局执行，内部 this 通常是指向 window 的，然后返回一个匿名函数。 2.返回的匿名函数绑定了事件，this 指向监听的元素（document）
3.fn 如果直接用 fn()这样的函数调用模式，this 是绑定到全局的（非严格模式下），这里需要特殊处理
4 这里用 apply 修正 this 指向，使 fn 内部的 this 重新指向 document

```js
function throttle(fn, delay) {
  console.log(this); //window
  // 记录上一次函数触发的时间
  var lastTime = 0;
  return function () {
    // 记录当前函数触发的时间
    var nowTime = Date.now();
    if (nowTime - lastTime > delay) {
    /*
	fn();
	console.log(this)//document
	*/

      fn.apply(this); // 修正this指向问题
      console.log(this); //document

      // 同步时间
      lastTime = nowTime;
    }
  };
}
document.onscroll = throttle(function () {
  /*console.log(this)//window*/
  console.log(this); //document
  console.log("scroll事件被触发了" + Date.now());
}, 1000);

```

## 2.函数防抖

> 当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次，如果设定的时间到来之前，又一次触发了事件，就重新开始延时，比如频繁触发的某一函数，防抖可以只让最后一次执行。记忆法:让函数执行者冷静下来后（不一直抖动后），才真正执行。
> 应用场景：用户多次点击提交表单

不用闭包后结构会很简单

```tsx
<script type="text/javascript">
			var timer = null;// 记录上一次的延时器
			function debounce() {
					console.log(timer)
					clearTimeout(timer)
					timer = setTimeout(function() {
					console.log("aaa")
					}, 1000)
			}
			document.getElementById('btn').onclick = debounce
		</script>
```

但为了能不污染全局，和有一定封装性建议还是用闭包裹一下

```tsx
    function debounce(func, time) {
      let timer;
      return function(...arg) {
        // 注意这里是清楚上一次缓存的旧timer
        clearTimeout(timer);
        timer = setTimeout(() => {
            console.log('asd')
          func.apply(this, arg);
        }, time);
      };
    }

    debounceButton.addEventListener("click", debounce(doSomething, 1000));

    function doSomething(e) {
      console.log(123);
      console.log(this);
      console.log(e);
    }

```
