## 了解 SPA

现代前端项目多为单页 Web 应用(SPA)，在单页 Web 应用中路由是其中的重要环节。
SPA 是 single page web application 的简称，译为单页 Web 应用。  
简单的说 SPA 就是一个 WEB 项目只有一个 HTML 页面，一旦页面加载完成，SPA 不会因为用户的操作而进行页面的重新加载或跳转。 取而代之的是利用 JS 动态的变换 HTML 的内容，从而来模拟多个视图间跳转。

## 前度路由

简单的说，就是在保证只有一个 HTML 页面，且与用户交互时不刷新和跳转页面的同时，为 SPA 中的每个视图展示形式匹配一个特殊的 url。在刷新、前进、后退和 SEO 时均通过这个特殊的 url 来实现。
我们需要实现下满两点：

- 改变 url 且不让浏览器像服务器发送请求。
- 可以监听到 url 的变化
- 可以在不刷新页面的前提下动态改变浏览器地址栏中的 URL 地址
  hash 模式和 history 模式，就是用来实现上面功能的

## Hash 模式

在 url 后面加上#，如`http://127.0.0.1:5500/前端路由/hash.html#/page1`这个 url 后面的`#/page1`就是 hash 值

- hash 值的变化不会导致浏览器像服务器发送请求
- location.hash 可以获取 hash 值
- hashchange 是 hash 值发生改变的调用的函数
  基于以上三点我们可以写一个路由实例

```tsx
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <ul>
      <li><a href="#/">/</a></li>
      <li><a href="#/page1">page1</a></li>
      <li><a href="#/page2">page2</a></li>
    </ul>
    <div class="content-div"></div>
  </body>
  <script>
    class RouterClass {
      constructor() {
        this.routes = {}; // 记录路径标识符对应的cb
        this.currentUrl = ""; // 记录hash只为方便执行cb
        window.addEventListener("load", () => this.render());
        window.addEventListener("hashchange", () => this.render());
      }

      /* 初始化 */
      static init() {
        window.Router = new RouterClass();
      }

      /* 注册路由和回调 */
      route(path, cb) {
        this.routes[path] = cb || function() {};
      }

      /* 记录当前hash，执行cb */
      render() {
        this.currentUrl = window.location.hash.slice(1) || "/";
        this.routes[this.currentUrl]();
      }
    }


    RouterClass.init();
    const ContentDom = document.querySelector(".content-div");
    const changeContent = content => (ContentDom.innerHTML = content);

    Router.route("/", () => changeContent("默认页面"));
    Router.route("/page1", () => changeContent("page1页面"));
    Router.route("/page2", () => changeContent("page2页面"));
  </script>
</html>
```

## History 模式

