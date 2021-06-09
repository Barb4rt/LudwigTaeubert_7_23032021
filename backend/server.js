const express = require ('express');
const bodyParser = require('body-parser');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const apiRouter = require ('./apiRouter').router;
const path = require('path');
const server = express();

const PORT = 8081

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
server.use(helmet())
// server.use(limiter);

server.use ((req , res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})

server.use('/api/', apiRouter);
server.use('/images', express.static(path.join(__dirname, 'images')));
server.use('/images/profilesPicture', express.static(path.join(__dirname, 'images/profilesPicture')));

server.listen(PORT, function(){
    console.log(`serveur en écoute sur le port : ${PORT}`);
})