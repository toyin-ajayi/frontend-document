class Man {
  constructor() {
    this.dep = [];
    setTimeout(() => {
      this.next();
    }, 0);
  }
  eat(x) {
    const _this = this;
    this.dep.push(function () {
      console.log("eat" + x);
      _this.next();
    });
    return this;
  }

  sleep(x) {
    const _this = this;
    this.dep.push(function () {
      console.log(`开始等待${x}秒...`);
      setTimeout(function () {
        _this.next();
      }, x * 1000);
    });
    return this
  }

  sleepFirst(x){
    const _this = this;
    this.dep.unshift(function () {
      console.log(`开始等待${x}秒...`);
      setTimeout(function () {
        _this.next();
      }, x * 1000);
    });
    return this
  }

  next() {
    const fn = this.dep.shift();
    fn && fn();
  }
}
const LazyMan = new Man();
LazyMan.eat("lunch").eat("dinner").sleep(4).eat("junk food").sleepFirst(2);
