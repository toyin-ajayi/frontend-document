// 基于promise实现
function getCode(data) {
  let paramArr = [];
  let encodeData;
  if (data instanceof Object) {
    for (let key in data) {
      // 参数拼接需要通过 encodeURIComponent 进行编码
      paramArr.push(
        encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
      );
    }
    encodeData = paramArr.join("&");
    return encodeData;
  } else if (typeof data === "string") {
    return data;
  } else {
    throw Error("发送的数据不合法");
  }
}

function ajax(options) {
  let {
    url = "",
    async = true,
    data = "",
    timeout,
    headers = {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  } = options;
  // 将方法转为小写
  const method = options.method.toLocaleLowerCase();

  let xhr;
  // 适配chrome和IE
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }

  // 如果设置了请求超时的时间
  if (timeout && timeout > 0) {
    xhr.timeout = timeout;
    xhr.ontimeout = function (e) {
      console.log(e)
    };
  }
  // 返回一个Promise实例
  return new Promise((resolve, reject) => {
    xhr.ontimeout = () => reject("请求超时");
    // 监听状态变化回调
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        // 200-300 之间表示请求成功，304资源未变，取缓存
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
          resolve(xhr.responseText);
        } else {
          reject("发现了未知错误");
        }
      }
    };
    // 错误回调
    xhr.onerror = err => reject(err);

    // 处理转码问题 提交的数据按照 key1=val1&key2=val2 的方式进行编码
    let encodeData = getCode(data);
    // 发送请求
    if (method === "get") {
      // 检测url中是否已存在 ? 及其位置
      const index = url.indexOf("?");
      if (data !== "") {
        if (index === -1) url += "?";
        else if (index !== url.length - 1) url += "&";
      }
      // 拼接url
      url += encodeData;
      xhr.open(method, url, async);
      // 设置请求头
      Object.keys(headers).forEach(key =>
        xhr.setRequestHeader(key, headers[key])
      );
      xhr.send(null);
    } else if (method === "post") {
      // 设置请求头
      xhr.open(method, url, async);
      Object.keys(headers).forEach(key =>
        xhr.setRequestHeader(key, headers[key])
      );
      xhr.send(encodeData);
    }
  });
}
