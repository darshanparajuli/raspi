var net = require('net');
var http = require('http');
var gpio = require('rpi-gpio');
var socket;

var pin = 16;

var server = net.createServer(function(c) {
  socket = c;
  
  console.log('new client!');

  c.on('end', function() {
    console.log('client disconnected!');
  })

  c.setEncoding('utf8');
  
  c.on('data', function(d) {
    var data = JSON.parse(d);
    console.log(data.name + ": " + data.message + ", " + data.value);
    
    write(pin, data.value);
    read(pin);
  });
});

server.listen(8080, function() {
  console.log('server bound');
});

gpio.setup(pin, gpio.DIR_OUT);


function write(pin, val) {
  gpio.write(pin, val, function(err) {
    if (err) throw err;
    console.log("Written to pin!");
  });
}

function read(pin) {
  gpio.read(pin, function(err, val) {
    if (err) throw err;
    console.log("value: " + val);
    socket.write(JSON.stringify({"value": val}));
  });
}
