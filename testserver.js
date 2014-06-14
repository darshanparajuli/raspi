var net = require('net');
var http = require('http');
var gpio = require('rpi-gpio');
var socket;

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
    
    write(16, data.value);
    read(16);
  });
});

server.listen(8080, function() {
  console.log('server bound');
});

gpio.on('change', function(channel, value) {
  console.log('Channel ' + channel + ' value is now ' + value);
});

gpio.setup(16, gpio.DIR_OUT);

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
    var message;
   
    if (val) {
      message = "turned on!";
    } else {
      message = "turned off!";
    }
    
    socket.write(JSON.stringify({"name": "led", "message": message}));
  });
}
