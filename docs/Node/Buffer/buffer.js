const fs = require('fs')
const path = require('path')
const mimeType = require('mime-types') // 文件类型

const filePath = path.resolve('./01.png')
const data = fs.readFileSync(filePath)
const buffer = new Buffer(data).toString('base64')
const base64 = `data:${mimeType.lookup(filePath)};base64,${buffer}`
console.log(base64)

