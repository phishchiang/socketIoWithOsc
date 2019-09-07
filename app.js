'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const OSC = require('osc-js');
const config = { udpClient: { port: 9129 } };
const osc = new OSC({ plugin: new OSC.BridgePlugin(config) });

osc.open(); // start a WebSocket server on port 8080

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, './public/index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', socket => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

io.on('connection', function(socket) {
  console.log(socket.id);
  socket.on('mouse', function(obj) {
    console.log(obj);
    io.emit('FINAL', obj);
  });
});

/*
let express = require('express');
let app = express();

// let server = app.listen(process.env.PORT||3000);
var port = process.env.PORT || 3000;
const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

app.use(express.static('public'));

console.log('My socket server is running');

io.configure(function () {  
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});


let socket = require('socket.io');
let io = socketIO(server);

io.sockets.on('connection', function(socket){
  console.log(socket.id);
  socket.on('mouse',function(obj){
    console.log(obj);
    io.emit('FINAL',obj);
  });
  
});
*/
