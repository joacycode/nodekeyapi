const exec = require('child_process').exec;
const fs = require('fs');

// server response对象公共方法
const drawResponse = (response,opts) => {
	if(!opts) {return false;}
	response.writeHeader(opts.statusCode,opts.headers);
	response.write(opts.chunk,opts.encoding,opts.callback);
	response.end();
} ;

const handlers = {
	indexpage(response){
		let body = '<!DOCTYPE html>'+
					'<html lang="en">'+
					'<head>'+
					'<meta charset="UTF-8">'+
					'<title>表单</title>'+
					'</head>'+
					'<body>'+
					'<form action="/upload" method="post">'+
					'<textarea name="text" cols="60" rows="20"></textarea>'+
					'<input type="submit" value="submit">'+
					'</form>'+
					'</body>'+
					'</html>';
		drawResponse(response,{
			statusCode: 200,
			headers: {'Content-type':'text/html; charset=utf-8'},
			chunk: body
		});
	},
	start(response) {
		// 阻塞代码
		// let s = new Date().getTime();
		// while(new Date().getTime() < s + 10000);

		console.log('request handler: starttttt called!');
		// 非阻塞代码 回调异步执行
		exec('ls -lah',(err, stdout, stderr) => {
			drawResponse(response,{
				statusCode: 200,
				headers: {'Content-type':'text/plain; charset=utf-8'},
				chunk: stdout
			});
		});
	},
	upload(response,postData) { 
		console.log('request handler: uploadddd called!');
		drawResponse(response,{
			statusCode: 200,
			headers: {'Content-type':'text/plain; charset=utf-8'},
			chunk: 'you are sent: ' + postData
		});
	},
	show (response) {
		console.log('request handler: showwwww called!');
		fs.readFile('sample.png', 'binary', (error, file) => {
			if (error) {
				drawResponse(response,{
					statusCode: 500,
					headers: {'Content-type':'text/plain; charset=utf-8'},
					chunk: error+ '\n'
				});
			} else {
				drawResponse(response,{
					statusCode: 200,
					headers: {'Content-type':'imgage/png; charset=utf-8'},
					chunk: file,
					encoding: 'binary'
				});
			}
		});
	}
};
exports.handlers = handlers;


