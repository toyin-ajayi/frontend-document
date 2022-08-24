function watch(target, func) {
    var proxy = new Proxy(target, {
        get: function(target, prop) {
            return target[prop];
        },
        set: function(target, prop, value) {
            target[prop] = value;
            // 代理对象被赋值的时候进入这里，
            // 执行传入的回调，因为代理的整个对象，我们需要拿到键名prop，然后进行相关处理
            func(prop, value);
        }
    });

    return proxy;
}




