let requestHandler = require('./requestHandler');
// const filename = __filename.split('/')[__filename.split('/').length-1];
// console.log(filename, __dirname);
// 映射不同路径的方法
let handler = {};
handler['/'] = requestHandler.handlers.indexpage;
handler['/start'] = requestHandler.handlers.start;
handler['/upload'] = requestHandler.handlers.upload;
handler['/show'] = requestHandler.handlers.show;

// 根据请求的pathname 执行映射的方法
const nodeRoute = (pathname, response, postdata) => {
	if (typeof handler[pathname] === 'function'){
		return handler[pathname](response, postdata);
	}else{
		console.log('No request handler for: ' + pathname);
		response.writeHeader(404,{'Content-type':'text/plain'});
		response.write('404 NOT FOUND');
		response.end();
	}
};
exports.nodeRoute = nodeRoute;