## 什么是monorepo

monorepo 是指一种把多个项目的源代码放在同一个代码仓库里面管理的一种方法。与 monorepo 相对的是 multirepo，它的思想是按模块分成多个仓库。

### 使用场景

- 当存在一个含有多个package的monorepo
- 管理这些package的版本与发布时
- 管理package共用的代码规范等配置时
- 管理package共用的依赖时

### 优点：

代码复用更容易;
精简依赖管理，去除多个包的重复依赖；
方便大规模的重构，可以同时重构多个包然后统一发布，避免不同包管理的问题；
跨团队合作更容易，跨团队开发时只需提交代码即可合作，而不需要发布到包管理中心;
方便统一管理lint、test、build 和 release；
统一的地方处理 issue;
方便统一生成 ChangeLog。

### 缺点：

丢失版本信息，统一发布版本的 monorepo，会丢失各自项目的版本信息，尽管也可以单独发布版本；
缺乏针对包的权限控制(Git)，只要需要访问一个项目的，就必须要给开发者授权整个仓库，可能存在安全问题；
消耗更多硬件资源：当你只需要开发某个项目时，必须要把整个仓库代码全部下载，会占用更多的网络和本地存储空间。



## 实现monorepo

目前最常见的 monorepo 解决方案是 Lerna 和 yarn 的 workspaces 特性，基于lerna和yarn workspace的monorepo工作流。**用 yarn 处理依赖问题，lerna处理发布问题。ps:依赖的处理最好都有yarn的指令，比较全**

lerna和yarn workspace有一部分功能确实重复，毕竟先有lerna后有yarn workspace。

workspace的特点：在所有workspaces所匹配的项目路径下会执行统一的yarn命令，包含测试、安装依赖或执行脚本。
通过使用 workspace，yarn install 会自动的帮忙解决安装和 link 问题


### lerna的功能

lerna的主要功能可以分为：版本控制与发布，需要与npm(或yarn)和git一同使用。

### 根目录下的package.json

private是防止publish root文件夹，workspace是指定工作区,yarn workspaces 可以将多个包的 node_modules 整合成一个， 只需要执行 yarn install 就可将所有包的依赖安装。
```tsx
{
  ...
  "private": true,
  "workspaces": [
    "packages/*",
    "workspace-a", 
    "workspace-b"
  ],
  ...
}

```
yarn会把["workspace-a", "workspace-b"]中的dep依赖自动安装到root，并且和工程下的node_modules做映射，实现了一个syslink，其实也可以理解成link到了根目录，同时在根目录下的node_modules中也会出现两个包，workspace-a和workspace-b，因为link到了根，所以改变workspace-a中的文件，node_modules下的文件也会跟着变，试想，我某一个模块是放common ui组件的，剩下a b c d ...模块是业务模块，我只需要类似import ui from 'common-ui'，特别是ts的加持，不需要关心引用路径的，统一当项目下的node_modules模块即可。

### 模块
如果不用workspace，那得借助一大堆npm link，包多了就失去了可管理性。
```tsx
{
  "name": "workspace-a",
  "version": "1.0.0",

  "dependencies": {
    "cross-env": "5.0.5"
  }
}

```

```tsx
{
  "name": "workspace-b",
  "version": "1.0.0",

  "dependencies": {
    "cross-env": "5.0.5",
    "workspace-a": "1.0.0"
  }
}

```

workspace-b 依赖 workspace-a，将直接引用当前项目中内部的文件，而不是从 npm 去取。且不会有各自的 node_modules/，统一在根目录下的 node_modules。

## lerna.json

```tsx
{
  "version": "1.1.3",
  "npmClient": "yarn",
  "useWorkspaces": true,
  "command": {
    "publish": {
      "ignoreChanges": ["ignored-file", "*.md"],
      "message": "chore(release): publish",
      "registry": "https://npm.pkg.github.com"
    },
    "bootstrap": {
      "ignore": "component-*",
      "npmClientArgs": ["--no-package-lock"]
    }
  },
  "packages": ["packages/*"]
}
```

version: 当前仓库的版本。
npmClient: 使用的 npm 客户端，默认是 "npm",可选值还有 "yarn"。
useWorkspaces: lerna与yarn workspace有很好的相性，设置useWorkspaces等价于使用bootstrap命令的--use-workspaces选项,
command.publish.ignoreChanges: 是个数组，在这个数组里面的文件变动，不会触发版本更新。
command.publish.message: 自定义发布新版本时的 git commit 信息。
command.publish.registry: 设置私有仓库，默认是发布到 npmjs.org。
command.bootstrap.ignore: 设置在这里的目录将不会参与 lerna bootstrap。
command.bootstrap.npmClientArgs: 执行 lerna bootstrap 时会将此数组的所有值当作参数传给 npm install。
command.bootstrap.scope: 限制 lerna bootstrap 在哪些包起作用。
packages: 用以指明所有包的路径。

