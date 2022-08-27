## 发布/订阅模式的前身-观察者模式

观察者模式定义了对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知，并自动更新。观察者模式属于行为型模式，行为型模式关注的是对象之间的通讯，观察者模式就是观察者和被观察者之间的通讯。

观察者模式有一个别名叫“发布-订阅模式”，或者说是“订阅-发布模式”，订阅者和订阅目标是联系在一起的，当订阅目标发生改变时，逐个通知订阅者。

## 什么是发布/订阅模式
其实24种基本的设计模式中并没有发布订阅模式，上面也说了，他只是观察者模式的一个别称。
但是经过时间的沉淀，似乎他已经强大了起来，已经独立于观察者模式，成为另外一种不同的设计模式。
在现在的发布订阅模式中，称为发布者的消息发送者不会将消息直接发送给订阅者，这意味着发布者和订阅者不知道彼此的存在。在发布者和订阅者之间存在第三个组件，称为消息代理或调度中心或中间件，它维持着发布者和订阅者之间的联系，过滤所有发布者传入的消息并相应地分发它们给订阅者。

## 两者区别

观察者模式与发布订阅模式都是定义了一个一对多的依赖关系，当有关状态发生变更时则执行相应的更新。

不同的是，在观察者模式中依赖于 Subject 对象的一系列 Observer 对象在被通知之后只能执行同一个特定的更新方法（没有中间通过类似key值的判断，直接触发订阅的方法），而在发布订阅模式中则可以基于不同的主题去执行不同的自定义事件（通过中间者管控）。相对而言，发布订阅模式比观察者模式要更加灵活多变。

![](/img/blog/发布订阅与观察者模式/1.png)


## 发布订阅模式的根本作用
- 广泛应用于异步编程中(替代了传递回调函数)
- 对象之间松散耦合的编写代码

## 基本案例介绍
背景:成都老妈兔头真香,买的人太多需要预定才能买到，所以顾客就等于了订阅者，订阅老妈兔头。
而老妈兔头有货了得通知顾客来买啊，不然没有钱赚，得通知所有的订阅者有货了来提兔头，这时老妈兔头这家店就是发布者。
```tsx
/*兔头店*/        
var shop={
    listenList:[],//缓存列表
    addlisten:function(fn){//增加订阅者
        this.listenList.push(fn);
    },
    trigger:function(){//发布消息
        for(var i=0,fn;fn=this.listenList[i++];){
            fn.apply(this,arguments);
        }
    }
}

/*小明订阅了商店*/
shop.addlisten(function(taste){
    console.log("通知小明，"+taste+"味道的好了");
});
/*小龙订阅了商店*/
shop.addlisten(function(taste){
    console.log("通知小龙，"+taste+"味道的好了");
});
/*小红订阅了商店*/
shop.addlisten(function(taste){
    console.log("通知小红，"+taste+"味道的好了");
});    

// 发布订阅
shop.trigger("中辣");


```

```tsx
//console
通知小明，中辣味道的好了
通知小龙，中辣味道的好了
通知小红，中辣味道的好了
```

## 案例升级
上面的案例存在问题，因为在触发的时候是将所以的订阅都触发了，并没有区分和判断，所以需要一个Key来区分订阅的类型，并且根据不同的情况触发。而且订阅是可以取消的。

