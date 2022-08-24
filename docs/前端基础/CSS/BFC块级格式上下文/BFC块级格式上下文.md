## 1.BFC 简要定义

BFC(Block formatting context)直译为"块级格式化上下文"。它是一个独立的渲染区域，它规定了内部如何布局，是决定块盒子的布局及浮动相互影响范围的一个区域，并且与这个区域外部毫不相干。

## 2.BFC 创建方式

- (`<html>`)根元素或其它包含它的元素；
- 浮动 (元素的 float 不为 none)；
- 绝对定位元素 (元素的 position 为 absolute 或 fixed)；
- 行内块 inline-blocks(元素的 display: inline-block)；
- 表格单元格(元素的 display: table-cell，HTML 表格单元格默认属性)；
- overflow 的值不为 visible 的元素；
- 弹性盒 flex boxes (元素的 display: flex 或 inline-flex)
- 网格元素（display为 grid 或 inline-grid 元素的直接子元素）
- 多列容器（元素的 column-count 或 column-width 不为 auto，包括 column-count 为 1）
- 匿名表格单元格元素（元素的 display为 table、table-row等）

## 3.BFC 内部特性

- 内部的盒会在垂直方向一个接一个排列（可以看作 BFC 中有一个的常规流）；
- 处于同一个 BFC 中的元素相互影响，可能会发生 margin collapse；但不同 BFC 可以阻止 margin collapse
- 每个元素的 margin box 的左边，与容器块 border box 的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此；
- BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然；
- 计算 BFC 的高度时，考虑 BFC 所包含的所有元素，连浮动元素也参与计算；
- 浮动盒区域不叠加到 BFC 上；

## 4.BFC 应用实例

### 1.BFC 清除浮动

**将父元素设置一个能让其变为 BFC 区域的属性，不如 overflow：auto**

![图片描述](/img/blog/14/1.png)
![图片描述](/img/blog/14/2.png)

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        #one{
            background:green;
            width: 100px;
            height: 50px;
            float: left;
        }
        #two{
            background: red;
            width: 200px;
            height: 50px;
            float: left;
        }
        #box{
            border: 2px solid salmon;
            width: 400px;
            overflow: auto;
        }
    </style>
</head>
<body>
<div id="box">
    <div id="one">one</div>
    <div id="two">two</div>
</div>

</body>
</html>
```

### 2.BFC 处理 margin collapse

> 在 CSS 中，两个或多个毗邻的普通流中的盒子（可能是父子元素，也可能是兄弟元素）在垂直方向上的外边距会发生叠加，这种形成的外边距称之为外边距叠加。这里讲解父子元素，兄弟元素同理。

![图片描述](/img/blog/14/3.png)
![图片描述](/img/blog/14/4.png)

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        p{
            padding: 0;
            margin: 20px 0 20px 0;
            height: 20px;
            background-color: burlywood;
            color: #fff;
        }
        div{
            overflow: auto;//前后的区别取决于这句话，加上就能让父级生成BFC区域包含它们
            width: 250px;
            background-color: #ccc;
        }
    </style>
</head>
<body>
<div>
    <p>aaaaaaaaaaaaaa</p>
    <p>bbbbbbbbbbbbbb</p>
</div>

</body>
</html>
```

**BFC 改造后**

![图片描述](/img/blog/14/5.png)

## 注意兄弟元素的margin也会重叠

解决兄弟元素的时候不能直接选择所有兄弟然后创建BFC，因为这样也处于同一个 BFC(父节点)，元素还是会相互影响，发生 margin collapse，所有我们可以再套一层box就行了，都不需要创建BFC

```
<div>
    <div class="box">
        <div class='hang'>bbbbbbbbbbbbbb</div>
    </div>
    <div class="box">
        <div class='hang'>bbbbbbbbbbbbbb</div>
    </div>
    <div class="box">
        <div class='hang'>bbbbbbbbbbbbbb</div>
    </div>
    <div class="box">
        <div class='hang'>bbbbbbbbbbbbbb</div>
    </div>
    
</div>
```