const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
let server = http.createServer((request, response) => {
    if (request.url !== '/favicon.ico') {
        const file = fs.createWriteStream('./res.log');
        let strData = '';
        file.write(`客户端请求方法：${request.method}\r\n`);
        file.write(`客户端请求url的参数字符串：${request.url}\r\n`);
        file.write(`客户端请求头对象：${JSON.stringify(request.headers)}\r\n`);
        file.write(`客户端请求http版本：${request.httpVersion}\r\n`);
        request.on('data', data => {
            strData += data;
        });
        request.on('end', () => {
            const objData = querystring.parse(strData);
            file.end(`服务端接收到的表单数据:my name is ${objData.myname} and my age is ${objData.myage}\r\n`);
            console.log(`服务端接收到的数据:my name is ${objData.myname} and my age is ${objData.myage}`);
            console.log(`客户端请求数据全部接收完毕`);
        });
    }
    response.end();
}).listen(8888, '127.0.0.1', () => {
    console.log(`服务端开始监听 `);
    // setTimeout(() => { server.close(); }, 10000)
});
server.on('connnection', () => {
    console.log('客户端连接已建立');
});
server.setTimeout(60 * 1000, socket => {
    console.log(`服务器超时，socket对象：${socket}`);
});
server.on('close', () => {
    console.log('服务被关闭');
});
server.on('error', err => {
    console.log(`发生错误代码：${err.code }`);
});

/**
 * 创建HTTP服务器 
 * createServer(requestListener)
 * @param requestListener(request,response) <Function>  当接收到客户端的请求时候进行的处理
 * * * * * @param request http.IncomingMessage对象 指客户端的请求
 * * * * * @param response http.serverResponse对象 指服务端的响应
 * @return HTTP Server类
 */

/**
 * HTTP Server类
 * 继承自net.server类且具有以下额外事件
 * 
 * @event clientError 客户端触发一个Error事件,该事件监听器负责销毁底层socket
 * * * *  callback(err,socket)
 * * * *  @param err 错误对象
 * * * *  @param socket net.socket对象 触发此事件将不会有(req,res),所以发送任何http响应,应写入socket对象
 * @event close 当http服务关闭触发
 * @event connect 当客户端发送HTPP CONNECT请求时候触发，该事件未被监听则客户端会关闭连接
 * @event connection 客户端和服务端建立连接时触发 callabck(socket) @param socket 服务端监听客户端的socket对象
 * @event request callback(req,res) 每接收到一个请求时触发，每个连接可能有多个请求。参数值与requestListener参数值完全相同
 * @event upgrade callback(req,socket,head) 每当客户端发送http upgrade请求时触发，该事件未被监听则客户端会关闭连接
 * 
 * @method close 停止服务端接收新的连接
 * @method listen([port],[hostname],[backlog],[callback])
 * * * * * @param port <number> 端口 默认随机分配
 * * * * * @param hostname <string> 主机名域名
 * * * * * @param backlog <number> 等待连接的队列最大长度 默认511
 * * * * * @param callback <function> 回调
 * @method listen(path,[callback]) 启动一个unix socket服务
 * @method listen(handle,[callback]) 
 * @method setTimeout([msecs=120000],[callback]) 设置socket超时时间,发生超时触发服务器对象的 'timeout' 事件,并传入 socket 作为一个参数
 * 
 * @property listening [boolean] 服务是否在监听连接
 * @property maxHeaderCount 限制请求头的最大数量 默认2000 0表示无限制
 * @property timeout 设置获取连接超时时间
 * @property keepAliveTimeout 服务器完成最后的响应需要等待额外数据的时间,保持活跃的毫秒数,之后才销毁socket
 */


/**
 * HTTP IncomingMessage类
 * IncomingMessage对象由 http.Server或http.ClientRequest创建，并作为第一个参数分别递给 'request' 和 'response' 事件，它可以用来访问响应状态、消息头、以及数据
 * 
 * @event aborted 
 * @event close
 * 
 * @method destory([error]) 调用接收到 IncomingMessage的socket上的destroy()方法
 * @method setTimeout(msecs, callback)
 * 
 * @property headers 请求头或响应头的对象 头信息的名称与值的键值对 头信息的名称为小写
 * @property httpVersion 返回客户端发送http的版本 （1.0、1.1）
 * @property method @return [string] 该属性只读，表示请求的方法
 * @property rawHeaders @return [array] 接收到的原始的请求头或响应头列表，键和值在同一个列表中，偶数位的是键，奇数位的是对应的值
 * @property url 返回请求的 URL 字符串,仅包含实际 HTTP 请求中的 URL,参数字符串
 * @property trailers 返回 Trailer 请求头或响应头对象
 * @property statusMessage HTTP响应状态消息
 * @property statusCode HTTP响应状态码
 * @property socket
 */

