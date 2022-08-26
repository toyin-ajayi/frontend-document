// TODO:添加二叉堆和堆排序
class treeNode {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(key) {
    if (this.root === null) {
      this.root = new treeNode(key);
    } else {
      this.insertNode(this.root, key);
    }
  }

  insertNode(node, key) {
    if (key < node.key) {
      if (node.left !== null) {
        this.insertNode(node.left, key);
      } else {
        node.left = new treeNode(key);
      }
    } else if (key > node.key) {
      if (node.right !== null) {
        this.insertNode(node.right, key);
      } else {
        node.right = new treeNode(key);
      }
    }
  }

  // 前序遍历 根节点->左子树->右子树
  preOrderTraverse(node) {
    if (node === null) return;
    console.log(node.key);
    this.preOrderTraverse(node.left);
    this.preOrderTraverse(node.right);
  }

  // 中序遍历 左子树->根节点->右子树
  inOrderTraverse(node) {
    if (node === null) return;
    this.inOrderTraverse(node.left);
    console.log(node.key);
    this.inOrderTraverse(node.right);
  }

  // 后序遍历 左子树->右子树->根节点
  postOrderTraverse(node) {
    if (node === null) return;
    this.postOrderTraverse(node.left);
    this.postOrderTraverse(node.right);
    console.log(node.key);
  }

  // 取最大值
  maxNode(node) {
    if (node.right) {
      return this.maxNode(node.right);
    } else {
      return node.key;
    }
  }

  // 取最小值
  minNode(node) {
    if (node.left) {
      return this.minNode(node.left);
    } else {
      return node.key;
    }
  }

  // 查找节点是否存在 一层层的 return上来的
  search(node, key) {
    if (node !== null) {
      if (key < node.key) {
        return this.search(node.left,key);
      } else if (key > node.key) {
        return this.search(node.right,key);
      } else {
        // 这里其实会有小问题 ， 如果直接else 我们不传key就会是undefined 也会进入这里返回true
        return true;
      }
    } else {
      return false;
    }
  }

  maxDeep(node){
    if(node == null){
      return 0
    }else{
      let left = this.maxDeep(node.left);
      let right = this.maxDeep(node.right);
      let deep = Math.max(left,right )+1
      return deep
    }

  }


  /**
   * @description 删除某一个节点
   * @returns 递归时需要向上层返回当前修改的节点
   * 分三种情况：
   * 1删除叶子节点
   * 2删除单边的节点
   * 3删除左右孩子都有的节点
   */
  removeNode(node,key){
    if (node !== null) {
      if (key < node.key) {
        node.left =  this.removeNode(node.left,key);// 递归返回然后赋值
        return node
      } else if (key > node.key) {
        node.right = this.removeNode(node.right,key);
        return node
      } else {
          if(node.right === null && node.left === null){
            node = null;
            return node// 叶子节点直接让父节点执行null即可
          }else if(node.left === null){// 删除单边节点直接让它的父节点指向它的孩子即可
            node = node.right
            return node // 这里返回就是让递归的上一层也就是父节点好赋值
          }else if(node.right === null){
            node = node.left
            return node
          }else{
            // 如果要删除的节点两边都有节点，那么首先要早到继承节点，然后替换
            // 继承节点：右边最小的 原因：如果不是最小的，那么把这个节点替换到上级后，右边孩子节点就存在值小于上层根节点，还需要替换到左边去
            node.key = this.minNode(node.right)
            // 这是有两个节点同值，需要删除继承节点
            node.right = this.removeNode(node.right,node.key)
            return node
          }
      }
    } else {
      return null;
    }
  }

}

let Tree = new BinarySearchTree();
Tree.insert(11);
Tree.insert(7);
Tree.insert(15);
Tree.insert(5);
Tree.insert(3);
Tree.insert(9);
Tree.insert(8);
Tree.insert(10);
Tree.insert(13);
Tree.insert(12);
Tree.insert(14);
Tree.insert(20);
Tree.insert(18);
Tree.insert(25);
Tree.insert(6);

let root = Tree.root;
console.log("前序遍历 根节点->左子树->右子树");
Tree.preOrderTraverse(root);

console.log("中序遍历 左子树->根节点->右子树");
Tree.inOrderTraverse(root);

console.log("后序遍历 左子树->右子树->根节点");
Tree.postOrderTraverse(root);

console.log("Max", Tree.maxNode(root));
console.log("Min", Tree.minNode(root));

console.log("能否找到13", Tree.search(root, 13));


Tree.removeNode(root,6)// 删除叶子节点
Tree.removeNode(root,5)// 删除单边
Tree.removeNode(root,15)// 删除两边都要孩子的节点

console.log("可以发现我们删除6,5,15后的中序遍历(从小到大)其他节点未受影响，删除成功的");
Tree.inOrderTraverse(root);
console.log('--------------------------')
console.log('Tree.maxDeep(root): ', Tree.maxDeep(root));


