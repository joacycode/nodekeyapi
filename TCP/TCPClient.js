const net = require('net');
/*
 * TCP客户端对象
 * new net.Socket([options])
 * options @params fd 指定一个现存的socket文件描述符 客户端将这个socket端口与服务器连接
 * options @params type 客户端所使用的协议 ["tcp4","tcp6","unix"]
 * options @params allowHalfOpen
 * 
 * 返回对象 @method @property @event参考socket端口对象
 */
{
    const client = new net.Socket();
    client.setEncoding("utf8");
    client.connect(8088, "127.0.0.1", () => {
        console.log("客户端：已连接服务器");
        client.write("这个数据发送给服务器接收~");
        setTimeout(() => {
            client.end("关闭与服务端连接", "utf8"); //防止立即关闭与服务端连接
        }, 10000);
        client.on("data", data => {
            console.log(`客户端：已接收服务端发送的数据${data}`);
        });
        client.on("error", err => {
            console.log(`客户端：TCP连接服务发生错误，错误编码${err.code}`);
            client.destroy();
        });
        client.on("end", () => {
            console.log("客户端：服务端连接被关闭");
        });
    });
}