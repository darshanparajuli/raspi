var net = require('net');
var http = require('http');
var gpio = require('rpi-gpio');

var server = net.createServer(function(c) {
  console.log('new client!');

  c.on('end', function() {
    console.log('client disconnected!');
  })

  c.setEncoding('utf8');
  
  c.on('data', function(d) {
    var data = JSON.parse(d);

    if (data.value == true) {
      write(16, true);
      console.log("test");
    } else if (data.value == false) {
      write(16, false);
      console.log("test2");
    }

    var val = read(16);
    var message;
    
    if (val) {
      message = "turned on!";
    } else {
      message = "turned off!";
    }
    
    console.log(data.name + ": " + data.message + ", " + data.value);
    c.write(JSON.stringify({"name": "led", "message": message}));
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
  return gpio.read(pin, function(err) {
    if (err) throw err;
  });
}
