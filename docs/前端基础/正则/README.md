## exec()和match()区别
- ### 当采用非全局匹配的时候，两个方法的返回值完全一样。
- ### match和exec都只匹配一次，且都会把分组抽出来放到数组后面
```
    (function(){
        
        let str="antzoane";
        let reg=/(a)(n)/;
        console.log(str.match(reg));
        console.log(reg.exec(str));
    })();
    
```
![](/img/blog/20/1.png)
- #### 当为全局匹配的时候，match方法返回一个存放所有匹配内容的数组（无视子表达式的匹配）。
- #### exex方法返回数组不会存储所有的匹配，仅存储第一个匹配到的内容（存储在数字第一个元素），第二个元素存储第一个子表达式匹配到的内容，第三个元素存储第二个子表达式匹配到的内容，以此类推
```
    (function(){
       
        let str="antzoane";
        let reg=/a(n)/g;
        console.log(str.match(reg));
        console.log(reg.exec(str));
        //再次调用从上次的lastindex开始匹配；
        console.log(reg.exec(str));
    })();
```
![](/img/blog/20/2.png)

## match()和分组匹配

```
    var reg = /(\d{4})-(\d{2})-(\d{2})/;
    var dateStr = '2018-04-18';
    var s=dateStr.match(reg);
    console.log(s)//arr[0]是匹配的结果，arr[1]是第一个（）里的匹配内容，全局匹配不会返回（）里的内容

    var str="hello my name is ben &nbsp;&nbsp;,this is &nbsp;";
    var reg2=/&nbsp;{1,}/g;
    var reg22=/(&nbsp;){1,}/g//（）内看成一个整体去匹配
    console.log(str.match(reg2));
    console.log(str.match(reg22));
```

![](/img/blog/20/3.png)

## replace()和分组捕获
### 全部匹配添加修饰

```
    var str="0816-2323263";
    var reg=/(\d+)(-)(\d+)/g;
    var str2=str.replace(reg,"($1)-$3");//全部匹配添加修饰
    console.log(str2);//(0816)-2323263
```
### (?`<name>`)与(?:exp)

```
var str1="123478basd-12aaaaa";
    var reg1=/(\d+)([a-z]+)(\d+)(?<rename>[a-z]+)/g;
    var str21=str1.replace(reg1,"$1hhhhh$<rename>");//(?<name>)捕获文本到名称为name的组里  (?:exp)匹配exp,不捕获匹配的文本，也不给此分组分配组号
    console.log(str21);//123478basd-12aaaaa
```
### 匹配需要删除的部分然后置空

```
 var str23="123478basd12asdsa";
    var reg2=/[a-z]+/g;
    var str22=str23.replace(reg2,"");//匹配需要删除的部分然后置空
    console.log(str22);//12347812
```
## 贪婪与懒惰

- ###  在量词后面加个问号表示懒惰，尽可能少的匹配
```
   
    var str="abc8defghij7klngon8qrstwxy7";
    var reg1=/8[a-zA-Z0-9]*7/;
    var reg2=/8[a-zA-Z0-9]*?7/;
    var reg3=/8[a-zA-Z0-9]+?/;
    var res1=str.match(reg1);
    var res2=str.match(reg2);
    var res3=str.match(reg3);
    console.log(res1);
    console.log(res2);
    console.log(res3);
```
![](/img/blog/20/4.png)
## 零宽断言
   - (?=exp)向前查找
   - (?<=exp)向后查找
   - (?!exp)匹配后面跟的不是exp的位置
   - (?<!exp)匹配前面不是exp的位置

```
    (function(){
        var str="http://www.sina.com.cn ";
        var reg1= new RegExp(/.+(:)/g);
        var res1=str.match(reg1);
        var reg2=new RegExp(/.+(?=:)/);
        var res2=str.match(reg2);
        console.log(res1);
        console.log(res2);
    })();
```    
![](/img/blog/20/5.png)
```
    (function(){
        var a = "价格是123456789.6754";
        var reg4= new RegExp(/(\d)(?=(\d{3})+\.)/g);
        console.log(a.match(reg4));
        var b = a.replace(reg4, '$1,');
        console.log(b)
    })();
```
![](/img/blog/20/6.png)
```   
    (function(){
        let str="ABCD01:$23.45";
        let reg1=/\$[0-9.]+/g;
        let reg2=/(?<=\$)[0-9.]+/g;
        let res1=str.match(reg1);
        let res2=str.match(reg2);
        console.log(res1);
        console.log(res2);
    })();
```
![](/img/blog/20/7.png)
## 匹配固定位数
   - 匹配固定位数时，不能/[1-9]\d{4,11}/这样写，这样输入15位也会从15位中成功匹配11位
   - 只能用^和$匹配字符串开始和结束位置，然后再匹配中间的位数(^$不是从哪里开始匹配

```
    function check(val) {
        console.log(val)
        var reg = /^[1-9]\d{4,8}[0-9]$/;//匹配5到10位qq号
        if (!reg.test(val)) {
            alert("输入有误");
        }else{
            alert("输入正确");
        }
    }
```