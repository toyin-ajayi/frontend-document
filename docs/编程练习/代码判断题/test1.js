function getAge(...args) {
  console.log(args);
}

getAge("21");

console.log(typeof []);

console.log(new String("asd"));
console.log(new String(1));
console.log("123");
console.log(new Boolean(false));

const numbers = [1, 2, 3];
numbers[10] = 11;
console.log(numbers);
console.log(numbers);


if(!("a" in window)){
  var a = 10;
}
console.log(a); // undefined
