## node 环境

使用nvm来安装node，方便管理版本
```bash
// Mac
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```
把nvm命令添加到全局环境,把下面的语句添加到用户目录下的.bash_profile文件中，
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```
如果没有.bash_profile可以先用touch指令来创建
```tsx
touch ~/.bash_profile
open -e ~/.bash_profile // 用文本编辑程序打开文件
source ~/.bash_profile // 加载环境变量
```
mac下采用zsh代替bash，而zsh加载的是 ~/.zshrc文件，而 ‘.zshrc’ 文件中并没有定义任务环境变量。

在~/.zshrc文件最后，增加一行：

```tsx
source ~/.bash_profile // zsh加载bash的环境配置
```

.bashrc和.zshrc是干嘛的
```tsx
使用man bash命令查看到的bai联机帮助文du件zhi中的相关解释如下：
.bashrc - The individual per-interactive-shell startup file.
这个文件主要保存个人的一些个性dao化设置，如命令别名、路径等。下面是个例子：
# User specific aliases and functions
PATH="/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin"
LANG=zh_CN.GBK
export PATH LANG
alias rm='rm -i'
alias ls='/bin/ls -F --color=tty --show-control-chars'
例子中定义了路径，语言，命令别名（使用rm删除命令时总是加上-i参数需要用户确认，使用ls命令列出文件列表时加上颜色显示）。
```

## nvm的使用
```tsx
nvm ls-remote：列出所有可以安装的node版本号
nvm install v10.4.0：安装指定版本号的node
nvm use v10.3.0：切换node的版本，这个是全局的
nvm alias default <version>  如： nvm alias default v11.1.0 node永久切换版本
nvm current：当前node版本
nvm ls：列出所有已经安装的node版本
```
一般使用 nvm install stable来安装稳定版


## npm与yarn源的管理

### npm
npm直接使用nrm来管理源
```tsx
npm install -g nrm，全局安装nrm。
```

查看源：执行命令nrm ls查看可选的源
增加源：nrm add cnpm http://cnpm.byted.org/
切换源：nrm use cnpm

这时候再去使用npm install就行了

在选择“使用npm/使用yarn”安装依赖之前，要先观察目录中是否有yarn.lock或者package-lock.json文件。若有yarn.lock，则使用yarn安装依赖；若有package-lock.json，则使用npm。

### yarn

yarn也比较常用，能够更快，包管理给便捷。Yarn的速度快主要来自以下两个方面：
- 并行安装：无论 npm 还是 Yarn 在执行包的安装时，都会执行一系列任务。npm 是按照队列执行每个 package，也就是说必须要等到当前 package 安装完成之后，才能继续后面的安装。而 Yarn 是同步执行所有任务，提高了性能。
- 离线模式：如果之前已经安装过一个软件包，用Yarn再次安装时之间从缓存中获取，就不用像npm那样再从网络下载了。

yarn 默认会使用 “prefer-online” 的模式，也就是先尝试从远程仓库下载，如果连接失败则尝试从缓存读取。yarn 也提供了 --offline 参数，即通过 yarn add --offline 安装依赖。

Yarn 缓存了每个下载过的包，所以再次使用时无需重复下载。 同时利用并行下载以最大化资源利用率，因此安装速度更快。
```tsx
npm i yarn -g // 全局安装完也需要换下公司的源
yarn config get registry  // 查看yarn当前镜像源
yarn config set registry http://cnpm.byted.org/  // 设置yarn镜像源为淘宝的源
```

```tsx
npm                                     yarn

npm init                                yarn init              // 初始化
npm i | install                         yarn  (install)        // 安装依赖包
npm i x --S | --save                    yarn add  x            // 安装生产依赖并保存包名
npm i x --D | --save-dev                yarn add x -D          // 安装开发依赖并保存包名
                                        yarn add x@1.2.3 [--exact/-E] // 安装精确的版本
npm un | uninstall  x                   yarn remove            // 删除依赖包
npm i -g | npm -g i x                   yarn global add x      // 全局安装
npm un -g x                             yarn global remove x   // 全局下载
npm run dev                             yarn dev | run dev     // 运行命令
npm update <package>@version            yarn upgrade <package>@version // 更新开发依赖包
npm update -g <package>                 yarn global upgrade <package> //更新全局依赖包
npm cache clean                         yarn cache clean      // 清除缓存
```


npm ci # 将确切地安装package-lock.json中的内容
npm install --no-save  = yarn install --frozen-lockfile （将准确地安装yarn.lock中的内容。不更新锁定

npm install --no-package-lock (alias: --no-shrinkwrap): do not read the lockfile (package-lock.json or npm-shrinkwrap.json) for the intended package tree, and do not save the resulting package tree back to a lockfile.

### yarn 缓存

yarn 会将安装过的包缓存下来，这样再次安装相同包的时候，就不需要再去下载，而是直接从缓存文件中直接copy进来。

可以通过命令 yarn cache dir 查看yarn的全局缓存目录

```bash
yarn cache list    列出已缓存的每个包

yarn cache list --pattern <pattern>  列出匹配指定模式的已缓存的包
```

### yarn install 过程

首次执行 yarn install 安装，会按照 package.json 中的语义化版本，去向 registry 进行查询，并获取到符合版本规则的最新的依赖包进行下载，并构建构建依赖关系树。 比如在 package.json 中指定 vue 的版本为 ^2.0.0，就会获取符合 2.x.x的最高版本的包。然后自动生成 yarn.lock 文件，并生成缓存。
之后再执行 yarn install，会对比 package.json 中依赖版本范围和 yarn.lock 中版本号是否匹配。

- 版本号匹配，会根据 yarn.lock 中的 resolved 字段去查看缓存， 如果有缓存，直接copy，没有缓存则按照 resolved 字段的url去下载包。
- 版本号不匹配，根据 package.json 中的版本范围去 registry 查询，下载符合版本规则最新的包，并更新至 yarn.lock 中。



## 什么是Homebrew？
简单来说就是一个macOS（或Linux）的包管理器，可以用它来安装你需要的软件，方便卸载跟升级。

如何安装Homebrew？
我们一般用官网提供的统一安装方法，执行如下命令即可：

/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

## git配置

```tsx
brew install git
```

- 打开终端，输入如下指令：
git config --global user.name "邮箱前缀"
git config --global user.email "邮箱前缀@.com"
ssh-keygen -t rsa -C "邮箱前缀@.com" // 回车
cat ~/.ssh/id_rsa.pub  # 拷贝输出的公钥至 code 的设置
- 访问 https://code.gitlab.com/profile/keys，将上一步中拷贝的公钥配置到 SSH Keys 中。
- 访问 https://code.gitlab.com/profile/password/edit，设置密码。
