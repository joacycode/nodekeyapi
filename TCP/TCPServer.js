const net = require('net');
const fs = require('fs');
/**
 * net 类方法
 * isIP() 
 * @param [String] 
 * @return [Number] 非字符串0 ipv4 4 ipv6 6
 * 
 * isIPv4()
 * isIPv6()
 */

/**
 * TCP服务器对象
 * net.createServer([options],[connectionListener])
 * @param connectionListener(socket) server与client建立连接时所要调用的回调函数 
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
 * @method ref()  阻止应用程序退出
 * @method uref() 默认TCP服务应用不会自动退出 指定当客户端连接全部关闭时退出应用
 * @method listen(port,[host],[backlog],[callback]) TCP server 监听的端口号(默认随机)、IP地址主机名(默认任意)、指定最大客户端连接数量(默认511)、回调
 * @method listen(options,[callback]) TCP server options = {port,host,path,backlog,exclusive}
 * @method listen(path,[callback]) unix server
 * @method listen(handle,[callback]) TCP server
 * 
 * @property listening [boolean] server是否正在监听连接
 * @property maxConnections 设置该属性使得当 server 连接数过多时拒绝连接
 */

/**
 * socket端口对象
 * TCP客户端用于建立连接的socket端口对象、TCP服务器用于监听客户端连接的socket端口对象
 * 
 * @event close socket端口彻底关闭时触发 
 * * * *  callback(had_error) @param had_error [Boolean] 错误引起的关闭为true 正常关闭为false
 * * * *
 * @event connect
 * @event data 监听socket端口对象接受到客户端发送的数据时触发 callback(data)
 * @event drain
 * * * *  A.网络较快数据量较少，node总是将数据发送到操作系统专用于发送数据的TCP缓存区中，从缓存区取数据发送
 * * * *  B.网络较慢数据量较大，node将这些数据缓存在缓存队列，再通过TCP缓存区发送
 * * * *  socket.write()返回布尔值 当使用A方式返回true，当使用B方式返回false
 * * * *  当返回false，且TCP缓存区数据全部发送出去，触发drain事件
 * * * *
 * @event end 当客户端连接被关闭触发 callback()
 * @event error TCP服务于客户建立连接发生错误或通信过程中发生错误
 * @event lookup
 * @event timeout 超时事件
 * 
 * @method address()
 * @method connect(port,[host],[connectListener]) TCP客户端连接TCP服务端
 * @method end([data],[encoding]) 关闭于服务端或者客户端的连接 data:追加发送的数据 encoding：编码方式
 * @method destory([exception]) 发生错误后,调用此方法销毁该socket对象
 * @method pause() 暂停data事件的触发
 * @method resume() 恢复data事件的触发
 * @method setEncoding() 设置编码方式
 * @method setKeppAlive([enable],[initialDelay]) 一端意外来不及发送FIN包 则另一端永远处于连接状态
 * * * * * @param enable 默认flase 设置true的一方会不间断发送探测包，检测对方有没有意外关闭连接（断电重启崩溃），采取对方已关闭连接的操作。 
 * * * * * @param initialDelay 发送探测包的间隔 毫秒
 * * * * * 
 * @method setNoDelay()
 * @method setTimeout(timeout,[callback]) 指定与该端口客户端相连接的超时时间
 * @method wirte(data,[encoding],callback) 写入向client或者server发送的流数据 
 * * * * * @return [Boolean] true所有数据通过TCP缓存区发送成功，false会缓存到缓存队列再通过TCP缓存发送，全部发送触发drain
 * * * * *
 * @method ref() 
 * @method uref() 
 * @method pipe(destination,[options]) 将客户端发送的数据书写到文件等其他的目标中
 * * * * * @param destination 可用于写入流数据的对象
 * * * * * @param options [Object] {end:[Boolean]} 当全部数据读取完毕时立即结束写操作 默认true
 * @method unpipe(destination) 取消对目标文件的写操作
 * 
 * @property bufferSize 查看缓存队列中当前的缓存字符数
 * @property bytesRead socket端口对象接收到的客户端发送的数据字节数
 * @property bytesWritten 从socket端口向TCP客户端或者服务器已发送的字节数
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
    const writeStream = fs.createWriteStream("./message.txt");
    const readStream = fs.createReadStream("./sendtoClient.txt");
    const server = net.createServer(socket => {
        const maxConnects = 2;
        const addr = socket.address();
        console.log(addr);
        socket.setEncoding("utf8");
        socket.pause();
        socket.pipe(writeStream);
        socket.setKeepAlive(true);
        setTimeout(() => {
            writeStream.end("服务端：写完了");
            socket.unpipe(writeStream);
            socket.resume();
        }, 5000);
        socket.setTimeout(1000 * 50, () => {
            console.log("连接超时");
        });
        socket.end("关闭与客户端连接", "utf8");
        readStream.on("data", data => {
            const flag = socket.write(data);
            console.log(`socket write方法返回值${flag}`);
            console.log(`缓存队列缓存的字符为${socket.bufferSize}`);
        });
        socket.on("data", data => {
            console.log(`服务端：接收的数据为(${data})`);
            console.log("服务端：已接收到%d字节的数据", socket.bytesRead);
        });
        socket.on("end", () => {
            console.log("服务端：客户端连接被关闭");
            server.unref(); //客户端连接关闭 手动关闭服务端应用
        });
        socket.on("error", err => {
            console.log(`服务端：TCP连接客户端发生错误，错误编码${err.code}`);
            socket.destroy();
        });
        socket.on("close", had_error => {
            if (had_error) {
                console.log(`服务端：socket端口连接关闭（错误引发）`);
            } else {
                console.log(`服务端：socket端口连接关闭（正常关闭）`);
            }
        });
        socket.on("drain", () => {
            console.log("TCP缓存区中数据已全部发送");
        });
        server.getConnections((err, count) => {
            if (err) throw err;
            console.log("当前存在%d个客户端连接", count);
            server.maxConnections = maxConnects; //最大客户端连接数
            console.log("TCP服务器最大的连接数为%d", server.maxConnections);
            if (count === maxConnects) {
                // server.on("close",()=>{})
                server.close(() => {
                    console.log("TCP服务被关闭");
                });
            }
        });
    });
    server.on("error", err => {
        if (err.code === "EADDRINUSE") {
            console.log(port + "端口已被占用");
        } else {
            console.log(`TCP服务错误码:${err.code}`);
        }
    });
    server.listen(port, hostname, () => {
        // TCP server
        const address = server.address(); //{ address: '127.0.0.1', family: 'IPv4', port: 8081 }
        console.log("服务端：正在监听" + hostname + ":" + port);
        console.log(address);
    });
}