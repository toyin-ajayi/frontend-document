
### 次级域名不同

虽然网站images.google.com与网站www.google.com同属于Google，但是域名不一样，二者同样不能互相操作彼此的Cookie。而且path也必须一样才能相互访问彼此的cookie，需要注意不同浏览器对path访问规定不一样，对于chrome，path必须为当前目录，设置为其他目录无效，只能当前页面只能访问当前目录及其以上的cookie

### 子父级域名

- 在 www.baidu.com下设置 baidu.com 的 cookie 会被自动转换成 domain=**.baidu.com**
- **.baidu.com**表示像www.baidu.com或在ccc.baidu.com这种和.baidu.com同级的域名都可以访问，且父域名 baidu.com 也能访问

- 但是在 baidu.com 下设置 domain=baidu.com 的 cookie，子域名www.baidu.com是无法访问的

注意：当前域名只能设置当前域名以及他的父域名，不能设置子域名，这种网上的说法好像不太准确，因为上面的验证显示子域名设置父域名的cookie时明细多带了一个点 '**.**'

## 访问Cookie总结

- 首先不同域名肯定不能相互访问
- 父域名可以访问子域名的 cookie
- 子域名不能访问父域名的 cookie

