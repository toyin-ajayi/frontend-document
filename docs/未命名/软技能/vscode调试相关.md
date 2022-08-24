## 简单调试文件

- 下载好debugger for chrome 这个插件

```
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Chrome",
            "file": "${file}",
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Node",
            "program": "${file}",
            "cwd": "${fileDirname}"
        },
    ]
}
```

##  Chrome 远程调试 Node

```
node --inspect .\dist\index.js
Debugger listening on ws://127.0.0.1:9229/b50197d4-c86e-42c1-9770-418d54cae652
For help, see: https://nodejs.org/en/docs/inspector
```


然后在chrome启动 inspect 进入调试页面  然后连接到刚刚的WS服务地址即可

## 调试服务

两个调试配置, “Launch Chrome Instance” 是直接通过 vscode 打开 Chrome 浏览器，也就是本地调试，整个 Chrome 实例都是可以用 vscode 控制的，”Attach to Chrome” 是调试外部环境的 Chrome 实例，也就是说这个 Chrome 浏览器的窗口是你另外打开的。

其中 9222 是浏览器远程调试的接口，需要在 Chrome 浏览器运行的时候加参数指定，只需可执行程序命令后面添加 –remote-debugging-port=9222 就可以了。

```
{
  "version": "0.2.0",
  "configurations": [
      
      {
          "name": "Launch Chrome Instance",
          "type": "chrome",
          "request": "launch",
          "url": "http://127.0.0.1:8080/#/",
          "sourceMaps": true,
          "webRoot": "${workspaceRoot}"
      },
      {
          "name": "Attach to Chrome",
          "type": "chrome",
          "request": "attach",
          "port": 9222,
          "sourceMaps": true,
          "webRoot": "${workspaceRoot}"
      }
  ]
}
```
## 结合Vue和React来看

### Vue 的 webpack 配置

在config的dev里添加这两个修改
```
    devtool: 'eval-source-map',
    cacheBusting : false,
```

### launch

重新起一个chrome来跑调试的程序
```
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "vuejs: chrome",
            "url": "http://localhost:8080",
            "webRoot": "${workspaceFolder}/src",
            "breakOnLoad": true,
            "sourceMapPathOverrides": {
              "webpack:///src/*": "${webRoot}/*"
            }
          },
    ]
  }
```

### Attach

连接已经在运行的程序，不需要再启动

在windows需要设置下启动debugging 监听端口
右键点击 Chrome 的快捷方式图标，选择属性
在目标一栏，最后加上--remote-debugging-port=9222 注意要用空格隔开

```
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
      {
        "type": "chrome",
        "request": "attach",
        "name": "Attach to Chrome Vue",
        "port": 9222,
        "webRoot": "${workspaceRoot}/src",
        //"webRoot": "${workspaceFolder}/taierWebAdmin",
        "url": "http://localhost:9528/#/",
        "sourceMaps": true,
        "sourceMapPathOverrides": {
          "webpack:///src/*": "${webRoot}/*"
        }
      }
    ]
  }
```
### React 简单调试

```

{
    "version": "0.2.0",
    "configurations": [
    
    {
        "type": "chrome",
        "request": "launch",
        "name": "Launch Chrome React",
        "url": "http://localhost:3000",  // 改为目标 url
        "sourceMaps": true,
        "webRoot": "${workspaceFolder}",
        "skipFiles": [
            "node_modules/**"
        ],
        "sourceMapPathOverrides": {
            "webpack:///*": "${webRoot}/*"
        }
    }]
}
```

## Typescript 调试

TS的一半是需要编译到js然后执行，那么其实很不方便调试，可以使用ts-node来直接运行

```
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
    
        {
          "type": "node",
          "request": "launch",
          "name": "Launch Program",
          "runtimeArgs": [
            "-r",
            "C:/Users/简佳成/AppData/Roaming/npm/node_modules/ts-node/register"
          ],
          "args": [
            "${file}"
          ]
        }
      ]
}
```