function forOf(obj, cb) {
    let iterable, result;

    if (typeof obj[Symbol.iterator] !== "function")
        throw new TypeError(result + " is not iterable");
    if (typeof cb !== "function") throw new TypeError("cb must be callable");

    iterable = obj[Symbol.iterator]();

    result = iterable.next();
    while (!result.done) {
        cb(result.value);
        // 注意这里每次都是执行的同一个next函数
        // next函数内部会有一个指针，执行一次就执行下一个数据，类似于for循环的i++
        result = iterable.next();
    }
}

// 数组和对象都是可迭代对象，可以使用我们的方法
const x = [1,2,3]
forOf(x,(item)=>console.log(item))// 1 2 3