const http = require('http');
const url = require('url');
const router = require('./router');
const querystring = require('querystring');
// const formidable = require('formidable');

const hostname = '127.0.0.1';
const port = 3000;

const startServer = () => {
    const reqListener = (request, response) => {
        let pathname = url.parse(request.url).pathname;
        let postData = '';
        request.setEncoding('utf-8');
        // request.on('removeListener',(e, f)=>{
        // 	console.log('取消绑定事件'+e);
        // 	console.log('取消处理函数'+f);
        // });
        // request.on('newListener',(e, f)=>{
        // 	console.log('绑定事件'+e);
        // 	console.log('处理函数'+f);
        // });
        request.on('data', postDataChunk => {
            postData += postDataChunk;
            // console.log('received post data chunk  '+postDataChunk+'.');
        });
        // console.log(request.listenerCount('data'));
        request.on('end', () => {
            let _postData = querystring.parse(postData).text;
            if (pathname !== '/favicon.ico') {
                router.nodeRoute(pathname, _postData, response); // 路由参数：请求信息（path）、response对象、请求信息(提交的表单data)
            }
        });
    };
    http.createServer(reqListener).listen(port, hostname, () => {
        console.log(`服务器运行在 http://${hostname}:${port}/`);
    });
};

exports.startServer = startServer;