## lerna 和 yarn 常用等价命令

```tsx
lerna bootstrap	安装依赖
lerna clean	删除各个包下的node_modules
lerna init	创建新的lerna库
lerna list	显示package列表
lerna changed	显示自上次relase tag以来有修改的包，选项通 list
lerna diff	显示自上次relase tag以来有修改的包的差异，执行 git diff
lerna exec	在每个包目录下执行任意命令

lerna run	执行每个包package.json中的脚本命令
lerna add       添加一个包的版本为各个包的依赖
lerna import	引入package
lerna link	链接互相引用的库
lerna create	新建package
lerna publish	发布
lerna ls 列出所有公开的包（排除private=true的）
```



### 下载所有依赖

```tsx
yarn install
lerna bootstrap --npm-client yarn --use-workspaces  (lerna bootstrap --hoist已改为yarn workspaces?

lerna bootstrap的执行详情如下：
npm install 为所有的包安装依赖。
为互相依赖的包创建软链接。
在所有 bootstrap 包（不包括 command.bootstrap.ignore 中忽略的包）中执行 npm run prepublish（如果传了参数 --ignore-prepublish 将跳过此步骤）。
在所有 bootstrap 包（不包括 command.bootstrap.ignore 中忽略的包）中执行 npm run prepare。
```


### 安装指定依赖


```tsx
yarn workspace packageB add packageA // 给某个package安装依赖,将packageA作为packageB的依赖进行安装
yarn workspaces add lodash // 给所有的package安装依赖（这条指令貌似已经废除，可以用lerna add lodash代替 
yarn add -W -D typescript // 给root 安装依赖 -W 选项显式指明在 workspace 的根目录执行，避免在根目录误操作 yarn
```


```tsx
lerna add semver --scope cli-shared-utils // 为cli-shared-utils 增加 semver 模块 
lerna add chalk // 为所有 package 增加 chalk 模块 
lerna add wdm-lerna-demo-core --scope=wdm-lerna-demo-ui // 增加内部模块之间的依赖,执行完后 wdm-lerna-demo-ui 会增加新的 dependencies
// 这里是通过软链接到 wdm-lerna-demo-core/ 目录，并不是使用从 npm 下载的包。所以，在 core 中的修改可以实时地在 ui 中反映。
```


### 删除依赖


```tsx
yarn workspace packageB remove packageA
yarn workspaces remove lodash
yarn remove -W -D typescript
```

```tsx
lerna 没有直接的删除指令，不过可以如下操作
lerna exec -- yarn remove lodash
```


### 清理环境

```tsx
lerna clean # 清理所有的node_modules
yarn workspaces run clean # 执行所有package的clean操作

```

## lerna管理模式

lerna有两种管理模式，固定模式和独立模式
### 固定/锁定模式（默认）

命令：lerna init
固定模式通过lerna.json里的版本进行统一的版本管理。这种模式自动将所有packages包版本捆绑在一起，对任何其中一个或者多个packages进行重大改动都会导致所有packages的版本号进行升级。

### 独立模式

命令：lerna init --independent
独立模式，init的时候需要设置选项--independent。这种模式允许使用者对每个package单独改变版本号。每次执行lerna publish的时候，针对所有有更新的package，会逐个询问需要升级的版本号，基准版本为它自身的package.json里面的版本号。
这种情况下，lerna.json的版本号不会变化， 默认为independent。


## lerna 启动是的一些参数

### --include-dependents

无论--scope、-ignore或--single，在运行命令时包括所有可传递的依赖项。

### --include-dependencies
无论--scope、-ignore或--single，在运行命令时包括所有可传递的依赖项。
与接受--scope（bootstrap、clean、ls、run、exec）的任何命令结合使用。确保任何作用域包（通过--scope或--ignore）的所有依赖项（和dev依赖项）也被操作。
```tsx
$ lerna bootstrap --scope my-component --include-dependencies
# my-component及其所有依赖项将被引导 bootstrapped 

$ lerna bootstrap --scope "package-*" --ignore "package-util-*" --include-dependencies
#所有匹配“package util-*”的包都将被忽略，除非它们是
#依赖于名称与“package-*”匹配的包

```

