let count = 0;
let rafId = null;
/**
 * 回调函数
 * @param time requestAnimationFrame 调用该函数时，自动传入的一个时间
 */
function requestAnimation(time) {
  console.log(time);
  // 动画没有执行完，则递归渲染
  if (count < 50) {
    count++;
    // 渲染下一帧
    rafId = requestAnimationFrame(requestAnimation);
  }
}
// 渲染第一帧
requestAnimationFrame(requestAnimation);