
import express from 'express'

const  app:express.Application = express();
const server = require('http').createServer(app);
const socket  = require('socket.io')(server);

app.get('/',(req,res)=>{
    res.send("hello world")
});

const topics:string[] =["nodejs","python","java","golang"];


socket.on('connection',async (http:any)=>{
    console.log('incoming connection');
   http.on('getTopics',()=>{
       http.emit('topics',topics);
   });

    http.on('message',(msg: any)=>{
       http.emit('msgReceived',msg);
    })


});

server.listen('2453',()=>{console.log('listening')});



