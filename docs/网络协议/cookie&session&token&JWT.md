## 浏览器存储

- cookie 通常用于存用户信息，登录状态等，可自行设置过期时间，体积上限为4K
- localStorage 无限期存储，体积上限为4~5M
- sessionStorage 浏览器窗口关闭则删除，体积上线为4~5M

## Cookie与Session

- Cookie与Session都能够进行会话跟踪，但是完成的原理不太一样。
  
  ![图片加载失败](./img/cookie与session.png)

### Cookie

cookie 是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。
响应头里添加set-Cookie的字段的属性就可以写入

```tsx
Set-Cookie: logcookie=3qjj; expires=Wed, 13-Mar-2019 12:08:53 GMT; Max-Age=31536000; path=/;
 domain=fafa.com;secure; HttpOnly;
```
![图片加载失败](./img/Cookie流程1.png)
![图片加载失败](./img/Cookie流程2.png)

### Session

服务端执行session机制时候会生成session的id值，这个id值会发送给客户端，客户端每次请求都会把这个id值放到http请求的头部发送给服务端，而这个id值在客户端会保存下来，保存的容器就是cookie，因此当我们完全禁掉浏览器的cookie的时候，服务端的session也会不能正常使用。

![图片加载失败](./img/Session流程.png)


## Cookie与Session对比

![图片加载失败](./img/cookie与session对比.png)

## 为什么Session比Cookie安全
>加盐加密：加盐加密是一种对系统登录口令的加密方式，它实现的方式是将每一个口令跟一个n位随机数相关联，这个n位随机数叫做”盐“（salt）。
MD5盐值加密算法:盐值就是在密码hash过程中添加的额外的随机值,盐值的作用是减少数据库泄露带来的损失。

- session的sessionID是放在cookie里，要想功破session的话，第一要功破cookie。功破cookie后，你要得到 sessionID,sessionID是要有人登录，或者启动session_start才会有，你不知道什么时候会有人登录，所以即使你劫持了cookie，也不一定里面含有sessionid。
- 第二，sessionID是加密的（由服务端的加密后返回，python的web框架，Django里面的secret_key，就是用来加密的，当然你也可以手动设置加密是的盐），第二次session_start的时候，前一次的sessionID就没有用了（因为加密的盐中带有时间戳等信息），
- session过期时sessionid也会失效(Cookie JSESSIONID 的过期时间默许为–1，只需关闭了浏览器窗口该 Session 就会失效)，想在短时间内功破加了密的 sessionID很难。session是针对某一次通信而言，会话结束session也就随着消失了，而真正的cookie存在于客户端硬盘上的一个文本文件，谁安全很显然了。

## Token （令牌）

Acesss Token
- 访问资源接口（API）时所需要的资源凭证
- 简单 token 的组成： uid(用户唯一的身份标识)、time(当前时间的时间戳)、sign（签名，- token 的前几位以哈希算法压缩成的一定长度的十六进制字符串）
- token也不需要像session那样服务器做额外的存储
- 特点：
  - 服务端无状态化、可扩展性好
  - 支持移动端设备
  - 安全
  - 支持跨程序调用
- token 的身份验证流程：

![图片加载失败](./img/token验证.png)


![图片加载失败](./img/token.png)

## JWT
>阮一峰:http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html

>简书：https://www.jianshu.com/p/576dbf44b2ae

Json web token (JWT), 是为了在网络应用环境间传递声明而执行的一种基于JSON的开放标准（(RFC 7519).该token被设计为紧凑且安全的，特别适用于分布式站点的单点登录（SSO）场景。JWT的声明一般被用来在身份提供者和服务提供者间传递被认证的用户身份信息，以便于从资源服务器获取资源，也可以增加一些额外的其它业务逻辑所必须的声明信息，该token也可直接被用于认证，也可被加密。

可以使用 HMAC 算法或者是 RSA 的公/私秘钥对 JWT 进行签名。因为数字签名的存在，这些传递的信息是可信的。应用为私钥始终在服务器端，下次JWT传到服务端时进行解密是比较安全的。

### 为什么需要JWT

基于session认证所显露的问题

- Session: 每个用户经过我们的应用认证之后，我们的应用都要在服务端做一次记录，以方便用户下次请求的鉴别，通常而言session都是保存在内存中，而随着认证用户的增多，服务端的开销会明显增大。

- 扩展性: 用户认证之后，服务端做认证记录，如果认证的记录被保存在内存中的话，这意味着用户下次请求还必须要请求在这台服务器上,这样才能拿到授权的资源，这样在分布式的应用上，相应的限制了负载均衡器的能力。这也意味着限制了应用的扩展能力。

