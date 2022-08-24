/*
* url 请求地址
* method 请求方法
* data 请求参数
* fnSucceed 成功的回调
* fnFail失败的回调
* timeout 超时时间
*/
function ajaxPost (url ,method, data , fnSucceed , fnFail,timeout) {
    // 封装一下下 超时和错误的时候都重试
    function retry(msg){
        fnFail(msg);
        if(retryNum > 0 ){
                // 异常，重试
                setTimeout(function(){
                   retryNum--;
                ajaxPost(url ,method, data , fnSucceed , fnFail)
                },timeGaps)
        }
    }

    //请求时间间隔,刚开始间隔时间短，后面间隔时间越来越长
    let timeGaps = 1000;
    //请求重试次数
    let retryNum = 10;
    var ajax = new XMLHttpRequest();
    ajax.open( method , url , true );
    ajax.setRequestHeader( "Content-Type" , "application/x-www-form-urlencoded" );
    ajax.onreadystatechange = function () {
        if(ajax.readyState == 4) {
            if( (ajax.status >= 200 && ajax.status < 300) || ajax.status == 304 ) {
                fnSucceed( ajax.responseText );
            }
            else {
                retry("HTTP请求错误！错误码："+ajax.status)
            }
        }
        else {
        }
    }
    if (timeout && timeout > 0) {
        ajax.timeout = timeout;
        ajax.ontimeout = function (e) {
            retry("HTTP请求超时！错误码："+ajax.status)
        };
      }
    ajax.send( data );
} 
