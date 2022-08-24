
## 代理+重写
```
https://ad.jjc.com/pages/ 127.0.0.1:8082/pages/
https://cc.jjc.com/v1/material reqHeaders://{ppe-api-img}
https://ad.jjc.com/platform/api/v1/video/ reqHeaders://{ppe-api-video}
# https://ad.jjc.com/pages/ reqHeaders://{ppe}
# https://cc.jjc.com/ reqHeaders://{ppe}
# https://ad.jjc.com/platform/api/v1/video/ resBody://{resbody}

```

## 跨域 + 排除
```
line`
https://cc.jjc.com/video_material/ 127.0.0.1:4001/video_material/
excludeFilter://https://cc.jjc.com/v1/***
excludeFilter://https://cc.jjc.com/tool/***
`
# https://ad.jjc.com/ resHeaders://{Access-Control-Allow-Origin}
https://ad.jjc.com/ resCors://enable

```