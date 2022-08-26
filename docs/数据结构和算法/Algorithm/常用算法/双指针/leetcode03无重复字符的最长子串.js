/* 给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。

示例 1:

输入: "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
示例 2:

输入: "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
示例 3:

输入: "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
 */


// 第一种是用数组模拟滑动窗口 频繁操作数组复杂度较高
/* 执行用时 : 124 ms , 在所有 JavaScript 提交中击败了 34.28% 的用户 
内存消耗 : 42.2 MB , 在所有 JavaScript 提交中击败了 14.58% 的用户 */
var lengthOfLongestSubstring = function(s) {
    if(s=='')return 0
    let len = s.length
    // 首先第一个位置的最长肯定是自身
    let max = 0
    let arr = []
    for(let i=0;i<len;i++){
        let find = arr.indexOf(s[i])
        if(find!==-1){
            arr.push(s[i])
            arr = arr.slice(find+1)// 从重复的哪项后面开始截取
        }else{
            arr.push(s[i])
        }
        max = Math.max(max,arr.length)
    }
    // 最关键的地方就是每一个坐标的计算值都在表里，取最大即可
    return max
};



// 第二种 双指针 不操作数组 效率会得到恨到的提升
/* 执行用时 : 88 ms , 在所有 JavaScript 提交中击败了 91.92% 的用户 
内存消耗 : 36.6 MB , 在所有 JavaScript 提交中击败了 98.83% 的用户 */
var lengthOfLongestSubstring2 = function(s) {
    let len = s.length
    if(len == 0) return 0;
    // 首先第一个位置的最长肯定是自身
    let max = 0
    let left = 0
    let right = 0
    for(right;right<len;right++){
        
        for(let i = left;i<right;i++){
            if(s[i]==s[right]){
                left = i+1
                break
            }
        }
        max = Math.max(max,right-left+1)

    }
    // 最关键的地方就是每一个坐标的计算值都在表里，取最大即可
    return max
};

console.log(lengthOfLongestSubstring2("acad"))



