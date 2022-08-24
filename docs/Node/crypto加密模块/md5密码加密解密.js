const crypto = require('crypto')

// 加密用的密钥 越复杂越不容易破解
const CRYPTO_SECRET_KEY = '123QWE!@#'

function _md5(content) {
    const str = `password=${content}&key=${CRYPTO_SECRET_KEY}`
    const md5 = crypto.createHash('md5')
    // hex 代表生成的是 16 进制
    return md5.update(str).digest('hex')
}


console.log(_md5('12345678'))
