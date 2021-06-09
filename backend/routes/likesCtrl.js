// Imports
var models   = require('../models');
var jwtUtils = require('../utils/jwt');
var asyncLib = require('async');

// Routes
module.exports = {
  likePost: (req, res) => {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    // Params
    var messageId = req.body.messageId;

    if (messageId <= 0) {
      return res.status(404).json({ 'error': 'Ce message n\'existe pas' });
    }

    asyncLib.waterfall([
      (done) => {
        models.Message.findOne({
          where: { id: messageId }
        })
        .then((messageFound) => {
          done(null, messageFound);
        })
        .catch(() => {
          return res.status(404).json({ 'error': 'Impossible de trouver le message' });
        });
      },
      (messageFound, done) => {
        
        if(messageFound) {
          models.User.findOne({
            where: { id: userId }
          })
          .then((userFound) => {
            done(null, messageFound, userFound);
          })
          .catch(() => {
            return res.status(404).json({ 'error': 'Impossible de trouver l\'utilisateur' });
          });
        } else {
          res.status(500).json({ 'error': 'like déja créer' });
        }
      },
      (messageFound, userFound, done) => {
        if(userFound) {
          models.Like.findOne({
            where: {
              userId: userFound.id,
              messageId:messageFound.id
            }
          })
          .then((likedFound) => {
            done(null, messageFound, userFound, likedFound);
          })
          .catch(() => {
            return res.status(500).json({ 'error': 'Impossible de vérifier si l\'utilisateur à déja liker' });
          });
        } else {
          res.status(404).json({ 'error': 'Impossible de trouver l\'utilisateur' });
        }
      },
      ( messageFound, userFound, likedFound ,done) => {
        
        console.log(messageFound.id);
        console.log(userFound.id)
        console.log(likedFound)
        if(!likedFound) {
          models.Like.create({
            messageId: messageFound.id,
              userId: userFound.id, 
          })
          .then(() => {
            const like = 1
            done(null, messageFound, userFound, like);
          })
          .catch(() => {
            return res.status(500).json({ 'error': 'Impossible de créer le like' });
          });
        }if(likedFound) {
          likedFound.destroy({
              where : {userId: userId,
              messageId: messageId}
          })
          .then(() => {
            const like = 0
            done(null,messageFound, userFound,like);
          })
          .catch(() => {
            return res.status(500).json({ 'error': 'Impossible de detruire le like' });
          });
      }
    },
      ( messageFound, userFound,like, done) => {
        if(like === 1) {
          messageFound.update(
            {likes: messageFound.likes  + 1 }, 
          ).then(() => {
            like = 'liker'
           done( null, userFound,like )
          }).catch(() => {
            return res.status(500).json({'error': 'Impossible de mettre à jour le compteur de like'})
          });
        }
        else {
          messageFound.update(
            {likes: messageFound.likes  - 1 }, 
          ).then(() => {
            like = 'disliker'
           done(  null, userFound,like )
          }).catch(() => {
            return res.status(500).json({'error':'Impossible de mettre à jour le compteur de like'})
          });
        }
      },
      function( userFound,like, done){
        if(like) {
          if(like === 'liker'){
            userFound.update({
              exp: userFound.exp + 1
            }).then(function(userFound) {
              done(userFound);
            }).catch((err)=>{
              return res.status(404).json({'error': err})
          });
          }
          else {
            userFound.update({
              exp: userFound.exp - 1
            }).then(function(userFound) {
              done(userFound);
            }).catch((err)=>{
              return res.status(404).json({'error': err})
          }); 
        }
        }
        else {
          res.status(500).json({ 'error': 'Impossible de mettre à jour l\'utilisateur' });
        }
      }
    ], (like) => {
      if (like) {
        return res.status(201).json({'message': 'Message liker'} );
      }
      
      else {
        return res.status(500).json({ 'error': 'Impossible de liker le message' });
      }
    });
  },
}