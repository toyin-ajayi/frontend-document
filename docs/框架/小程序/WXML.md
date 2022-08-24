

## WXML 和 自建组件体系

这里我们知道了WXML模版语法经过转换之后，会已自定义元素的形式来渲染。这里会有个疑问🤔️，为什么不用HTML语法和WebComponents来实现渲染，而是选择自定义？  

- 管控与安全：web技术可以通过脚本获取修改页面敏感内容或者随意跳转其它页面
- 能力有限：会限制小程序的表现形式
- 标签众多：增加理解成本


Exparser是微信小程序的组件组织框架，内置在小程序基础库中，为小程序提供各种各样的组件支撑。内置组件和自定义组件都有Exparser组织管理。与WebComponents类似。Exparser的主要特点包括以下几点：

- 基于Shadow DOM模型：模型上与WebComponents的Shadow DOM高度相似，但不依赖浏览器的原生支持，也没有其他依赖库；实现时，还针对性地增加了其他API以支持小程序组件编程。
- 可在纯JS环境中运行：这意味着逻辑层也具有一定的组件树组织能力。
- 高效轻量：性能表现好，在组件实例极多的环境下表现尤其优异，同时代码尺寸也较小。

## WXSS 编译
> WXSS并不可以直接执行在webview层进行渲染，而是通过了一层编译

```js
// BASE_DEVICE_WIDTH 基础设备物理像素宽度750rpx
number = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
number = Math.floor(number + eps);
```

