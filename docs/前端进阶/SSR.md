## 服务端渲染

> Server Slide Rendering服务端渲染,又简写为SSR，他一般被用在我们的SPA（Single-Page Application），即单页应用。 

服务端渲染的模式下，当用户第一次请求页面时，由服务器把需要的组件或页面渲染成 HTML 字符串(在Node环境已经跑了一遍JS拿到该拿的数据)，然后把它返回给客户端。客户端拿到手的，是可以直接渲染然后呈现给用户的 HTML 内容，不需要为了生成 DOM 内容自己再去跑一遍 JS 代码。使用服务端渲染的网站，可以说是“所见即所得”，页面上呈现的内容，我们在 html 源文件里也能找到。


## 为什么要用SSR
### 更好的SEO（Search Engine Optimization）
SEO是搜索引擎优化，简而言之就是针对百度这些搜索引擎，可以让他们搜索到我们的应用

事实上，很多网站是出于效益的考虑才启用服务端渲染，性能倒是在其次。
假设 A 网站页面中有一个关键字叫“前端性能优化”，这个关键字是 JS 代码跑过一遍后添加到 HTML 页面中的。那么客户端渲染模式下，我们在搜索引擎搜索这个关键字，是找不到 A 网站的——搜索引擎只会查找现成的内容，不会帮你跑 JS 代码。A 网站的运营方见此情形，感到很头大：搜索引擎搜不出来，用户找不到我们，谁还会用我的网站呢？为了把“现成的内容”拿给搜索引擎看，A 网站不得不启用服务端渲染。
但性能在其次，不代表性能不重要。服务端渲染解决了一个非常关键的性能问题——首屏加载速度过慢。在客户端渲染模式下，我们除了加载 HTML，还要等渲染所需的这部分 JS 加载完，之后还得把这部分 JS 在浏览器上再跑一遍。
### 提升首屏加载速度
更好的用户体验，对于缓慢的网络情况或运行缓慢的设备，加载完资源浏览器直接呈现，无需等待所有的 JavaScript 都完成下载并执行，才显示服务器渲染的HTML。

## 客户端渲染和服务端渲染路线对比
### 客户端渲染路线：
1.请求一个html
2.服务端返回一个html
3.浏览器下载html里面的js/css文件
4.等待js文件下载完成
5.等待js加载并初始化完成
6.js代码终于可以运行，由js代码向后端请求数据( ajax/fetch )
6.等待后端数据返回
7.react-dom( 客户端 )从无到完整地，把数据渲染为响应页面
### 服务端渲染路线：
1.请求一个html
2.服务端请求数据( 内网请求快 )
3.服务器初始渲染（服务端性能好，较快）
4.服务端读取浏览器端打包好的index.html文件为字符串，将渲染好的组件、样式、数据塞入html字符串，返回给浏览器
5.客户端请求js/css文件
6.等待js文件下载完成
7.等待js加载并初始化完成
8.浏览器直接渲染接收到的html内容，并且加载打包好的浏览器端js文件，进行事件绑定，初始化状态数据，完成同构

![](/img/blog/s1/1.png)

### 简易的React服务端渲染

### renderToString
React可以将React元素渲染成它的初始化Html，并且返回html字符串,在express服务端生成html,返回给浏览器渲染

```tsx
const express = require('express');
const app = express();
const React = require('react');
const {renderToString} = require('react-dom/server');
const App = class extends React.PureComponent{
  render(){
    return React.createElement("h1",null,"Hello World");;
  }
};
app.get('/',function(req,res){
  const content = renderToString(React.createElement(App));
  res.send(content);
});
app.listen(3000);
```

## 同构
将上面的代码加上JS的事件监听服务器端渲染返给浏览器，你会发现在浏览器里无能如何点击都不会触发事件
因为renderToString只是返回html字符串，元素对应的js交互逻辑并没有返回给浏览器，因此点击h1标签是无法响应的。
```tsx
const App = class extends React.PureComponent{
  handleClick=(e)=>{
    alert(e.target.innerHTML);
  }
  render(){
    return <h1 onClick={this.handleClick}>Hello World!</h1>;
  }
};
```
解决方法之前，我们先讲一下“同构”这个概念。何为“同构”，简单来说就是“同种结构的不同表现形态”。

