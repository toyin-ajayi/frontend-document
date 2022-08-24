## mockjs的功能

- 生产数据:通过mockjs提供的方法,你可以轻松地创造大量随机的文本,数字,布尔值,日期,邮箱,链接,图片,颜色等.

- 强大的拦截功能:mockjs可以进行强大的ajax拦截.能判断请求类型,获取到url,请求参数等.然后可以返回mock的假数据,或者你自己编好的json文件.功能强大易上手.


请求拦截方面,mockjs优先级最高.mockjs>nginx>dev-server.所以你可以使用Mock.mock()方法拦截任何你想拦截的请求而不需要担心nginx或者其他代理.而当你使用dev-server进行拦截时,并且你也和我一样,项目之前配置了nginx,则会比较麻烦.

**所以mockjs方式在控制台并不会看到有xhr请求，因为在发出去前就被拦截了**


## 框架中的架构

业务代码基本不用改变，请求mock接口和真实的写法一模一样。 只是请求被mockjs拦截然后返回mock数据。 那么我们可以根据环境变量来确定是否需要开启mock。

在main.js里定义一个变量

```
const mock = false; // 可以根据环境变量来影响
if(mock){
  require('./mock/api'); // 运行中加载
}
```
定义mock接口
```
// mock/api.js
import Mock from 'mockjs'
Mock.mock('/api/user/login',{
  "status": 0,
  "data": {
    "id|10001-11000": 0,
    "username": "@cname",
    "email": "admin@51purse.com",
    "phone": null,
    "role": 0,
    "createTime": 1479048325000,
    "updateTime": 1479048325000
  }
});

// 通过Mock.mock函数模拟post请求
Mock.mock('/api/addgoods', 'post', function (option) {
  // 这里的option是请求的相关参数
  console.log(option)

  return Mock.mock({
    status: 200,
    message: '@cword(2)'
  })
})
```
然后就用axios来发送请求'/api/user/login'就行了

## 其他mock方法：搭建服务

- https://www.easy-mock.com/login 

目前easy-mock开源，可以搭建个内网的服务来mock数据