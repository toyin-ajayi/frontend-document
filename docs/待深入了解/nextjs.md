## Pages

- 基于文件系统的路由

## 需要获取数据的静态生成 预渲染1



- 您的页面 内容 取决于外部数据：使用 getStaticProps。
- 你的页面 paths（路径） 取决于外部数据：使用 getStaticPaths （通常还要同时使用 getStaticProps）。

你一个React组件 通常是需要请求接口来获取数据的，Next约定在组件页面定义异步的getStaticProps会在静态生成时自动调用获取数据。




还有一种是具有 动态路由 的页面。例如，你可以创建一个名为 pages/posts/[id].js 的文件用以展示以 id 标识的单篇博客文章。当你访问 posts/1 路径时将展示 id: 1 的博客文章。 此时在组件页面在加一个getStaticPaths的异步钩子函数来取你想渲染的路径。我估计这个路径或影响getStaticProps中的params.id


```JS

function Post({ post }) {
  // Render post...
}

// 此函数在构建时被调用
export async function getStaticPaths() {
  // 调用外部 API 获取博文列表
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // 根据博文列表生成所有需要预渲染的路径
  const paths = posts.map((post) => `/posts/${post.id}`)

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

// 在构建时也会被调用
export async function getStaticProps({ params }) {
  // params 包含此片博文的 `id` 信息。
  // 如果路由是 /posts/1，那么 params.id 就是 1
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  // 通过 props 参数向页面传递博文的数据
  return { props: { post } }
}


export default Post

```
营销页面、博客文章、电商产品列表、帮助和文档，推荐使用静态生成 （带有或不带数据），因为你的所有 page（页面）都可以只构建一次并托管到 CDN 上，这比让服务器根据每个页面请求来渲染页面快得多


## 服务器端渲染SSR 预渲染2

如果 page（页面）使用的是 服务器端渲染，则会在 每次页面请求时 重新生成页面的 HTML

要对 page（页面）使用服务器端渲染，你需要 export 一个名为 getServerSideProps 的 async 函数。服务器将在每次页面请求时调用此函数。

```JS
function Page({ data }) {
  // Render data...
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

export default Page
```

**getServerSideProps 类似于 getStaticProps，但两者的区别在于 getServerSideProps 在每次页面请求时都会运行，而在构建时不运行。**


## Fast Refresh

有点像热跟新那种？

## 静态文件服务

Next.js 支持将静态文件（例如图片）存放到根目录下的 public 目录中，并对外提供访问。

## React SSR

### 通用代码

通用代码中不可在不判定执行环境的情况下引用 DOM、调用 window、document 这些浏览器特异和引用 global process 这些服务器端特异的操作，这往往是引起 Node.js 服务出问题的根本原因；

为了兼容两端，在选择库时，需要也同时需要支持两端，比如 axios，lodash 等；

### 差异代码
React 和 Vue 都有生命周期，需要区分哪些生命周期是在浏览器中运行，哪些会在服务器端运行，或者是同时运行，如使用 Redux 或者 Vuex 等库，最好在组件上引入 asyncData 钩子进行数据请求，同时供两端使用；

判定不同的执行环境可以通过注入 process.env.EXEC_ENV 来解决，形如：
```
if (process.env.EXEC_ENV === 'client') {
  window.addEventListener(...);
}

if (process.env.EXEC_ENV === 'server') {
}

```

### 状态处理

而在服务器端，页面一旦确定内容，就没有办法 Rerender 了，这就要求组件显示的时候，就要把 Store 的数据都准备好，所以服务器端异步数据结合 Redux 的使用方式，流程是下面的样子

- 创建 Store
- 根据路由分析 Store 中需要的数据
- 派发 Action 获取数据
- 更新Store 中的数据
- 结合数据和组件生成 HTML，一次性返回

客户端：
beforeMount -> render -> mounted
服务端：
preFetch -> beforeMount -> render // 服务端进行了数据的预先加载


### 路由同构

- 客户端：在App.jsx中使用BrowserRouter组件包裹根节点，用NavLink组件包裹li标签中的文本
- 服务端路由不同于客户端，它是无状态的。React提供了一个无状态的组件StaticRouter，向StaticRouter传递url，调用ReactDOMServer.renderToString()就能匹配到路由视图


### 事件同构处理
>所谓同构，就是指前后端共用一套代码或逻辑，而在这套代码或逻辑中，理想的状况是在浏览器端进一步渲染的过程中，判断已有的DOM结构和即将渲染出的结构是否相同，若相同，则不重新渲染DOM结构，只需要进行事件绑定即可。React提供了只绑定事件的API：https://zh-hans.reactjs.org/docs/react-dom.html#hydrate


renderToString 并没有做事件相关的处理，因此返回给浏览器的内容不会有事件绑定。

