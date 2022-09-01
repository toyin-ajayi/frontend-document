## esbuild

是一个「JavaScript」Bundler 打包和压缩工具，它可以将「JavaScript」和「TypeScript」代码打包分发在网页上运行。

目前「esbuild」支持的功能：

- 加载器
- 压缩
- 打包
- Tree shaking
- Source map 生成
- 将 JSX 和较新的 JS 语法移植到 ES6

## esbuild 速度更快

- 它是用「Go」语言编写的，该语言可以编译为本地代码。
- 解析，生成最终文件和生成 source maps 全部完全并行化。
- 无需昂贵的数据转换，只需很少的几步即可完成所有操作。
- 该库以提高编译速度为编写代码时的第一原则，并尽量避免不必要的内存分配。
- 现阶段的类似工具，底层的实现都是基于「JavaScript」，其受限于本身是一门解释型的语言，并不能充分利用 CPU。「Chrome V8」引擎虽然对「JavaScript」的运行做了优化，引进「JIT」的机制，但是部分代码实现机器码与「esbuild」全部实现机器码的形式，性能上的差距不可弥补。


## esbuild API 详解

「esbuild」总共提供了四个函数：transform、build、buildSync、Service

- transform：transform 可以用于转化 .js、.tsx、ts 等文件，然后输出为旧的语法的 .js 文件
- build 实现了 transform 的能力，即代码转化，并且它还会将转换后的代码压缩并生成 .js 文件到指定 output 目录
- buildSync： 相比较 build 而言，它是同步的构建方式，即如果使用 build 我们需要借助 async await 来实现同步调用，而使用 buildSync 可以直接实现同步调用。
- Service：为了解决调用上述 API 时都会创建一个子进行来完成的问题，如果存在多次调用 API 的情况出现，那么就会出现性能上的浪费，Service会创建一个长期的用于共享的子进程


## 实例

```js
mkdir esbuild-bundler; cd esbuild-bundler; npm init -y; npm i esbuild

|——— src
     |—— main.js  #项目入口文件
|——— index.js     #bundler实现核心文件

```

```js
// index.js
(async () => {
  const {
    startService,
    build,
  } = require("esbuild")
  const service = await startService()

  try {
    const res = await service.build({
      entryPoints: ["./src/main.js"],
      outfile: './dist/main.js',
      minify: true,
      bundle: true,
    })
  } finally {
    service.stop()
  }
})()

```




