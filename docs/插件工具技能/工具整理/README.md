## 工具网站

- [TypeScript PlayGround](www.typescriptlang.org/play)
- [抽象语法树AST](https://astexplorer.net/)
- [codesandbox](https://codesandbox.io/)
- [JSON](https://www.json.cn/json/jsonzip.html)
- [babel 在线编译](https://babeljs.io/repl)
- [正则表达式可视化](jex.im/regulex)
- [正则在线测试](regex101.com/)
- [正则表达式库](https://any86.github.io/any-rule/)
- [caniuse](caniuse.com/)

## 文档框架
  - Dumi 组件文档
  - [docusaurus](https://www.docusaurus.cn/docs/) : react
  - VuePress : vue
  - gatsbyjs: 插件完善 够自由

## 文档网站

- 飞书
- notion
- 语雀

## pathToRegexp
>https://blog.csdn.net/qq_36407748/article/details/106527398

Path-to-RegExp模块,可以把你定义的路由字符串转为正则表达,可以用来本页面刷新时匹配菜单

```tsx
npm install path-to-regexp --save
import { pathToRegexp } from 'path-to-regexp';
const regexp = pathToRegexp(id,[], { end: false })
return regexp.test(pathname);
```
## postcss-px-to-viewport配置
> 移动端适配 可替代rem

postcss-px-to-viewport 对内联css样式，外联css样式，内嵌css样式有效，对js动态css无效。 所以要动态改变css展示效果的话，要使用静态的class定义变化样式，通过js改变dom元素的class实现样式变化。
```js
module.exports = {
  plugins: {
    'postcss-px-to-viewport-8-plugin': {
      unitToConvert: 'px', // 需要转换的单位，默认为"px"
      viewportWidth: 750, // 设计稿的视口宽度
      unitPrecision: 5, // 单位转换后保留的精度
      propList: ['*','!font-size'], // 能转化为vw的属性列表,!font-size表示font-size后面的单位不会被转换
      viewportUnit: 'vw', // 希望使用的视口单位
      fontViewportUnit: 'vw', // 字体使用的视口单位
      // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
      // 下面配置表示类名中含有'keep-px'都不会被转换
      selectorBlackList: ['keep-px'], 
      minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
      mediaQuery: false, // 媒体查询里的单位是否需要转换单位
      replace: true, //  是否直接更换属性值，而不添加备用属性
      exclude: [/node_modules/], // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
      include: [/src/], // 如果设置了include，那将只有匹配到的文件才会被转换
      landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
      landscapeUnit: 'vw', // 横屏时使用的单位
      landscapeWidth: 1338, // 横屏时使用的视口宽度
    },
  },
};

```

## 更多
- Tailwind CSS https://www.tailwindcss.cn/docs/installation
- normalize.css 摸评浏览器之间的样式差异，解决部分原有样式不合理的地方
- react-hot-loader 热跟新不会刷新整个页面，它只替换了修改的代码，做到了页面的局部刷新，可以实现保留react状态的动态热更新。但它需要依赖 webpack 的 HotModuleReplacement 热加载插件。
- [jsondiffpatch:比对js对象数组的差异，具备回溯能力](https://github.com/benjamine/jsondiffpatch)
