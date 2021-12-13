var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var database = require('./modules/database');
var fileupload = require('express-fileupload');
var usuariosRouter = require('./routers/usuarios-router');
var chatsRouter = require('./routers/chats-router');
var emojisRouter = require('./routers/emojis-router');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileupload({useTempFiles : true,tempFileDir : '/tmp/'}))
app.use('/usuarios', usuariosRouter);
app.use('/chats', chatsRouter);
app.use('/emojis', emojisRouter);

app.listen(8888, ()=>console.log('Se levanto el servidor'));
