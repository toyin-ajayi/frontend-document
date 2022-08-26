// 如果是一个无权有向图，那很容易计算最短路径，因为通过广度优先算法一层一层取，第一次出现肯定是最短的
// 那如果是一个加权的图呢？肯定就不能按照层级来确定长度，还得计算。可以采用不断刷新起点与其他各个顶点之间的 “距离表”。
// 思路：首先建立相同顶点个数的距离表dist,初始化为无穷大
// 然后从起始点开始遍历，计算到邻接点的距离并比较如果小就填写到距离表
// 参考Java写法：https://mp.weixin.qq.com/s?__biz=MzIxMjE5MTE1Nw==&mid=2653197626&idx=1&sn=fca7472af006a7f8890ee84ad7cf1116&chksm=8c99e7e0bbee6ef6faa1a34160a5e135503425e37552e90dfca2fbc10f223dbf3b875e84e418&scene=21#wechat_redirect

const INF = Number.MAX_SAFE_INTEGER;

const dijkstra = (graph, src) => {
  const dist = [];
  const visited = [];
  const { length } = graph;

  //初始化最短路径表，到达每个顶点的路径代价默认为无穷大
  for (let i = 0; i < length; i++) {
    dist[i] = INF;
    visited[i] = false;
  }
  dist[src] = 0;
  //主循环，遍历每一个顶点
  for (let i = 0; i < length - 1; i++) {
    // 每一个节点遍历完它的邻接节点相当于遍历完一层后，选择这一层最短距离顶点
    // minDistance里会根据visited判断是否是当前层级未遍历，避免重复
    const u = minDistance(dist, visited);
    visited[u] = true;
    // 取出一个顶点的所有邻接点 刷新距离
    for (let v = 0; v < graph[u].length; v++) {
      if (
        !visited[v] &&
        graph[u][v] !== 0 &&
        dist[u] !== INF &&
        // 可能A->C->D 也可能 A->B->D,D是新的节点，有可能是A->C比A->B小
        // 但是加上D后就变成A->B->D小了，因为到D的距离不确定需要加上后重新计算
        dist[u] + graph[u][v] < dist[v]
      ) {
        // 如果从其他路过来的距离更小，更新距离
        dist[v] = dist[u] + graph[u][v];
      }
    }
  }
  return dist

};

const minDistance = (dist, visited) => {
  let min = INF;
  let minIndex = -1;
  for (let v = 0; v < dist.length; v++) {
    if (visited[v] === false && dist[v] <= min) {
      min = dist[v];
      minIndex = v;
    }
  }
  return minIndex;
};
let x = [
  [0, 2, 4, 0, 0, 0],
  [0, 0, 1, 4, 2, 0],
  [0, 0, 0, 0, 3, 0],
  [0, 0, 0, 0, 0, 2],
  [0, 0, 0, 3, 0, 2],
  [0, 2, 4, 0, 0, 0]
];

console.log(dijkstra(x,0))