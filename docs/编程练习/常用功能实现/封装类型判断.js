function isType(obj, type) {
  return Object.prototype.toString.call(obj) === `[object ${type}]`;
};
console.log(isType([1, 2, 3], "Array")); // true



function myTypeOf(data) {
  const typeStr = Object.prototype.toString.call(data);
  const type = typeStr.replace(/\[object\s(.+)\]/, "$1"); //replace可以捕获分组
  return type;
}
const num = 123;
const obj = {};
const arr = [];
console.log(myTypeOf(num));//Number
console.log(myTypeOf(obj));//Object
console.log(myTypeOf(arr));//Array




