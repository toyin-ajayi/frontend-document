let template = "我是{{name}}，年龄{{age}}，性别{{sex}}";
let data = {
  name: "姓名",
  age: 18,
};

console.log(Object.entries(data));

function render(template, data) {
  for (let [key, value] of Object.entries(data)) {
    console.log("value: ", value);
    const pattern = new RegExp("{{" + key + "}}");
    console.log(pattern);
    template = template.replace(pattern, value);
  }
  return template;
}
render(template, data);

// 递归版
function render2(template, data) {
  const reg = /\{\{(\w+)\}\}/; // 模板字符串正则
  if (reg.test(template)) {
    // 判断模板里是否有模板字符串
    const name = reg.exec(template)[1]; // 查找当前模板里第一个模板字符串的字段
    template = template.replace(reg, data[name]); // 将第一个模板字符串渲染
    return render(template, data); // 递归的渲染并返回渲染后的结构
  }
  return template; // 如果模板没有模板字符串直接返回
}




// 非递归版

const fn1 = (str, obj) => {
  let res = "";
  // 标志位，标志前面是否有{
  let flag = false;
  let start;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "{") {
      flag = true;
      start = i + 1;
      continue;
    }
    if (!flag) res += str[i];
    else {
      if (str[i] === "}") {
        flag = false;
        res += match(str.slice(start, i), obj);
      }
    }
  }
  return res;
};
// 对象匹配操作
const match = (str, obj) => {
  const keys = str.split(".").slice(1);
  let index = 0;
  let o = obj;
  while (index < keys.length) {
    const key = keys[index];
    if (!o[key]) {
      return `{${str}}`;
    } else {
      o = o[key];
    }
    index++;
  }
  return o;
};
