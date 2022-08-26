## setup

使用组合式 API，我们首先需要一个可以实际使用它的地方。在 Vue 组件中，我们将此位置称为 setup。setup 组件选项在创建组件之前执行，一旦 props 被解析，并充当合成 API 的入口点。



我的理解setup函数的作用和React hooks，关注点分离，并集中处理不同的业务逻辑。

**如果setup直接返回了渲染函数，组件中定义的 template 将会失效。**


## ＜script setup＞


### 基本作用
在`<script setup>`中，我们不必声明export default和setup方法，这种写法会自动将所有顶级变量声明公开给模板（template）使用。

```js
<script>
import { ref, computed } from 'vue'
export default {
   setup () {
      const a = ref(3)
      const b = computed(() => a.value + 2)
      
      const changeA = () => { a.value = 4 }
      return { a, b, changeA } // have to return everything! 
   }
}
</script>
```


如果使用` <script setup>` 语法，我们可以用下面的代码来实现与上面的一样功能：

```js

<script setup>
import { ref, computed } from 'vue'
// all of these are automatically bound to the template
const a = ref(3)
const b = computed(() => a.value + 2)
      
const changeA = () => { a.value = 4 } 
</script>

```


### 访问 props, emit 事件 等
首先，你可能想知道如何执行标准的Vue操作，例如：

- 访问 props: defineProps – 顾名思义，它允许我们为组件定义 props
- 怎么发出自定义事件:defineEmits – 定义组件可以发出的事件
- 访问上下文对象:useContext – 可以访问组件的槽和属性

```js
<template>
 <button @click="$emit('change')"> Click Me </button>
</template>
<script setup>
  import { defineProps, defineEmit, useContext } from 'vue'

  const props = defineProps({
    foo: String,
  })
  const emit = defineEmit(['change', 'delete'])

  const { slots, attrs } = useContext()
  
</script>

```
### 创建异步 setup 方法


使用的是Fetch API，我们可以像这样使用await

```js
<script setup>   
   const post = await fetch(`/api/pics`).then((a) => a.json())
</script>

```