History 接口允许操作浏览器的曾经在标签页或者框架里访问的会话历史记录。可以参考下两篇文章对 history 的说明
[https://css-tricks.com/using-the-html5-history-api/](https://css-tricks.com/using-the-html5-history-api/)
[https://developer.mozilla.org/zh-CN/docs/Web/API/History](https://developer.mozilla.org/zh-CN/docs/Web/API/History)
下面介绍在这个模式下需要用到的 api

### history 基本 api

- `history.go(n)`：路由跳转几步，n 为 2 往前跳转 2 个页面，-2 往后跳转两个页面
- `history.back()`：路由后退，相当于 `history.go(-1)`，用户可点击浏览器左上角的后退按钮模拟此方法
- `history.forward()`：路由前进，相当于 `history.go(1)`，用户可点击浏览器左上角的前进按钮模拟此方法


### pushState()

`history.pushState()`：添加一条路由历史记录，如果设置跨域网址则报错

> `history.pushState`用于在浏览历史中添加历史记录,但是并不触发跳转,此方法接受三个参数，依次为：
> `state`:一个与指定网址相关的状态对象，`popstate`事件触发时，该对象会传入回调函数。如果不需要这个对象，此处可以填`null`。  
> `title`：新页面的标题，但是所有浏览器目前都忽略这个值，因此这里可以填`null`。  
> `url`：新的网址，必须与当前页面处在同一个域。浏览器的地址栏将显示这个网址。

### window 的 popstate 事件

当活动历史记录条目更改时，将触发 popstate 事件。如果被激活的历史记录条目是通过对 history.pushState（）的调用创建的，或者受到对 history.replaceState（）的调用的影响，popstate 事件的 state 属性包含历史条目的状态对象的副本。
需要注意的是调用 history.pushState()或 history.replaceState()不会触发 popstate 事件。只有在做出浏览器动作时，才会触发该事件，如用户点击浏览器的回退按钮（或者在 Javascript 代码中调用 history.back()）

```tsx
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <ul>
      <li><a href="/">/</a></li>
      <li><a href="/page1">page1</a></li>
      <li><a href="/page2">page2</a></li>
    </ul>
    <div class="content-div"></div>
  </body>
  <script>
    class RouterClass {
      constructor(path) {
        this.routes = {}; // 记录路径标识符对应的cb
        history.replaceState({ path }, null, path); // 进入状态
        this.routes[path] && this.routes[path]();
        window.addEventListener("popstate", e => {// 当用户点击浏览器的前进或者后退触发
            console.log(e.state)
          const path = e.state && e.state.path;
          this.routes[path] && this.routes[path]();
        });
      }

      /* 初始化 */
      static init() {
        window.Router = new RouterClass(location.pathname);
      }

      /* 注册路由和回调 */
      route(path, cb) {
        this.routes[path] = cb || function() {};
      }

      /* 跳转路由，并触发路由对应回调 */
      go(path) {

        history.pushState({ path }, null, path);
        console.log(history);
        this.routes[path] && this.routes[path]();
      }
    }

    RouterClass.init();
    const ul = document.querySelector("ul");
    const ContentDom = document.querySelector(".content-div");
    const changeContent = content => (ContentDom.innerHTML = content);

    Router.route("/", () => changeContent("默认页面"));
    Router.route("/page1", () => changeContent("page1页面"));
    Router.route("/page2", () => changeContent("page2页面"));

    ul.addEventListener("click", e => {
      console.log(e.target.tagName);
      if (e.target.tagName === "A") {
        e.preventDefault();
        Router.go(e.target.getAttribute("href"));
      }
    });
  </script>
</html>

```

## Hash 模式和 History 模式对比

Hash 模式是使用 URL 的 Hash 来模拟一个完整的 URL，因此当 URL 改变的时候页面并不会重载。History 模式则会直接改变 URL，所以在路由跳转的时候会丢失一些地址信息，在刷新或直接访问路由地址的时候会匹配不到静态资源。因此需要在服务器上配置一些信息，让服务器增加一个覆盖所有情况的候选资源，比如跳转 index.html 什么的

nginx location 匹配规则
~ 波浪线表示执行一个正则匹配，区分大小写
~* 表示执行一个正则匹配，不区分大小写
^~ 表示普通字符匹配，如果该选项匹配，只匹配该选项，不匹配别的选项，一般用来匹配目录
= 进行普通字符精确匹配
@ 定义一个命名的 location，使用在内部定向时，例如 error_page, try_files



```tsx
location / {
    root /code/app1/build;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
}   
location ^~ /app {
    alias /code/app2/build;
    index index.html;
    try_files $uri $uri/ /app/index.html;
}
location ^~ /api/ {
  proxy_pass http://api.site;
}
```

当用户请求 http://localhost/example 时，这里的 \$uri 就是 /example。 
try_files 会到硬盘里尝试找这个文件。如果存在名为 /\$root/example（其中 \$root 是项目代码安装目录）的文件，就直接把这个文件的内容发送给用户。 
显然，目录中没有叫 example 的文件。然后就看 \$uri/，增加了一个 /，也就是看有没有名为 /\$root/example/ 的目录。 
又找不到，就会 fall back 到 try_files 的最后一个选项 /index.php，发起一个内部 “子请求”，也就是相当于 nginx 发起一个 HTTP 请求到 http://localhost/index.php。 

### hash 路由 优缺点

- 优点

  - 实现简单，兼容性好（兼容到`ie8`）
  - 绝大多数前端框架均提供了给予`hash`的路由实现
  - 不需要服务器端进行任何设置和开发
  - 除了资源加载和`ajax`请求以外，不会发起其他请求

- 缺点

  - 对于部分需要重定向的操作，后端无法获取`hash`部分内容，导致后台无法取得`url`中的数据，典型的例子就是微信公众号的`oauth`验证
  - 服务器端无法准确跟踪前端路由信息
  - 对于需要锚点功能的需求会与目前路由机制冲突

### History(browser)路由 优缺点

- 优点

  - 对于重定向过程中不会丢失`url`中的参数。后端可以拿到这部分数据
  - 绝大多数前段框架均提供了`browser`的路由实现
  - 后端可以准确跟踪路由信息
  - 可以使用`history.state`来获取当前`url`对应的状态信息

- 缺点

  - 兼容性不如`hash`路由(只兼容到`IE10`)
  - 需要后端支持，每次返回`html`文档

## 参考文章

实例来源：[https://segmentfault.com/a/1190000018081475](https://segmentfault.com/a/1190000018081475)
官方文档：[https://developer.mozilla.org/en-US/docs/Web/API/History_API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
优缺点比较:https://juejin.im/post/5b5ec5dd6fb9a04fc564b72d
