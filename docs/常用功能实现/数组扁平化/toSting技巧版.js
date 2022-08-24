//利用 toString 把数组变成以逗号分隔的字符串，遍历数组把每一项再变回原来的类型。
//缺点：数组中元素必须是 Number类型，String类型会被转化成Number
const str = [0, 1, [2, [3, 4]]].toString()
// '0, 1, 2, 3, 4'
const arr = str.split(',')
// ['0','1','2', '3', '4']
const newArr = arr.map(item => +item)
// [0, 1, 2, 3, 4]

const flatten = (arr) => arr.toString().split(',').map(item => +item)
