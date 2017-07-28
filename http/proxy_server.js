const http = require('http');
const url = require('url');

const server = http.createServer((sRequest, sResponse) => {
    const URL = url.parse(sRequest.url);
    let opts = {
        hostname: 'www.youku.com',
        port: 80,
        path: URL.pathname,
        method: 'GET'
    };
    let cReq = http.request(opts, cResponse => {
        sResponse.writeHead(cResponse.statusCode, cResponse.statusMessage, cResponse.headers);
        cResponse.pipe(sResponse);
    });
    sRequest.pipe(cReq);
    cReq.end();
});
server.listen(8888, '127.0.0.1', () => {
    console.log('服务端监听中....');
});