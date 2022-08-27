## MessageChannel
>MDN:https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel

Channel Messaging API的MessageChannel 接口允许我们创建一个新的消息通道，并通过它的两个MessagePort 属性发送数据。

![图片加载失败](./img/MessageChannel.png)

```tsx
const ch = new MessageChannel()
const port1 = ch.port1
const port2 = ch.port2

port1.onmessage = function(d) {
    console.log(`port1接收的消息是：${d.data}`)
}

port2.onmessage = function(d) {
    console.log(`port2接收的消息是：${d.data}`)
}

// 发送消息
port1.portMessage('port1发送的消息')
port2.portMessage('port2发送的消息')
```