## display:table-cell原理

```tsx
<div id="table-cell">content</div>

#table-cell {
    display: table-cell;
}
```

等价于
```tsx
<div id="table">
    <div id="table-row">
        <div id="table-cell">content</div>
    </div>
</div>

#table {
    display: table;
    table-layout: auto;
}

#table-row {
    display: table-row;
}

#table-cell {
    display: table-cell;
}
```

外层的table和table-row是由浏览器默认创建的，称为匿名元素

## 注意点

- 不要与float：left; position:absolute; 一起使用
- 可以实现大小不固定元素的垂直居中
- margin设置无效，响应padding设置
- 对高度和宽度高度敏感
- 不要对display：table-cell使用百分比设置宽度和高度



## td标签（display:table-cell）特点

- td默认继承tr的高度，且平分table的宽度
- 若table（display:table）不存在，给td设置的宽高不能用百分比只能用准确的数值
- 给td设置vertical-align: middle; td元素里面(除float、position:absolute)所有的块级、非块级元素都会相对于td垂直居中
- 给td设置text-align: center; td元素里面所有非block元素(除float、position:absolute)都会相对于td水平居中，虽然block元素不居中，但其中的文字或inline元素会水平居中

## 详细用法
- https://segmentfault.com/a/1190000007007885