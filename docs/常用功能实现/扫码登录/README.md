## 简单的逻辑

注意点就是网页会一直轮询服务器ID:obsbQ-Dzag有没有账号绑定。

当扫码获取二维码中的URL并访问这个URL对应的后端服务时就会再服务器把ID:obsbQ-Dzag和账号绑定，可以借助redis实现 key存id，value存账号，就绑定了。

一旦绑定就会被轮询到，即可跳转到已登录页面
<img src="./img/扫码登录简单版.png" />


## 完整流程

<img src="./img/扫码登录原理.png" />