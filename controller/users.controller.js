const asyncWrapper = require('../middlewares/asyncWrapper');
const User = require ('../models/user.model')
const httpStatusText = require('../utils/httpStatusText');
const appErrorr = require('../utils/appErrorr');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateJWT = require('../utils/generateJWT');




const getAllusers = asyncWrapper(async (req,res) => {
    const query = req.query;
    const limit = query.limit || 10 ;
    const page =  query.page || 10 ; 
    const skip =  (page - 1) * limit ;
        const users = await User.find({},{"__v":false,"password":false});//.limit(limit).skip(skip)
        res.json({status:httpStatusText.SUCCESS, data:{users}});
    })


const register = asyncWrapper (async (req, res ,next) => {
    const { firstName, lastName, email, password ,role } = req.body;
        
    const oldUser = await User.findOne({ email: email});

    if(oldUser){
        const error = appErrorr.create('user already exists', 400, httpStatusText.FAIL)
        return next(error);
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        firstName,
        lastName,
        email,
        password : hashedpassword,
        role,
        avatar: req.file.filename
    })
    
    //generate jwt token
    const token = await generateJWT({email: newUser.email, id: newUser._id, role:newUser.role});
    newUser.token = token;
    await newUser.save();
    res.status(201).json({status: httpStatusText.SUCCESS, data:{user: newUser}});
})

const login = asyncWrapper(async(req, res, next) => {
const {email, password} = req.body;
        if(!email || !password){
            const error = appErrorr.create('All faild are require', 400, httpStatusText.FAIL)
                return next(error);
        }
        const user = await User.findOne({email: email});
        
        if(!user){
            const error = appErrorr.create('user not found ' ,400 ,httpStatusText.FAIL);
            return next(error);
        }
    
        const matchedpassword = await bcrypt.compare(password, user.password);

        if(user && matchedpassword)
        { 
            const token = await generateJWT({email: user.email, id: user._id});
            res.status(201).json({status: httpStatusText.SUCCESS, data:{token}})
        }else {
            const error = appErrorr.create('email not found', 500, httpStatusText.ERROR)
            return next(error);
        }
})

module.exports = {
    getAllusers,
    register,
    login
}