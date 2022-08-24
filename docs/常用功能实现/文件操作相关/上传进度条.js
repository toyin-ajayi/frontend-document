upload.addEventListener("click", function() {
  var file = fileInput.files[0];
  if (!file) {
    alert("请选择上传文件");
    return;
  }
  var params = new FormData();
  params.append("file", file);
  params.append("otherParams", "xxx"); // 其他必要参数

  var xhr = new XMLHttpRequest();
  xhr.onerror = function() {
    alert("请求失败");
  };
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        console.log(xhr.responseText);
      } else {
        console.error(xhr.status);
      }
    }
  };
  xhr.upload.onprogress = function(e) {
    progress.innerHTML = Math.round((e.loaded / e.total) * 100) + "%";
  };
  xhr.open("POST", "http://localhost:8901/api/upload", true);
  xhr.send(params);
});
