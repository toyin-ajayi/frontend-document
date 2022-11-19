## 什么沙箱

沙箱(Sandbox)作为一种安全机制，用于提供一个独立的可控的执行环境供未经测试或不受信任的程序运行，并且程序运行不会影响污染外部程序的执行环境(如篡改/劫持window对象及其属性)，也不会影响外部程序的运行。

与此同时，沙箱和外部程序可以通过预期的方式进行通信。
更细化的功能就是:

- 拥有独立的全局作用域和全局对象(window)
- 沙箱提供启动、暂停、恢复和停机功能
- 多台沙箱支持并行运行
- 沙箱和主环境、沙箱和沙箱之间可实现安全通信


## with+eval/new Function + Proxy 实现沙箱

- [eval,Function,with详解](../../../前端基础/理解原生API/Eval-Function-with.md)
- [Proxy](../../../前端基础/理解原生API/Proxy.md)

### 究极简陋的沙箱

这个沙箱有一个明显的问题，若提供的ctx上下文对象中，没有找到某个变量时，代码仍会沿着作用域链一层层向上查找
```typescript
// 定义全局变量foo
var foo = "foo1";

// 执行上下文对象
const ctx = {
  func: variable => {
    console.log(variable);
  },
  foo: "f1"
};

// 非常简陋的沙箱
function veryPoorSandbox(code, ctx) {
  // 使用with，将eval函数执行时的执行上下文指定为ctx
  with (ctx) {
    // eval可以将字符串按js代码执行，如eval('1+2')
    eval(code);
  }
}

// 待执行程序
const code = `func(foo)`;

veryPoorSandbox(code, ctx); 
// 打印结果："f1"，不是最外层的全局变量"foo1"
```

### 勉强可以的沙箱

- 不用eval：性能不好，并且如果当前域里面没有,则会向上遍历.一直到最顶层的global scope 比如window
- 选择Function：性能比eval要好很多，但是只能访问全局作用域
- 配合with：在with的scope里面,所有的变量都会先从with定义的Obj上查找一遍.（但是又会有eval一样的一直往上找的问题
- 在配合proxy：将获取对象上的所有方式改写，先判断有没有，没有就不取
```tsx
function compileCode (src) {
  src = 'with (sandbox) {' + src + '}'
  const code = new Function('sandbox', src)
 
  return function (sandbox) {
    const sandboxProxy = new Proxy(sandbox, {has})
    return code(sandboxProxy)
  }
}
 
// 相当于检查 获取的变量是否在里面 like: 'in' 参考下面
function has (target, key) {
  return true
}
 
compileCode('log(name)')(console);
```

### 利用Proxy防止绑定解析逃逸

has拦截器，用于拦截with代码中任意变量的访问，也可以设置一个可正常在作用域链查找的绑定白名单，而白名单外的则必须以沙箱创建的作用域上定义维护。
```tsx
const whiteList = ['Math', 'Date', 'console']
const createContext = (ctx) => {
  return new Proxy(ctx, {
    has(target, key) {
      // 由于代理对象作为`with`的参数成为当前作用域对象，因此若返回false则会继续往父作用域查找解析绑定
      if (whiteList.includes(key)) {
        return target.hasOwnProperty(key)
      }

      // 返回true则不会往父作用域继续查找解析绑定，但实际上没有对应的绑定，则会返回undefined，而不是报错，因此需要手动抛出异常。
      if (!targe.hasOwnProperty(key)) {
        throw ReferenceError(`${key} is not defined`)
      }

      return true
    }
  })
}

with(createContext({ foo: 'foo' })) {
  console.log(foo)
  console.log(bar)
}
// 回显 foo
// 抛出 `Uncaught ReferenceError: bar is not defined` 
```

### 较为完整版的沙箱

```typescript
var foo = "foo1";

// 执行上下文对象
const ctx = {
  func: variable => {
    console.log(variable);
  }
};

// 构造一个 with 来包裹需要执行的代码，返回 with 代码块的一个函数实例
function withedYourCode(code) {
  code = "with(shadow) {" + code + "}";
  return new Function("shadow", code);
}

// 可访问全局作用域的白名单列表
const access_white_list = ["func"];

// 待执行程序
const code = `func(foo)`;

// 执行上下文对象的代理对象
const ctxProxy = new Proxy(ctx, {
  has: (target, prop) => {
    // has 可以拦截 with 代码块中任意属性的访问
    if (access_white_list.includes(prop)) {
      // 在可访问的白名单内，可继续向上查找
      return target.hasOwnProperty(prop);
    }
    if (!target.hasOwnProperty(prop)) {
      throw new Error(`Not found - ${prop}!`);
    }
    return true;
  }
});

// 没那么简陋的沙箱
function littlePoorSandbox(code, ctx) {
  // 将 this 指向手动构造的全局代理对象
  withedYourCode(code).call(ctx, ctx); 
}
littlePoorSandbox(code, ctxProxy);

// 执行func(foo)，报错： Uncaught Error: Not found - foo!
```

## 沙箱逃逸(Sandbox Escape)

虽然上面我们已经通过Proxy控制沙箱内部程序可访问的作用域链，但仍然有不少突破沙箱的漏洞。
- 通过原型链实现逃逸

