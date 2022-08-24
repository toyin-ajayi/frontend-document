const { Readable } = require('stream');  

const inStream = new Readable();

inStream.push('ABCDEFGHIJKLM');
inStream.push('NOPQRSTUVWXYZ');

inStream.push(null); // 没有更多数据了

inStream.pipe(process.stdout);


/* Readable.pause(): 这个方法会暂停流的流动。换句话说就是它不会再触发 data 事件。
Readable.resume(): 这个方法和上面的相反，会让暂停流恢复流动。
Readable.unpipe(): 这个方法会把目的地移除。如果有参数传入，它会让可读流停止流向某个特定的目的地，否则，它会移除所有目的地。 */

