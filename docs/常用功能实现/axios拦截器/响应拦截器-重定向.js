
// 响应拦截器
axios.interceptors.response.use(
    response => {
      //拦截响应，做统一处理  没有权限跳转登录
      if (response.data.code) {
        switch (response.data.code) {
          case 1002:
            store.state.isLogin = false
            router.replace({
              path: 'login',
              query: {
                redirect: router.currentRoute.fullPath
              }
            })
        }
      }
      return response
    },
    //接口错误状态处理，也就是说无响应时的处理
    error => {
      return Promise.reject(error.response.status) // 返回接口返回的错误信息
    })





