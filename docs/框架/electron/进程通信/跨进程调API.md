## remote

在渲染进程里是不能调用BrowserWindow这个API的，但是可以通过remote来跨进程调用
```js
// renderer.js
const { BrowserWindow } = require('electron').remote

let win = new BrowserWindow({ width: 800, height: 600 })
    win.loadURL('https://baidu.com')
```

**注意，渲染进程使用remote需要开启配置项**

```
    mainWindow = new BrowserWindow({
      width: 1024,
      height: 680,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true // 必须要这项
      },
    });
```
