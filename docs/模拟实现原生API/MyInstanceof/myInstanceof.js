function myInstanceof(L,R){
    let leftProto = L.__proto__
    while(leftProto){
        if(leftProto === R.prototype){
            return true
        }
        leftProto = leftProto.__proto__
    }
    return false
}

function myInstanceof2(left,right) {

    let proto = left.__proto__;
    let prototype = right.prototype
    while(true) {
        if(proto === null) return false
        if(proto === prototype) return true
        proto = proto.__proto__;
    }
}




console.log(myInstanceof([],Array)) // true
console.log(myInstanceof([],Object)) // true
console.log(myInstanceof(function(){},Object)) // true
console.log(myInstanceof(function(){},Function)) // true
console.log(myInstanceof(Array,Function)) // true
console.log(myInstanceof([],Function)) // false

