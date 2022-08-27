## Canvas 实现
>html2canvas 足足用了20多个js来实现这层转换，复杂成度可见一斑,不推荐自己手写

- 递归取出目标模版的所有DOM节点，填充到一个rederList，并附加是否为顶层元素/包含内容的容器 等信息
- 通过z-index postion float等css属性和元素的层级信息将rederList排序，计算出一个canvas的renderQueue
- 遍历renderQueue，将css样式转为setFillStyle可识别的参数，依据nodeType调用相对应canvas方法，如文本则调用fillText，图片drawImage，设置背景色的div调用fillRect等
- 将画好的canvas填充进页面

## SVG实现
>svg本来就是矢量图形；其次，svg是可以用xml描述的；再其次，用来描述svg的标签里有个 foreignObject标签，这个标签可以加载其它命名空间的xml(xhtml)文档。也就是说，如果使用svg的话，我们不再需要一点点的遍历，转换节点；不用再计算复杂的元素优先级，只需要一股脑的将要渲染的DOM扔进`<foreignObject></foreignObject>`就好了，剩下的就交给浏览器去渲染

SVG实现DOM转png时会有很多兼容性问题,之前在张鑫旭大佬的博客参考了一下，发现他的Demo已经跑不起来了(原因还没找到，反正无法触发img.onload)。

### 错误写法
网上现在很多写法都是

```tsx
new Blob([svgXML], { type: "image/svg+xml" });
```
但在这种写法回导致一些安全策略，并且污染canvas画布，最后会报如下错误
```tsx
Uncaught DOMException: Failed to execute 'toDataURL' on 'HTMLCanvasElement'
```
这里不关跨不跨域的事，没有对外部资源执行任何请求，所以设置
```tsx
img.crossOrigin = "anonymous";
```
是无效的

### 最后chrome能运行的写法
>encodeURIComponent()函数通过用表示字符的UTF-8编码的一个，两个，三个或四个转义序列替换某些字符的每个实例来对URI进行编码（对于由两个"代理"组成的字符而言，将仅是四个转义序列）字符）.

```tsx
// encodes characters such as ?,=,/,&,:
console.log(encodeURIComponent('?x=шеллы'));
// expected output: "%3Fx%3D%D1%88%D0%B5%D0%BB%D0%BB%D1%8B"

console.log(encodeURIComponent('?x=test'));
// expected output: "%3Fx%3Dtest"
```

在foreignObject 里的结果用encodeURIComponent来把字符串作为URI组件进行编码，最后交给image对象，然后用canvas画出来，再导出png，就不会报错

```tsx
      var svgXML = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
                <foreignObject width="100%" height="100%">${generateXML(
                  html
                )}</foreignObject>
             </svg>`;
      var url = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgXML);
```
`详细看[myDemo](./myDemo-只兼容chrome.html)`

### 参考
- https://developer.mozilla.org/zh-CN/docs/XMLSerializer
- https://www.zhangxinxu.com/wordpress/2019/06/domparser-xmlserializer-api/
- https://stackoverflow.com/questions/40897039/problems-with-getting-canvas-datauri-from-svg-with-foreignobject