const { body } = require("express-validator")
const validationSchema = () => {
    return [
        body('title')
        .notEmpty()
        .withMessage("title is require")
        .isLength({min:3})
        .withMessage("Title at least is 2 digits"),
        body('price')
            .notEmpty()
            .withMessage("price is require")
        ]   
} 

module.exports = {
    validationSchema
}