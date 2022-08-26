## Ref
接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象具有指向内部值的单个 property .value。 ref的值在data和reactive里会被自动解构

```js
const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1

const count = ref(1)
const obj = reactive({ count })

// ref 会被解构
console.log(obj.count === count.value) // true
```

Ref的作用：
- 解决基本类型的响应式
- 由于解构会消除reactive的响应式，所以结合toRefs来达到结构后保持响应式

## reactive

- https://www.vuemastery.com/courses/vue-3-reactivity/vue3-reactivity/

返回对象的响应式副本。响应式转换是“深层”的——它影响所有嵌套 property。在基于 ES2015 Proxy 的实现中，返回的 proxy 是不等于原始对象的。建议只使用响应式 proxy，避免依赖原始对象。


## toRefs

toRefs 用于将一个 reactive 对象转化为属性全部为 ref 对象的普通对象

```
const state = reactive({
  foo: 1,
  bar: 2
})

const stateAsRefs = toRefs(state)

// ref 和原始 property 已经“链接”起来了
state.foo++
console.log(stateAsRefs.foo.value) // 2

stateAsRefs.foo.value++
console.log(state.foo) // 3
```

当从组合式函数返回响应式对象时，toRefs 非常有用，这样消费组件就可以在不丢失响应性的情况下对返回的对象进行分解/扩散：
```
function useFeatureX() {
  const state = reactive({
    foo: 1,
    bar: 2
  })

  // 操作 state 的逻辑

  // 返回时转换为ref
  return toRefs(state)
}

export default {
  setup() {
    // 可以在不失去响应性的情况下解构
    const { foo, bar } = useFeatureX()

    return {
      foo,
      bar
    }
  }
}
```

### watchEffect

为了根据响应式状态自动应用和重新应用副作用，我们可以使用 watchEffect 方法。它立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数。

onInvalidate注册清除副作用的函数
```js
const stop = watchEffect(onInvalidate => {
  const token = performAsyncOperation(id.value)
  onInvalidate(() => {
    // id has changed or watcher is stopped.
    // invalidate previously pending async operation
    token.cancel()
  })
})
stop()
```