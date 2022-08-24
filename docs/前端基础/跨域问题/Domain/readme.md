在www.peterq.cn页面中嵌入iframe 引用//api.peterq.cn/cross,并代理xhr对象
在www.peterq.cn的页面中,所有的js代码之前添加如下js片段
```js
<script>
  document.write('<iframe src="//api.peterq.cn/cross" name="agent" style="display:none;"></iframe>')
  var _XMLHttpRequest = window.XMLHttpRequest
  window.XMLHttpRequest = function(){return agent.xhr()}
</script>
```
完成以上3步,就可以当作同域进行开发了，如果是已有项目，不需改动其他任何代码 :) 当然你得等到iframe,ready之后再实例化XMLHttpRequest,因为此时agent.xhr还是undefined



## 参考

- https://www.jianshu.com/p/4a3bc6d195b0?appinstall=0