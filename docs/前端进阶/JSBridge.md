- JSBridge的原理:https://juejin.im/post/5abca877f265da238155b6bc
- https://juejin.cn/post/6844904025511444493

## JSBridge

就是JavaScript(H5)与Native通信的桥梁.


## 实现原理

JSBridge与Native间通信原理
在H5中JavaScript调用Native的方式主要用两种

- 注入API，注入Native对象或方法到JavaScript的window对象中（可以类比于RPC调用）。
- 拦截URL Schema，客户端拦截WebView的请求并做相应的操作（可以类比于JSONP）。

下面将以Android端的JSBridge通信为例。

## 注入API

通过WebView提供的接口，向JavaScript的window中注入对象或方法(Android使用addJavascriptInterface()方法)，让JavaScript调用时相当于执行相应的Native逻辑，达到JavaScript调用Native的效果。

对于Android实现方式如下，核心代码在于

```JS
webView.addJavascriptInterface(new InjectNativeObject(this), "NativeBridge");

```

然后InjectNativeObject对应的代码如下
```JAVA
public class MainActivity extends AppCompatActivity {
    private WebView webView;
    // 不要用localhost或127.0.0.1
    private final String host = "192.168.199.231";

    public class InjectNativeObject { // 注入到JavaScript的对象
        private Context context;
        public InjectNativeObject(Context context) {
            this.context = context;
        }
        @JavascriptInterface
        public void openNewPage(String msg) { // 打开新页面，接受前端传来的参数
            if (msg.equals("")) {
                Toast.makeText(context, "please type!", Toast.LENGTH_LONG).show();
                return;
            }
            startActivity(new Intent(context, SecondActivity.class));
            Toast.makeText(context, msg, Toast.LENGTH_SHORT).show();
        }

        @JavascriptInterface // 存在兼容性问题
        public void quit() { // 退出app
            finish();
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        webView = findViewById(R.id.loginWebView);
        webView.getSettings().setJavaScriptEnabled(true);
        // JS注入
        webView.addJavascriptInterface(new InjectNativeObject(this), "NativeBridge");
        webView.loadUrl(String.format("http://%s:3000/login_webview", host)); // 加载Webview
    }

}


```

对于JavaScript侧，则可以直接调用Native端注入的InjectNativeObjec对象的方法

```JS
window.NativeBridge = window.NativeBridge || {}; // 注入的对象
// 登录按钮点击，调用注入的openNewPage方法，并传入相应的值
loginButton.addEventListener("click", function (e) {
    window.NativeBridge.openNewPage(accountInput.value + passwordInput.value);
}, false);
// 退出按钮点击，调用quit方法
quitButton.addEventListener("click", function (e) {
    window.NativeBridge.quit();
}, false)

```

## 拦截URL Schema

H5端通过iframe.src或localtion.href发送Url Schema请求，之后Native（Android端通过shouldOverrideUrlLoading()方法）拦截到请求的Url Schema（包括参数等）进行相应的操作。

通俗点讲就是，H5发一个普通的https请求可能是: daydream.com/?a=1&b=1， 而与客户端约定的JSBridge Url Schema可能是: Daydream://jsBridgeTest/?data={a:1,b:2}，客户端可以通过schema来区分是JSBridge调用还是普通的https请求从而做不同的处理。

其实现过程原理类似于JSONP

首先在H5中注入一个callback方法，放在window对象中
```JS
function callback_1(data) { 
  console.log(data); 
  delete window.callback_1 };
  window.callback_1 = callback_1;
  }
```

然后把callback的名字通过Url Schema传到Native

Native通过shouldOverrideUrlLoading()，拦截到WebView的请求，并通过与前端约定好的Url Schema判断是否是JSBridge调用。
Native解析出前端带上的callback，并使用下面方式调用callback

```JS
webView.loadUrl(String.format("javascript:callback_1(%s)", isChecked)); // 可以带上相应的参数

// 或者
webView.evaluateJavascript(String.format("callback_1(%s)", isChecked), value -> {
       // value callback_1执行是返回值
       Toast.makeText(this, value, Toast.LENGTH_LONG).show();
});

```

通过上面几步就可以实现JavaScript到Native的通信。下面可以看看处理Url Schema的拦截的shouldOverrideUrlLoading方法的相关例子

```JAVA
public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        String schema = request.getUrl().getScheme(); // https or Daydream
        if (this.schema.equals(schema)) { // 如果和约定好的Schema一致，则处理JSBridge调用
            String callback = request.getUrl().getQueryParameter("callback");
            String comment = request.getUrl().getQueryParameter("comment");
            assert comment != null;
            if (comment.equals("")) {
                Toast.makeText(context, "please type some comment!", Toast.LENGTH_LONG).show();
                return false;
            }
            // 使用loadUrl的方式来调用window上的方法
            view.loadUrl(String.format("javascript:%s('%s')", callback, comment));
        }
        return super.shouldOverrideUrlLoading(view, request);
}

```