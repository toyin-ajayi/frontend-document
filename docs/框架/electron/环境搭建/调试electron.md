## electron-debug

该插件支持一些类似的chrome快捷键，比如F12打开devtools。

## electron-devtools-installer

内部包含很多框架的devtools插件

```
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
    } = require("electron-devtools-installer");
    // 安装React开发者工具
    installExtension(REACT_DEVELOPER_TOOLS);
    installExtension(REDUX_DEVTOOLS);

    mainWindow.webContents.openDevTools();
```