const appErrorr = require("../utils/appErrorr")

module.exports = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.currentUser.roles)) {
            return next(appErrorr.create('this role is not allowed', 401));
        }
        next();
    }
}