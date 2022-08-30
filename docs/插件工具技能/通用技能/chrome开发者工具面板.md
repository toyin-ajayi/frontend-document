## 控制台
> https://juejin.cn/post/7085135692568723492

### 指令窗口

在控制台节面按下
cmd + shift + p 执行Command命令
```bash
...: 打开文件
:: 前往文件
@：前往标识符（函数，类名等）
!: 运行脚本文件
>: 打开某菜单功能
```

### 一键重新发起请求

重发请求，这有一种简单到发指的方式。

- 选中Network
- 点击Fetch/XHR
- 选择要重新发送的请求
- 右键选择Replay XHR

修改入参重新发起请求
- 选中Network
- 点击Fetch/XHR
- 选择Copy as fetch
- 控制台粘贴代码
- 修改参数，回车搞定

### 控制台常用变量

- `$0` 通过Elements选择要调试的元素，控制台直接用$0访问
- `$_` 引用上一次控制台执行的结果
- `$`  = document.querySelector
- `$$` = document.querySelectorAll
- copy函数，将对象作为入参执行即可

## 断点调试

### debugger（核心调试功能）


右侧按钮以及下面跟强大的功能
- Pause/Resume script execution：暂停/恢复脚本执行（程序执行到下一断点停止）。
- Step over next function call：执行到下一步的函数调用（跳到下一行）。
- Step into next function call：进入当前函数。
- Step out of current function：跳出当前执行函数。
- Deactive/Active all breakpoints：关闭/开启所有断点（不会取消）。
- Pause on exceptions：异常情况自动断点设置。

下面的堆栈信息
- Watch：Watch表达式
- Call Stack: 栈中变量的调用，这里是递归调用，肯定是在内存栈部分调用。
- Scope：当前作用域变量观察。
- BreakPoints：当前断点变量观察。
- XHR BreakPoints：面向Ajax，专为异步而生的断点调试功能。
- DOM BreakPoints：主要包括下列DOM断点，注册方式见下图
处。


### DOM断点调试

右键元素 =》 break on
当你要调试特定元素的DOM中的更改时，可以使用此选项。这些是DOM更改断点的类型

- Subtree modifications: 子节点删除或添加时
- Attributes modifications: 属性修改时
- Node Removal: 节点删除时
### 排除黑盒js Blackbox Script

在Sources或网络选项卡中打开文件，右键单击并选择Blackbox Script

## 面板

![图片加载失败](./img/chrome面板.png)

### 使用Chrome performance 面板监控
>https://blog.csdn.net/weixin_44135121/article/details/103998869

Network：表示每个服务器资源的加载情况。
Interactions：
Frames：表示每幅帧的运行情况。

Timings：上图中有 4 条虚线，分别表示如下。
（1）DCL（DOMContentLoaded）表示 HTML 文档加载完成事件。当初始 HTML 文档完全加载并解析之后触发，无需等待样式、图片、子 frame 结束。作为明显的对比，load 事件是当个页面完全被加载时才触发。
（2）FP（First Paint）首屏绘制，页面刚开始渲染的时间。
（3）FCP（First Contentful Paint）首屏内容绘制，首次绘制任何文本，图像，非空白canvas 或 SVG 的时间点。
（4）FMP（First Meaningful Paint）首屏有意义的内容绘制，这个“有意义”没有权威的规定，本质上是通过一种算法来猜测某个时间点可能是 FMP。有的理解为是最大元素绘制的时间，即同LCP（Largest Contentful Paint ）。
其中 FP、FCP、FMP 是同一条虚线，三者时间不一致。比如首次渲染过后，有可能出现 JS 阻塞，这种情况下 FCP 就会大于 FP。
（5）L（Onload）页面所有资源加载完成事件。
（6）LCP（Largest Contentful Paint ）最大内容绘制，页面上尺寸最大的元素绘制时间。

Main：表示主线程。
合成线程主要负责：
Javascript 的计算与执行；
CSS 样式计算；
Layout 布局计算；
将页面元素绘制成位图（paint），也就是光栅化（Raster）；
将位图给合成线程。

Raster：光栅化（处理光栅图，即位图）。

GPU：表示 GPU 占用情况。

Chrome_childIOThread：子线程。

Compositor：合成线程。
合成线程主要负责：
将位图（GraphicsLayer 层）以纹理（texture）的形式上传给 GPU；
计算页面的可见部分和即将可见部分（滚动）；
CSS 动画处理；
通知 GPU 绘制位图到屏幕上。

JS Heap：表示 JS 占用的内存大小。
Documents：表示文档数。
Nodes：表示 Node 节点数。
Listeners：表示监听数。
GPU Memory：表示 GPU 占用数。