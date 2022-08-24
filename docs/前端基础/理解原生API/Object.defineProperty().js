var data = {name:'jjc',age:0};

Object.defineProperty(data, 'birth', {
    enumerable: true,
    set: function (birth) {
        console.log("你要赋值给我,我的新值是",birth)
        let y = new Date().getFullYear()
        this.age =y-birth;
    },
    get:function(){
        let y = new Date().getFullYear()
        return y-this.age
    }

});

Object.defineProperty(data, 'name', {
    writable: false,// 不能修改完的我的名字
    enumerable: false // 不可可枚举 会不会在for in 中被遍历
});

for(prop in data) {
    console.log(prop);// 不会出现name
}

data.birth = 1999
console.log(data.age,data.birth)
console.log(data)
console.log(data)

