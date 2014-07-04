var http = require('http');

http.createServer(function(req, resp) {
  var pinNumber = 1;
  var state = '';
  
  resp.writeHead(200, {'Content-Type': 'text/html'});
  resp.write("hello world");
  resp.end();
}).listen(8080);
