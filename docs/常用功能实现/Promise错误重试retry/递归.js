Promise.retry = function (fn, times) {
  fn()
    .then(console.log)
    .catch((e) => {
      if (times > 0) {
        console.log("try again...");
        Promise.retry(fn, times - 1);
      } else {
        console.log("Error: No more times, now rejected.");
      }
    });
};
