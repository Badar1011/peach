var http = require('http');
var fs = require('fs'); 
var querystring = require('querystring');


http.createServer(function (req, res) {
	if (req.method === "GET" && req.url === "/")
	{
		res.writeHead(200, {'Content-Type': 'text/html'});
		fs.createReadStream('./public/index.html','UTF-8').pipe(res);
	}
	else if (req.method === "POST" && req.url === "/"){
		var queryResult = "";
		req.on("data", function(data){
			queryResult += data;
			// if someone tries to flood the ram it would kill the connection
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if(queryResult.length > 1e6) {
                queryResult = "";
                res.writeHead(413, {'Content-Type': 'text/plain'}).end();
				// kills the connection
                req.connection.destroy();
            }
		});

		req.on("end", function(){
			postData = querystring.parse(queryResult);
			console.log(postData['fullName']);
			res.writeHead(200, {'Content-Type': 'text/html'});
		})	
	}
}).listen(8080);
