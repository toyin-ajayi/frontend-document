const LinkedList = require('../LinkedLists/linkedList');

class HashTable {
    constructor(hashTableSize=32){
        // 建立子数组，也就是桶，用来装一个或多个键值对(冲突就是多个)
        // 注意填充时不能直接fill(new LinkedList),这样其实只创建了一个链表，然后去填充，引用都是一样的
        this.buckets = new Array(hashTableSize).fill(null).map(()=>new LinkedList())
        this.keys = {}
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


}

const HashTable1 = new HashTable()

HashTable1.set('name','jianjiacheng')
HashTable1.set('naem','jianjiacheng2')
HashTable1.set('anme','jianjiacheng3')

HashTable1.set('name','简佳成')// 重新设置姓名

HashTable1.set('age','20')
HashTable1.set('sex','男')
HashTable1.set('like','玩')
HashTable1.set('error','阿萨德撒打算')

HashTable1.delete('error')// 删除错误属性

console.log(HashTable1.get('name'))//  简佳成
console.log(HashTable1.get('naem'))//jianjiacheng2
console.log(HashTable1.get('anme'))//jianjiacheng3
console.log(HashTable1.get('age'))//20
console.log(HashTable1.get('sex'))//玩
console.log(HashTable1.get('like'))//男
console.log(HashTable1.get('error')) // undefined

console.log(Object,Array)
