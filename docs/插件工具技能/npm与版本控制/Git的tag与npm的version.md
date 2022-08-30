
## git 的 Tag 

### git打标签的作用

频繁 commit 的背后，带来的结果是一长串密密麻麻的提交记录。 一旦项目出现问题，需要检查某个节点的代码问题，就会有点头疼。 虽然有 commit message，但还是有存在查找困难和描述不清的问题。

Git 的打标签功能 git tag 来解决这个问题.Git tag 通常用于标记版本发布的某一个点。例如，当我们有大型项目要发布到正式环境，我们会给这个 commit 打上一个版本 tag，来标识它的版本信息。不在需要用 hash 字符串表示的版本号去查看更改。

### git 的 Tag 常见操作
tag 的常用命令，例如，添加、删除、共享标签、查看标签等。

```tsx
git tag <标签名> //添加 tag
git tag -a  <tag名> -m <注释文字> //添加 tag
git tag -d <标签名> //删除本地标签
git tag //查看标签列表
git push origin <标签名> //推送 tag 到远端
git push origin --tags //一次推送本地所有 tags
git tag :refs/tags/<tag 名字> //删除远端 tag
git show <tag标签名> //查看指定 tag
```

**注意标签需要额外推送，与分支的 push 无关**

---

## npm 的 tag

### npm tag的作用
**npm 的 tag 是给 version 一个语义化的值比如我发布一个 1.0 的版本，可以打一个 beta 的 tag 上去，别人安装就可以 npm install xx@beta 下载指定版本，不然数字很难记**

- X.Y.Z-Alpha: 内测版
- X.Y.Z-Beta: 公测版
- X.Y.Z-Stable: 稳定版

### 给 npm publish 带上标签
给 my-package 设置 tag，对应到版本 version。
要将标记添加到包的特定版本，请使用：

```tsx
npm dist-tag add <pkg>@<version> [<tag>]
```

默认情况下，npm publish 会使用标记标记您的包 latest。如果使用该--tag 标志，则可以指定要使用的另一个标记。例如，以下内容将使用 beta 标记发布您的包：

```tsx
npm publish --tag beta
```

### 打错标签的处理

如果你直接执行 npm publish，那么即使你的版本号是-beta.n，默认会打上 latest 的标签，别人 install 的时候也会下载到。这个时候需要我们只要改一下 tag：

```tsx
// 不小心发错了
latest: 1.0.1-beta.0
// 将1.0.1-beta.0设置为beta
npm dist-tag add my-package@1.0.1-beta.0 beta
npm dist-tag add my-package@1.0.0 latest

```

### 查看当前的 tag 和对应的 version

我们可以通过 `npm dist-tag ls [<pkg>] `来查看一个包的 tag，一般来说我们至少会有三种类型的标签

```tsx
latest：最后版本，npm install的就是这个
beta：测试版本，一般内测使用，需要指定版本号install，例如3.1.0-beta.0
next: 先行版本，npm install foo@next安装，例如3.0.2-alpha.0
```

通过这个命令，我们可以得到这样的结果：

```tsx
latest: 1.0.0
next: 1.0.0-alpha.0
```

如果我们需要发布一个测试版本，在发布的时候需要执行

```tsx
npm publish --tag beta
```


### 查看 my-package 发布过的所有版本号

```tsx
npm view my-package versions
[ '0.1.0',
  '1.0.0',
  '1.0.0-alpha.0',
  '1.0.0-alpha.1' ]
```



## npm Version 指令

### npm version

作为开发者，版本号肯定不陌生，发布到 npm 后，每一个版本号都对应了其资源文件，而且是不可修改的。npm 中的版本号类似于 git 中的 tag。version 和 tag 是相互独立的。

### npm version 使用

在 NodeJS 项目中，我们经常需要变更 package.json 中的版本信息。正常操作是，手动修改 package.json 文件的版本信息，然后再 commit。每次这样做，操作太繁琐。实际上，我们可以使用 `npm version <newversion> ` 命令

```tsx
npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]

major：主版本号

minor：次版本号

patch：补丁号

premajor：预备主版本

prepatch：预备次版本

prerelease：预发布版本
```

假设我们当前版本号为 "0.1.3"，当需要更改次版本号时，使用命令 npm version minor 进行变更。此时，该命令会进行两个操作：

- 更改 package.json 中 version，将版本信息有 "0.1.3"更改为 "0.2.0"
- 保存修改并生产一个新的 commit,会默认执行一次 git tag version

若需要指定 commit 的信息，可以使用 -m 命令。

```tsx
npm version patch -m "Upgrade to %s"  # %s 会自动替换成版本号
```

### 如何查询 npm version 命令的使用方法

```tsx
npm version ?
```

## 发布的操作

### 第一种手动

第一行 npm version patch 将在 package.json 中将补丁版本增加 1（x.x.1 到 x.x.2）。然后添加所有文件 - 包括 package.json，此时已修改。然后，通常的 git commit 和 git Push，最后 npm publish 来发布模块。

```tsx
npm version patch
git add *;
git commit -m "Commit message"
git push
git push origin --tags // git的tags需要额外重新推送
npm publish --tag beta // 发布到npm的时候带一个beta标志
```

### 第二种采用钩子

- 运行测试
- 将 package.json 更改为下一个次要版本
- 自动提交修改
- 推动您的更改
- 创建一个新的 git 标签发布和
- 发布您的 npm 包。

```tsx
  "scripts": {
    "eslint": "eslint index.js",
    "pretest": "npm install",
    "test": "npm run eslint",
    "preversion": "npm run test",
    "version": "",
    "postversion": "git Push && git Push --tags && npm publish"
  }
```

## version 和 tag 的区别

version 一旦发布，是不可变的；而 tag 更像一个渠道，只要用户选择了这个渠道，就可以一直更新这个渠道的最新版。

## 参考文章

- https://juejin.im/post/6844903870678695943
- https://www.jianshu.com/p/91902bae5572
- https://www.jianshu.com/p/9e64bdf1e8f9