那怎么解决这个问题呢？

这就需要进行同构了。所谓同构，通俗的讲，就是一套 React 代码在服务器上运行一遍，到达浏览器又运行一遍。服务端渲染完成页面结构，浏览器端渲染完成事件绑定。

那如何进行浏览器端的事件绑定呢？

让浏览器去拉取 JS 文件执行，让 JS 代码来控制。

修改 server/index.js, 添加 `<script src="/index.js"></script>`

```
<body>
  <div id="root">${content}</div>
  <script src="/index.js"></script>
</body>
```
index.js加载后进行客户端渲染,indexjs里是browser的react渲染逻辑，而这里使用ReactDOM.hydrate, 官方解释是该api和我们平时使用是ReactDOM.render是一样一样的, 但是当container的HTML内容是由ReactDOMServer渲染, 那么我们需要调用hydrate, 与 render() 相同，但它用于在 ReactDOMServer 渲染的容器中对 HTML 的内容进行 hydrate 操作。React 会尝试在已有标记上绑定事件监听器。它会尝试将事件绑定在已渲染的dom上.

### 构建与运行

在使用 webpack 进行构建时，需要将公共 App 部分打包出来，形成公共代码，由服务器端引入执行，而客户端可以引用打包好的公共代码，再用 webpack 引入之后进行特异处理即可；
需要引入 Node.js 中间层，负责请求数据，提供渲染能力，提供 HTTP 服务，由于 HTML 模板需要在服务端引入，CDN 文件需要自行处理；
至于 babel 的使用，可以在浏览器中通用处理，服务端只解决特殊语法，如 jsx，vue template；


由于要从一份源码构建出2份不同的代码，需要有2份 Webpack 配置文件分别与之对应。 构建用于浏览器环境的配置和前面讲的没有差别，本节侧重于讲如何构建用于服务端渲染的代码。
```JS
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  // JS 执行入口文件
  entry: './main_server.js',
  // 为了不把 Node.js 内置的模块打包进输出文件中，例如 fs net 模块等
  target: 'node',
  // 为了不把 node_modules 目录下的第三方模块打包进输出文件中 因为 Node.js 默认会去 node_modules 目录下寻找和使用第三方模块；
  externals: [nodeExternals()],
  output: {
    // 为了以 CommonJS2 规范导出渲染函数，以给采用 Node.js 编写的 HTTP 服务调用
    libraryTarget: 'commonjs2',
    // 把最终可在 Node.js 中运行的代码输出到一个 bundle_server.js 文件
    filename: 'bundle_server.js',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: path.resolve(__dirname, 'node_modules'),
      },
      {
        // CSS 代码不能被打包进用于服务端的代码中去，忽略掉 CSS 文件
        test: /\.css/,
        use: ['ignore-loader'],
      },
    ]
  },
  devtool: 'source-map' // 输出 source-map 方便直接调试 ES6 源码
};

```

以上代码有几个关键的地方，分别是：

- target: 'node' 由于输出代码的运行环境是 Node.js，源码中依赖的 Node.js 原生模块没必要打包进去；
- externals: [nodeExternals()] webpack-node-externals 的目的是为了防止 node_modules 目录下的第三方模块被打包进去，因为 Node.js 默认会去 node_modules 目录下寻找和使用第三方模块；
- {test: /\.css/, use: ['ignore-loader']} 忽略掉依赖的 CSS 文件，CSS 会影响服务端渲染性能，又是做服务端渲不重要的部分；
- libraryTarget: 'commonjs2' 以 CommonJS2 规范导出渲染函数，以供给采用 Node.js 编写的 HTTP 服务器代码调用。



在构建客户端代码时，使用的是客户端的执行入口文件，构建结束后，将构建结果在浏览器运行即可，但是在服务端渲染中，HTML是由服务端渲染的，也就是说，我们要加载那些JavaScript脚本，是服务端决定的，因为HTML中的script标签是由服务端拼接的，所以在客户端代码构建的时候，我们需要使用插件，生成一个构建结果清单，这个清单是用来告诉服务端，当前页面需要加载哪些JS脚本和CSS样式表。



### 缓存控制

一般的业务场景下，我们需要在 Node.js 中通过内网将数据获取到，然后通过 render 函数渲染出 HTML（一般需要将数据附带给 HTML 输出以便重复利用），这个时候我们可以通过页面访问地址和生成的 HTML 字符串做缓存策略，在缓存（一般选择 redis 等方案）之后，下次直接将同样的页面直接输出到前端，可大幅提高渲染性能。


## 参考

- https://juejin.cn/post/6844903792836608008
- https://juejin.cn/post/6844903537030201351
- https://juejin.cn/post/6844903616705232909#heading-13