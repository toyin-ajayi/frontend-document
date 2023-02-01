## 为什么需要cookie

Web应用程序是使用HTTP协议传输数据的。HTTP协议是无状态的协议。一旦数据交换完毕，客户端与服务器端的连接就会关闭，再次交换数据需要建立新的连接。这就意味着服务器无法从连接上跟踪会话。

你可能会有这样的经历，登陆一个网站的时候会提醒你要不要记住账户和密码，这样下次来你就不用再次输入账号密码了。这就是cookie的作用，当我们再次访问的时候，方便服务器直接根据我们的cookie来判断你的状态

## 什么是 Cookie

HTTP Cookie（也叫 Web Cookie或浏览器 Cookie）是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。通常，它用于告知服务端两个请求是否来自同一浏览器，如保持用户的登录状态。Cookie 使基于无状态的 HTTP 协议记录稳定的状态信息成为了可能。

Cookie 主要用于以下三个方面：
- 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
- 个性化设置（如用户自定义设置、主题等）
- 浏览器行为跟踪（如跟踪分析用户行为等）

## 设置cookie不可跨域，满足同源策略

### 主域名不同

比如在www.baidu.com下开启控制台，然后写入Cookie：
```tsx
document.cookie='myname=huaminlai;path=/;domain=.google.com';// 无效
```
上面这种写法是不会生效的，应为在www.baidu.com这个域下，只能设置百度网页的Cookie：
```tsx
document.cookie='myname=laihuamin;path=/;domain=.baidu.com';// 有效
```
### 次级域名不同

虽然网站images.google.com与网站www.google.com同属于Google，但是域名不一样，二者同样不能互相操作彼此的Cookie。而且path也必须一样才能相互访问彼此的cookie，需要注意不同浏览器对path访问规定不一样，对于chrome，path必须为当前目录，设置为其他目录无效，只能当前页面只能访问当前目录及其以上的cookie

### 子父级域名

- 在 www.baidu.com下设置 baidu.com 的 cookie 会被自动转换成 domain=**.baidu.com**
- **.baidu.com**表示像www.baidu.com或在ccc.baidu.com这种和.baidu.com同级的域名都可以访问，且父域名 baidu.com 也能访问

- 但是在 baidu.com 下设置 domain=baidu.com 的 cookie，子域名www.baidu.com是无法访问的

注意：当前域名只能设置当前域名以及他的父域名，不能设置子域名，这种网上的说法好像不太准确，因为上面的验证显示子域名设置父域名的cookie时明细多带了一个点 '**.**'

## 访问Cookie总结

- 首先不同域名肯定不能相互访问
- 父域名可以访问子域名的 cookie
- 子域名不能访问父域名的 cookie

