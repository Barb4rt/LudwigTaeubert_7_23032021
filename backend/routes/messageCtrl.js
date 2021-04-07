// Imports
let models   = require('../models');
let asyncLib = require('async');
let jwtUtils = require('../utils/jwt');
const fs = require('fs')


// Constants
const TITLE_LIMIT   = 2;
const CONTENT_LIMIT = 4;
const ITEMS_LIMIT   = 50;

// Routes
module.exports = {
  createMessage: function(req, res) {
    // Getting auth header
    let headerAuth  = req.headers['authorization'];
    let userId      = jwtUtils.getUserId(headerAuth);
    // Params
    let title   = req.body.title;
    let content = req.body.content;
    let attachment =
    () => {
      if(req.file){

        return `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }return null 
    }
    console.log(attachment());

    if (title == null || content == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    if (title.length <= TITLE_LIMIT || content.length <= CONTENT_LIMIT) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

    asyncLib.waterfall([
      function(done) {

        models.User.findOne({
          where: { id: userId }
        })
        .then(function(userFound) {
          console.log(userFound.username)
          done(null, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      function(userFound, done) {
        if(userFound) {
          models.Message.create({
            title  : title,
            content: content,
            likes  : 0,
            UserId : userFound.id,
            username : userFound.username,
            attachment: attachment()
          })
          .then(function(newMessage) {
            done( newMessage);
          }).catch((err)=>{
            return res.status(404).json({'error': err})
        });
        } else {
          res.status(404).json({ 'error': 'user not found' });
        }
      }
    ], function(newMessage) {
      if (newMessage) {
        return res.status(201).json(newMessage);
      } else {
        return res.status(500).json({ 'error': 'cannot post message' });
      }
    });
  },


  listMessages: function(req, res) {
    let fields  = req.query.fields;
    let limit   = parseInt(req.query.limit);
    let offset  = parseInt(req.query.offset);
    let order   = req.query.order;
    console.log('1')

    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }

    models.Message.findAll({
      order: [(order != null) ? order.split(':') : ['updatedAt', 'DESC']],
      attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
      limit: (!isNaN(limit)) ? limit : null,
      offset: (!isNaN(offset)) ? offset : null,
      include: [{
        model: models.User,
        attributes: [ 'username' ]
      }],
    }).then(function(messages) {
      if (messages) {
        res.status(200).json(messages);
      } else {
        res.status(404).json({ "error": "no messages found" });
      }
    }).catch(function(err) {
      console.log(err);
      res.status(500).json({ "error": "invalid fields" });
    });
  },


  listUsersMessages: function(req, res) {
    let fields  = req.query.fields;
    let limit   = parseInt(req.query.limit);
    let offset  = parseInt(req.query.offset);
    let order   = req.query.order;
    let headerAuth  = req.headers['authorization'];
    let userId      = jwtUtils.getUserId(headerAuth);
    console.log('1')

    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }

    models.Message.findAll({
      order: [(order != null) ? order.split(':') : ['updatedAt', 'DESC']],
      attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
      limit: (!isNaN(limit)) ? limit : null,
      offset: (!isNaN(offset)) ? offset : null,
      include: [{
        model: models.User,
        attributes: [ 'username' ]
      }],
      where: { userId : userId

      }
    }).then(function(messages) {
      if (messages) {
        res.status(200).json(messages);
      } else {
        res.status(404).json({ "error": "no messages found" });
      }
    }).catch(function(err) {
      console.log(err);
      res.status(500).json({ "error": "invalid fields" });
    });
  },
  deleteMessage : (req, res) => {
 // Getting auth header
 let headerAuth  = req.headers['authorization'];
 let userId      = jwtUtils.getUserId(headerAuth);
 
 asyncLib.waterfall([
   (done) => {
     models.User.findOne({
       where : { id: userId}
     })
     .then((userFound) => {
      done( null , userFound)
     }).catch((err) => {
       return res.status(500).json({ 'error': 'Impossible de vérifier l\'utilisateur'})
     });
   },
   (userFound, done) => {
    if(userFound){
      models.Message.findOne({
        where : { id : req.params.id}
      }).then((messageFound) => {
        done( null , messageFound)
       }).catch((err) => {
         return res.status(500).json({ 'error': 'Impossible de trouver le message'})
       });
    }
   },
   (messageFound, done) => {
     if(messageFound){
      const filename = messageFound.attachment.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        console.log(messageFound);
       models.Message.destroy({
         where : { id : messageFound.id }
       }).then((messageDestroy) => {
        done( messageDestroy)
       }).catch((err) => {
         return res.status(500).json({ 'error': 'Impossible de trouver le message'})
       });
     })
    } 
   }
 ],function(messageDestroy) {
      if (messageDestroy) {
        return res.status(201).json({'message' : 'message supprimée'});
      } else {
        return res.status(500).json({ 'error': 'cannot post message' });
      }
    })
  }
}