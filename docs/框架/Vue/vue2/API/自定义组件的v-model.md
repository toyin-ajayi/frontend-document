## v-model 其实是一个语法糖，这背后其实做了两个操作

- v-bind 绑定一个 value 属性
- v-on 指令给当前元素绑定 input 事件

## 在原生表单元素中

```
<input v-model='something'>
```
就相当于
```

<input v-bind:value="something" v-on:input="something = $event.target.value">

```
当input接收到新的输入，就会触发input事件，将事件目标的value 值赋给绑定的元素


## 在自定义组件中

```
<my-component v-model='something'></my-componment>

```
相当于

```
<my-component v-bind:value='something' v-on:input='something = arguments[0]'></my-component>

```
这时候，something接受的值就是input是事件的回掉函数的第一个参数
所以在自定义的组件当中，要实现数据绑定，还需要使用[$emit]去触发input的事件。
```

//my-component
this.$emit('input', value)
```

## 定制

默认情况下，一个组件上的 v-model 会把 value 用作 prop 且把 input 用作 event，但是一些输入类型比如单选框和复选框按钮可能想使用 value prop 来达到不同的目的。使用 model 选项可以回避这些情况产生的冲突。

```
<!-- parent -->
<template>
<div class="parent">
  <p>我是父亲, 对儿子说： {{sthGiveChild}}</p>
  <Child v-model="sthGiveChild"></Child>
</div>
</template>
<script>
import Child from './Child.vue';
export default {
  data() {
    return {
      sthGiveChild: '给你100块'
    };
  },
  components: {
    Child
  }
}
</script>
```
v-model的sthGiveChild 绑定到give属性，也就是孩子组件的props上的give是等于sthGiveChild的。

然后自定义一个绑定的事件为returnBack（默认是input，本来是自动监听input来改变绑定的属性），现在我们需要主动触发returnBack这个事件来更新`v-on:returnBack='sthGiveChild = arguments[0]'`
```
<!-- child -->
<template>
<div class="child">
  <p>我是儿子，父亲对我说： {{give}}</p>
  <a href="javascript:;"rel="external nofollow" @click="returnBackFn">回应</a>
</div>
</template>
<script>
export default {
  props: {
    give: String
  },
  model: {
    prop: 'give',
    event: 'returnBack'
  },
  methods: {
    returnBackFn() {
      this.$emit('returnBack', '还你200块');
    }
  }
}
</script>
```