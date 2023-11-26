const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const verifyToken = require('../middlewares/varifyToken');
const userRoles = require('../utils/userRoules');
const courseController = require ('../controller/course.controller')
const allowedTo = require('../middlewares/allowedTo');

const { validationSchema } = require ('../middlewares/validationSchema')



router.route('/')
            .get(courseController.getAllcourses)
            .post(verifyToken,allowedTo(userRoles.MANGER),validationSchema(),courseController.addcourse);   


router.route('/:courseId')
            .get(courseController.getCourse)
            .patch(courseController.updateCourse )
            .delete(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANGER),courseController.deleteCourse);

module.exports = router ;