## 弹性盒模型
>[MDN上的定义](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes)

CSS3 弹性盒子(Flexible Box 或 Flexbox)，是一种用于在页面上布置元素的布局模式，使得当页面布局必须适应不同的屏幕尺寸和不同的显示设备时，元素可预测地运行。对于许多应用程序，弹性盒子模型提供了对块模型的改进，因为它不使用浮动，flex容器的边缘也不会与其内容的边缘折叠。

在定义方面来说，弹性布局是指通过调整其内元素的宽高，从而在任何显示设备上实现对可用显示空间最佳填充的能力。弹性容器扩展其内元素来填充可用空间，或将其收缩来避免溢出。

块级布局更侧重于垂直方向、行内布局更侧重于水平方向，与此相对的，弹性盒子布局算法是方向无关的。虽然块级布局对于单独一个页面来说是行之有效的，但其仍缺乏足够的定义来支持那些必须随用户代理(user agent)不同或设备方向从水平转为垂直等各种变化而变换方向、调整大小、拉伸、收缩的应用程序组件。

弹性盒子布局主要适用于应用程序的组件及小规模的布局
新兴的栅格布局则针对大规模的布局。

## 轴线

容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做main start，结束位置叫做main end；交叉轴的开始位置叫做cross start，结束位置叫做cross end。

项目默认沿主轴排列。

![图片加载失败](./img/flexbox.png)


默认情况下，项目都排在一条线（又称"轴线"）上。flex-wrap属性定义，如果一条轴线排不下，如何换行。

flex-wrap属性
- nowrap（默认）：不换行。
- wrap：换行，第一行在上方。
- wrap-reverse：换行，第一行在下方。
  
```
.box{
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

## Flex 容器属性

```
主轴方向：水平排列（默认） | 水平反向排列 | 垂直排列 | 垂直反向排列
flex-direction: row | row-reverse | column | column-reverse;

换行：不换行（默认） | 换行 | 反向换行(第一行在最后面)
flex-wrap: nowrap | wrap | wrap-reverse;

flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap
flex-flow: <flex-direction> || <flex-wrap>;

主轴对齐方式：起点对齐（默认） | 终点对齐 | 居中对齐 | 两端对齐 | 分散对齐
justify-content: flex-start | flex-end | center | space-between | space-around;

交叉轴对齐方式：拉伸对齐（默认） | 起点对齐 | 终点对齐 | 居中对齐 | 第一行文字的基线对齐
align-items: stretch | flex-start | flex-end | center | baseline;

多根轴线对齐方式：拉伸对齐（默认） | 起点对齐 | 终点对齐 | 居中对齐 | 两端对齐 | 分散对齐
align-content: stretch | flex-start | flex-end | center | space-between | space-around;
```

## Flex 项目属性

```
顺序：数值越小越靠前，默认为0
order: <number>;

放大比例：默认为0，如果有剩余空间也不放大，值为1则放大，2是1的双倍大小，以此类推
flex-grow: <number>;

缩小比例：默认为1，如果空间不足则会缩小，值为0不缩小
flex-shrink: <number>;

项目自身大小：默认auto，为原来的大小，可设置固定值 50px/50%
flex-basis: <length> | auto;

flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto
两个快捷值：auto (1 1 auto) 和 none (0 0 auto)
flex:none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]

项目自身对齐：继承父元素（默认） | 起点对齐 | 终点对齐 | 居中对齐 | 基线对齐 | 拉伸对齐
align-self: auto | flex-start | flex-end | center | baseline | stretch;

```

## flex 布局中 item 的 flex 属性

> 参考 http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html

flex 属性

flex: flex-grow | flex-shrink | flex-basis
flex 属性包含三个值：flex-grow、flex-shrink 和 flex-basis

- flex-grow: 扩展比例:如果所有项目的 flex-grow 属性都为 1，则它们将等分剩余空间（如果有的话）。如果一个项目的 flex-grow 属性为 2，其他项目都为 1，则前者占据的剩余空间将比其他项多一倍。
- flex-shrink: 收缩比例:如果所有项目的 flex-shrink 属性都为 1，当空间不足时，都将等比例缩小。如果一个项目的 flex-shrink 属性为 0，其他项目都为 1，则空间不足时，前者不缩小。
- flex-basis:表示在 flex items 被放入 flex 容器之前的大小，也就是 items 的理想或者假设大小，但是并不是其真实大小，其真实大小取决于 flex 容器的宽度，flex items 的 min-width,max-width 等其他样式,默认为 auto ，即元素本来大小。(content < width < flex-basis (limted by max|min-width)),如果未指定 flex-basis，flex-basis 将回退到 width 属性。如果未指定 width 属性，flex-basis 将回退到基于 Flex 项目内容的计算宽度值（computed width）。

flex items 总和超出 flex 容器，会根据 flex-shrink 的设置进行压缩
如果有剩余空间，如果设置 flex-grow，子容器的实际宽度跟 flex-grow 的设置相关。如果没有设置 flex-grow，则按照 flex-basis 展示实际宽度，一般我们直接使用 flex:1 就都设置了.
flex 的默认值是 0 1 auto:

```
.item {
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;
}
```

当 flex 取值为 none，则计算值为 0 0 auto，如下是等同的：

```
.item {flex: none;}
.item {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}
```
当 flex 取值为 auto，则计算值为 1 1 auto，如下是等同的：
```
.item {flex: auto;}
.item {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;
}
```

当 flex 取值为一个非负数字，则该数字为 flex-grow 值，flex-shrink 取 1，flex-basis 取 0，如下是等同的(来自stackoverflow)：

```
.item {flex: 1;}
.item {
flex-grow : 1;    ➜ The div will grow in same proportion as the window-size       
flex-shrink : 1;  ➜ The div will shrink in same proportion as the window-size 
flex-basis : 0;   ➜ The div does not have a starting value as such and will 
                     take up screen as per the screen size available for
                     e.g:- if 3 divs are in the wrapper then each div will take 33%.
}
```
所以当其他flex-grow: 0;这个flex-grow: 1;就可以被拉伸实现那种三栏布局