升级思路：
- 创建一个对象(缓存列表)
- addlisten方法用来把订阅回调函数fn都加到缓存列表listenList中
- trigger方法取到arguments里第一个当做key，根据key值去执行对应缓存列表中的函数
- remove方法可以根据key值取消订阅
```tsx
/*兔头店*/        
var shop={
    listenList:{},//缓存对象
    addlisten:function(key,fn){

        // 没有没有key给个初值避免调用报错
        if (!this.listenList[key]) {
            this.listenList[key] = [];
        }
        // 增加订阅者,一个key就是一种订阅类型
        this.listenList[key].push(fn);
    },
    trigger:function(){
        const key = Array.from(arguments).shift()
        const fns = this.listenList[key]
        
        // 这里排除两种特殊情况，第一种为触发的一种从未订阅的类型，第二种订阅后取消了所有订阅的
        if(!fns || fns.length===0){
            return false;
        }

        // 发布消息，触发同类型的所有订阅，
        fns.forEach((fn)=>{
            fn.apply(this,arguments);
        })

/*         for(var i=0,fn;fn=fns[i++];){
            fn.apply(this,arguments);
        } */

    },

    remove:function(key,fn){
        var fns=this.listenList[key];//取出该类型的对应的消息集合
        if(!fns){//如果对应的key没有订阅直接返回
            return false;
        }
        if(!fn){//如果没有传入具体的回掉，则表示需要取消所有订阅
            fns && (fns.length=0);
        }else{
            for(var l=fns.length-1;l>=0;l--){//遍历回掉函数列表
                if(fn===fns[l]){ // 这里是传入地址的比较，所以不能直接用匿名函数了
                    fns.splice(l,1);//删除订阅者的回掉
                }
            }
        }
    }

}

function xiaoming(taste){
    console.log("通知小明，"+taste+"味道的好了");
}

function xiaolong(taste){
    console.log("通知小龙，"+taste+"味道的好了");
}

function xiaohong(taste){
    console.log("通知小红，"+taste+"味道的好了");
}

// 小明订阅了商店
shop.addlisten('中辣',xiaoming);

shop.addlisten('特辣',xiaoming);

// 小龙订阅了商店
shop.addlisten('微辣',xiaolong);

// 小红订阅了商店
shop.addlisten('中辣',xiaohong);

// 小红突然不想吃了
shop.remove("中辣",xiaohong);

// 中辣口味做好后，发布订阅
shop.trigger("中辣");

shop.trigger("微辣");

shop.trigger("特辣");

```

![](/img/blog/s4/1.png)

## 发布-订阅的顺序探讨
我们通常所看到的都是先订阅再发布，但是必须要遵守这种顺序吗？答案是不一定的。如果发布者先发布一条消息，但是此时还没有订阅者订阅此消息，我们可以不让此消息消失于宇宙之中。就如同QQ离线消息一样，离线的消息被保存在服务器中，接收人下次登录之后，才会收到此消息。同样的，我们可以建立一个存放离线事件的堆栈，当事件发布的时候，如果此时还没有订阅者订阅这个事件，我们暂时把发布事件的动作包裹在一个函数里，这些包装函数会被存入堆栈中，等到有对象来订阅事件的时候，我们将遍历堆栈并依次执行这些包装函数，即重发里面的事件，不过离线事件的生命周期只有一次，就像qq未读消息只会提示你一次一样。

## EventEmitter

发布-订阅的优势很明显，做到了时间上的解耦和对象之间的解耦，从架构上看，MVC，MVVM都少不了发布-订阅的参与。
同样的node中的EventEmitter也是发布订阅的

```tsx
class EventEmitter{
    constructor(){
        this._events  = this._events||new Map()
    }

    addEventListener(type,fn){
        if(this._events.has(type)){
            this._events.set(type,this._events.get(type).concat([fn]))
        }else{
            this._events.set(type,[fn])
        }
    }

    removeListen(type,fn){
        const events = this._events.get(type)
        const index = events.indexOf(fn)
        if(index!==-1){
            events.splice(index,1)
        }
    }

    emit(type,...arg){
        const events = this._events.get(type)
        if(events&&events.length>0){
            events.forEach((fn)=>{
                fn.apply(undefined,arg)
            })
        }

    }

    once(type,fn){
        let _this = this;
        function warp(...arg){
            fn.apply(undefined,arg)
            _this.removeListen(type,warp)
        }
        this.addEventListener(type,warp)
    }




}

const event = new EventEmitter()
event.addEventListener('click',function(x){
    console.log('click',x);
})
event.addEventListener('click',function(x){
    console.log('click2',x);
})
event.addEventListener('move',function(x){
    console.log('click2',x);
})
event.emit('click','123')
event.emit('move','1234')

function a(){
    console.log('a')
}
function b(){
    console.log('b')
}

event.addEventListener('do',a)
event.addEventListener('do',b)

event.emit('do')
event.removeListen('do',a)
event.emit('do')

console.log('___________________')
event.once('once',a)
event.once('once',a)
event.emit('once')
```
