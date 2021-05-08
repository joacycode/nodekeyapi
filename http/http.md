## http.Server类
**提供服务，处理客户端的请求** `server`
**继承net.Server类** 
`createServer(requestListener)`
```javascript
/**
 * @param requestListener(request,response) <Function>  当接收到客户端的请求时候进行的处理
 * * * * * @param request http.IncomingMessage对象 指客户端的请求
 * * * * * @param response http.serverResponse对象 指服务端的响应
 * @return HTTP Server类
 * 
 * 继承自 net.server 类且具有以下额外事件方法属性
 * @event clientError 客户端触发一个Error事件,该事件监听器负责销毁底层socket
 * * * *  callback(err,socket)
 * * * *  @param err 错误对象
 * * * *  @param socket net.socket对象 触发此事件将不会有(req,res),所以发送任何http响应,应写入socket对象
 * @event close 当http服务关闭触发
 * @event connect 当客户端发送HTPP CONNECT请求时候触发,HTTP method为connect,该事件未被监听则客户端会关闭连接
 * @event connection 客户端和服务端建立连接时触发 callabck(socket) 
 * * * *  @param socket 服务端监听客户端的socket对象
 * @event request callback(req,res) 每接收到一个请求时触发，多个request可能对应的是一个 connection(keep-alive), 参数值同requestListener
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
```

## http.ServerResponse类
**服务端针对客户端的请求做出响应** `serverResponse`

```javascript
/**
 * 服务端响应流 可写流
 * 
 * 事件方法属性
 * @event close end方法调用之前被终止触发
 * @event finish 当响应已被发送时触发（不意味着客户端已接收到任何东西）,此后响应对象不再触发任何事件
 * 
 * @method addTrailers(headers) 添加http尾部响应头到响应
 * @method end([data],[encoding],[callback]) 通知服务器所有响应头和响应主体都被发送
 * @method setHeader(name,value) 为一个隐式的响应头设置值 改+增
 * * * * * Tips: 如果该响应头已存在,则值会被覆盖,如果要发送多个名称相同的响应头,则使用字符串数组
 * * * * * Tips: write方法第一次被调用随即发送响应头，而writeHeader调用时即发送响应头
 * @method getHeader(name) @return [string] 读取一个已入队列但尚未发送到客户端的响应头,名称不区分大小写
 * @method getHeaderNames() @return [array] 返回包含当前响应唯一名称的http头信息名称数组,名称均小写
 * @method getHeaders @return [object] 返回当前响应头信息 查
 * @method hasHeader(name) @return [boolean] 判断是否含有一个已入队列但尚未发送到客户端的响应头
 * @method removeHeader(name) 从隐式发送的队列中移除一个响应头 删
 * @method writeHeader(statusCode,[statusMessage],[headers]) 优先级高于setHeader 并且在write()和end()之前调用，否则会切换到隐式响应头
 * * * * * @param statusCode [number] 状态码 
 * * * * * @param statusMessage [string] 状态描述
 * * * * * @param headers [object] 服务端响应头
 * * * * * * * * * headers = {
 * * * * * * * * * content-type: 指定内容类型,
 * * * * * * * * * location: 用于将客户端重定向到另一个url地址,
 * * * * * * * * * content-disposition: 用于指定一个被下载的文件名,
 * * * * * * * * * content-length: 用于指定服务端响应内容的字节数,
 * * * * * * * * * set-cookie: 用于在客户端创建一个cookie
 * * * * * * * * * content-encoding: 服务器端相应内容的编码方式
 * * * * * * * * * Cache-Control:用于开启缓存机制
 * * * * * * * * * Expires: 用于指定缓存过期时间
 * * * * * * * * * Etag: 用于指定当服务端响应内容没有变化时不重新下载数据
 * * * * * * * * * }
 * @method write(chunk,[encoding],[callback]) 发送一块响应主体
 * * * * * @param chunk [string|buffer]
 * * * * * @param encoding [string] 默认‘utf8’
 * * * * * @param callback [function]
 * * * * * @return [boolean] 全部数据进入内核缓存区-true 全部或者部分数据依然在内存排队-false
 * 
 * @property finished [boolean] 表示响应是否已经完成 执行end()之后会变成true
 * @property headersSent 返回一个布尔值(只读),如果响应头已被发送则为 true,否则为 false
 * @property sendDate 默认为 true,如果false响应头里没有日期响应头,否则日期响应头会被自动生成并发送
 * @property statusCode 当使用隐式的响应头时（没有显式地调用 response.writeHead()）,该属性控制响应头刷新时将被发送到客户端的状态码。
 * @property statusMessage 当使用隐式的响应头时,该属性控制响应头刷新时将被发送到客户端的状态信息。
 */
```


