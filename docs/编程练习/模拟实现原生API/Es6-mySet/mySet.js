class mySet{
    constructor(arr = []) {
        // TODO：我发现用obj存键虽然查找的时候快，但无法实现对NaN这种数据的支持
        // TODO: 用symbol包裹也不行，因为最后for of循环不会走symbol属性,需要修改为数组
        this.items = {};
        this.size = 0;
        this.SymbolNaN = Symbol(NaN)
        this.forOf(arr, (item) => {
            this.add(item);
        })
    }
    encodeVal = function(value) {
        return value !== value ? this.SymbolNaN : value;
    }

    decodeVal = function(value) {
        return (value === this.SymbolNaN) ? NaN : value;
    }

    // 改良一下之前手写的迭代器，最后要转化NaN，用于Set.keys和Set.values返回使用
    createIterator(array) {
        const that = this
        var nextIndex = 0;
        return {
          next: function() {
            return nextIndex < array.length
              ? { value: that.decodeVal(array[nextIndex++]), done: false }
              : { value: undefined, done: true };
          },
          [Symbol.iterator]: function () { 
              return this // 注意这里是对象调用模式，this指向的就是上层的对象，迭代器
          }
        };
    }

    // 采用一个forOf来遍历我们传入的迭代器
    forOf(obj, cb) {
        let iterable, result;

        if (typeof obj[Symbol.iterator] !== "function") throw new TypeError(obj + " is not iterable");
        if (typeof cb !== "function") throw new TypeError('cb must be callable');

        iterable = obj[Symbol.iterator]();

        result = iterable.next();
        while (!result.done) {
            cb(result.value);
            result = iterable.next();
        }
    }

    // has方法
    has(val) {
        // 处理NaN这种特殊情况
        val = this.encodeVal(val)
        return this.items.hasOwnProperty(val);
    };
    // add方法
    add(val) {
        // 如果没有存在items里面就可以直接写入
        if (!this.has(val)) {
            val = this.encodeVal(val)
            this.items[val] = val;
            this.size++;
            return true;
        }
        return false;
    };

    // delete方法
    delete(val) {
        val = this.encodeVal(val)
        if (this.has(val)) {
            delete this.items[val];  // 将items对象上的属性删掉
            this.size--;
            return true;
        }
        return false;
    };
    // clear方法
    clear() {
        this.items = {};
        this.size = 0;
    };
    // keys方法
    keys() {
        return this.createIterator(Object.keys(this.items));
    };
    // values方法
    values() {
        return this.createIterator(Object.keys(this.items));
    }

    // forEach方法
    forEach(fn, context = this) {
        for (let i = 0; i < this.size; i++) {
            let item = Object.keys(this.items)[i];
            fn.call(context, item, item, this.items);
        }
    }

    // 并集
    union(other) {
        let union = new Set();
        let values = this.values();

        for (let i = 0; i < values.length; i++) {
            union.add(values[i]);
        }
        values = other.values();    // 将values重新赋值为新的集合
        for (let i = 0; i < values.length; i++) {
            union.add(values[i]);
        }

        return union;
    };
    // 交集
    intersect(other) {
        let intersect = new Set();
        let values = this.values();
        for (let i = 0; i < values.length; i++) {
            if (other.has(values[i])) {
                intersect.add(values[i]);
            }
        }
        return intersect;
    };
    // 差集
    difference(other) {
        let difference = new Set();
        let values = this.values();
        for (let i = 0; i < values.length; i++) {
            if (!other.has(values[i])) {
                difference.add(values[i]);
            }
        }
        return difference;
    };
    // 子集
    subset(other) {
        if (this.size > other.size) {
            return false;
        } else {
            let values = this.values();
            for (let i = 0; i < values.length; i++) {
                console.log(values[i])
                console.log(other.values())
                if (!other.has(values[i])) {
                    return false;
                }
            }
            return true;
        }
    };
}
let mySet1 = new mySet([1,23,4,NaN,NaN])
let set = new Set([2, 1, 3]);
let x = set.keys()

console.log(mySet1.keys())
console.log(mySet1.values())
for (let item of mySet1.keys()) {
    console.log(item)
}
for (let item of mySet1.values()) {
    console.log(item)
}


const x2 = Symbol.iterator
console