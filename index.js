var express  = require('express');

var http = require('http');

const app = express();

var server = http.createServer(app)

var io = require('socket.io')(server);

app.use(express.static('public'));

app.get(`/`,(req,res)=>{
  res.send('hello world');
})

server.listen(5000)

let user = {};
let userClient = {}

io.on('connection', function (socket) {

  var _query = socket.request["_query"];

  //已用户的uid为key存入user的nickname和socket

  if( !user[_query.uid] ){


    //保存帐号信息
    user[_query.uid] = _query.nickname;
  
    //保存 socket  实例
    userClient[_query.uid]=socket;
  }

  // user登录 想所有用户发送信息

  io.emit('broadcast', user);
  


  socket.on('roomconnect',(uid)=>{
    socket.emit('sys',uid)
  })
  socket.on('ptp',(msg)=>{
    console.log(msg);
    if( !msg.target ){
      socket.emit('ptp','接收人不存在！！！！');
      return;
    }
    if( !user[msg.target] ){
      socket.emit('ptp','接收人不存在！！！！');
      return;
    }
    userClient[msg.target].emit('ptp',msg);
  })
});