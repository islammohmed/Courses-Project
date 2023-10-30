const jwt =require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText');
const appErrorr = require('../utils/appErrorr');
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if(!authHeader) {
        const error = appErrorr.create('token is required', 401, httpStatusText.ERROR)
        return next(error);
    }
    const token = authHeader.split(' ')[1];
    try {    
        const currentUser = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.currentUser = currentUser;   
        next();
    } catch (err) {
        const error = appErrorr.create('invalid token', 401, httpStatusText.ERROR)
        return next(error);
        
    }

}





module.exports = verifyToken;