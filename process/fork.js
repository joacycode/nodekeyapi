const cp = require('child_process');

/**
 * fork创建子进程实例
 * child_process.fork(modulePath,[args],[options])
 * @return 返回代表子对象的childProcess对象
 * @param modulePath <String> 指定需要运行的node模块文件路径以及文件名
 * @param args <Array> 顺序存放运行该模块时需要的参数  
 * @param options <Object> 开启子进程使用的选项
 * * * * * options = {
 * * * * * cwd,
 * * * * * env,
 * * * * * encoding,
 * * * * * silent <Boolean> true 父子进程不共享标准输入输出流 / false 父子进程共享标准输入输出流
 * * * * *}
 * 
 * fork_cp.send(msg, [sendHandle]) 父进程中向子进程发消息
 * process.send(msg, [sendHandle]) 子进程中向父进程发消息
 * fork_cp.on('message',(m,setHandle)=>{})
 * process.on('message',(m,setHandle)=>{})
 */
const { fork } = child_process;
let fork_cp = cp.fork(`${__dirname}/test.js`, ['one', 'two', 'three'], { slient: true });
fork_cp.on('message', m => {
    console.log(`父进程接收到消息:${m}`);
    process.exit();
});
fork_cp.send({ username: zhangsan });

/** 
 * 子进程
 * process.on('message',m=>{
 *  consolo.log(`子进程接收到消息:${m}`);
 *  process.send({age:40});
 * })
 */