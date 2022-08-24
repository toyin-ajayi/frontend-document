Promise.retry = function (fn, num) {
    return new Promise(async function (resolve, reject) {
      while (num > 0) {
        try {
          const res = await fn();
          resolve(res);
          num = 0;
        } catch (e) {
          if (!num) reject(e);
        }
        num--;
      }
    });
  };
  