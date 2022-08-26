## Provide / Inject

常用的父子组件通信方式都是父组件绑定要传递给子组件的数据，子组件通过props属性接收，一旦组件层级变多时，采用这种方式一级一级传递值非常麻烦，而且代码可读性不高，不便后期维护。

vue提供了provide和inject帮助我们解决多层次嵌套嵌套通信问题。在provide中指定要传递给子孙组件的数据，子孙组件通过inject注入祖父组件传递过来的数据。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>provide + inject</title>
  <script src="https://cdn.bootcss.com/vue/2.6.11/vue.min.js"></script>
</head>
<body>
  <div id="app"></div>
</body>
</html>

<script>
  Vue.component('A', {
    template: `
      <div>
        <B></B>
      </div>
    `,
    provide: {
      msg: '1234124'
    }
  })
  Vue.component('B', {
    template: `
      <div>
        <label>B:</label>
        <span>{{ this.msg }}</span>
        <C></C>
      </div>
    `,
    provide: {
      msg: '42341234',
      name: 'asdasda'
    },
    inject: ['msg'],
  })

  Vue.component('C', {
    template: `
      <div>
        <label>C:</label>
        <span>{{ this.xingming }}</span>
        <span>{{ this.msg }}</span>
      </div>
    `,
    inject: {
      xingming: {
        from: 'name',
        default: ''
      },
      msg: {
        from: 'msg',
        default: ''
      }
    },
    data() {
      return {
      }
    },
  })
  var app=new Vue({
    el: '#app',
    template: `
      <div>
        <A />
      </div>
    `
  });
</script>
```