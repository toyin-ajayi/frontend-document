## 关于 IP 的字段

### \$remote_addr

是 nginx 与客户端进行 TCP 连接过程中，获得的客户端真实地址. Remote Address 无法伪造，因为建立 TCP 连接需要三次握手，如果伪造了源 IP，无法建立 TCP 连接，更不会有后面的 HTTP 请求

### X-Real-IP

是一个自定义头。X-Real-Ip 通常被 HTTP 代理用来表示与它产生 TCP 连接的设备 IP，这个设备可能是其他代理，也可能是真正的请求端。需要注意的是，X-Real-Ip 目前并不属于任何标准，代理和 Web 应用之间可以约定用任何自定义头来传递这个信息

### X-Forwarded-For

X-Forwarded-For 是一个扩展头。HTTP/1.1（RFC 2616）协议并没有对它的定义，它最开始是由 Squid 这个缓存代理软件引入，用来表示 HTTP 请求端真实 IP，现在已经成为事实上的标准，被各大 HTTP 代理、负载均衡等转发服务广泛使用，并被写入 RFC 7239（Forwarded HTTP Extension）标准之中.

## X-Forwarded-For 和 X-Real-IP

一般来说，X-Forwarded-For 是用于记录代理信息的，每经过一级代理(匿名代理除外)，代理服务器都会把这次请求的来源 IP 追加在 X-Forwarded-For 中

来自 4.4.4.4 的一个请求，header 包含这样一行

```tsx
X-Forwarded-For: 1.1.1.1, 2.2.2.2, 3.3.3.3

```

代表 请求由 1.1.1.1 发出，经过三层代理，第一层是 2.2.2.2，第二层是 3.3.3.3，而本次请求的来源 IP4.4.4.4 是第三层代理.

而 X-Real-IP，没有相关标准，上面的例子，如果配置了 X-Read-IP，可能会有两种情况

```tsx
// 最后一跳是正向代理，可能会保留真实客户端IP
X-Real-IP: 1.1.1.1
// 最后一跳是反向代理，比如Nginx，一般会是与之直接连接的客户端IP
X-Real-IP: 3.3.3.3

```

## Nginx 获取客户端 IP

在实际应用中，我们可能需要获取用户的 ip 地址，比如做异地登陆的判断，或者统计 ip 访问次数等，通常情况下我们使用 request.getRemoteAddr()就可以获取到客户端 ip，但是当我们使用了 nginx 作为反向代理后，使用 request.getRemoteAddr()获取到的就一直是 nginx 服务器的 ip 的地址

```tsx
proxy_set_header    X-real-ip $remote_addr;// 将客户端真实 ip 地址放到 header的 x-real-ip 字段，然后直接从这个字段来取客户端的 ip 地址就可以获取到真实 IP 了。
```

## 反向代理 IP 的处理

```tsx
proxy_set_header Host $http_host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
```

## node 获取 ip

```js
var express = require("express");
var app = express();
//发送请求，获取客户端ip
app.get("/", function (req, res) {
  var clientIp = getIp(req);
  console.log("客户端ip", clientIp);
  res.send("Hello World");
});
//通过req的hearers来获取客户端ip
var getIp = function (req) {
  var ip =
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddres ||
    req.socket.remoteAddress ||
    "";
  if (ip.split(",").length > 0) {
    ip = ip.split(",")[0];
  }
  return ip;
};
// 指定ipv4格式
var server = app.listen(8081, "0.0.0.0", function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("服务启动...");
});
```
## 过滤ip中间件

```js
/*
** iplimiter: ip过滤中间件，对于在ip黑名单上的ip直接返回，请求不再进行下去
** ip_blacklist: Array, example: ['192.123.12.11']
*/
module.exports = function(ip_blacklist) {
  return async (ctx, next) => {
    if(Array.isArray(ip_blacklist) && ip_blacklist.length) {
      let ip =getIp(ctx.req) //获取客户端ip
      if(ip && ip_blacklist.indexOf(ip) !== -1) {
        await next()
      } else {
        return res.end('ip restricted')
      }
    } else {
      await next()
    }
  }
}
```