```tsx
// 在沙箱内执行如下代码
({}).constructor.prototype.toString = () => {
  console.log('Escape!')
}

// 外部程序执行环境被污染了
console.log(({}).toString()) 
// 回显 Escape!
// 而期待回显是 [object Object]
```

## 实现一个基本安全的沙箱

```typescript
const toFunction = (script: string): Function => {
  try {
    return new Function('ctx', `with(ctx){${script}}`)
  } catch (e) {
    console.error(`${(e as Error).message} in script: ${script}`)
    return () => {}
  }
}

const toProxy = (ctx: object, whiteList: string[]) => {
  return new Proxy(ctx, {
    has(target, key) {
      // 由于代理对象作为`with`的参数成为当前作用域对象，因此若返回false则会继续往父作用域查找解析绑定
      if (whiteList.includes(key)) {
        return target.hasOwnProperty(key)
      }

      // 返回true则不会往父作用域继续查找解析绑定，但实际上没有对应的绑定，则会返回undefined，而不是报错，因此需要手动抛出异常。
      if (!targe.hasOwnProperty(key)) {
        throw ReferenceError(`${key} is not defined`)
      }

      return true
    },
    get(target, key, receiver) {
      if (key === Symbol.unscopables) {
        return undefined
      }

      return Reflect.get(target, key, receiver)
    }
  })
}

class Sandbox {
  private evalCache: Map<string, Function>
  private ctxCache: WeakMap<object, Proxy>

  constructor(private whiteList: string[] = ['Math', 'Date', 'console']) {
    this.evalCache = new Map<string, Function>()
    this.ctxCache = new WeakMap<object, Proxy>()
  }

  run(script: string, ctx: object) {
    if (!this.evalCache.has(script)) {
      this.evalCache.set(script, toFunction(script))
    }
    const fn = this.evalCache.get(script)

    if (!this.ctxCache.has(ctx)) {
      this.ctxCache.set(ctx, toProxy(ctx, this.whiteList))
    }
    const ctxProxy = this.ctxCache.get(ctx)

    return fn(ctx)
}
```

## 原生沙箱-iframe 

iframe拥有独立的browser context，不单单提供独立的JavaScript执行环境，甚至还拥有独立的HTML和CSS命名空间。
通过将iframe的src设置为about:blank即保证同源且不会发生资源加载，那么就可以通过iframe.contentWindow获取与主环境独立的window对象作为沙箱的全局对象，并通过with将全局对象转换为全局作用域。

而iframe的缺点：
- 若我们只需要一个独立的JavaScript执行环境，那么其它特性则不仅仅是累赘，还会带来不必要的性能开销。而且iframe会导致主视窗的onload事件延迟执行；
- 内部程序可以访问浏览器所有API，我们无法控制白名单。(这个可以通过Proxy处理)

## 使用原生沙箱+JS沙箱
> 用来通过上面沙箱环境的最顶层Window对象，做到完全隔离

1）设置 blacklist 黑名单，添加 document、XMLHttpRequest、fetch、WebSocket 来禁止开发者操作DOM和调接口
2）判断要访问的变量，是否在当前环境的 window 对象中，不在的直接报错，实现禁止通过三方库调接口

```typescript
// 沙箱全局代理对象类
class SandboxGlobalProxy {
  constructor(blacklist) {
    // 创建一个 iframe 标签，取出其中的原生浏览器全局对象作为沙箱的全局对象
    const iframe = document.createElement("iframe", { url: "about:blank" });
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    // 获取当前HTMLIFrameElement的Window对象
    const sandboxGlobal = iframe.contentWindow;

    return new Proxy(sandboxGlobal, {
      // has 可以拦截 with 代码块中任意属性的访问
      has: (target, prop) => {

        // 黑名单中的变量禁止访问
        if (blacklist.includes(prop)) {
          throw new Error(`Can't use: ${prop}!`);
        }
        // sandboxGlobal对象上不存在的属性，直接报错，实现禁用三方库调接口
        if (!target.hasOwnProperty(prop)) {
          throw new Error(`Not find: ${prop}!`);
        }

        // 返回true，获取当前提供上下文对象中的变量；如果返回false，会继续向上层作用域链中查找
        return true;
      }
    });
  }
}

// 使用with关键字，来改变作用域
function withedYourCode(code) {
  code = "with(sandbox) {" + code + "}";
  return new Function("sandbox", code);
}

// 将指定的上下文对象，添加到待执行代码作用域的顶部
function makeSandbox(code, ctx) {
  withedYourCode(code).call(ctx, ctx);
}

// 待执行的代码code，获取document对象
const code = `console.log(document)`;

// 设置黑名单
// 经过小伙伴的指导，新添加Image字段，禁止使用new Image来调接口
const blacklist = ['window', 'document', 'XMLHttpRequest', 'fetch', 'WebSocket', 'Image'];

// 将globalProxy对象，添加到新环境作用域链的顶部
const globalProxy = new SandboxGlobalProxy(blacklist);

makeSandbox(code, globalProxy);
```

## 参考

- https://juejin.cn/post/7088581480552595492
- https://juejin.cn/post/7157570429928865828#heading-7