> 同一份react代码在服务端执行一遍，再在客户端执行一遍。
同一份react代码，在服务端执行一遍之后，我们就可以生成相应的html。在客户端执行一遍之后就可以正常响应用户的操作。这样就组成了一个完整的页面。所以我们需要额外的入口文件去打包客户端需要的js交互代码。
```tsx
import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import App from  './src/app';
const app = express();

app.use(express.static("dist"))

app.get('/',function(req,res){
  const content = renderToString(<App/>);
  res.send(`
        <!doctype html>
        <html>
            <title>ssr</title>
            <body>
                <div id="root">${content}</div>
                <script src="/client/index.js"></script>
            </body> 
        </html>
    `);
});
app.listen(3000);
```
“/client/index.js”就是我们用webpack打包出来的用于客户端执行的js文件
现在点击会出现弹窗

![](/img/blog/s1/2.png)
## ReactDOM.hydrate()
我们在服务端渲染时用ReactDOM.hydrate()来取代ReactDOM.render()
ReactDOM.render()会将挂载dom节点的所有子节点全部清空掉，再重新生成子节点。而ReactDOM.hydrate()则会复用挂载dom节点的子节点，并将其与react的virtualDom关联上。
所以我们客户端入口文件调整一下,拿到刚才从后台返回HTML里面的root节点，进行hydrate

```js
import React from 'react';
import {hydrate} from 'react-dom';
import App from './app';
hydrate(<App/>, document.getElementById("root"));
```




## 同构的缺陷
至此看来，难道同构应用就是完美的吗？当然不是，其实普通的同构应用只是提升了 FCP 也就是用户看到内容的速度，但是却还是要等到框架代码下载完成，hydrate 注水完毕等一系列过程执行完毕以后才能真正的可交互。
并且对于 FID 也就是 First Input Delay 第一输入延迟这个指标来说，由于 SSR 快速渲染出内容，更容易让用户误以为页面已经是可交互状态，反而会使「用户第一次点击 - 浏览器响应事件」 这个时间变得更久。
因此，同构应用很可能变成一把「双刃剑」。

FP: First Paint，是 Paint Timing API 的一部分，是页面导航与浏览器将该网页的第一个像素渲染到屏幕上所用的中间时，渲染是任何与输入网页导航前的屏幕上的内容不同的内容。


FCP: First Contentful Paint，首次有内容的渲染是当浏览器渲染 DOM 第一块内容，第一次回馈用户页面正在载入。


TTI: Time to interactive 第一次可交互时间，此时用户可以真正的触发 DOM 元素的事件，和页面进行交互。


FID: First Input Delay 第一输入延迟测量用户首次与您的站点交互时的时间（即，当他们单击链接，点击按钮或使用自定义的 JavaScript 驱动控件时）到浏览器实际能够的时间回应这种互动。


TTFB: Time to First Byte 首字节时间，顾名思义，是指从客户端开始和服务端交互到服务端开始向客户端浏览器传输数据的时间（包括 DNS、socket 连接和请求响应时间），是能够反映服务端响应速度的重要指标。

## 服务端同构渲染 SSR with Hydration
基于以上客户端渲染的缺点以及用户对于 CSR 应用交互更加丰富的需求，于是诞生了集 SSR 和 CSR 的性能、SEO、数据获取的优点与一身的「同构渲染」，简单点说，就是：


- 第一次请求，在服务端就利用框架提供的服务端渲染能力，直接原地请求数据，生成包含完整内容的 html 页面，用户不需要等待框架的 js 加载就可以看到内容。


- 等到页面渲染后，再利用框架提供的 Hydration（注水）能力，让服务端返回的“干瘪”的 HTML 注册事件等等，变的丰富起来，拥有了各种事件后，就和传统 CSR 一样拥有了丰富多彩的客户端交互。

## 渐进式注水 Progressive Hydration
> 链接：https://juejin.cn/post/6898235695245197325

我们知道 hydrate 的过程需要遍历整颗 React 节点树来添加事件，这在页面很大的情况下耗费的时间一定是很长的，我们能否先只对关键的部分，比如视图中可见的部分，进行「注水」，让这部分先一步可以进行交互？
想象一下它的特点：

组件级别的渐进式注水。
服务端依旧整页渲染。
页面可以根据优先级来分片“启动”组件。
