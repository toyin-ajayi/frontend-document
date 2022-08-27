
## ResizeObserver
>这是一个实验中的功能 此功能某些浏览器尚在开发中，请参考浏览器兼容性表格以得到在不同浏览器中适合使用的前缀。由于该功能对应的标准文档可能被重新修订，所以在未来版本的浏览器中该功能的语法和行为可能随之改变。——来自MDN的提醒

- ResizeObserver 接口可以监听到 Element 的内容区域或 SVGElement的边界框改变

- ResizeObserver避免了在自身回调中调整大小，从而触发的无限回调和循环依赖。
- 它仅通过在后续帧中处理DOM中更深层次的元素来实现这一点。
- 如果（浏览器）遵循规范，只会在绘制前或布局后触发调用
- 非轮询监控，所以不会造成性能问题。


## 老方法的局限

window.resize事件能帮我们监听窗口大小的变化。
- 但是reize事件会在一秒内触发将近60次，所以很容易在改变窗口大小时导致性能问题。- 只有window对象才有resize事件，而不是具体到某个元素的变化。
- 如果我们只想监听某个元素的变化的话，这种操作就很浪费性能了。

```tsx
window.onresize = function() {
	const width = getStyle(dom, 'width');
	const height = getStyle(dom, 'height');
}
function getStyle(ele,attr){
  	if(window.getComputedStyle){
        return window.getComputedStyle(ele,null)[attr];
    }
    return ele.currentStyle[attr];
}
```

用setInterval的方式进行监听DOM的变化。核心代码如下：
```tsx
let timer = 0；
timer = setInterval(() => {
    const style = {
            width: getStyle(dom, 'width'),
            height: getStyle(dom, 'height'),
    };
}, 200)
```

## ResizeObserver实例

```tsx
// 导入兼容模块 如果支持也可以不用polyfill
import ResizeObserver from 'resize-observer-polyfill';
const element1 = document.getElementById('div1');
const element2 = document.getElementById('div2');
/* 
 *  新建以一个观察者，传入一个当尺寸发生变化时的回调处理函数
 *  参数entries 是 ResizeObserverEntry 的数组，包含两个属性：
 *  ResizeObserverEntry.contentRect   包含尺寸信息（x,y,width,height,top,right,left,bottom)
 *  ResizeObserverEntry.target  目标对象，即当前观察到尺寸变化的对象
 *
 */
const robserver = new ResizeObserver( entries => {
  for (const entry of entries) {
     // 可以通过 判断 entry.target得知当前改变的 Element，分别进行处理。
     switch(etry.target){
       case element1 :
          entry.target.innerHTML = `第一个DIV尺寸 [${entry.contentRect.width} : ${entry.contentRect.height}]`;
       break;
       case element2 :
          entry.target.innerHTML = `第二个DIV尺寸 [${entry.contentRect.width} : ${entry.contentRect.height}]`;
       break;
     }
  }
});
robserver.observe(element1);
robserver.observe(element2);


省略...
// 新建obsever对象
const resizeObserver = new ResizeObserver(entries => {
	for (let entry of entries) {
		console.log(entry.target.offsetWidth)
	}
});
开始监听，传入dom对象
resizeObserver.observe(targetNode);

```