// Map底层是通过哈希表来实现的，这里简单模拟实现以下
// 需要用到一个单链表来解决索引冲突
const LinkedList = require('./linkedList');
class myMap {
    constructor(arrays){
        // 建立子数组，也就是桶，用来装一个或多个键值对(冲突就是多个)
        // 注意填充时不能直接fill(new LinkedList),这样其实只创建了一个链表，然后去填充，引用都是一样的
        // 哈希表的桶数默认设为32
        this.buckets = new Array(32).fill(null).map(()=>new LinkedList())
        this.keys = {}
        arrays.forEach(([key,value])=> {
            this.set(key,value)
        });
    }
    // 计算一个hash值作为存储索引
    hash(key){
        const hash = [...key].reduce(function(pre,now){
            return pre+now.charCodeAt(0)
        },0)
        return hash % this.buckets.length;
    }

    set(key,value){
        const keyHash = this.hash(key)
        this.keys[key] = keyHash
        const findBucketLinkedList = this.buckets[keyHash]
        const findNode = findBucketLinkedList.findNode(node=>node.key === key)
        if(findNode){
            // 如果已经有了这个键 更新即可 findNode.value是键值对象
            findNode.value.value = value;
        }else{
            findBucketLinkedList.append({
                key,
                value
            })
        }
    }

    delete(key){
        const keyHash = this.hash(key)
        delete this.keys[key]
        const findBucketLinkedList = this.buckets[keyHash]
        const index = findBucketLinkedList.indexOf(node=>node.key === key)
        if(index!==-1){
            findBucketLinkedList.removeAt(index)
        }
        return this
    }

    get(key){
        const keyHash = this.hash(key)
        const findBucketLinkedList = this.buckets[keyHash]
        const findNode = findBucketLinkedList.findNode(node=>node.key === key)
        return findNode?findNode.value.value:undefined
    }

    has(key) {
        return Object.hasOwnProperty.call(this.keys, key);
    }

    clear(){
        this.buckets = new Array(32).fill(null).map(()=>new LinkedList())
        this.keys = {}
    }




}

const myMap1 = new myMap([['key1',1],['key2',2]])
console.log(myMap1.get('key1'))//  简佳成
console.log(myMap1.get('key2'))//jianjiacheng2


myMap1.set('name','jianjiacheng')
myMap1.set('naem','jianjiacheng2')
myMap1.set('anme','jianjiacheng3')

myMap1.set('name','简佳成')// 重新设置姓名

myMap1.set('age','20')
myMap1.set('sex','男')
myMap1.set('like','玩')
myMap1.set('error','阿萨德撒打算')

myMap1.delete('error')// 删除错误属性

console.log(myMap1.get('name'))//  简佳成
console.log(myMap1.get('naem'))//jianjiacheng2
console.log(myMap1.get('anme'))//jianjiacheng3
console.log(myMap1.get('age'))//20
console.log(myMap1.get('sex'))//玩
console.log(myMap1.get('like'))//男
console.log(myMap1.get('error')) // undefined

console.log(Object,Array)
