## “scripts”属性中的脚本

npm 支持运行package.json里“scripts”属性中的脚本，包括：

* prepublish：在npm publish命令之前运行（也会在不带参数的npm install命令前运行，详情在下段描述）

* prepare: 在两种情况前运行，一是npm publish命令前，二是不带参数的npm install命令；它会在prepublish之后、prepublishOnly之前执行

* prepublishOnly: 在npm publish命令前执行

* publish,postpublish： 在npm publish命令后执行

* preinstall: 在npm install命令前执行

* install,postinstall： 在npm install命令后执行

* preuninstall，uninstall: 在npm uninstall命令前执行

* postuninstall ： 在npm uninstall命令后执行

* preversion：在改变包的version前执行

* version： 在改变包的version后，但提交之前执行

* postversion： 在提交version变更后执行

* pretest， test， posttest： 伴随npm test命令

* prestop， stop， poststop： 伴随npm stop命令

* restart, start, poststart: 伴随 npm start命令

* pre restart， restart， poststart： 伴随 npm restart命令。提示：假如scripts里没有写restart命令，npm默认会运行start、stop

* preshrinkwrap, shrinkwrap, postshrinkwrap: 伴随 npm shrinkwrap 命令（用于固定依赖包版本）

## prepublish 和 prepare
废弃告示：
从npm@1.1.71开始，npm CLI 会在npm publish和npm install之前执行prepubish脚本，因为这做法便于准备package环境（几种用法如本段下面描述）。但事实证明这让人非常困惑。所以在npm@4.0.0后，新增来一种事件prepare来替代上述功能。另外一种新事件prepublishOnly作为替代策略，让用户避免以往npm版本的混乱行为。prepublishOnly 只在npm publish前执行（例如，publish前最后执行一次测试，以确保无误）

重要提示：在npm5中， prepublish只在npm publish前执行，即取代prepublishOnly，所以npm6即以后的版本会放弃prepublishOnly。到时就忘了这些矬事吧。

## 执行顺序


### 并行

如果是并行执行（即同时的平行执行），可以使用&符号。
```tsx
npm run script1.js & npm run script2.js


"scripts": {
    ...,
    "lint:bx": "npm run lint:js & npm run lint:jsx & npm run lint:css & npm run lint:json & npm run lint:markdown"
}

```

并行命令，为了稳定复现一些错误，可在命令最后加上 & wait。另外，加上 & wait 的好处还有，如果我们在子命令启动长时间运行的进程，可用 ctrl + c 来结束进程。

### 串行

实现方式很简单，用 && 符号按顺序把命令串联起来。

```tsx
"scripts": {
    ...,
    "lint:cx": "npm run lint:js && npm run lint:jsx && npm run lint:css && npm run lint:json && npm run lint:markdown"
}

```

 串行命令执行过程中，如果前面的命令失败，后面命令会全部终止。所以前面的命令一般都是那种不可交换的，返回ture或者false的。示例很简单，自己试下就好。