## 概述

`<canvas>`元素用于生成图像。它本身就像一个画布，JavaScript 通过操作它的 API，在上面生成图像。它的底层是一个个像素，基本上`<canvas>`是一个可以用 JavaScript 操作的位图（bitmap）。

它与 SVG 图像的区别在于，`<canvas>`是脚本调用各种方法生成图像，SVG 则是一个 XML 文件，通过各种子元素生成图像。

## Canvas API：绘制图形

### 路径

ctx = canvas.getContext("2d")：
- ctx.beginPath()：开始绘制路径。
- ctx.closePath()：结束路径，返回到当前路径的起始点，会从当前点到起始点绘制一条直线。如果图形已经封闭，或者只有一个点，那么此方法不会产生任何效果。
- ctx.moveTo()：设置路径的起点，即将一个新路径的起始点移动到(x，y)坐标。
- ctx.lineTo()：使用直线从当前点连接到(x, y)坐标。
- ctx.fill()：在路径内部填充颜色（默认为黑色）。
- ctx.stroke()：路径线条着色（默认为黑色）。
- ctx.fillStyle：指定路径填充的颜色和样式（默认为黑色）。
- ctx.strokeStyle：指定路径线条的颜色和样式（默认为黑色）。

```
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.moveTo(100, 100);
ctx.lineTo(200, 200);
ctx.lineTo(100, 200);
```

### 线型

- ctx.lineWidth：指定线条的宽度，默认为 1.0。
- ctx.lineCap：指定线条末端的样式，有三个可能的值：butt（默认值，末端为矩形）、round（末端为圆形）、square（末端为突出的矩形，矩形宽度不变，高度为线条宽度的一半）。
- ctx.lineJoin：指定线段交点的样式，有三个可能的值：round（交点为扇形）、bevel（交点为三角形底边）、miter（默认值，交点为菱形)。
- ctx.miterLimit：指定交点菱形的长度，默认为 10。该属性只在lineJoin属性的值等于miter时有效。
- ctx.getLineDash()：返回一个数组，表示虚线里面线段和间距的长度。
- ctx.setLineDash()：数组，用于指定虚线里面线段和间距的长度。
```
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.moveTo(100, 100);
ctx.lineTo(200, 200);
ctx.lineTo(100, 200);

ctx.lineWidth = 3;
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.setLineDash([15, 5]);
ctx.stroke();
```



### 线型

- ctx.lineWidth：指定线条的宽度，默认为 1.0。
- ctx.lineCap：指定线条末端的样式，有三个可能的值：butt（默认值，末端为矩形）、round（末端为圆形）、square（末端为突出的矩形，矩形宽度不变，高度为线条宽度的一半）。
- ctx.lineJoin：指定线段交点的样式，有三个可能的值：round（交点为扇形）、bevel（交点为三角形底边）、miter（默认值，交点为菱形)。
- ctx.miterLimit：指定交点菱形的长度，默认为 10。该属性只在lineJoin属性的值等于miter时有效。
- ctx.getLineDash()：返回一个数组，表示虚线里面线段和间距的长度。
- ctx.setLineDash()：数组，用于指定虚线里面线段和间距的长度。

```
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.moveTo(100, 100);
ctx.lineTo(200, 200);
ctx.lineTo(100, 200);

ctx.lineWidth = 3;
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.setLineDash([15, 5]);
ctx.stroke();
```

### 矩形

- ctx.rect()：绘制矩形路径。
- ctx.fillRect()：填充一个矩形。
- ctx.strokeRect()：绘制矩形边框。
- ctx.clearRect()：指定矩形区域的像素都变成透明。

```
// 绘制一个正方形，左上角坐标为(10, 10)，宽和高都为 100。
ctx.rect(10, 10, 100, 100);
ctx.fill();
```

### 弧线

- ctx.arc()：通过指定圆心和半径绘制弧形。
- ctx.arcTo()：通过指定两根切线和半径绘制弧形。

arc()方法的x和y参数是圆心坐标，radius是半径，startAngle和endAngle则是扇形的起始角度和终止角度（以弧度表示），anticlockwise表示做图时应该逆时针画（true）还是顺时针画（false），这个参数用来控制扇形的方向（比如上半圆还是下半圆）。

```
// 格式
ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);

// 实例
ctx.arc(5, 5, 5, 0, 2 * Math.PI, true);
```

## 图像处理方法

```
var image = new Image();

image.onload = function() {
  var canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  canvas.getContext('2d').drawImage(image, 0, 0);
  // 插入页面底部
  document.body.appendChild(image);
  return canvas;
}

image.src = 'image.png';

```
## toDataURL 导出 Base64

```
function convertCanvasToImage(canvas) {
  var image = new Image();
  image.src = canvas.toDataURL('image/png');
  return image;
}
```

## 转Blob+压缩

压缩质量quality 0~1
```
canvas.toBlob(function (blobObj) {
    let imgSrc = window.URL.createObjectURL(blobObj)
	document.getElementById('img').src = imgSrc
}, "image/jpeg", {quality: 1});
```

## 参考

- https://juejin.im/post/5ac437b5f265da238f12c1c6#heading-2
- https://segmentfault.com/a/1190000021998875