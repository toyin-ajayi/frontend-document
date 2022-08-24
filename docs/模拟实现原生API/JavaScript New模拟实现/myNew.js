function myNew(){
    let obj = {}
    let Constructor  = Array.prototype.shift.call(arguments)
    // 这么写可能不安全 可以改为 obj = Object.create(Constructor.prototype)
    obj.__proto__ = Constructor.prototype
    const ret = Constructor.apply(obj,arguments)
    return typeof ret === 'object' ? ret : obj;// new操作符会在构造函数有返回类型且这个返回类型为引用类型的时候返回这个值，而不是返回我们的obj
}

function person(name, age) {
    this.name = name;
    this.age = age;

    this.habit = 'Games';
    //return {a:"1"}
}

person.prototype.strength = 60;

person.prototype.sayYourName = function () {
    console.log('I am ' + this.name);
}


var person = myNew(person, 'Kevin', '18')

console.log(person.name) // Kevin
console.log(person.habit) // Games
console.log(person.strength) // 60

person.sayYourName(); // I am Kevin

