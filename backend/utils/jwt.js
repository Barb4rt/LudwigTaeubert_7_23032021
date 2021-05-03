const jwt = require('jsonwebtoken')

const JWT_SIGN_SECRET = '1fdsfjgh4kilmjkm8erqs2f1s5d4fsdf55sdfds65fdsfqdqsdq';

module.exports = {
    generateTokenForUser: function(userData){
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: "24h"
        })
    },
    parseAuthorization: function(authorization){
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },
    getUserId: function(authorization) {
        let userId = -1;
        let token = module.exports.parseAuthorization(authorization);
        if(token != null) {
            try{
                let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if(jwtToken != null)
                userId = jwtToken.userId;
            }catch(err){ }
        }
        return userId;
    }
}