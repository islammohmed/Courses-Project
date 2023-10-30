const express = require('express');
const router = express.Router();
const userController = require('../controller/users.controller');
const verifyToken =require('../middlewares/varifyToken');
const multer  = require('multer');
const appErrorr = require('../utils/appErrorr');
const diskStorage = multer.diskStorage({
        destination: function(req, file, cb){
                console.log("FILE", file);
                cb(null, 'uploads');
        },
        filename: function(req, file, cb){
                const ext = file.mimetype.split('/')[1];
                const fileName = `user-${Date.now()}.${ext}`;
                cb(null, fileName)
        }
})
const  fileFilter = (req, file, cb) => {
        const imageType = file.mimetype.split('/')[0];
        if(imageType == 'image'){
                return cb(null, true)
        }else {
                return cb(appErrorr.create('the file must be an image',400),false)
        }
}
const upload = multer({
        storage: diskStorage,
        fileFilter
});
router.route('/')
        .get(verifyToken,userController.getAllusers)


router.route('/register')
        .post(upload.single('avatar'), userController.register)    
        
        
router.route('/login')
        .post(userController.login)           
 

module.exports = router;