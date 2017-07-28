const http = require('http');

/**
 * ClientRequest对象 HTTP客户端 可写流
 * 
 * 创建方式
 * http.request(options,[callback]) 向其他网站发送请求数据
 * @param options <Object|String|URL> 指定请求的目标地址以及相关配置
 * * * * * options <Object> = { protocol,host,hostname,family,port,localAdrress,socketPath,method,path,headers,auth,agent,timeout,createConnection }
 * @param callback(response) > @param response http.IncomingMessage对象,利用该对象读取响应流数据
 * @return 返回ClientRequest类实例,代表一个客户端请求,可写流
 * 
 * 事件方法属性
 * @event abort 首次调用abort(),请求被客户端中止触发
 * @event aborted 请求被服务器中止,且网络socket已被关闭
 * @event connect 服务器响应connect请求时触发
 * * * *  callback(req,socket,head)
 * * * *  @param req <http.IncomingMessage>
 * * * *  @param socket <net.socket>
 * * * *  @param head <buffer>
 * @event continue
 * @event error 在向目标网站请求数据过程中发生错误
 * @event response 当请求的响应被接收到时触发，只触发一次
 * @event socket 建立连接分配端口时候触发 callback(socket) @param socket 用于分配的socket端口对象
 * @event upgrade 服务器响应upgrade请求时触发
 * * * *  callback(req,socket,head)
 * * * *  @param req <http.IncomingMessage>
 * * * *  @param socket <net.socket>
 * * * *  @param head <buffer>
 * @method abort() 标记请求中止，剩余相应数据被丢弃且销毁socket
 * @method end([[data],[encoding]],[callback]) 结束本次发送请求
 * @method flushHeaders() 刷新请求头
 * @method setNoDelay([noDelay]) 见socket.setNoDelay() 默认true
 * @method setSocketKeepAlive([enable],[initialDelay]) 见socket.setKeepAlive() 默认flase
 * @method setTimeout(timeout,[callback]) 见socket.setTimeout()
 * @method write(chunk,[encoding],[callback])发送请求主题的一个数据块
 * @property aborted 如果请求被终止 打印被中止的时间距1970 00:00:00毫秒数
 */

const options = {
    hostname: '127.0.0.1',
    port: 8888,
    path: '/',
    method: 'POST'
};
const req = http.request(options, (res) => {
    console.log(`状态码:${res.statusCode}\r\n`);
    console.log(`响应头:${JSON.stringify(res.headers)}\r\n`);
    res.setEncoding('utf8');
    res.on('data', chunk => {
        console.log(`客户端接收到的内容:${chunk}\r\n`);
    });
    res.on('end', () => {
        console.log(`trailers头信息:${JSON.stringify(res.trailers)}`);
    });
});
req.on('error', err => {
    console.log(`请求发生错误${err}`);
});
req.on('socket', socket => {
    socket.setTimeout(10000);
    socket.on('timeout', () => {
        console.log('socket请求超时');
        req.abort();
    });
});
// req.setTimeout(1000, () => {
//     console.log('socket请求超时');
//     req.abort();
// });
req.write('这条是客服端发送的数据:hello,node~');
req.end(); //每次请求结束必须调用end方法