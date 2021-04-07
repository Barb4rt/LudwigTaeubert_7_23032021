const express = require('express');
const usersCtrl = require('./routes/usersCtrl');
const messageCtrl = require('./routes/messageCtrl');
const multer = require('./middleware/multer-config')

exports.router = (function(){
    const apiRouter = express.Router();

    apiRouter.route('/users/register/').post(multer,usersCtrl.register);
    apiRouter.route('/users/login/').post(usersCtrl.login);
    apiRouter.route('/users/me/').get(usersCtrl.getUserProfile);
    apiRouter.route('/users/me/').put(multer,usersCtrl.updateUserProfile);

    apiRouter.route('/messages/new/').post(multer,messageCtrl.createMessage);
    apiRouter.route('/messages/:id').delete(messageCtrl.deleteMessage);
    apiRouter.route('/messages/').get(messageCtrl.listMessages);
    apiRouter.route('/users/messages/').get(messageCtrl.listUsersMessages);
    return apiRouter;
})();