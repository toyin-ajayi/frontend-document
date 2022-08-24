function limitRunTask(tasks, limit) {
  return new Promise((resolve, reject) => {
    let index = 0;
    let alive = 0;
    let finish = 0;
    let result = [];
    function trigger() {
      if (finish >= tasks.length) {
        resolve(result);
        return;
      }
      while (alive < limit  && index < tasks.length) {
        alive ++;
        const promise = tasks[index]();
        const curIndex = index;
        promise.then(value => {
          alive --;
          finish ++;
          result[curIndex] = value;
          trigger();
        });
        index ++;
      }
    }
    trigger();
  });
}