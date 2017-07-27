const fs = require('fs');
const child_process = require('child_process');
/**
 * node process 方法事件属性
 * @event beforeExit 非exit代替事件 事件循环数组已空，且无事件进来
 * @event disconnet 如果进程是由IPCchannel方式创建，当IPC channel关闭时触发
 * @event exit  exit()被调用或者事件循环数组中没有额外工作 callback中只支持同步操作
 * @event message IPC channel 子进程收到父进程的消息 父进程使用child.send()发送
 * * * * callback(m,setHandle) @param m 子/父进程中收到的消息  @param setHandle send方法中的服务器对象或者sokcet端口对象
 * @event uncaughtException 进程出现未被捕捉的异常触发，可指定对所有进程的异常默认处理，避免进程异常退出
 * @event warning
 * @event signal Events 信号事件
 * * * *  SIGINT CTRL+C触发事件
 * @method abort() node进程异常中止
 * @method chdir(dir) 变更node当前的工作目录
 * @method cpuUsage([previousValue])
 * @method cwd() @return 返回node当前的工作目录
 * @method disconnect()
 * @method emitWarning(warning,[options])
 * @method exit([code]) 退出node应用程序的进程 @param code指定操作系统提供的退出代码 0表示正常退出
 * @method getegid()
 * @method geteuid()
 * @method getgid()
 * @method getuid()
 * @method getgroups()
 * @method setegid()
 * @method seteuid()
 * @method setgid()
 * @method setuid()
 * @method setgroups()
 * @method hrtime([time]) 测试一个代码段运行的时间，@param time 上次hrtime()结果 @return <Array> [seconds,nanoseconds] nanoseconds是当前时间无法使用秒的精度表示的剩余部分
 * @method initgroups(user,extra_group)
 * @method kill(pid,[signal]) 向一个进程发送信号 默认中止SIGTERM  @param pid 进程pid @param 发送的信号（SIGINT,SIGUSR1）
 * @method memoryUsage() 获取node应用程序的内存使用量 @return <Object> {rss,heapTotal,heapUsed}
 * @method nextTick(callback,[args]) callback被添加到'nextTick'队列，当事件轮询队列完成，'nextTick'队列callbacks依次被调用
 * * * * * 事件轮询随后的ticks调用，会在任何I/O事件（包括定时器）之前运行
 * * * * *
 * @method send(msg,[sendHandle],[options],[callback]) 父子进程建立IPC通道后，子进程发送消息到父进程
 * * * * * @param msg 指定需要发送的数据
 * * * * * @param sendHandle 当收到对方发送的消息后执行的回调 或者 服务器对象或者socket端口对象
 * @method umask([mask]) 读取或者修改node应用程序进程的文件权限掩码，子进程集成父进程的文件权限掩码
 * * * * * @param mask 指定修改后的文件权限掩码（0777），返回当前的码或者指定参数后返回修改前的码
 * * * * *
 * @method uptime() 返回node应用程序当前的运行时间
 * @property arch node运行环境的处理器架构字符串 ['arm','ia32','x64'] @return <String>
 * @property argv arr[0] = node可执行程序绝对路径; arr[1] = 当前js文件绝对路径 arr[..reset] 命令行其他参数 @return <Array> 
 * @property channel IPC channel的引用 不存在则为undefined
 * @property config node运行时相关的配置信息
 * @property connected Ipc channel连接时 返回ture
 * @property env 用户环境相关信息
 * @property execArgv node进程被启动时候，特定的命令行选项
 * @property execPath node可执行程序绝对路径
 * @property mainModule
 * @property pid 进程的pid @return <Number>
 * @property platform node进程运行环境的操作系统平台 @return <String>
 * @property release 
 * @property stderr 返回用于写入标准错误输出流的对象 参考fs writeStream事件方法 作为pipe目标是非阻塞 否则为阻塞 @return <Object>
 * @property stdin 返回用于读入标准输入流的对象 参考fs readStream事件方法 @return <Object> 
 * @property stdout 返回用于写入标准输出流的对象 参考fs writeStream事件方法  作为pipe目标是非阻塞 否则为阻塞 @return <Object> 
 * @property title 运行node应用程序的命令行标题
 * @property version node版本信息
 * @property versions node和其依赖的版本信息
 */
process.stdin.resume();
process.stdin.on('data', chunk => {
    process.stdout.write('接收到的数据:' + chunk);
});
const time_one = process.hrtime();
// nextTick
console.log('before next tick');
process.nextTick(() => {
    console.log('等到事件轮询结束(同步之后，异步回调、I/O之前)，依次运行nextTick队列callback,这里是callback-1');
});
console.log('after next tick1');
console.log('after next tick2');
console.log('after next tick3');
const file = fs.createReadStream('./reader.txt');
file.on('data', data => {
    console.log(`async data length:${data.length}`);
});

const maybeTrue = Math.random > 0.5;
const foo = () => {
    console.log('等到事件轮询结束(同步之后，异步回调、I/O之前)，依次运行nextTick队列callback,这里是callback-2');
};
const bar = () => {
    console.log(`sync bar running~ `);
};
const maybeSync = (arg, cb) => {
    if (arg) {
        nextTick(cb); //使用nextTick(cb)代替cb(), 避免bar(),foo()运行顺序混乱问题
        return;
    }
    fs.stat('file', cb);
}
maybeSync(maybeTrue, () => {
    foo();
});
bar();

// uncaughtException
process.on("uncaughtException", err => {
    console.log(`未被处理的异常${err}`);
});
const time_two = process.hrtime(time_one);
console.log(`hrtime one took ${time_one[0]*1e9 + time_one[1]} nanoseconds`);
console.log(`hrtime two took ${time_two[0]*1e9 + time_two[1]} nanoseconds`);


/**
 * node child_process类
 * @event close 子进程的所有stdio流被关闭时触发 callback(code,singal)
 * @event disconnect 父进程：child.disconnect() 子进程：process.disconnect()后触发此事件
 * @event error 错误事件 1.进程无法被衍生 2.进程无法被杀死 3.向子进程发送信息失败
 * @event exit 子进程结束后会触发‘exit’事件，未必触发close, callback(code,singal)
 * @event message 父进程收到子进程的消息 子进程使用process.send()发送
 * 
 * @method disconnect() 关闭父进程与子进程之间的 IPC 通道
 * @method kill() 向子进程发送信号 默认中止进程
 * @method send(msg,[sendHandle],[options],[callback]) 父子进程建立IPC通道后，父进程发送消息到子进程
 * 
 * @property channel @return <Object> 代表子进程的IPC通道的管道
 * @property connected @return <boolean> 调用 child.disconnect()后会被设为false
 * @property pid @return <number> 返回子进程的进程标识（PID）
 * @property stderr 一个代表子进程的 stderr 的可读流
 * @property stdin 一个代表子进程的 stdin 的可写流
 * @property stdout 一个代表子进程的 stdout 的可读流
 * @property stdio
 */



/**
 * execFile创建子进程实例
 */



/**
 * 子进程中运行node应用 fork方法创建worker对象
 */