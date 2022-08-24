## sourceMap

sourceMap就是一个信息文件，里面储存着打包前的位置信息。也就是说，转换后的代码的每一个位置，所对应的转换前的位置。一般来说 source map 的应用都是在监控系统中，开发者构建完应用后，通过插件将源代码及 source map 上传至平台中。一旦客户端上报错误后，我们就可以通过该库来还原源代码的报错位置（具体 API 看文档即可），方便开发者快速定位线上问题。

## 浏览器怎么知道源文件和 source map 的关系

查看 bundle.js 文件以后我们会发现代码中存在这一一段注释：
```js
console.log(1);
//# sourceMappingURL=bundle.js.map
```
sourceMappingURL 就是标记了该文件的 source map 地址。

## source map 文件是否影响网页性能

source map 只有在打开 dev tools 的情况下才会开始下载，不会影响性能。在

## source map 标准

source map 是存在一个标准的，为 Google 及 Mozilla 的工程师制定，文档地址。正是因为存在这份标准，各个打包器及浏览器才能生成及使用 source map，否则就乱套了。
各个打包器基本都基于该库来生成 source map，当然也存在一些魔改的方案，但是标准都是统一的。

```js
{
  version: 3,
  file: "min.js",
  names: ["bar", "baz", "n"],
  sources: ["one.js", "two.js"],
  sourceRoot: "http://example.com/www/js/",
  mappings: "CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA"
}

```

- version：顾名思义，指代了版本号，目前 source map 标准的版本为 3，也就是说这份 source map 使用的是第三版标准产出的
- file：编译后的文件名
- names：一个优化用的字段，后续会在 mappings 中用到
- sources：多个源文件名
- mappings：这是最重要的内容，表示了源代码及编译后代码的关系

## mappings

mappings 的内容其实是 Base64 VLQ 的编码表示.

其实这每串英文中的字母都代表了一个位置：

- 压缩代码的第几列
- 哪个源代码文件，毕竟可以多个文件打包成一个，对应 sources 字段
- 源代码第几行
- 源代码第几列
- names 字段里的索引

## sourceMap的反编译

如果无特殊需求，生产环境是需要关闭这个选项的，vue-cli3直接配置productionSourceMap: false即可。不然可能导致反编译后它人获取源码,可以通过下载sourceMap通过reverse-sourcemap插件反编译得到你的源代码。
