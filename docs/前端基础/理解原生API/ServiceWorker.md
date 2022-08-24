## 服务工作线程概念和用法

Service worker是一个注册在指定源和路径下的事件驱动worker。它采用JavaScript控制关联的页面或者网站，拦截并修改访问和资源请求，细粒度地缓存资源。你可以完全控制应用在特定情形（最常见的情形是网络不可用）下的表现。

## Service worker 特点

Service worker运行在worker上下文，因此它不能访问DOM。相对于驱动应用的主JavaScript线程，它运行在其他线程中，所以不会造成阻塞。它设计为完全异步，同步API（如XHR和localStorage）不能在service worker中使用。

出于安全考量，Service workers只能由HTTPS承载，毕竟修改网络请求的能力暴露给中间人攻击会非常危险。在Firefox浏览器的用户隐私模式，Service Worker不可用。

可以把 Service Worker 理解为一个介于客户端和服务器之间的一个代理服务器。在 Service Worker 中我们可以做很多事情，比如拦截客户端的请求、向客户端发送消息、向服务器发起请求等等，其中最重要的作用之一就是离线资源缓存。


## 注册

使用 ServiceWorkerContainer.register() 方法首次注册service worker。如果注册成功，service worker就会被下载到客户端并尝试安装或激活（见下文），这将作用于整个域内用户可访问的URL，或者其特定子集。

```
// index.js
if ('serviceWorker' in window.navigator) {
  navigator.serviceWorker.register('./sw.js', { scope: './' })
    .then(function (reg) {
      console.log('success', reg);
    })
    .catch(function (err) {
      console.log('fail', err);
    });
}

```

## 通信

使用 postMessage 方法可以进行 Service Worker 和页面之间的通讯

```
// index.js
if ('serviceWorker' in window.navigator) {
  navigator.serviceWorker.register('./sw.js', { scope: './' })
    .then(function (reg) {
      console.log('success', reg);
      navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage("this message is from page");
    });
}

```
为了保证 Service Worker 能够接收到信息，我们在它被注册完成之后再发送信息，和普通的 window.postMessage 的使用方法不同，为了向 Service Worker 发送信息，我们要在 ServiceWorker 实例上调用 postMessage 方法，这里我们使用到的是 navigator.serviceWorker.controller

```
// sw.js
this.addEventListener('message', function (event) {
  console.log(event.data); // this message is from page
});

```

## 静态资源缓存

Service Worker 能够实现的最主要的功能——静态资源缓存。

正常情况下，用户打开网页，浏览器会自动下载网页所需要的 JS 文件、图片等静态资源。我们可以通过 Chrome 开发工具的 Network 选项来查看。

但如果没有联网，浏览器无法下载展示的页面,这时可以使用 Service Worker 配合 [CacheStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/CacheStorage)  来实现对静态资源的缓存。
>CacheStorage 接口表示 Cache 对象的存储。它提供了一个 ServiceWorker 、其它类型worker或者 window 范围内可以访问到的所有命名cache的主目录（它并不是一定要和service workers一起使用，即使它是在service workers规范中定义的），并维护一份字符串名称到相应 Cache 对象的映射。
CacheStorage  同样暴露了 CacheStorage.open() 和 CacheStorage.match()方法。使用 CacheStorage.open() 获取 Cache 实例。

```
Cache是Service Worker衍生出来的API，配合Service Worker实现对资源请求的缓存。
不过cache并不直接缓存字符串，而是直接缓存资源请求（css、js、html等）。
cache也是key-value形式，一般来说key就是request，value就是response

caches.open(cacheName) 打开一个cache
caches是global对象，返回一个带有cache返回值的Promise
cache.keys() 遍历cache中所有键，得到value的集合
cache.match(Request|url) 在cache中匹配传入的request，返回Promise；
cache.matchAll只有第一个参数与match不同，需要一个request的数组，当然返回的结果也是response的数组
cache.add(Request|url) 并不是单纯的add，因为传入的是request或者url，在cache.add内部会自动去调用fetch取回request的请求结果，然后才是把response存入cache；
cache.addAll类似，通常在sw install的时候用cache.addAll把所有需要缓存的文件都请求一遍
cache.put(Request, Response) 这个相当于cache.add的第二步，即fetch到response后存入cache
cache.delete(Request|url) 删除缓存

```

