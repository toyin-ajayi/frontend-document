## 事件冒泡与事件捕获

事件冒泡和事件捕获分别由微软和网景公司提出，这两个概念都是为了解决页面中事件流（事件发生顺序）的问题。

如下：假设三层 div 都有事件监听，这时我们点击的小的蓝方框，事件执行的顺序是怎么样的呢

```
<div id="s1" style="height: 400px;width: 400px;border: 1px solid red">红
    <div id="s2" style="height: 200px;width: 200px;border: 1px solid yellow">
        黄
        <div id="s3" style="height: 100px;width: 100px;border: 1px solid blue">蓝</div>
    </div>
</div>
```

![](/img/blog/24/1.png)

## 事件冒泡

微软提出了名为事件冒泡(event bubbling)的事件流。事件冒泡可以形象地比喻为把一颗石头投入水中，泡泡会一直从水底冒出水面。也就是说，事件会从最内层的元素开始发生，一直向上传播，直到 document 对象。
因此在事件冒泡的概念下在 div 元素上发生 click 事件的顺序应该是`div -> body -> html -> document`

## 不支持冒泡的事件

blur、focus、load、unload 、mouseleave以及自定义的事件。

原因是在于：这些事件仅发生于自身上，而它的任何父节点上的事件都不会产生，所有不会冒泡。

参考：https://www.w3.org/TR/DOM-Level-3-Events/#event-type-blur

## 事件捕获

网景提出另一种事件流名为事件捕获(event capturing)。与事件冒泡相反，事件会从最外层开始发生，直到最具体的元素。
因此在事件捕获的概念下在 div 元素上发生 click 事件的顺序应该是`document -> html -> body -> div -> div`

## w3c 采用折中的方式，制定了统一的标准——先捕获再冒泡。

addEventListener 第三个参数默认值是 false，表示在事件冒泡阶段调用事件处理函数;如果参数为 true，则表示在事件捕获阶段调用处理函数。

## 测试事件冒泡-点击蓝色

```
    s1 = document.getElementById('s1')
    s2 = document.getElementById('s2')
    s3 = document.getElementById('s3')

    s1.addEventListener("click",function(e){
        console.log("红 冒泡事件");//从底层往上
    },false);//第三个参数默认值是false，表示在事件冒泡阶段调用事件处理函数;如果参数为true，则表示在事件捕获阶段调用处理函数。
    s2.addEventListener("click",function(e){
        console.log("黄 冒泡事件");
    },false);
    s3.addEventListener("click",function(e){
        console.log("蓝 冒泡事件");
    },false);

```

![](/img/blog/24/3.png)

## 测试事件捕获-点击蓝色

```
s1.addEventListener("click",function(e){
        console.log("红 捕获事件");
    },true);

    s2.addEventListener("click",function(e){
        console.log("黄 捕获事件");

    },true);
    s3.addEventListener("click",function(e){
        console.log("蓝 捕获事件");
    },true);
```

![](/img/blog/24/4.png)

## 事件捕获与事件冒泡同时存在-先捕获后冒泡

- 这里记被点击的 DOM 节点为 target 节点,document 往 target 节点，捕获前进，遇到注册的捕获事件立即触发执行
- 到达 target 节点，触发事件
- 对于 target 节点上，是先捕获还是先冒泡则捕获事件和冒泡事件的注册顺序，先注册先执行
- arget 节点 往 document 方向，冒泡前进，遇到注册的冒泡事件立即触发

![](/img/blog/24/1.png)

```
    s1.addEventListener("click",function(e){
        console.log("红 冒泡事件");
    },false);
    s2.addEventListener("click",function(e){
        console.log("黄 冒泡事件");
    },false);
    s3.addEventListener("click",function(e){
        console.log("蓝 冒泡事件");
    },false);

    s1.addEventListener("click",function(e){
        console.log("红 捕获事件");
    },true);

    s2.addEventListener("click",function(e){
        console.log("黄 捕获事件");

    },true);
    s3.addEventListener("click",function(e){
        console.log("蓝 捕获事件");
    },true);
```

![](/img/blog/24/2.png)

## 应用：事件委托（也叫事件代理）

比如我想点击 ul 标签里面的 li 获取它的值,有点人就会遍历去给每个 li 加一个事件监听
其实我们可以在 li 的父级加一个事件监听，这就相当于把事件监听委托给了 ul
我们点击 li 的时候是会打出值的

```
<ul id="ul">
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    <li>6</li>
    <li>7</li>
</ul>
```

