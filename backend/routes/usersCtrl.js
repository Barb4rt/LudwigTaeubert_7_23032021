// Imports
var bcrypt    = require('bcrypt');
var jwtUtils  = require('../utils/jwt');
var models    = require('../models');
var asyncLib  = require('async');
var fs = require('fs')

// Constants
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,8}$/;

// Routes
module.exports = {
  register: (req, res) => {
    
    // Params
    var email    = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var bio      = req.body.bio;
    let profilePicture =
    () => {
      if(req.file){
        return `${req.protocol}://${req.get('host')}/images/profilesPicture/${req.file.filename}`
      }return  `${req.protocol}://${req.get('host')}/images/profilesPicture/DefaultPP.jpeg`
    }

    if (email == null || username == null || password == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    if (username.length >= 13 || username.length <= 4) {
      return res.status(400).json({ 'error': 'wrong username (must be length 5 - 12)' });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ 'error': 'email is not valid' });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
    }

    asyncLib.waterfall([
      (done) => {
        models.User.findOne({
          attributes: ['email'],
          where: { email: email }
        })
        .then((userFound) => {
          done(null, userFound);
        })
        .catch((err) => {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      (userFound, done) => {
        if (!userFound) {
          bcrypt.hash(password, 5, ( err, bcryptedPassword ) => {
            done(null, userFound, bcryptedPassword);
          });
        } else {
          return res.status(409).json({ 'error': 'user already exist' });
        }
      },
      (userFound, bcryptedPassword, done) => {
        var newUser = models.User.create({
          email: email,
          username: username,
          password: bcryptedPassword,
          bio: bio,
          exp: 0,
          profilePicture: profilePicture(),
          isAdmin: 0
        })
        .then((newUser) => {
          done(newUser);
        })
        .catch((err) => {
          return res.status(500).json({ 'error': 'cannot add user' });
        });
      }
    ], (newUser) => {
      if (newUser) {
        return res.status(201).json({
          'userId': newUser.id,
          'token': jwtUtils.generateTokenForUser(newUser),
        });
      } else {
        return res.status(500).json({ 'error': 'cannot add user' });
      }
    });
  },
  login: (req, res) => {
    
    // Params
    var email    = req.body.email;
    var password = req.body.password;

    if (email == null ||  password == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    asyncLib.waterfall([
      (done) => {
        models.User.findOne({
          where: { email: email }
        })
        .then((userFound) => {
          done(null, userFound);
        })
        .catch((err) => {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      (userFound, done) => {
        if (userFound) {
          bcrypt.compare(password, userFound.password, (errBycrypt, resBycrypt) => {
            done(null, userFound, resBycrypt);
          });
        } else {
          return res.status(404).json({ 'error': 'user not exist in DB' });
        }
      },
      (userFound, resBycrypt, done) => {
        if(resBycrypt) {
          done(userFound);
        } else {
          return res.status(403).json({ 'error': 'invalid password' });
        }
      }
    ], (userFound) => {
      if (userFound) {
        return res.status(201).json({
          'userId': userFound.id,
          'token': jwtUtils.generateTokenForUser(userFound),
        });
      } else {
        return res.status(500).json({ 'error': 'cannot log on user' });
      }
    });
  },
  getUserProfile: (req, res) => {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    if (userId < 0)
      return res.status(400).json({ 'error': 'wrong token' });

    models.User.findOne({
      attributes: [ 'id', 'email', 'username','exp', 'bio','profilePicture' ],
      where: { id: userId }
    }).then((user) => {
      if (user) {
        res.status(201).json(user);
      } else {
        res.status(404).json({ 'error': 'user not found' });
      }
    }).catch((err) => {
      res.status(500).json({ 'error': 'cannot fetch user' });
    });
  },

  getAllUsers: (req, res) => {
    // Getting auth header
    models.User.findAll({
      attributes: [ 'id','username','exp', 'bio','profilePicture' ],
    }).then((users) => {
      if (users) {
        res.status(201).json(users);
      } else {
        res.status(404).json({ 'error': 'user not found' });
      }
    }).catch((err) => {
      res.status(500).json({ 'error': 'cannot fetch user' });
    });
  },
  updateUserProfile: (req, res) => {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    // Params
    let newbio = req.body.bio;

    asyncLib.waterfall([
      (done) => {
        models.User.findOne({
          attributes: ['id', 'bio','exp', 'profilePicture', 'username'],
          where: { id: userId }
        }).then( (userFound) => {
          done(null, userFound);
        })
        .catch((err) => {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      (userFound, done) => {
          
        if(userFound) {
          const oldProfilePicture = `${req.protocol}://${req.get('host')}/images/profilesPicture/DefaultPP.jpeg`
           
            fs.unlink(`images/profilesPicture/${oldProfilePicture}`, () => {
              userFound.update({
                bio: (req.body.bio ? req.body.bio : userFound.bio),
                profilePicture: (req.file ? `${req.protocol}://${req.get('host')}/images/profilesPicture/${req.file.filename}` : userFound.profilePicture) 
              }).then((userFound) => {
              done( userFound)
             }).catch((err) => {
            res.status(500).json({ 'error': 'cannot update user' })
          });
        })
      } 
        else {
          res.status(404).json({ 'error': 'user not found' });
        }
      },
    ], (userFound) => {
      if (userFound) {
        return res.status(201).json(userFound);
      } else {
        return res.status(500).json({ 'error': 'cannot update user profile' });
      }
    });
  },

  destroyUser : (req, res) => {
    // Getting auth header
    const headerAuth  = req.headers['authorization'];
    const userId      = jwtUtils.getUserId(headerAuth);
   
    asyncLib.waterfall([
      (done) => {
        models.User.findOne({
          where : { id: userId}
        })
        .then((userFound) => {
          console.log('ici');
         done( null , userFound)
        }).catch((err) => {
          return res.status(500).json({ 'error': 'Impossible de vérifier l\'utilisateur'})
        });
      },
      (userFound, done) => {
        if(userFound){
          
         if(userFound.profilePicture === `${req.protocol}://${req.get('host')}/images/profilesPicture/DefaultPP.jpeg` ){
          
         userFound.destroy({
          }).then((userDestroy) => {
           done( userDestroy)
          }).catch((err) => {
            return res.status(500).json({ 'error': 'Impossible de supprimer l\'utilisateur'})
          }); 
       }else{
        console.log(userFound.profilePicture); 
         const filename = userFound.profilePicture.split('/profilesPicture/')[1];
         console.log(filename);
         fs.unlink(`images/profilesPicture/${filename}`, () => {
           console.log(userFound);
           userFound.destroy({
          }).then((userDestroy) => {
           done( userDestroy)
          }).catch((err) => {
            return res.status(500).json({ 'error': 'Impossible de supprimer l\'utilisateur'})
       }) 
       })
      }
     }
  }
    ],function(userDestroy) {
         if (userDestroy) {
           return res.status(201).json({'message' : 'utilisateur supprimée'});
         } else {
           return res.status(500).json({ 'error': 'cannot post message' });
         }
       })
     } 
}