```
// sw.js
this.addEventListener('install', function (event) {
  console.log('install');
  event.waitUntil(
    caches.open('sw_demo').then(function (cache) {
      return cache.addAll([
        '/style.css',
        '/panda.jpg',
        './main.js'
      ])
    }
    ));
});

```

- 当用户第一次访问页面的时候，资源的请求是早于 Service Worker 的安装的，所以静态资源是无法缓存的；只有当 Service Worker 安装完毕，用户第二次访问页面的时候，这些资源才会被缓存起来；
- CacheStorage 只能缓存静态资源，所以它只能缓存用户的 GET 请求；
- CacheStorage 中的缓存不会过期，但是浏览器对它的大小是有限制的，所以需要我们定期进行清理；


## 使用场景

Service workers也可以用来做这些事情：

- 后台数据同步
- 响应来自其它源的资源请求
- 集中接收计算成本高的数据更新，比如地理位置和陀螺仪信息，这样多个页面就可以利用同一组数- 据
- 在客户端进行CoffeeScript，LESS，CJS/AMD等模块编译和依赖管理（用于开发目的）
- 后台服务钩子
- 自定义模板用于特定URL模式
- 性能增强，比如预取用户可能需要的资源，比如相册中的后面数张图片

## 对比 Web Worker

相同点：
- Service Worker 工作在 worker context 中，是没有访问 DOM 的权限的，所以我们无法在 Service Worker 中获取 DOM 节点，也无法在其中操作 DOM 元素；
- 我们可以通过 postMessage 接口把数据传递给其他 JS 文件；
- Service Worker 中运行的代码不会被阻塞，也不会阻塞其他页面的 JS 文件中的代码；
不同点：
- Service Worker 是一个浏览器中的进程而不是浏览器内核下的线程，因此它在被注册安装之后，能够被在多个页面中使用，也不会因为页面的关闭而被销毁
- Service Worker 只能被使用在 https 或者本地的 localhost 环境下。


## PWA

Progressive Web Apps- 渐进式网页应用,基于Service Worker和CacheStorage实现

- 可靠（Reliable） 即使在不稳定的网络环境下，也能瞬间加载并展现
- 快速响应（Fast） 快速响应，并且有平滑的动画响应用户的操作
- 粘性（Engaging） ： PWA 可以添加在用户的主屏幕上，不用从应用商店进行下载，他们通过网络应用程序 Manifest file 提供类似于 APP 的使用体验（ 在 Android 上可以设置全屏显示哦，由于 Safari 支持度的问题，所以在 IOS 上并不可以 ），并且还能进行 ”推送通知” 。

还包括的功能特性：

- 渐进式 - 适用于所有浏览器，因为它是以渐进式增强作为宗旨开发的
- 连接无关性 - 能够借助 Service Worker 在离线或者网络较差的情况下正常访问
- 类似应用 - 由于是在 App Shell 模型基础上开发，因为应具有 Native App 的交互和导航，给- 用户 Native App 的体验
- 持续更新 - 始终是最新的，无版本和更新问题
- 安全 - 通过 HTTPS 协议提供服务，防止窥探和确保内容不被篡改
- 可索引 - 应用清单文件和 Service Worker 可以让搜索引擎索引到，从而将其识别为『应用』
- 粘性 - 通过推送离线通知等，可以让用户回流
- 可安装 - 用户可以添加常用的 webapp 到桌面，免去去应用商店下载的麻烦
- 可链接 - 通过链接即可分享内容，无需下载安装
