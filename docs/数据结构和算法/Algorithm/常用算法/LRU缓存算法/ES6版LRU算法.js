// 这个用Map来实现也太简单了吧。。。
var LRUCache = class {

    constructor(capacity) {
        this.cache = new Map();
        this.capacity = capacity;
    }
    get(key) {
        let cache = this.cache;
        if (cache.has(key)) {
            // 如果一个值已经有了需要重新插入，以提高其优先级，代表这个数据我常用
            let temp = cache.get(key)
            cache.delete(key);
            cache.set(key, temp);
            return temp;
        } else {
            return -1;
        }
    };
    put(key, value) {
        let cache = this.cache;
        if (cache.has(key)) {
            cache.delete(key);
        } else if (cache.size >= this.capacity) {
            // keys函数返回的是迭代器，然后调用next方法，返回第一个一个对象（最先插入在头部，就是最久为使用的
            // 对象有一个done属性 如果没有遍历结束就是false，value属性就是key
            // 
            cache.delete(cache.keys().next().value);
        }
        cache.set(key, value);
    };
};


let x = new LRUCache(3)

x.put('1','a')
x.put('2','b')
x.put('3','c')
x.put('4','d')