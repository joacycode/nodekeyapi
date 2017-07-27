const cp = require('child_process');

/**
 * exec创建子进程实例 同步方法
 * child_process.exec(command,[options],[callback])
 * @return 代表子进程的childProcess对象
 * @param command <String> 运行的命令完整的
 * @param callback(error,stdout,stderr) 指定子进程中止时使用的回调函数
 * * * * * @param error 子进程异常中止抛出的对象 {code，signal}
 * * * * * @param stdout 缓存了子进程标准输出数据的缓存区对象
 * * * * * @param stderr 缓存了子进程标准输出错误数据的缓存区对象
 * 
 * @param options <Object> 指定开启子进程时候使用的选项
 * * * * * options = {
 * * * * * cwd 子进程当前工作目录
 * * * * * env 键值对为子进程指定环境变量 默认不指定为空
 * * * * * encoding 指定标准输出以及标准错误输出的编码格式 默认utf8
 * * * * * timeout 指定子进程的超时时间，当子进程裕兴时间超过设置值，node使用killSingal的信号强制关闭该进程 默认0不限时
 * * * * * maxBuffer 指定用于缓存标准输出和标准错误输出的缓存区最大长度 超过设置值子进程将被强制关闭 默认200*1024
 * * * * * killSignal 指定关闭子进程的信号 默认'SIGTERM'
 * * * * * }
 */

let sp1 = cp.exec('node child_1.js one two three', { cwd: './test' }, (err, stdout, stderr) => {
    if (err) {
        console.log(`子进程开启失败${err}`);
        process.exit();
    } else {
        console.log(`子进程标准输出: ${stdout.toString()}`);
        sp2.stdin.write(stdout.toString());
    }
});
let sp2 = cp.exec('node child_2.js', (err, stdout, stderr) => {
    process.exit();
});