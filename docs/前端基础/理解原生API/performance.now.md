## performance.now()

获取当前的微秒数，比Date.now()更精确，微秒是毫秒的1000倍。Date.now() 输出的是 UNIX 时间，即距离 1970 的时间，而 performance.now() 输出的是相对于 performance.timing.navigationStart(页面初始化) 的时间。


是相对于网页加载的，并且在数量级上更为精确。 适用于包括基准测试和其他需要高分辨率时间的情况，例如媒体

参考 - https://stackoverflow.com/questions/30795525/performance-now-vs-date-now