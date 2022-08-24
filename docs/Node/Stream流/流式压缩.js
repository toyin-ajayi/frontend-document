/* const fs = require('fs');
const zlib = require('zlib');
fs.readFile('./big.file', (err, buffer) => {
  zlib.gzip(buffer, (err, buffer) => {
    fs.writeFile('big' + '.gz', buffer, err => {
      console.log('File successfully compressed');
    });
  });
});
 */
const fs = require('fs');
const zlib = require('zlib');
const file = './big.file';
fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream(file + '.gz'))
  .on('finish', () => console.log('File successfully compressed'));

