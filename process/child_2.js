const fs = require('fs');
const out = fs.createWriteStream('./reader.txt');
process.stdin.on('data', data => {
    out.write(data);
    process.exit(); // exec
});
// sapwn
// process.stdin.on('end', data => {
//     process.exit();
// });