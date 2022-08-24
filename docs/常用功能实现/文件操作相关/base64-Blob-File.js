let dataURLtoBlob = function(dataurl) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

//将blob转换为file
let blobToFile = function(theBlob, fileName) {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
};

//将base64数据转化为文件格式
export default function(base64, fileName) {
  let reg = new RegExp(/^data:image/, "i");
  //如果base64数据没有开头的一段
  if (!reg.test(base64)) {
    base64 = "data:image/png;base64," + base64;
  }
  let blob = dataURLtoBlob(base64, fileName);
  return blobToFile(blob);
}

const base64 = "";
let file = base64TOFile(base64, "img");
let fd = new FormData();
fd.append("file", file);

