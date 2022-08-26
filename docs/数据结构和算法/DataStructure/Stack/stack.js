
/**
 * @description 栈：先进后出 实现了颠倒
 * @date 2020-01-31
 * @class Stack
 */
class Stack {
    constructor(...items) {
        console.log(items)
        this.reverse = false;
        this.stack = [...items];
    }

    // 颠倒原理就是本来从栈顶进出，现在从栈底进出，逻辑上栈就被翻转了
    push(...items) {
        return this.reverse
            ? this.stack.unshift(...items)
            : this.stack.push(...items);
    }
    
    pop() {
        return this.reverse ? this.stack.shift() : this.stack.pop();
    }
}

const stack = new Stack(4, 5);
stack.reverse = true;
console.log(stack.push(1, 2, 3) === 5) // true
console.log(stack.stack ===[1, 2, 3, 4, 5]) // true
