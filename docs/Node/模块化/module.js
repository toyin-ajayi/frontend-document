

/* // 在执行模块代码之前，Node.js 会使用一个如下的函数封装器将其封装：
(funciton (exports, require, module, __filename, __dirname) { // 包装头

}); // 包装尾 */

/* module.exports 是真正的接口
exports 是一个辅助工具
如果 module.exports 为空，那么所有的 exports 收集到的属性和方法，都赋值给了 module.exports
 */

//module.exports.f = ... 可以更简洁地写成 exports.f = ...。 但是，就像任何变量一样，如果为 exports 赋予了新值，则它将不再绑定到 module.exports
let a = 100;

 module.exports.x = 1
 module.exports.y = 1

exports.x = 2
console.log(module.exports); //能打印出结果为：{}
console.log(exports); //能打印出结果为：{} 

exports.a = a;


//为 exports 赋予了新值，则它将不再绑定到 module.exports
exports = '指向其他内存区'; //!这里把exports的指向指走,并不是导出变量的意思
console.log(exports)

//module.exports.c = 1

// module.exports和exports指向同一个内存空间