## http.IncomingMessage类
**获取客户端请求的相关信息** `serverRequset`
**获取服务端返回的相关信息** `clientResponse`
```javascript
/**
 * 可读流
 * IncomingMessage对象由 http.Server或http.ClientRequest创建，
 * 作为第一个参数分别递给 'request' 和 'response' 事件，它可以用来访问响应状态、消息头、以及数据
 * 
 * 事件方法属性
 * @event aborted 
 * @event close
 * @event end
 * @event data
 * 
 * @method destory([error]) 调用接收到 IncomingMessage的socket上的destroy()方法
 * @method setTimeout(msecs, callback)
 * 
 * @property headers 请求头或响应头的对象 头信息的名称与值的键值对 头信息的名称为小写
 * @property httpVersion 返回客户端发送http的版本 （1.0、1.1）
 * @property method @return [string] 该属性只读，表示请求的方法 server only
 * @property rawHeaders @return [array] 接收到的原始的请求头或响应头列表，键和值在同一个列表中，偶数位的是键，奇数位的是对应的值
 * @property url 返回请求的 URL 字符串,仅包含实际 HTTP 请求中的 URL,参数字符串
 * @property trailers 返回 Trailer 请求头或响应头对象
 * @property statusMessage HTTP响应状态消息 client only
 * @property statusCode HTTP响应状态码 client only
 * @property socket
 */
```

代码示例
```javascript
const http = require('http');
const url = require('url');
const querystring = require('querystring');

let server = http.createServer((serverRequest, serverResponse) => {
    if (serverRequest.url !== '/favicon.ico') {
        const file = fs.createWriteStream('./res.log');
        let strData = '';
        file.write(`客户端请求方法：${serverRequest.method}\r\n`);
        file.write(`客户端请求url的参数字符串：${serverRequest.url}\r\n`);
        file.write(`客户端请求头对象：${JSON.stringify(serverRequest.headers)}\r\n`);
        file.write(`客户端请求http版本：${serverRequest.httpVersion}\r\n`);
        
        // get请求
        // const urlObj = url.parse(serverRequest.url)
        // const query = urlObj.query
        // const queryObj = querystring.parse(query) 
        //  res.end(JSON.stringify(queryObj))

        // post请求
        serverRequest.on('data', data => {
            strData += data;
        });
        serverRequest.on('end', () => {
            let bodyStr;
            if (typeof(strData) !== 'string') {
                objData = querystring.parse(strData);
                file.end(`服务端接收到的表单数据:my name is ${objData.myname} and my age is ${objData.myage}\r\n`);
                bodyStr = `服务端接收到的表单数据:my name is ${objData.myname} and my age is ${objData.myage}\r\n`;
            } else {
                bodyStr = `服务端接收到的数据:${strData}`;
            }
            // 响应体 可用路由处理
            serverResponse.setTimeout(10 * 1000);
            serverResponse.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'Access-Control-Allow-Origin': '127.0.0.1', 'Trailer': 'content-MD5' });
            if (serverResponse.headersSent) { console.log('响应头已发送'); } else { console.log('响应头未发送'); }
            serverResponse.addTrailers({ 'content-MD5': 'xxxxxxx' });
            serverResponse.write(`
              <html>
              <head><title>node应用程序</title></head>
              <body><h1>node webserver start</h1><h2>${bodyStr}</h2></body>
              <html>
            `);
            serverResponse.on('timeout', () => {
                console.log('响应超时');
            });
            serverResponse.on('close', () => {
                console.log('end方法未被调用之前，连接被中断');
            });
            serverResponse.end();
            console.log(`客户端请求数据全部接收完毕`);
        });
    }
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
```

