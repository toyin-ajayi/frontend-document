## glob

在计算机编程中 glob 模式表示带有通配符的路径名，例如在 bash 中查看文件列表
```bash
$ls src/*.js
src/a.js src/b.js
```

## 参考

- https://juejin.cn/post/6876363718578405384
- https://juejin.cn/post/6844904077801816077

## 引号问题

npm scripts中的命令里的glob模式并不会直接交给shell做glob展开，而是应该作为字符串传递给第三方库（下面为stylelint），交给第三方库做glob解析，因此需要用单引号包住，防止元字符问题，下面第一行是正确的，第二行是错误的

```bash
    "stylelint": "stylelint \"src/**/*.{css,scss}\"",
    "stylelint": "stylelint src/**/*.{css,scss}",
```

第二行是你的 shell 试图为你扩展你的 glob, shell就会对这些**的字符做特殊处理，而不是让它 stylelint 扩展它。

**所以如果要将通配符传入原始命令，防止被 Shell 转义，要是用双引号包裹 或者 是直接将星号先进行转义。**

```bash
  "test": "tap test/\*.js"
```

