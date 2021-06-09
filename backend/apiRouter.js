const express = require('express');
const usersCtrl = require('./routes/usersCtrl');
const messageCtrl = require('./routes/messageCtrl');
const commentCtrl = require('./routes/commentCtrl');
const multerMsg = require('./middleware/multer-msg');
const multerProfile = require('./middleware/multer-profilePicture');
const likesCtrl    = require('./routes/likesCtrl');

exports.router = (function(){
    const apiRouter = express.Router();

    apiRouter.route('/user/register/').post(multerProfile,usersCtrl.register);
    apiRouter.route('/user/login/').post(usersCtrl.login);
    apiRouter.route('/user/me/').get(usersCtrl.getUserProfile);
    apiRouter.route('/users/all/').get(usersCtrl.getAllUsers);
    apiRouter.route('/user/me/').put(multerProfile,usersCtrl.updateUserProfile);
    apiRouter.route('/user/:id').delete(usersCtrl.destroyUser)
    apiRouter.route('/admin/users/:id').delete(usersCtrl.adminDestroyUser)

    apiRouter.route('/messages/new/').post(multerMsg,messageCtrl.createMessage);
    apiRouter.route('/messages/:id').delete(messageCtrl.destroyMessage);
    apiRouter.route('/admin/messages/:id').delete(messageCtrl.adminDestroyMessage);
    apiRouter.route('/messages/').get(messageCtrl.listMessages);

    apiRouter.route('/message/comment').post(commentCtrl.createComment);
    apiRouter.route('/message/comment/:id').delete(commentCtrl.destroyComment);

    apiRouter.route('/messages/like').post(likesCtrl.likePost);
    return apiRouter;
})();