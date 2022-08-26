:::tip
迁移From: https://github.com/jianjiachenghub/electron-react
:::
## 依赖安装

- electron 容器
- concurrently 同时执行多个命令，一个是React起的本地3000服务，一个是electron的mainjs
- wait-on 等React服务启动后在跑mainjs
- electron-is-dev 判断是否是开发环境来加载不同的地址
- cross-env 跨平台设置环境变量

## 启动命令

```json
"dev": "concurrently \"wait-on http://localhost:3000 && electron .\" \"cross-env BROWSER=none npm start\""
```
`electron .`会首先去找main,所以可以在package配置一项

```json
  "main": "main.js",
```

## 如何集成typescript

### Main
首先main.tsx可以专门配置一个webpack.config来打包成js，因为main主进程其实和我们的react-app并无引用关系，比较单一，直接打包到dist目录下即可。

到时候package配置一项`"main": "dist/main.js"`即可。

### React-App 渲染层
然后是整体的渲染层代码也就是页面代码可以采用react-cli的打包方式（官方脚手架是可以选择TS版本的，内部配置比较齐全可以直接上手使用）

然后就是在main.js中mainWindow.loadURL时要注意环境
- Dev：直接用http://localhost:3000即可（以及内部帮我们打包运行了
- Pro：一般我们可以个性化配置webpack打包到renderer/index.html，那我们就加载这个html即可

```
 output: {
    path: path.resolve(rootPath, 'dist/renderer'),
    filename: 'js/[name].js',
    publicPath: './'
  },
```

```
if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000')
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true
      })
    )
  }
```


## Render进程中使用Node模块

不能直接使用require去导入Node的原生模块。 React脚手架采用Webpack来打包。Webpack支持ES6moudle和commentJS模块打包。require就是后者。

如果采用require那么webpack会尝试打包Node原生模块，但是Webpack默认会去node_modules里找，但是Node是装到我们系统环境的，所以打包会出错。

## 查看版本

- process.versions.node
- process.versions.chrome
- process.versions.v8
- process.versions.electron