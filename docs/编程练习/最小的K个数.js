function GetLeastNumbers_Solution(input, k)
{
    input.sort()// 应该会要求手写快排。。。那还不如搞个最小堆
    return input.slice(0,k)
}

console.log(GetLeastNumbers_Solution([1,2,24,15,124,15,23],4))