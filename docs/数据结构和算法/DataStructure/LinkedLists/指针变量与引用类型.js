let obj = {
    a:1,
    b:2
}
let obj2 = {
    c:1,
    d:2
}

let point1 = obj
let point2 = obj2// obj和obj2只是一个指向堆内存地址的指针变量  

obj.a = 'aaaa'
console.log(point1)

obj2 = "cccc"//point2已经指向了{c:1，d:2} 无能你怎么修改obj2这个变量都不会
console.log(point2)