//在main.js设置全局的请求次数，请求的间隙
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;

axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    // 这里进入的是错误的回调
    var config = err.config;
    // 如果配置不存在或未设置重试选项，则拒绝 
    if(!config || !config.retry) return Promise.reject(err);
    
    // 设置变量以跟踪重试计数 
    config.__retryCount = config.__retryCount || 0;
    
    // 检查我们是否已重试总数 
    if(config.__retryCount >= config.retry) {
        // Reject with the error
        return Promise.reject(err);
    }
    
    // 增加重试次数
    config.__retryCount += 1;
    
    // 创建Promise来处理等待时间
    var backoff = new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, config.retryDelay || 1);
    });
    
    // 触发then也就是等待一秒后重试
    return backoff.then(function() {
        return axios(config);
    });
});
