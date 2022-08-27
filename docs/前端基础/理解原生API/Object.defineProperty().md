## Object.defineProperty(obj, prop, descriptor)

- obj表示的是需要定义属性的那个对象
- 参数prop表示需要被定义或者修改的属性名
- 参数descriptor就是我们定义的那个属性prop的描述;



## descriptor有哪些配置项

### value

The value associated with the property (data descriptors only).

#### writable

当且仅当仅当该属性的writable为true时,该属性才能被赋值运算符改变;它的默认值为false.

#### enumerable 

这个特性决定了我们定义的属性是否是可枚举的类型,默认是false;只有我们把它设置为true的时候这个属性才可以使用for(prop in obj)和Object.keys()中枚举出来

#### configurable 

这个特性决定了对象的属性是否可以被删除,以及除writable特性外的其它特性是否可以被修改;并且writable特性值只可以是false

#### get 

一个给属性提供getter的方法,如果没有getter则为undefined;该方法返回值被用作属性值,默认为undefined.

#### set 

一个给属性提供setter的方法,如果没有setter则为undefined;该方法将接受唯一参数,并将该参数的新值分配给该属性,默认为undefined.


```tsx
Object.defineProperty(data, 'name', {
    value: 'dreamapple',
    writable: true,// 可更改
     enumerable: false // 可枚举 会不会在for in 中被遍历
});

console.log(data.name); // jjc
data.name = 'apple'; // 修改name属性
console.log(data.name); // apple

for(prop in data) {
    console.log(prop);// 不会出现name
}
```

### 使用get和set需要特别注意

get里面不能对本属性取值，set里面也不能对本属性赋值，不然就会造成循环爆栈

descriptor 中不能 同时设置访问器 (get 和 set) 和 wriable 或 value，否则会错

实例：监听设置生日修改年龄
```tsx
var data = {name:'jjc',age:0};

Object.defineProperty(data, 'birth', {
    enumerable: true,
    set: function (birth) {
        console.log("你要赋值给我,我的新值是",birth)
        let y = new Date().getFullYear()
        this.age =y-birth;
        
        console.log(this)
    },
    get:function(){
        let y = new Date().getFullYear()
        return y-this.age
    }

});

data.birth = 1999
console.log(data.age,data.birth)
```

## Object.defineProperty有缺点

拿数组没有办法