>网上看到一句话，匿名函数的执行是具有全局性的，那怎么具有的全局性呢？闭包内部this的指向是window，为什么指向了window呢？下面通过js函数调用模式和部分案例分析了为什么确实如此


## 方法调用模式和函数调用模式

>其实这两种调用本质上可以理解为上下文调用（call，apply）的语法糖，下面讲上下文调用时分析如何等价

### 方法调用模式

如果一个函数被设置为一个对象的属性，则称它为一个方法。
当通过对象对其进行调用时，即this的方法调用模式。
在方法调用模式下，函数中的this指向该函数所属的对象。

### 函数调用模式

当一个函数并非对象的属性，而是直接作为函数进行调用时，为函数调用模式。
此模式来调用函数的时候，this绑定的是全局对象。这是语言设计的一个错误。
倘若语言设计正确，那么当内部函数被调用时，this应该仍然绑定到外部函数的this变量。
这个设计错误的后果就是方法不能利用内部函数来帮助它工作，因为内部函数的this被绑定了错误的值，所以不能共享该方法对对象的访问权

```tsx
var obj = {
    val : 1,
    show : function(){alert(this.val);},//方法调用模式
    outFunc : function(){
        function innerFunc(){
            console.log(this);
        }
        innerFunc(); //函数调用模式
    }
};
obj.show();// 方法调用模式 this指向obj 弹出1
//在严格模式下，console.log(this)中的this为undefined，
//否则，console.log(this)中的this为全局对象(浏览器中为window)
//下文讲解为什么

```

## 构造器调用模式

当以new来调用一个函数时，即构造器模式。
当使用new调用时，发生这些事情：
创建一个连接到该函数prototype的新对象
将this绑定到创建的新对象上
函数结束时，如果没有返回其它对象，就返回this，即新创建的对象。

```tsx
 var quo=function(string){
            this.status=string;
        }
    quo.prototype.get_status=function(){
            return this.status;
        }
    var qq=new quo("aaa");
    alert(qq.get_status());

```


## 上下文调用模式（call,apply）


```tsx
var myobject={};
var sum = function(a,b){
　　return a+b;
};
var sum2 = sum.call(myobject,10,30); //var sum2 = sum.apply(myobject,[10,30]); 
alert(sum2);
```

其实我们常用调用模式如下：
*   func(p1, p2)
*   obj.child.method(p1, p2) 
其实两种都是语法糖，可以等价地变为 call 形式
*   func.call(undefined, p1, p2) 
*  obj.child.method.call(obj.child, p1, p2);


浏览器里有一条规则：
如果你传的 context 就 null 或者 undefined，那么 window 对象就是默认的 context（严格模式下默认 context 是 undefined）





## 事件监听内部调用方法案例分析

```tsx
    var div=document.getElementById("one");
    function f2(){
    console.log(this)
    }
    div.onclick =function () {
        console.log(this)//one那个节点
        f2()//window(函数调用模式)
    }
```



