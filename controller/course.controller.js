// data which we use in this project 
const asyncWrapper = require('../middlewares/asyncWrapper');
const Course = require('../models/course.model');
const httpStatusText = require('../utils/httpStatusText');
const { validationResult } = require('express-validator');
const appErrorr = require('../utils/appErrorr');


const getAllcourses = asyncWrapper(async (req,res) => {
    const query = req.query;
    const limit = query.limit || 10 ;
    const page =  query.page || 10 ; 
    const skip =  (page - 1) * limit ;
        const courses = await Course.find({},{"__v":false}).limit(limit).skip(skip);;
        res.json({status:httpStatusText.SUCCESS, data:{courses}});
    })

const getCourse = asyncWrapper ( 
    async (req,res,next) => {
    
    const course = await Course.findById(req.params.courseId);
    if(!course)
    {
    
        const error = appErrorr.create('course not found', 404, httpStatusText.statusText)
        return next(error);
        
    }
    res.json({status:httpStatusText.SUCCESS, data:{course}});
})


const addcourse = asyncWrapper(async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        const error = appErrorr.create(error.array(), 400, httpStatusText.statusText)
        return next(error);
    }
    
    
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json({status:httpStatusText.SUCCESS, data:{course:newCourse}});
})


const updateCourse = asyncWrapper(async (req,res)=>{
        const courseId = req.params.courseId;
    
    const updatedCourse = await  course.updateOne(courseId, {$set: {...req.body}});
    res.status(200).json({status:httpStatusText.SUCCESS, data:{course:updateCourse}})
        
    }  
)

const deleteCourse = asyncWrapper( async(req,res)=>{
    await Course.deleteOne({_id:req.params.courseId});
    return res.status(200).json({status:httpStatusText.SUCCESS, data:null})
})

module.exports = {
    getAllcourses,
    getCourse,
    addcourse,
    updateCourse,
    deleteCourse
}