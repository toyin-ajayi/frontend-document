## OpenGL、WebGL、Canvas、Svg、Three.js

- OpenGL：Open Graphics Library“开放式图形库”是用于渲染2D、3D矢量图形的跨语言、跨平台的应用程序编程接口（API），目前计算机底层都是采用这套接口进行与显卡交互渲染
- Canvas：是HTML5新增的一个元素对象，名副其实就是一个画布，浏览器 js 配有相应的操作api，可以不再依赖其他的API或组件而直接绘位图
- SVG:只是一种矢量图形文件格式， 不仅现在的浏览器都支持，很多主流的系统也都支持。 矢量图，是给数据就可以绘制点、线、图形的，基于 XML 的标记语言； 
- WebGL:以 OpenGL ES 2.0 为基础的一套 浏览器 3D图形API （HTML5）, 3D位图，WebGL 无论如何都需要一个显示对象来呈现，这个对象就是 Canvas，仅此而已，WebGL不对Canvas有任何附加的操作API， 那部分属于浏览器js支持的范畴.
- Three.js: Three.js以WebGL的一款的三维引擎，对于WebGL API和着色器语言GLSL进行了封装。如果你有前端基础你可以简单吧threejs类比为jquery，都是一个js库

## 操作系统、显卡、OpenGL之间的关系

当由C语言等的高级语言开发的计算机操作系统日趋成熟，计算机操作系统也就有了可视化的需要。有需要，就有人做！

这就有了显卡：把操作系统 output 的电路信号处理成成可以被显示屏显示的结果，这就是 GPU。

和早期的浏览器对 JavaScript 的支持一样，早期不同厂商的显卡也互不兼容。于是就有了 OpenGL。

OpenGL API是一套接口，学习这套接口，就可以在那些支持OpenGL的机器上正常使用这些接口，在屏幕上看到绘制的结果。这套接口是 Khronos 这个组织在维护，怎么维护呢：就是写一个说明书，指导各个GPU厂家。如果他们要支持OpenGL的话，要怎么实现一个具体的OpenGL库。如果不实现，那么就不算支持OpenGL。也有一些接口不一定要实现。这和 JavaScript 为什么又叫做 ECMAScript 有着异曲同工之妙。

OpenGL 统一了软件输出可视化界面的接口。如果你了解过 JavaScript 库 Threejs，你可能了解过 WebGL（浏览器对 OpenGL ES（OpenGL 的简化版，多用于嵌入式、移动端等） 的封装） 的部分语法，你会发现 OpenGL 用的是一种十分晦涩难懂的着色器语言，同时管线、纹理、缓冲等概念和大量必须的数学、图形学知识都使得 OpenGL 门槛变得很高。但是可视化的程序仍然普及的起来，这是怎么回事呢？

因为有操作系统、浏览器、第三方渲染引擎等。目前主流的个人电脑搭载的计算机操作系统，都在底层对 OpenGL 做了封装，同时开放部分这些接口给开发者，使其开发能运行于当前操作系统的应用程序，当然开发者也可以直接调用 OpenGL 直接和 GPU 通信。

## Android IOS 与 openGL

不管是 iOS 还是 Android，他们的渲染引擎都是 OpenGL，OpenGL是面向C语言的（当然，在Objective-C和Java中都有封装）。而作为前端开发者，要直接使用OpenGL编写界面，真是不(Tai)现(Nan)实(Le)。于是，我们有了界面库，这种界面库，在iOS上，我们称之为UIKit，在Android上，我们使用android.view.*包。不管是iOS还是Android，界面库要做的事情，目标都是一致的，那就是将界面渲染从具体变成抽象。

View不会直接面向OpenGL进行封装，而是通过中间层，在iOS上，使用的是CALayer(CoreGraphics)更抽象，而在Android上，使用的是 Canvas(Skia)。

## 参考


- https://blog.csdn.net/Vito_Jianxue/article/details/105809981
- https://zhuanlan.zhihu.com/p/56693625
- https://blog.csdn.net/Thea12138/article/details/79723380