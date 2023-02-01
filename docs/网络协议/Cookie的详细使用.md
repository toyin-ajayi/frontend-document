## 设置cookie不可跨域，满足同源策略

### 主域名不同

比如在www.baidu.com下开启控制台，然后写入Cookie：
```tsx
document.cookie='myname=huaminlai;path=/;domain=.google.com';// 无效
```
上面这种写法是不会生效的，应为在www.baidu.com这个域下，只能设置百度网页的Cookie：
```tsx
document.cookie='myname=laihuamin;path=/;domain=.baidu.com';// 有效
```
