var context = {
    next:0,
    prev:null,
    gen$:null,
    done:false,
    stop:function(){
      this.done = true;
    }
};
Object.defineProperty(context, Symbol.iterator, {
    enumerable: false,
    writable: false,
    configurable: true,
    value: function () {
        var me = this;
        return {
            next: function () {
               var nextValue = me.gen$(me);
                return {
                    value: nextValue,
                    done: me.done
                }
            }
        }
    }
});
var regeneratorRuntime = {
  wrap:function(_gen){
    context.gen$ = _gen;
    return context;
  }
}
function gen(arg) {
    return regeneratorRuntime.wrap(function gen$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return 2;
            case 2:
              _context.next = 4;
              return arg;
            case 4:
            case "end":
              return _context.stop();
          }
      }
  });
}
var b = gen(3);
for(var c of b){
  console.log(c);   // 结果为：2，3
}