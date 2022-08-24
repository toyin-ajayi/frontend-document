### 先来看看 ECMAScript 标准规范对 this 的定义：

「The this keyword evaluates to the value of the ThisBinding of the current execution context.」
「this 这个关键字代表的值为当前执行上下文的 ThisBinding。」

### 然后再来看看 MDN 对 this 的定义：

「In most cases, the value of this is determined by how a function is called.」
「在大多数的情况下，this 其值取决于函数的调用方式。」

### 常规认识：

this 是指包含它的函数作为方法被调用时(最后)所属的对象。

### 通俗一点：

其实 this 就是一个指针，它指示的就是当前的一个执行环境，可以用来对当前执行环境进行一些操作。因为它指示的是执行环境，所以在定义这个变量时，其实是不知道它真正的值的，只有运行时才能确定他的值。同样一段代码，用不同的方式执行，他的 this 指向可能是不一样的
