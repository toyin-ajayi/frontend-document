function sendRequest(urls,max,callback) {
    //将urls根据max做分组，一共分为times组，每个组里面最多包含max个url
    let urlsObj = {};
    let times = Math.ceil(urls.length / max);
    let currentIndex = 0;
    for(let i = 0;i<times;i++){
        urlsObj[i] = urls.slice(i * max,(i + 1) * max);
    }
    //fetch请求的方法
    let getFetch = (source) => {
        return source.map((item) => {
            return fetch(item).then((res) => {
                return res.status;
            })
        })
    };
    let send = () => {
        urlsObj[currentIndex] && Promise.all(getFetch(urlsObj[currentIndex]))
            .then((res) => {
                console.log(res, `第${currentIndex}批请求成功`);
                currentIndex++;
                if (times === currentIndex) {
                    callback();
                }
                //此处可加个定时器，模拟请求接口耗时
                //递归调用，直到 !urlsObj[currentIndex] 为止
                send();
            }).catch((err) => {
                console.log(err);
            })
    };
    send();
}
let urls = [
    'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2580986389,1527418707&fm=27&gp=0.jpg',
    'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1995874357,4132437942&fm=27&gp=0.jpg',
    'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2640393967,721831803&fm=27&gp=0.jpg',
    'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1548525155,1032715394&fm=27&gp=0.jpg',
    'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2434600655,2612296260&fm=27&gp=0.jpg',
    'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2160840192,133594931&fm=27&gp=0.jpg'
];
let max = 4;
let callback = () => {
    console.log('全部请求完成');
};
sendRequest(urls,max,callback);