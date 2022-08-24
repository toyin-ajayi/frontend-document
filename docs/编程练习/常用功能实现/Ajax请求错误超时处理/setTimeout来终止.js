function ajax(url, timeout, callback) {
  var request = new XMLHttpRequest();
  var time = false; //是否超时
  var timer = setTimeout(function() {
    time = true;
    //中止求请;
    request.abort();
    //? 递归重试
  }, timeout);
  request.open("GET", url);
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      if (time) return; //忽略超时被中止的请求
      clearTimeout(timer); //没有被终止则证明没有超时，需要清除掉定时器
      if (request.status === 200) callback(request.responseText);
    }
  };
  request.send(null);
}
