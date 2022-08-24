var obj = {};
var a = Symbol("a"); // 创建新的symbol类型
var b = Symbol.for("b"); // 从全局的symbol注册?表设置和取得symbol

obj[a] = "localSymbol";
obj[b] = "globalSymbol";

var objectSymbols = Object.getOwnPropertySymbols(obj);

console.log(objectSymbols.length); // 2
console.log(objectSymbols)         // [Symbol(a), Symbol(b)]
console.log(objectSymbols[0])      // Symbol(a)



let x= Symbol(1)
let x2= Symbol(1)
console.log(x === x2)// false

let obj2= {
    a:'aa',
    [Symbol(1)]:123,
    [Symbol(1)]:234
}

obj2[x] = 'xxx'
obj2[x2] = 'x222'
console.log(Object.keys(obj2))// 拿不到symbol
console.log(Object.getOwnPropertySymbols(obj2))// 拿得到4个Symbols键
