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

## cookie的属性

属性名 | 描述
------- | -------
name | Cookie的名称，Cookie一旦创建，名称便不可更改
value | Cookie的值，如果值为Unicode字符，需要为字符编码。如果为二进制数据，则需要使用BASE64编码
maxAge | Cookie失效的时间，单位秒。如果为整数，则该Cookie在maxAge秒后失效。如果为负数，该Cookie为临时Cookie，关闭浏览器即失效，浏览器也不会以任何形式保存该Cookie。如果为0，表示删除该Cookie。默认为-1。
secure | 该Cookie是否仅被使用安全协议传输。安全协议。安全协议有HTTPS，SSL等，在网络上传输数据之前先将数据加密。默认为false。
HttpOnly | 通过js脚本将无法读取到cookie信息，这样能有效的防止XSS攻击，窃取cookie内容
path | Cookie的使用路径。如果设置为“/sessionWeb/”，则只有contextPath为“/sessionWeb”的程序可以访问该Cookie。如果设置为“/”，则本域名下contextPath都可以访问该Cookie。注意最后一个字符必须为“/”。
domain | 可以访问该Cookie的域名。如果设置为“.google.com”，则所有以“google.com”结尾的域名都可以访问该Cookie。注意第一个字符必须为“.”。
comment | 该Cookie的用处说明，浏览器显示Cookie信息的时候显示该说明。
version | Cookie使用的版本号。0表示遵循Netscape的Cookie规范，1表示遵循W3C的RFC 2109规范

### name和value

- name表示一个cookie的名字，在同一个域下不能相同，相同的话会被覆盖
- value表示name对应Cookie的值，其必须被URL编码（由于cookie规定是名称/值是不允许包含分号，逗号，空格的，所以为了不给用户到来麻烦，考虑服务器的兼容性，任何存储cookie的数据都应该被编码。）

### domain

- 指的域名，这个代表的是，cookie绑定的域名，如果没有设置，就会自动绑定到执行语句的当前域
- 一个域名下的二级域名也是不可以交换使用cookie的，比如，你设置www.baidu.com和image.baidu.com,依旧是不能公用的

### path

path这个属性默认是'/'，这个值匹配的是web的路由
```tsx
//默认路径
www.baidu.com
//blog路径
www.baidu.com/blog
```
当你路径设置成/blog的时候，其实它会给/blog、/blogabc等等的绑定cookie,

### Expires 和 Max-Age

Expires这个是代表当前时间的，想要cookie存在一段时间，那么你可以通过设置Expires属性为未来的一个时间节点

Max-Age，是以秒为单位的

- Max-Age为正数时，cookie会在Max-Age秒之后，被删除
- 当Max-Age为负数时，表示的是临时储存，不会生出cookie文件，只会存在浏览器内存中
- 当Max-Age为0时，又会发生什么呢，删除cookie，因为cookie机制本身没有设置删除cookie，失效的cookie会被浏览器自动从内存中删除，所以，它实现的就是让cookie失效

### secure

http不仅是无状态的，还是不安全的协议，容易被劫持，当这个属性设置为true时（Secure=true），此cookie只会在https和ssl等安全协议下传输


## js操作cookie

```tsx
document.cookie = "userId=nick123; expires=Wed, 15 Jan 2020 12:00:00 UTC; path=/user; domain=mysite.com"
```

