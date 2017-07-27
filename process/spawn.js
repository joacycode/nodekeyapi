const cp = require('child_process');

/**
 * 创建多线程应用程序
 * 
 * spawn创建子进程实例 异步方法
 * child_process.spawn(command,[args],[options])
 * @return childProcess对象
 * @param command <String> 需要运行的命令
 * @param args <Array> 顺序存放运行该命令时候需要的参数
 * @param options <Object> 指定开启子进程使用的选项
 * * * * * options = {
 * * * * * cwd,子进程当前的工作目录 默认设置值undefined
 * * * * * env,环境变量键值对 默认设置值process.env
 * * * * * datached,设置为true 则子进程独立于父进程存在
 * * * * * uid,设置该进程用户标识
 * * * * * gid,设置该进程组标识
 * * * * * shell,
 * * * * * stdio,<String,Array[arr1,arr2,arr3]> 配置父子进程建立的通道
 *  * * * *  * * * * 数组三个元素对应指定stdin、stdout、stderr文件描述符
 *  * * * *  * * * * @value pipe 创建一个父子进程的管道，管道的父端以child.stdio[fd]形式作为child_process对象属性暴露给父进程 fd 0,1,2分别对应stdin stdout stderr
 *  * * * *  * * * * @value ipc 创建一个父子进程之间传递消息或者文件描述通道，一个子进程最多拥有一个文件描述符，子进程拥有send()方法
 *  * * * *  * * * * @value ignore 不为子进程设置文件描述符，子进程fd将被设置为/dev/null空设备文件
 *  * * * *  * * * * @value Stream对象
 *  * * * *  * * * * @value null undefined
 * * * * * }
 *  
 */
let sp1 = cp.spawn('node', ['child_1.js', 'one', 'two', 'three'], { cwd: './test', stdio: ['ipc', 'pipe', 'ignore'] });
let sp2 = cp.spawn('node', ['child_2.js'], { stdio: 'pipe' });

sp1.stdout.on('data', data => {
    console.log(`子进程标准输出: ${data}`);
    sp2.stdin.write(data);
    sp1.kill();
});
sp1.on('exit', (code, signal) => {
    if (!!code) {
        console.log(`子进程非正常退出，退出信息号${signal}退出代码${code}`);
    } else {
        console.log(`子进程退出，退出代码${code}退出信息号${signal}`);
    }
    process.exit();
});
sp1.on('error', err => {
    console.log(`子进程开启失败: ${err}`);
    process.exit();
});
sp1.on('disconnect', () => {
    console.log(`IPC通道关闭`);
});