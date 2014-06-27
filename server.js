var net = require('net');
var gpio = require('rpi-gpio');

// add json validating functionality

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
    console.log(data.id + ": " + data.pin + ", " + data.value);

    if (data.type == "change") {
      write(pin, data.value);
      read(pin);
    } else if (data.type == "status") {
      read(pin);
    }
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
    socket.write(JSON.stringify({"pin": pin, "value": val}));
  });
}
