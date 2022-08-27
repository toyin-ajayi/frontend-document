## crypto

crypto 模块提供了加密功能，包括对 OpenSSL 的哈希、HMAC、加密、解密、签名、以及验证功能的一整套封装。

## MD5 加密

MD5信息摘要算法（英语：MD5 Message-Digest Algorithm），一种被广泛使用的密码散列函数，可以产生出一个128位（16字节）的散列值（hash value）

 MD5不可逆的原因是由于它是一种散列函数（也叫哈希函数，哈希函数又称散列函数，杂凑函数，他是一个单向密码体制，即从明文到密文的不可逆映射，只有加密过程没有解密过程，哈希函数可以将任意长度的输入经过变化后得到固定长度的输出，这个固定长度的输出称为原消息的散列或消息映射。 理想的哈希函数可以针对不同的输入得到不同的输出，如果存在两个不同的消息得到了相同的哈希值，那我们称这是一个碰撞），使用的是hash算法，在计算过程中原文的部分信息是丢失了的。一个MD5理论上是可以对应多个原文的，因为MD5是有限多个而原文是无限多个的。
```tsx
const md5 = crypto.createHash('md5')
res = md5.update(str).digest('hex')
```

### hash.update(data[, inputEncoding])

使用给定的 data 更新哈希的内容，该数据的字符编码在 inputEncoding 中给出。 如果未提供 encoding，并且 data 是字符串，则强制执行 'utf8' 的编码。 如果 data 是一个 Buffer、 TypedArray 或 DataView，则 inputEncoding 会被忽略。

在流式传输时，可以使用新数据多次调用此方法。


### hash.digest([encoding])

计算传入要被哈希（使用 hash.update() 方法）的所有数据的摘要。 如果提供了 encoding，则返回字符串，否则返回 Buffer。

调用 hash.digest() 方法之后， Hash 对象不能被再次使用。 多次调用将会导致抛出错误。
