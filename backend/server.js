const express = require ('express');
const bodyParser = require('body-parser');
const apiRouter = require ('./apiRouter').router;

const server = express();

server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())

server.use ((req , res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})

server.use('/api/', apiRouter);

server.listen(8081, function(){
    console.log('serveur en écoute');
})