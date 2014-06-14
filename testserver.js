var net = require('net');
var http = require('http');

var server = net.createServer(function(c) {
  console.log('new client!');

  c.on('end', function() {
    console.log('client disconnected!');
  })

  c.setEncoding('utf8');
  
  c.on('data', function(d) {
    var data = JSON.parse(d);
    console.log(data.name + ": " + data.message);
    c.write(JSON.stringify({"name": "server", "message": "hello client"}));
  });
});

server.listen(8000, function() {
  console.log('server bound');
});
