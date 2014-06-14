var net = require('net');
var http = require('http');
var gpio = require('rpi-gpio');

var temp = false;

var server = net.createServer(function(c) {
  console.log('new client!');

  c.on('end', function() {
    console.log('client disconnected!');
  })

  c.setEncoding('utf8');
  
  c.on('data', function(d) {
    if (temp)
      temp = false;
    else
      temp = true;

    write();
    
    var data = JSON.parse(d);
    console.log(data.name + ": " + data.message);
    c.write(JSON.stringify({"name": "server", "message": "hello client"}));
  });
});

server.listen(8080, function() {
  console.log('server bound');
});

gpio.on('change', function(channel, value) {
  console.log('Channel ' + channel + ' value is now ' + value);
});

gpio.setup(16, gpio.DIR_OUT);

function write() {
  gpio.write(16, temp, function(err) {
    if (err) throw err;
    console.log("Written to pin!");
  });
}
