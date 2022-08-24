## Webview H5错误

很多 App 里面都会内嵌 Webview 运行 H5 页面。如果 H5 在 Webview 里面发生了错误，会是什么样的

## iOS 

在 iOS 中的 Webview，跨域脚本的异步代码如果发生了badjs(注意是异步代码)，不管有没有按照常规方案去设置跨域头和 crossOrigin，在 window 下的 error 事件里都只能抓到 'Script error'。

在iPhone的微信里打开了某个 H5 页面，H5 页面引用了某 (跨域)cdn 的 js 文件。当这个 js 文件内部某个事件产生 badjs 并上报了，我们在日志系统只能看到 'Script error'。


如何解决？


1.跨域脚本改为同域脚本。
同域脚本报错不会显示 Script error。
2.try...catch 包裹
把跨域的脚本里的异步方法用 try...catch 包裹一下，在 catch 中手动触发事件。手动包裹比较麻烦，可以考虑用工具打包的时候自动包裹一下。




## Android。


Android 中的 Webview，和web端一样的表现。设置好了跨域头和 crossOrigin，如果跨域脚本发生 badjs，不论异步同步代码，都能在 window 下的 error 事件里抓到错误详情。  






## 参考


- 一篇文章教你如何捕获前端错误https://cloud.tencent.com/developer/article/1477500
- http://jartto.wang/2018/11/20/js-exception-handling/