const path = require('path');
// 从右到左进行处理，每个后续的`path`前置，直到构造出一个绝对路径
const name = path.resolve('ban','pan','movie')
const dirname = __dirname
const fileanem = __filename
console.log(name)
console.log(dirname)
console.log(fileanem)
