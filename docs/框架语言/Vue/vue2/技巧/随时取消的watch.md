## 随时监听，随时取消，了解一下$watch

```tsx
export default {
  data() {
    return {
      formData: {
        name: '',
        age: 0
      }
    }
  },
  created() {
    this.$_loadData()
  },
  methods: {
    // 模拟异步请求数据
    $_loadData() {
      setTimeout(() => {
        // 先赋值
        this.formData = {
          name: '子君',
          age: 18
        }
        // 等表单数据回填之后，监听数据是否发生变化
        const unwatch = this.$watch(
          'formData',
          () => {
            console.log('数据发生了变化')
          },
          {
            deep: true
          }
        )
        // 模拟数据发生了变化
        setTimeout(() => {
          this.formData.name = '张三'
        }, 1000)
      }, 1000)
    }
  }
}

```

执行 unwatch()即可取消