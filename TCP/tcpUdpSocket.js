const net = require('net');
const fs = require('fs');
/*
 * TCP服务端
 * net.createServer([options],[connectionListener])
 * @params connectionListener(socket) server与client建立连接时所要调用的回调函数 
 * 参数socket为监听的socket端口对象
 * 方法返回创建的TCP服务器
 * 
 * @event connection 当一个新的connection建立触发
 * @event listening 当服务被绑定后调用server.listen()
 * @event close server关闭后以及所有connection结束触发
 * @event error 错误出现时触发
 * 
 * @method address() listening事件触发后，在IPsocket上监听返回ip地址、端口、地址协议
 * @method getConnections(callback) 获取当前的connections,callback(err,count)
 * @method close(callback) 停止server接受建立新的connections并保持已经存在的connections
 * @method listen(port,[host],[backlog],[callback]) TCP server 监听的端口号(默认随机)、IP地址主机名(默认任意)、指定最大客户端连接数量(默认511)、回调
 * @method listen(options,[callback]) TCP server options = {port,host,path,backlog,exclusive}
 * @method listen(path,[callback]) unix server
 * @method listen(handle,[callback]) TCP server
 * 
 * @property listening [boolean] server是否正在监听连接
 * @property maxConnections 设置该属性使得当 server 连接数过多时拒绝连接
 */
{
    // const port = 8081;
    // const hostname = "127.0.0.1";
    // const server = net.createServer(socket => {
    //     const saddr = socket.address();
    //     const maxConnects = 2;
    //     // 回调代码
    //     console.log("服务器与客户端连接已建立");
    //     server.getConnections((err, count) => {
    //         if (err) throw err;
    //         console.log("当前存在%d个客户端连接", count);
    //         server.maxConnections = maxConnects;
    //         console.log("TCP服务器最大的连接数为%d", server.maxConnections);
    //         if (count === maxConnects) {
    //             server.close(() => {
    //                 console.log("TCP服务被关闭");
    //             });
    //         }
    //     });

    // });
    // server.on("error", err => {
    //     if (err.code === "EADDRINUSE") {
    //         console.log(port + "端口已被占用");
    //     }
    // });
    // server.listen(port, hostname, () => {
    //     // TCP server
    //     const address = server.address(); //{ address: '127.0.0.1', family: 'IPv4', port: 8081 }
    //     console.log("正在监听" + hostname + ":" + port);
    //     console.log(address);
    // });
}

/*
 * socket端口对象
 * TCP客户端用于建立连接的socket端口对象、TCP服务器用于监听客户端连接的socket端口对象
 * @event close
 * @event connect
 * @event data 监听socket端口对象接受到客户端发送的数据时触发 callback(data)
 * @event drain
 * * * *  A.网络较快数据量较少，node总是将数据发送到操作系统专用于发送数据的TCP缓存区中，从缓存区取数据发送
 * * * *  B.网络较慢数据量较大，node将这些数据缓存在缓存队列，再通过TCP缓存区发送
 * * * *  socket.write()返回布尔值 当使用A方式返回true，当使用B方式返回false
 * * * *  当返回false，且TCP缓存区数据全部发送出去，触发drain事件
 * 
 * @event end 当客户端连接被关闭触发 callback()
 * @event error
 * @event lookup
 * 
 * @method address()
 * @method connect(port,[host],[connectListener]) TCP客户端连接TCP服务端
 * @method end([data],[encoding])
 * @method destory([exception])
 * @method pause() 暂停data事件的触发
 * @method resume() 恢复data事件的触发
 * @method setEncoding() 设置编码方式
 * @method setKeppAlive()
 * @method setNoDelay()
 * @method setTimeout(timeout,[callback]) 指定与该端口客户端相连接的超时时间
 * @method wirte(data,[encoding],callback) 写入向client或者server发送的流数据
 * @method ref()
 * @method uref()
 * @method pipe(destination,[options]) 将客户端发送的数据书写到文件等其他的目标中
 * * * * * @params destination 可用于写入流数据的对象
 * * * * * @params options [Object] {end:[Boolean]} 当全部数据读取完毕时立即结束写操作 默认true
 * @method unpipe(destination) 取消对目标文件的写操作
 * 
 * @property bufferSize 查看缓存队列中当前的缓存字符数
 * @property bytesRead socket端口对象接收到的客户端发送的数据字节数
 * @property bytesWritten
 * @property connecting [Boolean]
 * @property destoryed [Boolean]
 * @property localAddress 本地用于建立连接的地址
 * @property localPort 本地用于建立连接的端口号
 * @property remoteAddress 连接的另一端所使用的远程地址
 * @property remotePort 连接的另一端所使用的端口号
 * @property remoteFamily
 */
{
    const port = 8088;
    const hostname = "127.0.0.1";
    const file = fs.createWriteStream("./message.txt");
    const server = net.createServer(socket => {
        const addr = socket.address();
        console.log(addr);
        socket.setEncoding("utf8");
        socket.pause();
        socket.pipe(file);
        setTimeout(() => {
            file.end("服务端：写完了");
            socket.unpipe(file);
            socket.resume();
        }, 5000);
        socket.setTimeout(1000 * 50, () => {
            console.log("连接超时");
        });
        socket.on("data", data => {
            console.log(`服务端：接收的数据为(${data})`);
            console.log("服务端：已接收到%d字节的数据", socket.bytesRead);
        });
        socket.on("end", data => {
            console.log("服务端：客户端连接被关闭");
        });
    });
    server.listen(port, hostname, () => {
        // TCP server
        console.log("服务端：正在监听" + hostname + ":" + port);
    });
}

/*
 * TCP客户端
 * new net.Socket([options])
 * options @params fd 指定一个现存的socket文件描述符 客户端将这个socket端口与服务器连接
 * options @params type 客户端所使用的协议 ["tcp4","tcp6","unix"]
 * options @params allowHalfOpen
 */
const client = new net.Socket();
client.setEncoding("utf8");
client.connect(8088, "127.0.0.1", () => {
    console.log("客户端：已连接服务器");
    client.write("这个数据发送给服务器接收~");
});
client.on("data", data => {
    console.log(`客户端：已接收服务端发送的数据${data}`);
});

/*
 * TCP客户端、TCP服务端通信
 */



/*
 * UDP服务端
 */

/*
 * UDP客户端
 */

/*
 * UDP客户端、UDP服务端数据通信
 */