function unique(arr) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i] == arr[j]) {
        //第一个等同于第二个，splice方法删除第二个
        arr.splice(j, 1);
        j--;// 删了一个后原来j位置的已经变了元素，所以需要再判断j这个位置 j--后j++就回退了
      }
    }
  }
  return arr;
}
