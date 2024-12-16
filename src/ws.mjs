#!/usr/bin/node 
import { createServer } from "http";
import { Server } from "socket.io";

const server = createServer();
const io = new Server(server, { cors: { origin: '*' } });
const PORT = 3001;

io.on('connection', socket => {
  socket.on('message', (target, signal)=>{
    io.emit(target, signal);
  });
});

server.listen(PORT, ()=> console.log('[*] listen websocket server on ', PORT));