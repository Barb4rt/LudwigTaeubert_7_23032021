// Imports
const models   = require('../models');
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt');
const fs = require('fs');


// Constants
const ITEMS_LIMIT = 50;
const CONTENT_LIMIT   = 150;

// Routes
module.exports = {
  createMessage: function(req, res) {
    // Getting auth header
    console.log(req.file);
    const headerAuth  = req.headers['authorization'];
    const userId      = jwtUtils.getUserId(headerAuth);

    // Params
    const content = req.body.content;
    const tag = req.body.tag
    const attachment =
    () => {
      if(req.file){
        return `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
      if(req.body.gif){
        return req.body.gif
      }
      return null 
    }

    if (tag == null || content == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    if ( content.length > CONTENT_LIMIT) {
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
            tag  : tag,
            content: content,
            likes  : 0,
            UserId : userFound.id,
            attachment: attachment()
          })
          .then(function(newMessage) {
            done(null, newMessage, userFound);
          }).catch((err)=>{
            return res.status(404).json({'error': err})
        });
        } else {
          res.status(404).json({ 'error': 'user not found' });
        }
      },
      function( newMessage, userFound, done){
        if(newMessage) {
          userFound.update({
            exp: userFound.exp + 5
          }).then(function(userFound) {
            done(userFound);
          }).catch((err)=>{
            return res.status(404).json({'error': err})
        });
        } else {
          res.status(500).json({ 'error': 'Impossible de mettre à jour l\'utilisateur' });
        }
      }
    ], function(userFound) {
      if (userFound) {
        return res.status(201).json({'message' : 'post saved'});
      } else {
        return res.status(500).json({ 'error': 'cannot post message' });
      }
    });
  },


  listMessages: function(req, res) {
    const fields  = req.query.fields;
    const limit   = parseInt(req.query.limit);
    const offset  = parseInt(req.query.offset);
    const order   = req.query.order;

    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }

    models.Message.findAll({
      order: [(order != null) ? order.split(':') : ['createdAt', 'DESC'],['Comments', 'createdAt', 'DESC']],
      attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
      limit: (!isNaN(limit)) ? limit : null,
      offset: (!isNaN(offset)) ? offset : null,
      include: [
        {
        model: models.Like,
        attributes :['userId']
      },
        {
        model: models.User,
        attributes :['id','bio','username','exp', 'profilePicture']
      },
      {
        model: models.Comment,
        attributes: [ 'id','content','gifUrl' ],
        include: [ {
          model: models.User,
          attributes :['username' ,'exp', 'profilePicture']
        }]
      }
    ],
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
  destroyMessage : (req, res) => {
 // Getting auth header
 const headerAuth  = req.headers['authorization'];
 const userId      = jwtUtils.getUserId(headerAuth);

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
        console.log(messageFound.UserId);
        done( null ,userFound, messageFound)
       }).catch((err) => {
         return res.status(400).json({ 'error': 'Impossible de trouver le message'})
       });
    }
   },(userFound,messageFound, done) => {
     ;
    if(userFound.id !== messageFound.UserId){
      return res.status(500).json({ 'error': 'L\'utilisateur n\'a pas les droit nécessaire'})
    }
    done( null , messageFound)},
   (messageFound, done) => {
     if(messageFound){
      if(messageFound.attachment){
        const filename = messageFound.attachment.split('/images/')[1];
      console.log(filename);
        fs.unlink(`images/${filename}`, () => {
          console.log(messageFound);
         models.Message.destroy({
           where : { id : req.params.id }
         }).then((messageDestroy) => {
          done( messageDestroy)
         }).catch((err) => {
           return res.status(500).json({ 'error': 'Impossible de supprimer le message'})
      })
    })
  }else{
    models.Message.destroy({
      where : { id : req.params.id }
    }).then((messageDestroy) => {
     done( messageDestroy)
    }).catch((err) => {
      return res.status(500).json({ 'error': 'Impossible de supprimer le message'})
    });
  }
       
    } 
   }
 ],function(messageDestroy) {
      if (messageDestroy) {
        return res.status(201).json({'message' : 'message supprimée'});
      } else {
        return res.status(500).json({ 'error': 'cannot post message' });
      }
    })
  },
  adminDestroyMessage : (req, res) => {
    // Getting auth header
    const headerAuth  = req.headers['authorization'];
    const userId      = jwtUtils.getUserId(headerAuth);
    const isAdmin      = jwtUtils.getIsAdmin(headerAuth);
   
    asyncLib.waterfall([
      (done) => {
        models.User.findOne({
          where : { id: userId,
          isAdmin: isAdmin }
        })
        .then((adminFound) => {
         done( null , adminFound)
        }).catch((err) => {
          return res.status(500).json({ 'error': 'Impossible de vérifier l\'administrateur'})
        });
      },
      (adminFound, done) => {
       if(adminFound){
         models.Message.findOne({
           where : { id : req.params.id}
         }).then((messageFound) => {
           done( null , messageFound)
          }).catch((err) => {
            return res.status(400).json({ 'error': 'Impossible de trouver le message'})
          });
       }
      },
      (messageFound, done) => {
        if(messageFound){
         if(messageFound.attachment){
           const filename = messageFound.attachment.split('/images/')[1];
         console.log(filename);
           fs.unlink(`images/${filename}`, () => {
             console.log(messageFound);
            models.Message.destroy({
              where : { id : req.params.id }
            }).then((messageDestroy) => {
             done( messageDestroy)
            }).catch((err) => {
              return res.status(500).json({ 'error': 'Impossible de supprimer l\'image'})
         })
       })
     }else{
      messageFound.destroy({
       }).then((messageDestroy) => {
        done( messageDestroy)
       }).catch((err) => {
         return res.status(500).json({ 'error': 'Impossible de supprimer le message'})
       });
     }
          
       } 
      }
    ],function(messageDestroy) {
         if (messageDestroy) {
           return res.status(201).json({'message' : 'message supprimée'});
         } else {
           return res.status(500).json({ 'error': 'Impossible de supprimer le message' });
         }
       })
     }
}