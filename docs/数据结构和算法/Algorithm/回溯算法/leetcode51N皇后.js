function solveNQueens(n) {
  let board = Array(n)
    .fill(null)
    .map(() => Array(n).fill("."));
  let res = [];
  backtrack(board, 0, res);
  let newRes = res.map(item => {
    return item.map(row => {
      return row.join("");
    });
  });
  return newRes;
}



function backtrack(board, row, res) {
  if (row === board.length) {
    res.push(deepCloneArray(board));
    return;
  }

  let rowL = board[row].length;
  for (let col = 0; col < rowL; col++) {
    if (!isValid(board, row, col)) continue;
    board[row][col] = "Q";
    backtrack(board, row + 1, res);
    board[row][col] = ".";
  }
}

//是否可以在 board[row][col] 放置皇后
function isValid(board, row, col) {
  let colL = board.length;
  // 检查列是否有皇后互相冲突
  for (let i = 0; i < colL; i++) {
    if (board[i][col] == "Q") return false;
  }
  // 检查右上方是否有皇后互相冲突
  for (let i = row - 1, j = col + 1; i >= 0 && j < colL; i--, j++) {
    if (board[i][j] == "Q") return false;
  }
  // 检查左上方是否有皇后互相冲突
  for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
    if (board[i][j] == "Q") return false;
  }
  return true;
}

function deepCloneArray(arr) {
  if (Array.isArray(arr)) {
    return Array.from(arr, deepCloneArray); //递归入口
  } else {
    return arr;
  }
}

console.log(solveNQueens(4));
console.log(123);
