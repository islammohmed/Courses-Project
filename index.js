require('dotenv').config();
const express = require ('express');
const app = express();
const cors = require ('cors');
const httpStatusText = require('./utils/httpStatusText');
const mongoose = require('mongoose');
const path = require('path');
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname,'uploads')));


const url = process.env.MONGO_URL;



mongoose.connect(url).then(()=>{
    console.log("mongoeDB server started");
})
app.use(express.json());


const coursesRouter = require ('./routes/courses.route');
const usersRouter = require ('./routes/users.route');



app.use('/api/courses',coursesRouter);
app.use('/api/users', usersRouter);


// global middleware for not found router
app.all('*', (req,res,next)=> {
    return res.status(error.statusCode || 500).json({status: httpStatusText.ERROR, message: 'this resource is nont found'})
})
// global error handler
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500 ).json({status: error.httpStatusText || httpStatusText.ERROR, message: error.message, code :error.statusCode || 500 , data:null })
})

    app.listen(process.env.PORT || 4000 ,()=>{
    console.log("app listen on port : 4000");
    });