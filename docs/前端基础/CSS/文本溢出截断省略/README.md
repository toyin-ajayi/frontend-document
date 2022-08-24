## 单行文本溢出省略

- overflow: hidden；（文字长度超出限定宽度，则隐藏超出的内容）
- white-space: nowrap；（设置文字在一行显示，不能换行）
- text-overflow: ellipsis；（规定当文本溢出时，显示省略符号来代表被修剪的文本）


## 多行文本溢出省略

-webkit-line-clamp: 2；（用来限制在一个块元素显示的文本的行数, 2 表示最多显示 2 行。 为了实现该效果，它需要组合其他的WebKit属性）
display: -webkit-box；（和 1 结合使用，将对象作为弹性伸缩盒子模型显示 ）
-webkit-box-orient: vertical；（和 1 结合使用 ，设置或检索伸缩盒对象的子元素的排列方式 ）
overflow: hidden；（文本溢出限定的宽度就隐藏内容）
text-overflow: ellipsis；（多行文本的情况下，用省略号“…”隐藏溢出范围的文本)

## flex 布局单行文本溢出

当flex:1的时候，overflow:hidden不生效

方案一：
flex布局,flex:1下的子元素如果文字超长，并不会按预期“文字超出部分显示为用省略号代替”显示，文字超出部分会撑开容器显示，而不是限制在flex:1的动态剩余的空间中显示
换行的父级 加 min-width:0,可以间接这么理解 然后确定了width 避免溢出

```css
.team-item-content {
  flex: 1;
  color: #AAAAAA;
  min-width: 0;
}
```

方案二：
可在设置flex:1的元素(即文字超长元素.tove的父元素)设置overflow:hidden;属性，该属性会触发BFC(块级元素格式化上下文)

方案三：
随便给文本父级flex-item设置一个比较大的width，然后overflow:hidden就生效了

```css
flex-item {
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  .name {
      ...
  }
}
```