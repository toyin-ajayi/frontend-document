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

`比如在www.baidu.com下开启控制台然后写入Cookie`

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

### 读取Cookie

```tsx
//  有编码的话需要使用encodeURIComponent decodeURIComponent这两个API
function getCookieValue(name) {
  const nameString = name + "="
  
  const value = document.cookie.split(";").filter(item => {
    return item.includes(nameString)
  })
  
  if (value.length) {
    return value[0].substring(nameString.length, value[0].length)
  } else {
    return ""
  }
}

```

正则方式：

```tsx
function getCookieValue(name) {
  let result = document.cookie.match("(^|[^;]+)\\s*" + name + "\\s*=\\s*([^;]+)")
  return result ? result.pop() : ""
}

```

### 修改Cookie


```tsx
document.cookie = "userId=new_value"
```

### 删除Cookie

```tsx
document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"

```

## 服务端操作Cookie

一个set-cookie只能设置一个cookie, 当你想设置多个, 需要添加同样多的set-cookie
服务端可以设置cookie的所有选项: expires, domain, path, secure, HttpOnly(比刚刚多了一个HttpOnly表示不允许Js来读取)
```tsx
设置cookie
基础设置：

res.writeHead(200, {
        'Set-Cookie': 'myCookie=test',
        'Content-Type': 'text/plain'
});
多组设置：

res.writeHead(200, {
     'Set-Cookie': ["aaa=bbb","ccc=ddd","eee=fff"],
     'Content-Type': 'text/plain'
 });
但真正使用时，我们的Cookie并非这样简单的的格式，需要设置过期时间等等：


res.writeHead(200, {
        'Set-Cookie': 'myCookie=test; Expires=Wed, 13-Jan-2021 22:23:01 GMT;HttpOnly ',
        'Content-Type': 'text/html'
});
```

## 特别注意跨域请求的Cookie写入

比如后台服务是request.com,然后现在页面是page.com; 
现在用户在page.com登录，请求request.com服务,request.com会用set-cookie的形式写入一个cookie，那问题来了，这个cookie在哪个域下呢？

答案是在request.com这个域名下，现在无法在Application下面的Cookies面板看到这个cookie(一般你在page.com打开这个面板只会看到page.com下面的Cookie)，而是要在network面板的所有请求这个request.com域的请求里才能看到。

**总结下就是客户端请求服务端，服务端返回时写入Cookie，是在浏览器控制的内存中存到服务端的域下，下次同一个浏览器无论在哪个域的页面上，请求这个服务端，都会带上这个cookie；现在你是否想到了跨站点请求伪造**

![图片加载失败](./img/跨域请求的Cookie.png)

## 第三方cookie

### 跨站请求与第三方cookie
>同站(same-site)/跨站(cross-site)」：只要两个 URL 的 eTLD+1 相同即可，不需要考虑协议和端口。eTLD 表示有效顶级域名，eTLD+1 是有效顶级域名+二级域名

当一个请求本身的 URL 和它的发起页面的 URL 不属于同一个站点时，这个请求就算第三方请求。(也就是跨站请求)

当前页面发起的请求的 URL 不一定也是 a.com 上的，可能有 b.com 的，也可能有 c.com 的。我们把发送给 a.com 上的请求叫做第一方请求（first-party request），发送给 b.com 和 c.com 等的请求叫做第三方请求（third-party request），第三方请求和第一方请求一样，都会带上各自域名下的 cookie，所以就有了第一方 cookie（first-party cookie）和第三方 cookie（third-party cookie）的区别。上面提到的 CSRF 攻击，就是利用了第三方 cookie 。

### 利用img种第三方Cookie

目前，进行跨域cookie的方式有以下几种：
- iframe 跨域
- jsonp 跨域
- 使用img tag来完成cookie 跨域

使用html img 标签进行的跨域。其原理就是我们在设置img的src属性时，浏览器会自动去获取src指向的地址，且此方式为get请求。

现有 http://a.com 和 http://b.com，我们分别称呼为 A B。实现的效果是打开 A网站时，会为B网站设置一个cookie。
假设设置的cookie名为 uid，此处使用PHP语言来进行解释。

### A网站需要做的工作
在 http://a.com 指向的html页面中加入
```tsx
 <img src="http://laravel-site1.app/set_cookie/?uid=rovast-blog" >
```



### B网站需要做的工作

Ｂ网站的路由控制器中需要返回一个透明1px图片同时设定cookie即可
```tsx
    // laravel 示例
    Route::get('set_cookie', function (Request $request) {
        return response(base64_decode('iVBOR......vDMAAAAASUVORK5CYII='), 200)
        ->header('Content-Type', 'image/png')
        ->cookie('uid', $request->uid);
        /* Returns 1px transparent image */
    });
```

我们打开 http://a.com 的时候在Application里的Cookie那栏就已经再 B 网站中设置好了 cookie!

## 参考

- https://javascript.ruanyifeng.com/bom/cookie.html