/**
 * HTTP SeverResponse类
 * @event close end方法调用时触发
 * @event finish 当响应已被发送时触发（不意味着客户端已接收到任何东西）,此后响应对象不再触发任何事件
 * 
 * @method addTrailers(headers) 添加http尾部响应头到响应
 * @method end([data],[encoding],[callback]) 通知服务器所有响应头和响应主体都被发送
 * @method setHeader(name,value) 为一个隐式的响应头设置值,如果该响应头已存在,则值会被覆盖,如果要发送多个名称相同的响应头,则使用字符串数组
 * @method getHeader(name) @return [string] 读取一个已入队列但尚未发送到客户端的响应头,名称不区分大小写
 * @method getHeaderNames() @return [array] 返回包含当前响应唯一名称的http头信息名称数组,名称均小写
 * @method getHeaders @return [object] 返回当前响应头信息
 * @method hasHeader(name) @return [boolean] 判断是否含有一个已入队列但尚未发送到客户端的响应头
 * @method removeHeader(name) 从隐式发送的队列中移除一个响应头
 * @method writeHeader(statusCode,[statusMessage],[headers]) 优先级高于setHeader 并且在write()和end()之后调用，否则会切换到隐式响应头
 * * * * * @param statusCode [number] 状态码 
 * * * * * @param statusMessage [string] 状态描述
 * * * * * @param headers [object] 响应头
 * * * * *
 * @method write(chunk,[encoding],[callback]) 发送一块响应主体
 * * * * * @param chunk [string|buffer]
 * * * * * @param encoding [string] 默认‘utf8’
 * * * * * @param callback [function]
 * * * * * @return [boolean] 全部数据进入内核缓存区 true 全部或者部分数据依然在内存排队 false
 * 
 * @property finished [boolean] 表示响应是否已经完成 执行end()之后会变成true
 * @property headersSent 返回一个布尔值(只读),如果响应头已被发送则为 true,否则为 false
 * @property sendDate 默认为 true,如果响应头里没有日期响应头,则日期响应头会被自动生成并发送
 * @property statusCode 当使用隐式的响应头时（没有显式地调用 response.writeHead()）,该属性控制响应头刷新时将被发送到客户端的状态码。
 * @property statusMessage 当使用隐式的响应头时,该属性控制响应头刷新时将被发送到客户端的状态信息。
 * @property
 */

/**
 * HTTP ClientRequest类
 * @event abort 首次调用abort(),请求被客户端中止触发
 * @event aborted 请求被服务器中止,且网络socket已被关闭
 * @event connect 服务器响应connect请求时触发
 * * * *  callback(req,socket,head)
 * * * *  @param req [http.IncomingMessage]
 * * * *  @param socket [net.socket]
 * * * *  @param head [buffer]
 * @event continue
 * @event response 当请求的响应被接收到时触发，只触发一次
 * @event socket
 * @event upgrade 服务器响应upgrade请求时触发
 * * * *  callback(req,socket,head)
 * * * *  @param req [http.IncomingMessage]
 * * * *  @param socket [net.socket]
 * * * *  @param head [buffer]
 * 
 * @method abort() 标记请求中止，剩余相应数据被丢弃且销毁socket
 * @method end([[data],[encoding]],[callback]) 结束发送请求
 * @method flushHeaders() 刷新请求头
 * @method setNoDelay([noDelay]) 见socket.setNoDelay() 默认true
 * @method setSocketKeepAlive([enable],[initialDelay]) 见socket.setKeepAlive() 默认flase
 * @method setTimeout(timeout,[callback]) 见socket.setTimeout()
 * @method write(chunk,[encoding],[callback])
 * 
 * @property aborted 如果请求被终止 打印被中止的时间距1970 00:00:00毫秒数
 */

/**
 * HTTP Agent类
 * @event
 * @event
 * @event
 * @method
 * @method
 * @method
 * @property
 * @property
 * @property
 */