```
ul = document.getElementById('ur')

    ul.addEventListener("click",function(e){
        // 如果层级深了代理了多层的事件可以通过一些属性信息来判断执行谁
        if(e.target.tagName.toLowerCase() === 'li'){
        console.log(e.target.innerText);
     }
        
    },false);
```

##onclick 事件分析
onclick 不能像 addEventListener 那样指定是事件类型，它只能是事件冒泡

```
    s1.onclick=function(){
        console.log('红')
    }
    s2.onclick=function(){
        console.log('黄')
    }
    s3.onclick=function(){
        console.log('蓝')
        return true
    }
```

![](/img/blog/24/5.png)

## 阻止事件冒泡和事件默认行为

但某一些时候我们不想触发事件冒泡怎么办或者是不想触发默认的一些方法

### e.stopPropagation()

这是 W3C 的标准方法，stopPropagation 是事件对象(Event)的一个方法，作用是阻止目标元素的冒泡事件，但是会不阻止默认行为。
IE 使用的是 IE 则是使用 e.cancelBubble = true

```
function stopBubble(e) {
//如果提供了事件对象，则这是一个非IE浏览器
if ( e && e.stopPropagation )
    //因此它支持W3C的stopPropagation()方法
    e.stopPropagation();
else
    //否则，我们需要使用IE的方式来取消事件冒泡
    window.event.cancelBubble = true;
}
```

### stopImmediatePropagation方法

该方法作用在当前节点及事件链的所有后续节点上，目的是在执行完当前事件处理程序后，停止当前节点及所有后续节点的同类事件处理程序的运行。

调用后，除了所有后续节点，绑定到当前元素上的、当前事件处理程序之后的事件处理程序都不会执行。简言之，既能阻止父类元素冒泡，也能阻止同类事件的执行。假如一个元素绑定了多个同类事件（比如click），且父元素也绑定了该类事件，那么在元素调用stopImmediatePropagation方法后，父元素不会执行同类事件，该元素执行完当前事件，绑定的同类事件也不会执行。

### e.preventDefault()

preventDefault 它是事件对象(Event)的一个方法，作用是取消一个目标元素的默认行为。既然是说默认行为，当然是元素必须有默认行为才能被取消，如果元素本身就没有默认行为，调用当然就无效了。什么元素有默认行为呢？如链接`<a>`，提交按钮`<input type=”submit”>`等。当 Event 对象的 cancelable 为 false 时，表示没有默认行为，这时即使有默认行为，调用 preventDefault 也是不会起作用的。

### return false

javascript 的 return false 只会阻止默认行为，而是用 jQuery 的话则既阻止默认行为又防止对象冒泡。

```
//阻止浏览器的默认行为 总结
function stopDefault( e ) {
    //阻止默认浏览器动作(W3C)
    if ( e && e.preventDefault )
        e.preventDefault();
    //IE中阻止函数器默认动作的方式
    else
        window.event.returnValue = false;
    return false;
}
```

## event.target 与 event.currentTarget

事件的目标event.target是导致事件的最深嵌套元素是事件的目标。 你可以通过 event.stopPropagation 停止冒泡

```
    <div id='box'>
        <div id='content'>
          <button id='button'>
            Click!
          </button>
        </div>
      </div>
</body>
<script>
let box = document.getElementById('box')
let content = document.getElementById('content')
let button = document.getElementById('button')
box.addEventListener('click',function(e){
    console.log(this)
    console.log(e.target)
},false)
content.addEventListener('click',function(e){
    console.log(this)
    console.log(e.target)
},false)
button.addEventListener('click',function(e){
    console.log(this)
    console.log(e.target)
},false)
</script>
```

所有的 e.target 打出来都是

```
    <button id='button'>
      Click!
    </button>
```
而使用event.currentTarget的话就可以拿到事件绑定的元素，而不是最深嵌套元素

## 最后注意事件监听的适配性
> 主要是低版本的浏览器，可能需要适配一下，下面的方法融合了低版本IE和高版本IE、谷歌、火狐等的方法
```
var EventUtil ={
    addHandler: function(element, type, handler){
        if(element.addEventListener){//标准浏览器webkit，ff
            element.addEventListener(type, handler, false);
        }
        else if(element.attachEvent){//ie
            element.attachEvent('on' + type,handler);
        }else{
            element['on' + type] = handler;
        }
    },
    removeHandler: function(){
        if(element.removeEventListener){
            element.removeEventListener(type, handler, false);
        }else if(element.detachEvent){
            element.detachEvent('on' + type, handler);
        }else{
            element['on' + type] = null;
        }
    }
}
```