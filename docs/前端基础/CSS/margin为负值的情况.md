## margin 负值

- margin top left 为负数时：是以内容盒为基准线，所以负值使整个元素向上，右移动。
- margin right bottom 为负数时：是以border为基准线，所以负值使不会影响元素的位置，但会使元素的基准线发生变化。结果使这个元素相邻的元素的位置发生变化。


## 不同定位模式下margin为负值的影响

### 元素没有设置浮动且没有设置定位或者 position 为 static

#### 设置的 margin 的方向为 top 或者 left

当设置负值的 margin 的方向为 top 或者 left 的时候，元素会按照设置的方向移动相应的距离。

#### 设置的 margin 的方向为 bottom 或者 right

当设置负值的 margin 的方向为 bottom 或者 right 的时候，元素本身并不会移动，元素后面的其他元素会往该元素的方向移动相应的距离，并且**覆盖在该元素上面**。


### 元素没有设置浮动且 position 为 relative

#### 设置的 margin 的方向为 top 或者 left

当设置负值的 margin 的方向为 top 或者 left 的时候，元素也会按照设置的方向移动相应的距离。

#### 设置的 margin 的方向为 bottom 或者 right

当设置 margin-bottom/right 的时候，元素本身也不会移动，元素后面的其他元素也会往该元素的方向移动相应的距离，但是，**该元素会覆盖在后面的元素上面** (当然，此处说的情况肯定是后面的元素没有设置定位以及 z-index 的情况)。

### 元素没有设置浮动且 position 为 absolute

#### 设置的 margin 的方向为 top 或者 left

当设置负值的 margin 的方向为 top 或者 left 的时候，元素也会按照设置的方向移动相应的距离。

#### 设置的 margin 的方向为 bottom 或者 right

由于设置绝对定位的元素已经**脱离了标准文档流**，所以，设置 margin-right/bottom 对后面的元素并没有影响。

### 元素设置了浮动

如果设置的 margin 的方向与浮动的方向相同，那么，元素会往对应的方向移动对应的距离。

```tsx
.elem {
    float: right;
    margin-right: -100px;
}
```
方向相同都是right，elem右移


如果设置 margin 的方向与浮动的方向相反，则元素本身不动，元素之前或者之后的元素会向该元素的方向移动相应的距离。
```tsx
.elem {
    float: right;
    margin-left: -100px;
}
```
方向相反，则元素本身不动，元素之前或者之后的元素会向钙元素的方向移动相应的距离。

## 总结

没有浮动，margin top left会改变该元素的位置，right bottom 改变他后面的元素的为，绝对定位时，对后面元素无影响，相对定位时是该元素覆盖后面位置变化的元素