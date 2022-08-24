> 网上看到一句话，匿名函数的执行是具有全局性的，那怎么具有的全局性呢？
this的指向在函数定义的时候是确定不了的，只有函数执行的时候才能确定this到底指向谁，实际上this的最终指向的是那个调用它的对象

## 案例1闭包-了解this指向最后一个调用者
这里的sayTwo相当于是一个闭包，内部的匿名函数的执行是this的函数调用模式，具体在案例2通过调用模式分析

```
   var name = 'window'
    var person = {
        name :'Alan',
        sayOne:function () {
                console.log(this.name)
        },
        sayTwo:function () {
            return function () {
                console.log(this.name)
            }
        }
    }
    person.sayOne()
    person.sayTwo()()
```

### 结果

第一个say打出来的是Alan，而第二个则是window

### 原因

1. 函数内部的this指向调用者
2. sayOne调用者是person对象，所以this指向person；
3. sayTwo的调用者虽然也是person对象，但是区别在于这次调用并没有打出this而是在全局返回了一个匿名函数
4. 而这个匿名函数不是作为某个对象的方法来调用执行，是在全局执行，最后的执行者就是window

## 案例2匿名函数-函数调用模式分析

```
    var name = 'window'
    var person = {
        name :'one',
        wrap: function(){
            (function (){
                console.log(this.name)// window
            })()
            function sum(){
                console.log(this.name)// window
            }
            sum()
        }
    }
    person.wrap()
```

wrap内部是一个自执行的匿名函数，this.name 打出来是 window那根据那句老话：this指向最后一个调用者；感觉无法分析，因为是自己执行自己。

### 用函数调用模式来分析

JS（ES5）里面有三种函数调用形式：
- func(p1, p2) 函数调用模式
- obj.child.method(p1, p2) 方法调用模式
- func.call(context, p1, p2) 上下文调用模式

可以看到不是通过对象来调用的方法，而是直接执行的，属于函数调用模式。

匿名函数自动执行属于函数调用模式，我们定义的非匿名函数sum虽然在对象里，但不是通过对象(obj.sum)直接调用而是在对象的函数里调用，所以sum也属于函数调用模式


### 调用模式的转化

其实我们常用调用模式如下：
*   func(p1, p2)
*   obj.child.method(p1, p2) 
其实两种都是语法糖，可以等价地变为 call 形式
*   func.call(undefined, p1, p2) 
*  obj.child.method.call(obj.child, p1, p2);


再加上浏览器里有一条规则：
如果你传的 context 就 null 或者 undefined，那么 window 对象就是默认的 context（严格模式下默认 context 是 undefined）

所以上面person.wrap()里匿名函数的this指向window

## 总结

之前看到的匿名函数的执行是具有全局性是有道理的，我感觉只要不是对象直接调用的函数，好像执行都具有全局性呃这样看来。
所以嵌套函数调用this很容易就指向了window,func.call(this)可以帮我修正。
还有些特殊情况需要从上层传入this，我们通过let that = this 然后在func.call(that)来绑定this



## 综合应用：函数节流案例分析

1.throttle函数的执行环境是在全局，内部this通常是指向window的，然后返回一个匿名函数。
2.返回的匿名函数绑定了事件，this指向监听的元素（document）
3.fn其实与上面返回匿名函数形成了闭包，且fn也其实是一个匿名函数，匿名函数的执行具有全局性，fn内部this应该指向window
4这里用apply修正this指向，使fn内部的this重新指向document

```
            function throttle(fn, delay) {
                console.log(this)//window
                // 记录上一次函数触发的时间
                var lastTime = 0;
                return function() {
                    // 记录当前函数触发的时间
                    var nowTime = Date.now();
                    if(nowTime - lastTime > delay) {
                     /*
                          fn();
                        console.log(this)//document
                    */
                        
                        fn.apply(this)// 修正this指向问题
                        console.log(this)//document
                        
                        // 同步时间
                        lastTime = nowTime;
                    }
                }
            }
            document.onscroll = throttle(function() {
                /*console.log(this)//window*/
                console.log(this)//document
                console.log('scroll事件被触发了' + Date.now())
            }, 1000)
```


## 参考JS高级编程的案例用call修改this指向

```
var name = "global";

var foo = {
    name: "foo",
    getName : function(){
        console.log(this.name);
    }
}

var bar = {
    name: "bar",
    getName : function(){
        return (function(){
            console.log(this.name);
        })();
    }
}

foo.getName(); //foo
foo.getName.call(bar); //bar
foo.getName.call(this); //global
foo.getName.call(window); //global

(function(){

    console.log(this.name)

}.bind(bar))(); //bar

(function(){

    console.log(this.name)

}.bind())(); //global
```



