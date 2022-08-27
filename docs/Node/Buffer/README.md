## Buffer（缓冲器）

Buffer 类的实例类似于从 0 到 255 之间的整数数组（其他整数会通过 ＆ 255 操作强制转换到此范围），但对应于 V8 堆外部的固定大小的原始内存分配。 Buffer 的大小在创建时确定，且无法更改。

Buffer 类在全局作用域中，因此无需使用 require('buffer').Buffer。

```tsx
// 创建一个长度为 10、且用零填充的 Buffer。
const buf1 = Buffer.alloc(10);

// 创建一个长度为 10、且用 0x1 填充的 Buffer。 
const buf2 = Buffer.alloc(10, 1);

// 创建一个长度为 10、且未初始化的 Buffer。
// 这个方法比调用 Buffer.alloc() 更快，
// 但返回的 Buffer 实例可能包含旧数据，
// 因此需要使用 fill() 或 write() 重写。
const buf3 = Buffer.allocUnsafe(10);

// 创建一个包含 [0x1, 0x2, 0x3] 的 Buffer。
const buf4 = Buffer.from([1, 2, 3]);

// 创建一个包含 UTF-8 字节 [0x74, 0xc3, 0xa9, 0x73, 0x74] 的 Buffer。
const buf5 = Buffer.from('tést');

// 创建一个包含 Latin-1 字节 [0x74, 0xe9, 0x73, 0x74] 的 Buffer。
const buf6 = Buffer.from('tést', 'latin1');
```

每当需要在 Node.js 中处理I/O操作中移动的数据时，就有可能使用 Buffer 库。原始数据存储在 Buffer 类的实例中。一个 Buffer 类似于一个整数数组，但它对应于 V8 堆内存之外的一块原始内存。

Buffer编码：utf-8 是默认的编码方式，此外它同样支持以下编码："ascii", "utf8", "utf16le", "ucs2", "base64" 和 "hex"


## linux 操作系统中buffer 和 cache 的作用

Buffer 和 cache （它们都是占用内存）。

Buffer 缓冲区:  是块设备的读写缓冲区，buffer 是I/O 缓存，用于内存和硬盘（或其他 I/O设备）之间的数据交换的速度而设计的。buffer的数据则不是始终有效，而是实时生成的数据流，每当buffer满或者主动flush buffer的时候触发一次读取，对于小数据，这样可以减少读取次数，对于大数据，这可以控制单次读取的数据量。换句话说，无论数据量大还是小，单次读取数据量都按照buffer尺寸进行归一化了。


分析：

1、通常在写一个非常大的文件，文件会被分成一个个的小 block块-->一直往内存上写-->然后再写入磁盘,,  这个文件非常的大，但是会被分成一个个小的block块，每次都一点一点的-->写入内存-->再写入磁盘,  这样的效率较慢 。

2、 这种情况下，内存就会攒足一次大的block块-->再写入磁盘，这样的话就不会有第一种情况里的延迟。 这就是buffer.

 

 Cache高速缓存 ：cache是高速缓存，用于cpu与内存之间的缓冲。主要原因是cpu与memory,由于cpu快，memory跟不上，且有些值使用次数多，所以放入cache中，主要目的是，使用内存来缓存可能被再次访问的数据。  Cache 经常被使用在I/O 请求上。为提高系统性能。

 ## 总结

 cache 是为了弥补高速设备和低速设备的鸿沟而引入的中间层，最终起到**加快访问速度**的作用。而 buffer 的主要目的进行流量整形，把突发的大数量较小规模的 I/O 整理成平稳的小数量较大规模的 I/O，以**减少响应次数**（比如从网上下电影，你不能下一点点数据就写一下硬盘，而是积攒一定量的数据以后一整块一起写，不然硬盘都要被你玩坏了）。
