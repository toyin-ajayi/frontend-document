// 创建拦截器
var instance = axios.create();
instance.interceptors.request.use(function () {/*...*/});

// 请求拦截器 比如添加token
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么，例如加入token
    if(sessionStorage.getItem('token')){
        config.headers['token'] = sessionStorage.getItem('token')
    }
    // 还可以对一些post请求啊，做一些封装配置
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });