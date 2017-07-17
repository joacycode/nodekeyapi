const fs = require('fs');
/*
 * 打开文件-读取
 */
// fs.open('./readfile.txt', 'r', (err, fd) => {
//     if (err) {
//         console.log('发生错误: ' + err);
//     } else {
//         let buff = Buffer.allocUnsafe(255);
//         // fs.read() @params(文件描述，指定读入的缓存，写入缓存开始位置，写入长度，读取文件开始位置,回调函数)
//         // callback() @params(错误对象，实际长度，被读取缓存的对象)
//         fs.read(fd, buff, 0, 28, 0, (err, bytesRead, buffer) => {
//             let newBuff = buffer.slice(0, bytesRead).toString();
//             console.log(bytesRead, newBuff);
//         });
//     }
// });

/*
 * 打开文件-写入'w'、追加'a'
 */
// fs.open('./writefile.txt', 'a', (err, fd) => {
//     if (err) {
//         console.log('发生错误: ' + err);
//     } else {
//         let buff = Buffer.from('打开后写入：nodeJs博大精深~\r\n');
//         // fs.write() @params(文件描述，指定读出的缓存，读取缓存开始位置，读取长度|null默认长度，写入文件开始位置|null上次位置,回调函数)
//         // callback() @params(错误对象，实际长度，被读取缓存的对象)
//         fs.write(fd, buff, 0, null, null, (err, written, buffer) => {
//             if (err) console.log("写文件失败");
//             console.log("写文件成功", written, buffer);
//             fs.fsync(fd, err => { if (err) console.log("fsync错误：" + err) });
//             fs.close(fd, err => { if (err) console.log("close错误：" + err) });
//         });
//     }
// });

/*
 * 读、写文件
 */
// const buff = Buffer.from('nodejs博大精深');
// const addStr = Buffer.from('\r\n这是追加的内容@#$%');
// let options = {
//     flag: 'a+',
//     encoding: 'utf8',
//     mode: '0666'
// };

// fs.readFile('./readfile.txt', 'utf8', (err, data) => {
//     if (err) {
//         console.log('发生错误: ' + err);
//     } else {
//         console.log('开始读取内容: ' + data);
//     }
// });

// fs.writeFile('./writefile.txt', addStr, options, function(err) {
//     if (err) {
//         console.log('发生错误: ' + err);
//     } else {
//         console.log('写文件成功');
//     }
// });

/*
 * 图片文件读写
 */
// fs.readFile('./sample.png','base64',(err,data)=>{
// 	if (err){
// 		console.log('读文件发生错误: '+err);
// 	} else {
// 		fs.writeFile('./copy.jpg',data.toString(),'base64',(err)=>{
// 			if(err){
// 				console.log('写文件发生错误: '+err);
// 			} else {
// 				console.log('写文件成功');
// 			}
// 		});
// 	}
// });

/*
 * 创建读取目录
 * fs.mkdir(path,[mode],callback) callback @params(错误对象)
 * fs.readdir(path,callback) callback @params(错误对象, 所有文件名)
 */
fs.mkdir("./test/childfile", err => {
    if (err) console.log(err);
    console.log("创建目录成功");
});
fs.readdir("./", (err, files) => {
    if (err) console.log(err);
    console.log(files);
});

/*
 * 查看文件目录信息
 * fs.stat(path,callback) & fs.lstat(path,callback) 
 * callback @params(错误对象, fs.Stats对象)
 * fs.Stats对象 
 * @methods isFile() 是否是文件
 * @methods isDirectory() 是否是目录
 * @methods isSymbolicLink() 是否是符号链接
 * @property mode 数字形式权限表示
 * @property nlink 硬链接数量
 * @property size 文件大小
 * @property atime 访问时间
 * @property mtime 修改时间
 * @property ctime 创建时间
 */
fs.stat("./test", (err, stats) => {
    if (!err) console.log(stats);
});

/*
 * 检查文件目录是否存在
 */
fs.exists("./message", exists => {
    console.log(exists);
})

/*
 * 获取文件目录绝对路径
 * fs.realpath(path,[cache],callback)
 * @params path 要查看文件目录的完整路径
 * @params cache 预先指定的路径
 * callback @params err错误对象
 * callback @params resolvePath文件或者目录的绝对路径
 */
fs.realpath("./test/childfile", (err, resolvePath) => {
    if (err) throw err;
    console.log(resolvePath);
});

/*
 * 修改文件目录访问修改时间
 * fs.utimes(path,atime,mtime,callback)
 * fs.futimes(fd,atime,mtime,callback)
 * @params atime 指定修改后的访问时间
 * @params mtime 指定修改后的修改时间
 * @params fd 使用open方法打开后返回的文件描述
 */
fs.utimes("./test/childfile", new Date(), new Date(), err => {
    if (err) throw err;
    console.log("修改文件时间成功~");
});

/*
 * 修改文件目录的访问权限
 * fs.chmod(path,mode,callback)
 * fs.chmod(fd,mode,callback)
 * @params mode 数字形式的权限表示法
 * @params fd 使用open方法打开后返回的文件描述
 * callback @params err 错误对象
 * 0+ r=4 w=2 x=1 
 * user group other
 */
fs.chmod("./test", 0740, err => {
    if (err) throw err;
    console.log("文件权限修改成功!");
})

/*
 * 移动文件、目录
 * fs.rename(oldpath,newpath,callback)
 * callback @params err 错误对象
 */
fs.rename("./readfile.txt", "./test/childfile/newfile.txt", err => {
    if (err) throw new Error("移动失败" + err);
    console.log("移动文件成功");
})

/*
 * 创建删除文件硬链接
 */


/*
 * 创建查看符号链接
 * 
 */


/*
 * 截断文件
 */


/*
 * 删除空目录
 *  
 */


/*
 * 监视文件、目录
 */


/*
 * 文件流
 */


/*
 * 路径的操作
 */