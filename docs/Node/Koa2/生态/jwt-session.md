JWT
============================

1. **JWT加密**
```js
const jwt = require('jsonwebtoken')

const { security } = require('./config')

router.post('login', async ctx => {
  const { username, password } = ctx.request.body
  let userInfo = ''
  if (username === 'xx' && password === 'xx') {
    userInfo = {
      username: 'xx',
      password: 'xx'
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '用户名密码错误'
    }
    return
  }
  let token = ''
  if (userInfo) {
    token = jwt.sign(userInfo, security.secretKey, {
      expiresIn: security.expiresIn
    })
  }
  ctx.body = {
    code: 0,
    data: token
  }
})
```

1. **JWT验证** 
```js
//app.js
const jwtKoa = require('koa-jwt')


// 在路由配置前
app.use(jwtKoa({
  secret: '123qwerASD', // 密钥信息
})).unless({
  path: [/^\users\/login/] // 自定义哪些目录忽略 jwt 验证
})
```

客户端发请求的时候在header需要带上token
```tsx

```

3. **JWT解密获取用户信息**
```js
const util = require('util')
const jwt = require('jsonwebtoken')
const verify = util.promisify(jwt.verify)

const { security } = require('./config')

router.get('userInfo', async ctx => {
  const token = ctx.header.authorization
  try {
    const payload = await verify(token.split(' ')[1], security.secretKey) // jsonwebtoken会给token前加Bearer 前缀
    ctx.body = {
      code: 0,
      userInfo: payload
    }
  } catch (ex) {
    ctx.body = {
      code: -1,
      msg: 'verify token failed'
    }
  }
})
```

JWT VS session
============================
1. jwt 用户信息加密存储在客户端，不依赖cookie，可跨域
2. session 用户信息存储在服务端，依赖cookie，默认不可跨域
3. jwt 更适合于服务节点较多，跨域比较多的系统
4. session 更适合于同一 web 服务，server 要严格管理用户信息
5. *jwt 过期时间在客户端，服务端无法控制*