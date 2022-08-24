function shallowClone(source){
    if(typeof source === 'object'){
        let res = source.constructor === Array? []:{}
        for(let key in source){
            res[key] = source[key]
        }
        return source

    }else{
        return source
    }

}

var a = {
    name: "jjc",
    book: {
        title: "You Don't Know JS",
        price: "45"
    },
    a1: undefined,
    a2: null,
    a3: 123
}
var b = shallowClone(a);

