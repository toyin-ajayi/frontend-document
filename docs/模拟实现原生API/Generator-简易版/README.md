


##  yield

yield 有位置记忆功能

由于函数只有一个出口（RETURN），所以用“函数的退出”是无法映射“函数包含一个多次生成值的过程”这样的概念的。如果要实现这一点，就必须让函数可以多次进入和退出。
这些作用有两个方面：
- 逻辑上：它产生一次函数的退出，并接受下一次 tor.next() 调用所需要的进入；
- 数据上：它在退出时传出指定的值（结果），并在进入时携带传入的数据（参数）。

## yield 挂起函数

yield运算必然不能使该函数退出（或者说必须不能让数据帧从栈上移除和销毁）。因为yield之后还有其他代码，而一旦数据帧销毁了，那么其他代码就无法执行了。所以，yield是为数不多的能“挂起”当前函数的运算。但这并不是yield主要的、标志性的行为。yield操作最大的特点是它在挂起当前函数时，还将函数所在栈上的执行现场移出了调用栈。

“执行现场”这个东西，事实上它包括三个层面的概念：
- 块级作用域以及其他的作用域本质上就是一帧数据，交由所谓“环境”来管理；
- 函数是通过 CALL/RETURN 来模拟上述“数据帧”在栈上的入栈与出栈过程，也称为调用栈；
- 执行现场是上述环境和调用栈的一个瞬时快照（包括栈上数据的状态和执行的“位置”）。

所有其他上下文都在执行栈上，而生成器的上下文（多数时间是）在栈的外面。

## yield 与上下文切换

tor 是 foo3() 生成器（内部的）迭代过程的一个句柄。从引擎内的实现过程来说，tor 其实包括状态（state）和执行上下文（context）两个信息，它是GeneratorFunction.prototype的一个实例。这个 tor 所代表的生成器在创建出来的时候将立即被挂起，因此状态值（state）初始化置为"启动时挂起（suspendedStart）"，而当在调用 tor.next() 因yield运算而导致的挂起称为"Yield 时挂起（suspendedYield）"。

另一个信息，即 context，就指向 tor 被创建时的上下文。上面已经说过了，所谓上下文一定指的是一个外部的、内部的或由全局 / 模块入口映射成的函数。接下来，当 tor.next() 执行时，tor 所包括的 context 信息被压到栈顶执行；当 tor.next() 退出时，这个 context 就被从栈上移除。这个过程与调用 eval() 是类似的，总是能保证指定栈是全局唯一活动的一个栈。
```

function* foo3() {
  yield 10;
}
let tor = foo3();
...
```

## 生成器这个挂起和调用栈移动的机制是协程吗

不过实现上，可以是。OS真实线程的切换成本高，在实现上用协程来做是可以的。但这与具体引擎的选择有关。另外按照ECMAScript的约定，这里自己实现一个上下文的管理器也是可以的，与线程什么的，并没有关系。

？ babel实现 generator的过程还想是用switch case 来实现切换和上下文管理的

## 简易实现

最主要的就是把yield编译成switch case，并且执行网上一个case 0，就把context报存的上下文中的next指向下一个yield进入的case条件，可是怎么知道下一个进入那个case呢？安装本来Generator函数的顺序从下往下切割yield就行了，用case 0 next2，case 2 next4进行连接，比如下面的代码：

```js
// https://juejin.im/post/5e3b9ae26fb9a07ca714a5cc#heading-18

// 生成器函数根据yield语句将代码分割为switch-case块，后续通过切换_context.prev和_context.next来分别执行各个case
function gen$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return 'result1';
  
        case 2:
          _context.next = 4;
          return 'result2';
  
        case 4:
          _context.next = 6;
          return 'result3';
  
        case 6:
        case "end":
          return _context.stop();
      }
    }
  }
  
  // 低配版context  
  var context = {
    next:0,
    prev: 0,
    done: false,
    stop: function stop () {
      this.done = true
    }
  }
  
  // 低配版invoke
  let gen = function() {
    return {
      next: function() {
        value = context.done ? undefined: gen$(context)
        done = context.done
        return {
          value,
          done
        }
      }
    }
  } 
  
  // 测试使用
  var g = gen() 
  g.next()  // {value: "result1", done: false}
  g.next()  // {value: "result2", done: false}
  g.next()  // {value: "result3", done: false}
  g.next()  // {value: undefined, done: true}
  
```