## http.ClientRequest
**向服务端发起请求** `client`
```javascript
/**
 * ClientRequest对象 HTTP客户端 可写流
 * 
 * 创建方式
 * http.request(options,[callback]) 向其他网站发送请求数据
 * @param options <Object|String|URL> 指定请求的目标地址以及相关配置
 * * * * * options <Object> = { protocol,host,hostname,family,port,localAdrress,socketPath,method,path,headers,auth,agent,timeout,createConnection }
 * @param callback(response) > @param clinetResponse http.IncomingMessage对象,利用该对象读取响应流数据
 * @return 返回ClientRequest类实例,代表一个客户端请求,可写流
 * 
 * 事件方法属性
 * @event abort 首次调用abort(),请求被客户端中止触发,客户端主动中断
 * @event aborted 请求被服务器中止,且网络socket已被关闭,服务端主动中断
 * @event connect 服务器响应connect请求时触发
 * * * *  callback(req,socket,head)
 * * * *  @param req <http.IncomingMessage>
 * * * *  @param socket <net.socket>
 * * * *  @param head <buffer>
 * @event continue 当收到服务端的响应 100 Continue 时触发
 * @event error 在向目标网站请求数据过程中发生错误
 * @event response 当请求的响应被接收到时触发，只触发一次
 * @event socket 建立连接分配端口时候触发 callback(socket)
 * * * *  @param socket 用于分配的socket端口对象
 * @event upgrade 服务器响应upgrade请求时触发 请求首部里声明 'Connection': 'Upgrade'要求服务端将当前连接升级到新的协议
 * * * *  callback(req,socket,head)
 * * * *  @param req <http.IncomingMessage>
 * * * *  @param socket <net.socket>
 * * * *  @param head <buffer>
 * 
 * @method abort() 标记请求中止，剩余相应数据被丢弃且销毁socket
 * @method end([[data],[encoding]],[callback]) 结束本次发送请求
 * @method flushHeaders() 刷新请求头
 * @method setNoDelay([noDelay]) 见socket.setNoDelay() 默认true
 * @method setSocketKeepAlive([enable],[initialDelay]) 见socket.setKeepAlive() 默认flase
 * @method setTimeout(timeout,[callback]) 见socket.setTimeout()
 * @method write(chunk,[encoding],[callback])发送请求主题的一个数据块
 * 
 * @property aborted 如果请求被终止 打印被中止的时间距1970 00:00:00毫秒数
 */
```

代码示例
```javascript
const http = require('http');
const options = {
    hostname: '127.0.0.1',
    port: 8888,
    path: '/',
    method: 'POST'
};
// 发送给服务端的数据
const postBody = {
  name: 'jacky'
};
const client = http.request(options, (clientResponse) => {
    console.log(`状态码:${clientResponse.statusCode}\r\n`);
    console.log(`响应头:${JSON.stringify(clientResponse.headers)}\r\n`);

    clientResponse.setEncoding('utf8');
    clientResponse.on('data', chunk => {
        console.log(`客户端接收到的内容:${chunk}\r\n`);
    });
    clientResponse.on('end', () => {
        console.log(`trailers头信息:${JSON.stringify(clientResponse.trailers)}`);
    });
});
client.on('error', err => {
    console.log(`请求发生错误${err}`);
});
client.on('socket', socket => {
    socket.setTimeout(10000);
    socket.on('timeout', () => {
        console.log('socket请求超时');
        client.abort();
    });
});
client.setTimeout(1000, () => {
    console.log('socket请求超时');
    client.abort();
});
client.write(querystring.stringify(postBody));
client.end(); //每次请求结束必须调用end方法

```