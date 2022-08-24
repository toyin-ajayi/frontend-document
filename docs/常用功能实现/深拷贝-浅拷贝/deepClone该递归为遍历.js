function deepClone(data){
    const root = {}
    const loopList = [
        {
            parent:root,
            key:undefined,
            data:data
        }
    ]
    while(loopList.length>0){
        const node = loopList.pop()// 从后面取，后面进，进行深度优先搜索
        const {parent,key,data} = node
        let res = parent
        if(key!==undefined){
            // 如果有key，则表明 上层data[key]是一个对象，也就是传过来的data是一个对象
            // 表明的parent的key的数据需要拷贝，所以创建一个对象来拷贝它到parent[key]上
            res = parent[key] = {}
        }
        for(let key in data){
            if(typeof data[key] == 'object'){
                loopList.push({
                    parent:res,
                    key:key,
                    data:data[key]
                })
            }else{
                res[key] = data[key]
            }
        }
    }
    return root
}

var a = {
    name: "jjc",
    book: {
      title: "You Don't Know JS",
      price: "45"
    },
    a1: undefined,
    a3: 123
  };
  var b = deepClone(a);
  b.book.price = 123
  console.log(a)
  let ax;