- CSRF: 因为是基于cookie来进行用户识别的, cookie如果被截获，用户就会很容易受到跨站请求伪造的攻击。

基于token认证机制的应用不需要去考虑用户在哪一台服务器登录了，这就为应用的扩展提供了便利。

### JWT长什么样

JWT是由三段信息构成的，将这三段信息文本用.链接一起就构成了Jwt字符串。

```tsx
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ
```

#### 第一部分我们称它为头部（header)

- 声明类型，这里是jwt
- 声明加密的算法 通常直接使用 HMAC SHA256

```tsx
{
  'typ': 'JWT',
  'alg': 'HS256'
}

```
然后将头部进行base64加密（该加密是可以对称解密的),构成了第一部分.`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9
`

#### 第二部分我们称其为载荷（payload, 类似于飞机上承载的物品)

- iss: jwt签发者
- sub: jwt所面向的用户
- aud: 接收jwt的一方
- exp: jwt的过期时间，这个过期时间必须要大于签发时间
- nbf: 定义在什么时间之前，该jwt都是不可用的.
- iat: jwt的签发时间
- jti: jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击。

```tsx
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```
然后将其进行base64加密，得到Jwt的第二部分。
公共的声明 ：
公共的声明可以添加任何的信息，一般添加用户的相关信息或其他业务需要的必要信息.但不建议添加敏感信息，因为该部分在客户端可解密.

私有的声明 ：
私有声明是提供者和消费者所共同定义的声明，一般不建议存放敏感信息，因为base64是对称解密的，意味着该部分信息可以归类为明文信息。

#### 第三部分是签证（signature)

jwt的第三部分是一个签证信息，这个签证信息由三部分组成：
- header (base64后的)
- payload (base64后的)
- secret
这个部分需要base64加密后的header和base64加密后的payload使用.连接组成的字符串，然后通过header中声明的加密方式进行加盐secret组合加密，然后就构成了jwt的第三部分。

```tsx
// javascript
var encodedString = base64UrlEncode(header) + '.' + base64UrlEncode(payload);

var signature = HMACSHA256(encodedString, 'secret'); // TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ

```

#### 加密

secret是保存在服务器端的，jwt的签发生成也是在服务器端的，secret就是用来进行jwt的签发和jwt的验证，所以，它就是你服务端的私钥，在任何场景都不应该流露出去。一旦客户端得知这个secret, 那就意味着客户端是可以自我签发jwt了。


### 应用JWT

JWT数据放置的地方：
- Authorization: Bearer `<token>`
- 跨域的时候，可以把 JWT 放在 POST 请求的数据体里。
- 通过 URL 传输 http://www.example.com/user?token=xxx
```tsx
fetch('api/user/1', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
})
```

![图片加载失败](./img/JWT.png)

JWT使用场景：A 网站和 B 网站是同一家公司的关联服务。现在要求，用户只要在其中一个网站登录，再访问另一个网站就会自动登录，就可以使用JWT，因为登录的信息全部都存在客户端，多个服务端只需要一套相同的逻辑即可


### JWT总结

优点：
- 因为json的通用性，所以JWT是可以进行跨语言支持的，像JAVA,JavaScript,NodeJS,PHP等很多语言都可以使用。
- 因为有了payload部分，所以JWT可以在自身存储一些其他业务逻辑所必要的非敏感信息。
- 便于传输，jwt的构成非常简单，字节占用很小，所以它是非常便于传输的。
- 它不需要在服务端保存会话信息, 所以它易于应用的扩展
  
安全相关

不应该在jwt的payload部分存放敏感信息，因为该部分是客户端可解密的部分。
保护好secret私钥，该私钥非常重要。
如果可以，请使用https协议




## Token 和 JWT 的区别 
相同：

- 都是访问资源的令牌
- 都可以记录用户的信息
- 都是使服务端无状态化
- 都是只有验证成功后，客户端才能访问服务端上受保护的资源

区别：

- Token：服务端验证客户端发送过来的 Token 时，还需要查询数据库获取用户信息，然后验证 - Token 是否有效。
- JWT： 将 Token 和 Payload 加密后存储于客户端，服务端只需要使用密钥解密进行校验（校验也是 JWT 自己实现的）即可，不需要查询或者减少查询数据库，因为 JWT 自包含了用户信息和加密的数据。


## Cookie对比Storage

![图片加载失败](./img/cookie对比storage.png)
