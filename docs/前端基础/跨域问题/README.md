## 什么是跨域

只要协议、域名、端口有任何一个不同，都被当作是不同的域。
随便引用外部文件，不同标签下的页面引用类似的彼此的文件，浏览器觉得很不安全就有了同源策略。
同源策略 (Same-Origin Policy) 最早由 Netscape 公司提出, 所谓同源就是要求, 域名, 协议, 端口相同. 非同源的脚本不能访问或者操作其他域的页面对象(如DOM等)，访问了就是跨域了. 

### postMessage解决内嵌页面跨域无法通信

postMessage是html5引入的API,postMessage()方法允许来自不同源的脚本采用异步方式进行有效的通信,可以实现跨文本文档,多窗口,跨域消息传递.多用于窗口间数据通信,这也使它成为跨域通信的一种有效的解决方案.

我们知道postMessage是挂载在window对象上
第一个参数是要发送的数据，可以是任何原始类型的数据。
第二个参数可以设置要发送到哪个url，如果当前子页面的url和设置的不一致，则会发送失败，我们设置为*，代表所有url都允许发送

```tsx
  <body style="border:5px solid #333;">
    <h1>this is index</h1>
    <iframe src="./iframePage.html" id="myframe"></iframe>
  </body>
  <script>
    let iFrame = document.getElementById("myframe");
    //iframe加载完毕后再发送消息，否则子页面接收不到message
    iFrame.onload = function() {
      //iframe加载完立即发送一条消息
      //postMessage挂载在window对象上的
      //iFrame.contentWindow获取到iframe的window对象
      iFrame.contentWindow.postMessage("父页面index", "*");
    };

    // 接受子页面的消息
    function receiveMessageFromIframePage(event) {
      console.log("receiveMessageFromIframePage", event.data);
    }

    //监听message事件
    window.addEventListener("message", receiveMessageFromIframePage, false);
  </script>
```

```tsx
  <script>
    //回调函数
    function receiveMessageFromIndex(event) {
      console.log("receiveMessageFromIndex", event.data);
    }

    //监听message事件
    window.addEventListener("message", receiveMessageFromIndex, false);
    parent.postMessage( {msg: '子页面'}, '*');
  </script>
```


### document.domain跨域

在根域范围内，Mozilla允许你把domain属性的值设置为它的上一级域。例如，在 developer.mozilla.org 域内，可以把domain设置为 "mozilla.org" 但不能设置为 "mozilla.com" 或者"org"。
因此，若两个源所用协议、端口一致，主域相同而二级域名不同的话，可以借鉴该方法解决跨域请求。

如下，两个不同源但在同一个域名下，可以把他们的域名设置为相同
```tsx
  <body>
    <iframe id="iframe" src="http://child.domain.com/b.html"></iframe>
  </body>
  <script>
    document.domain = "domain.com";
    var user = "admin";
  </script>
```

```tsx
  <body>
    <iframe id="iframe" src="http://child.domain.com/b.html"></iframe>
  </body>
  <script>
    document.domain = "domain.com";
    var user = "admin";
  </script>

```



### Jsonp跨域

减轻web服务器的负载，可以把js、css，img等静态资源分离到另一台独立域名的服务器上，在html页面中再通过相应的标签从不同域名下加载静态资源，而被浏览器允许，基于此原理，我们可以通过动态创建script，再请求一个带参网址实现跨域通信。只能实现get请求

- 首先，因为ajax无法跨域，然后开发者就有所思考
- 其次，开发者发现， `<script>`标签的src属性是可以跨域的,把跨域服务器写成 调用本地的函数 ，回调数据回来不就好了
- json刚好被js支持（object）
- 调用跨域服务器上动态生成的js格式文件（不管是什么类型的地址，最终生成的返回值都是一段js代码）
- 这种获取远程数据的方式看起来非常像ajax，但其实并不一样,便于客户端使用数据，逐渐形成了一种非正式传输协议，人们把它称作JSONP。
- 传递一个callback参数给跨域服务端，然后跨域服务端返回数据时会将这个callback参数作为函数名来包裹住json数据即可。

```tsx
    <script type="text/javascript">
        function res (r) {  //定义回调函数接收返回结果
            console.log(r)
        }
    </script>
    <script src="./test.js?callback=res">
        //? 之前为请求的路径
　　　　 //? 之后 callback 可缩写为 cb，值为回调函数的名称
    </script>  
```

### window.name + iframe

window.name属性的独特之处：name值在不同的页面（甚至不同域名）加载后依旧存在，并且可以支持非常长的 name 值（2MB）。

我们可以用a页面跨域访问c，虽然跨域访问但是name值已经绑定在了iframe的window上，然后把iframe的src改为b的，name也不会掉，也就完成了跨域。

其中a.html和b.html是同域的，都是http://localhost:3000;而c.html是http://localhost:4000



### location.hash + iframe

a.html欲与c.html跨域相互通信，通过中间页b.html来实现。 三个页面，不同域之间利用iframe的location.hash传值，相同域之间直接js访问来通信。

具体实现步骤：a把hash->c  c能拿到hash做相关逻辑然后传一个hash->b  b能直接和a通信于是a可以修改a的hash，然后a监听hash的变化就达到了通信的作用

### Node中间件代理(两次跨域)

实现原理：同源策略是浏览器需要遵循的标准，而如果是服务器向服务器请求就无需遵循同源策略。 node中间件实现跨域代理，是通过启一个代理服务器，实现数据的转发

```tsx
var proxy = require('http-proxy-middleware');
var options = {
  target: 'https://xxxx.xxx.xxx/abc/req',
  changeOrigin: true,
  pathRewrite: (path,req)=>{
    return path.replace('/api','/')
  }
}
app.use('/api', proxy(options));

```

###  跨域资源共享（CORS）Cross-origin resource sharing

普通跨域请求：只服务端设置Access-Control-Allow-Origin即可，前端无须设置，若要带cookie请求：前后端都需要设置。

### nginx代理跨域

跨域原理： 同源策略是浏览器的安全策略，不是HTTP协议的一部分。服务器端调用HTTP接口只是使用HTTP协议，不会执行JS脚本，不需要同源策略，也就不存在跨越问题。

```tsx
server {
        listen       80;
	server_name  localhost;
	location / {
            root   /Users/abc/dist/;
            index  index.html index.htm;
        }

        location /api/ {
                proxy_pass  https://xxx.xxx.xxx/req/;
        }
}

```

### 开发环境跨域

如React，可以在package.json里配置一个Proxy属性来代理，只能在开发环境使用，生产环境需要额外配置

```tsx
"proxy":{
    "/api": {
        "target": "http://172.19.5.35:9536",
        "ws": true
      },
  "/apc": {
        "target": "http://179.19.5.35:9536",
        "ws": true
      }
```

## 如何使用跨域方法看场合

开发环境下一般比如React,直接用内置的代理就行了，不过开发环境需要重新配置。
如果是什么iframe内嵌或是不同窗口的跨域用postMessage比较方便。
生产环境可以考虑nginx反向代理或node中间件比较方便