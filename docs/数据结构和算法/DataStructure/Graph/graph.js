// TODO:添加最小生成树与最短路径算法
class Graph {
  constructor() {
    // 类邻接表
    this.AdjList = new Map();
  }

  // 添加顶点
  addVertex(vertex) {
    if (!this.AdjList.has(vertex)) {
      this.AdjList.set(vertex, []);
    } else {
      throw "顶点已存在";
    }
  }

  /**
   * @description 添加边
   * @param {*} vertex 顶点，放出边指向节点
   * @param {*} node 边指向的节点
   */
  addEdge(vertex, node) {
    // 必须判断vertex和node都必须要存在才能操作
    if (this.AdjList.has(vertex) && this.AdjList.has(node)) {
      // 拿到该顶点的邻接表
      const adjoinVertex = this.AdjList.get(vertex);
      const nodeAdjoinVertex = this.AdjList.get(node);
      // 还需要判断这条边是否已经存在
      if(!adjoinVertex.includes(node)){
        adjoinVertex.push(node);
      }
      // 无向图需要加上下面的，两边都能到达
      if(!nodeAdjoinVertex.includes(vertex)){
        nodeAdjoinVertex.push(vertex);
      }
    }else{
        throw new Error('无法正常添加该边')
    }
  }

  print(){
    console.log(this.toString())
  }

  //创建广度优先搜索
  breadthFirstSearch(startVertex){
      // 简单一点直接用arr模拟queue，也可以用之前建立的Queue类
      const queue = []
      // 建立一个字典来判断一个顶点是否又被遍历过
      const keys = new Map()
      queue.push(startVertex)
      while(queue.length>0){
        const nowVertex =  queue.shift()
        keys.set(nowVertex,true)
        console.log(nowVertex)
        const adjoinVertex = this.AdjList.get(nowVertex)
        adjoinVertex.forEach((vertex)=>{
            // 一个节点是否添加到队列需要满足1：没有在队列里 2：它没有被遍历过（可能一个节点被遍历了又出队了
            if(!queue.includes(vertex)&&!keys.has(vertex)){
                queue.push(vertex)
            }
        })
      }
  }

  // 深度优先搜索  最简单的思路：1.创一个map判断节点是否遍历 2.用递归调用栈传递map的地址即可每次都访问到同一个map
  depthFirstSearch(startVertex,keys=new Map()){
    keys.set(startVertex,true)
    console.log(startVertex)
    const adjoinVertex = this.AdjList.get(startVertex)
    adjoinVertex.forEach((vertex=>{
        if(!keys.has(vertex)){
            this.depthFirstSearch(vertex,keys)
        }
    }))

  }



  toString() {
    let s = '';
    for(let [key,value] of this.AdjList){
        s += `${key} -> `;
        for (let j = 0; j < value.length; j++) {
          s += `${value[j]} `;
        }
        s += '\n';
    }
    return s
  }
}

let g = new Graph();
let arr = ['A', 'B', 'C', 'D', 'E', 'F','G','H','I'];
for (let i = 0; i < arr.length; i++) {
  g.addVertex(arr[i]);
}
g.addEdge('A', 'B');
g.addEdge('A', 'C');
g.addEdge('A', 'D');
g.addEdge('C', 'D');
g.addEdge('C', 'G');
g.addEdge('D', 'G');
g.addEdge('D', 'H');
g.addEdge('B', 'E');
g.addEdge('B', 'F');
g.addEdge('E', 'I');
g.print();
console.log('广度优先搜索')
g.breadthFirstSearch('A');
console.log('深度度优先搜索')
g.depthFirstSearch('A');


