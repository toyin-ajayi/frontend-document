## 自定义命令（bin）

用过 vue-cli，create-react-app等脚手架的朋友们，不知道你们有没有好奇过，为什么安装这些脚手架后，就可以使用类似 vue create/create-react-app之类的命令，其实这和 package.json 中的 bin 字段有关。
bin 字段用来指定各个内部命令对应的可执行文件的位置。当package.json 提供了 bin 字段后，即相当于做了一个命令名和本地文件名的映射。
当用户安装带有 bin 字段的包时，

如果是全局安装，npm 将会使用符号链接把这些文件链接到/usr/local/node_modules/.bin/；
如果是本地安装，会链接到./node_modules/.bin/。

### 全局安装

如果全局安装@vue/cli的话，@vue/cli源文件会被安装在全局源文件安装目录（/user/local/lib/node_modules）下，而npm会在全局可执行bin文件安装目录（/usr/local/bin）下创建一个指向/usr/local/lib/node_modules/@vue/cli/bin/vue.js文件的名为vue的软链接，这样就可以直接在终端输入vue来执行相关命令。

### 局部安装

如果局部安装@vue/cli的话，npm则会在本地项目./node_modules/.bin目录下创建一个指向./node_moudles/@vue/cli/bin/vue.js名为vue的软链接，这个时候需要在终端中输入./node_modules/.bin/vue来执行（**也可以使用npx vue命令来执行，npx 的作用就是为了方便调用项目内部安装的模块**）。


## package.json 中的 bin 字段

package.json中的字段 bin 表示的是一个可执行文件到指定文件源的映射。

```json
"bin": {
  "my-app-cli": "bin/my-app-cli.js"
}

```

上面代码指定，my-app-cli 命令对应的可执行文件为 bin 子目录下的 cli.js，因此在安装了 my-app-cli 包的项目中，就可以很方便地利用 npm执行脚本：

```js
"scripts": {
  start: 'node node_modules/.bin/my-app-cli start'
}
```

怎么看起来和 vue create/create-react-app之类的命令不太像？原因：

- 当需要 node 环境时就需要加上 node 前缀
- 如果加上 node 前缀，就需要指定 my-app-cli 的路径 -> node_modules/.bin，否则 node my-app-cli会去查找当前路径下的 my-app-cli.js，这样肯定是不对。


## bin/my-app-cli.js 写一个简单的脚本

#!/usr/bin/env NAME这个语法的意思是，让 Shell 查找$PATH环境变量里面第一个匹配的NAME。如果你不知道某个命令的具体路径，或者希望兼容其他用户的机器，这样的写法就很有用。

```js
#!/usr/bin/env node
console.log('hello world'); // bin/my-app-cli.js

```

#!/usr/bin/env node这里表示使用node作为脚本的解释程序，可以省略node ./hello,直接运行./hello, node的路径通过env来查找，可以避免node安装的路径不一样带来找不到的问题。

```js
"scripts": {
  start: 'my-app-cli start' // my-app-cli 为什么可以直接用与PATH 环境变量有关，下面介绍
}
```

## npm run 与 PATH 环境变量

在terminal中执行命令时，命令会在PATH环境变量里包含的路径中去寻找相同名字的可执行文件。局部安装的包只在./node_modules/.bin中注册了它们的可执行文件，不会被包含在PATH环境变量中，这个时候在terminal中输入命令将会报无法找到的错误。

那为什么通过npm run可以执行局部安装的命令行包呢？

是因为每当执行npm run时，会自动新建一个Shell，这个 Shell会将当前项目的node_modules/.bin的绝对路径加入到环境变量PATH中，执行结束后，再将环境变量PATH恢复原样。

所以，通过npm run可以在不添加路径前缀的情况下直接访问当前项目node_modules/.bin目录里面的可执行文件。

## 当你完成脚手架开发时，你想本地测试是否成功运作，会出现这种情况

```tsx
my-app-cli : 无法将“my-app-cli”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保路径正确，然后再试一次。
所在位置 行:1 字符: 1
+ my-app-cli
```

这是因为你本地找不到命令执行的路径，没有映射到bin中去，那么如何在本地测试刚开发玩的脚手架工具命令，那就是用npm link my-app-cli

## 测试包

npm link用来在本地项目和本地npm模块之间建立连接，可以在本地进行模块测试

具体用法：

1. 项目和模块在同一个目录下，可以使用相对路径

npm link ../module

2. 项目和模块不在同一个目录下

cd到模块目录，npm link，进行全局link

cd到项目目录，npm link 模块名(package.json中的name)

3. 解除link

解除项目和模块link，项目目录下，npm unlink 模块名

解除模块全局link，模块目录下，npm unlink （不需要加模块名）