## 分析一下执行流程

我们定义的function*生成器函数被转化为以上代码
- 转化后的代码分为三大块：
  - gen$(_context)由yield分割生成器函数代码而来（也可以编译来
  - context对象用于储存函数执行上下文（主要是这次case执行后保存一个下次的
  - invoke()方法定义next()，用于执行gen$(_context)来跳到下一步
- 当我们调用g.next()，就相当于调用invoke()方法，执行gen$(_context)，进入switch语句，switch根据context的标识，执行对应的case块，return对应结果
- 当生成器函数运行到末尾（没有下一个yield或已经return），switch匹配不到对应代码块，就会return空值，这时g.next()返回{value: undefined, done: true}

从中我们可以看出，Generator实现的核心在于上下文的保存，函数并没有真的被挂起，每一次yield，其实都执行了一遍传入的生成器函数，只是在这个过程中间用了一个context对象储存上下文，使得每次执行生成器函数的时候，都可以从上一个执行结果开始执行，看起来就像函数被挂起了一样

## Babel如何编译Generator函数

```
function* foo() {
  yield 'result1'
  yield 'result2'
  yield 'result3'
}
  
const gen = foo()
console.log(gen.next().value)
console.log(gen.next().value)
console.log(gen.next().value)
```
编译结果：
```
var _marked =
/*#__PURE__*/
regeneratorRuntime.mark(foo);

function foo() {
  return regeneratorRuntime.wrap(function foo$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return 'result1';

        case 2:
          _context.next = 4;
          return 'result2';

        case 4:
          _context.next = 6;
          return 'result3';

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}

var gen = foo();
console.log(gen.next().value);
console.log(gen.next().value);
console.log(gen.next().value);
```

详细结果
```
(function() {
  var ContinueSentinel = {};

  var mark = function(genFun) {
    var generator = Object.create({
      next: function(arg) {
        return this._invoke("next", arg);
      }
    });
    genFun.prototype = generator;
    return genFun;
  };

  function wrap(innerFn, outerFn, self) {
    var generator = Object.create(outerFn.prototype);

    var context = {
      done: false,
      method: "next",
      next: 0,
      prev: 0,
      abrupt: function(type, arg) {
        var record = {};
        record.type = type;
        record.arg = arg;

        return this.complete(record);
      },
      complete: function(record, afterLoc) {
        if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        }

        return ContinueSentinel;
      },
      stop: function() {
        this.done = true;
        return this.rval;
      }
    };

    generator._invoke = makeInvokeMethod(innerFn, context);

    return generator;
  }

  function makeInvokeMethod(innerFn, context) {
    var state = "start";

    return function invoke(method, arg) {
      if (state === "completed") {
        return { value: undefined, done: true };
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        state = "executing";

        var record = {
          type: "normal",
          arg: innerFn.call(self, context)
        };

        if (record.type === "normal") {
          state = context.done ? "completed" : "yield";

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        }
      }
    };
  }

  window.regeneratorRuntime = {};

  regeneratorRuntime.wrap = wrap;
  regeneratorRuntime.mark = mark;
})();

var _marked = regeneratorRuntime.mark(helloWorldGenerator);

function helloWorldGenerator() {
  return regeneratorRuntime.wrap(
    function helloWorldGenerator$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            _context.next = 2;
            return "hello";

          case 2:
            _context.next = 4;
            return "world";

          case 4:
            return _context.abrupt("return", "ending");

          case 5:
          case "end":
            return _context.stop();
        }
      }
    },
    _marked,
    this
  );
}

var hw = helloWorldGenerator();

console.log(hw.next());
console.log(hw.next());
console.log(hw.next());
console.log(hw.next());

```



## 参考文章

- https://juejin.im/post/5e3b9ae26fb9a07ca714a5cc#heading-16
- https://juejin.im/post/5e534b7d6fb9a07cb83e20f2#heading-2
- https://www.zhihu.com/question/30820791
- https://segmentfault.com/a/1190000010641417
- https://juejin.im/post/5bd85cfbf265da0a9e535c10#heading-6