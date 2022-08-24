## 看你做了挺多项目，有没有在架构层面上考虑过对项目的优化

虽然做了很多项目，但很多都是搭好的框架，所以这方面经验还比较少，但自己下来有考虑过一些优化方案，主要是基于webpack的，我来优化的话首先就是从打包开始优化，因为这个是项目的根据把

### 打包


- 把公共代码提取出来
- 压缩css和js
- 抽离css和js
- 包大小分析工具
- 按需加载 - babel-plugin-import
- 动态加载 - import() 可以结合路由来进行动态加载
- 配置删除生产环境的console.log
- 开启Tree shaking 当引入一个模块时，不引入所有的代码，只引入需要的代码
- 可以把一些一些第三方库React才分出来放到CDN,提升速度

### 环境支持

- 比如添加babel-polyfill来让ES6语法得到更多的环境支持
- plugin-proposal-decorators可以使用修饰器来connect
- less让css变得好写
- 比如现在有postcss的话就可以极大的提升适配性

### 提深打包效率

- alias可以加快webpack查找模块的速度。
- happypack并发打包
- 使用动态链接库文件DLL，不用每次都打包第三方库
- babel缓存 不重复编译


### 代码层面

- 添加首屏渲染时的loading，或者可以添加加载中的骨架
- 预加载 - preload 提前加载某些重要资源到时候直接就可以使用
- 预判加载 - prefetch 在浏览器空闲的时候预判下一个页面需要什么先做了
- 懒加载 - React.lazy包装一个组件 延迟加载不是立即需要的组件,Suspense的callback显示loading（或者使用社区提供的react-loadable）
- 使用不可变数据优化state 如immer immutable
- React.memo和pureComponent浅比较props和state
- 使用useMemo缓存大量的计算
- 优化高频事件：函数节流，函数防抖。
- 避免无用的多层嵌套
- 避免滥用context
- 长列表优化，添加虚拟滚动
- 避免 JavaScript 运行时间过长阻塞渲染，可以启用requestIdleCallback
- 费事的JS可以放到其他线程。在浏览器中启用并行线程可以使用 Web Worker 中

### 网络层面


- 小图标以base64打包嵌入页面减少请求数量
- 设置好一些常用资源的缓存时间来，尽量命中强缓存和协商缓存
- 可以采用CDN来减小资源的传播时延（主要受距离影响）
- 可以开启g-zip压缩减少包的大小
- http1.1的同一个域名并行TCP最多6个，如果存在大量资源可以考虑拆分域名
- 使用 Http2.0
- BFF 非常合适做的一件事就是后端服务的聚合。业务聚合，把要访问几个接口通过BFF变成请求一个接口

### HTML与浏览器层面

- 避免多次重绘和回流
- 合理使用 defer 和 async 来加载资源，避免阻塞DOM加载
- 对于动画效果的实现，避免使用 setTimeout 或 setInterval，请使用 requestAnimationFrame。
- 择适当的图像类型以及大小减少下载时间
  - 使用CSS3、SVG、IconFont代替图像
  - 使用字体图标 iconfont 代替图片图标
- CSS写在头部，JS写在尾部并异步
- 使用事件委托

### 避免代码问题

- async await 的不当使用导致并行请求被串行化了；
- 频繁地 JSON.parse 和 JSON.stringify 大对象；
- 正则表达式的灾难性回溯；
- 闭包导致的内存泄漏；
- CPU 密集型任务导致事件循环 delay 严重；
- 未捕获的异常导致进程频繁退出，守护进程（pm2/supervisor）又将进程重启，这种频繁的启停也会比较消耗资源；