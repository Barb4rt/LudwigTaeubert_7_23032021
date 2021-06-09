// Imports
let models   = require('../models');
let asyncLib = require('async');
let jwtUtils = require('../utils/jwt');


// Constants
const CONTENT_LIMIT = 150;
const ITEMS_LIMIT   = 50;

// Routes
module.exports = {
  createComment: (req, res) => {
    // Getting auth header
    let headerAuth  = req.headers['authorization'];
    let userId      = jwtUtils.getUserId(headerAuth);
    
    // Params
    console.log(req.body);
    let content = req.body.content;
    let messageId = req.body.messageId;
    let gifUrl = req.body.gifUrl
    

    if (content == null && gifUrl == null  ) {
      return res.status(400).json({ 'error': 'requête non valide' });
    }

    if ( content.length > CONTENT_LIMIT) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

    asyncLib.waterfall([
      (done)=> {
        models.User.findOne({
          where: { id: userId }
        })
        .then((userFound)=>{
          done(null, userFound);
        })
        .catch((err) => {
          return res.status(500).json({ 'error': 'impossible d\'authentifier l\'utilisateur' });
        });
      },(userFound, done)=> {
        models.Message.findOne({
          where: { id: messageId }
        })
        .then((messageFound)=>{
          done(null, userFound, messageFound);
        })
        .catch((err) => {
          return res.status(404).json({ 'error': 'impossible de trouver le message' });
        });
      },
      (userFound, messageFound, done) => {
        if(messageFound) {
          models.Comment.create({
            UserId: userFound.id,
            content: content,
            gifUrl: gifUrl,
            MessageId: messageFound.id
          })
          .then((newComment)=>{
            done( null, newComment , userFound);
          }).catch((err)=>{
            return res.status(500).json({'error': 'Impossible de créer le commentaire'})
        });
        } else {
          res.status(404).json({ 'error': 'Impossible de trouver l\'utilisateur' });
        }
      },
      function( newComment, userFound, done){
        console.log(newComment);
        if(newComment) {
          userFound.update({
            exp: userFound.exp + 3
          }).then(function(userFound) {
            done(userFound);
          }).catch((err)=>{
            return res.status(404).json({'error': err})
        });
        } else {
          res.status(500).json({ 'error': 'Impossible de mettre à jour l\'utilisateur' });
        }
      }
    ], (newComment)=> {
      if (newComment) {
        return res.status(201).json(newComment);
      } else {
        return res.status(500).json({ 'error': 'Impossible de d\'envoyer le commentaire ' });
      }
    });
  },
  destroyComment : (req, res) => {
 // Getting auth header
 let headerAuth  = req.headers['authorization'];
 let userId      = jwtUtils.getUserId(headerAuth);
 let commentId = req.params.id

 console.log(userId);
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
      models.Comment.findOne({
        where : { id : commentId}
      }).then((commentFound) => {
        done( null , commentFound)
       }).catch((err) => {
         return res.status(404).json({ 'error': 'Impossible de trouver le commentaire'})
       });
    }
   },
   (commentFound, done) => {
     if(commentFound){
      console.log(commentFound.id);
       models.Comment.destroy({
         where : { id : commentFound.id }
       }).then((commentDestroy) => {
        
        done( commentDestroy)
       }).catch((err) => {
         return res.status(500).json({ 'error': 'Impossible de trouver le commentaire'})
       });
    } 
   }
 ],(commentDestroy) => {
      if (commentDestroy) {
        return res.status(201).json({'comment' : 'commentaire supprimée'});
      } else {
        return res.status(500).json({ 'error': 'impossible de supprimer le commentaire' });
      }
    })
  }
}