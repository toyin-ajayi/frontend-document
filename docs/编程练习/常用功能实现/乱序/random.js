

// 乱序的就会更加彻底
function shuffle(a) {
    for (let i = a.length; i>0; i--) {
        // 这里注意下因为i每次都变小，这样就可以避免取到所取过的值
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];//遍历数组元素，然后将当前元素与以后随机位置的元素进行交换
    }
    return a;
}

let a = [1,2,3,4,5,6,7,8,9]

console.log(shuffle(a))
console.log(shuffle(a))
console.log(shuffle(a))
console.log(shuffle(a))

