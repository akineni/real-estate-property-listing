const { body } = require('express-validator')
require('dotenv').config()

const passwordMinLength = JSON.parse(process.env.MINLENGTHS).password

module.exports = {
    logInValidation: [
        body(['email', 'password'])
        .trim()
        .notEmpty().withMessage((value, {path}) => {
            return path[0].toUpperCase() + path.substring(1) + " is required"
        }),

        body('email')
        .isEmail().withMessage('Invalid email'),
        
        body('password')
        .isLength({min: passwordMinLength}).withMessage(
            "Minimum length of '" + passwordMinLength + "'")
    ],

    registrationValidation: [
        body(['name', 'username', 'type', 'email', 'password', 'password2', 'acceptance'])
        .trim()
        .notEmpty().withMessage((value, {path}) => {
            return path + " is required"
        }),

        body('name')
        .isAlpha('en-US', { ignore: ' ' }).withMessage('Bad name'),

        body('username')
        .isAlphanumeric().withMessage('Bad username'),

        body('email')
        .isEmail().withMessage('Invalid email'),
        
        body('password')
        .isLength({min: passwordMinLength}).withMessage(
            "Minimum length of '" + passwordMinLength + "'"),

        body('password2')
        .custom((value, { req }) => {
            if (value !== req.body.password) throw new Error('Passwords mismatch')
            
            // Indicates the success of this synchronous custom validator
            return true;
        }),

        body('acceptance')
        .custom(value => {

            //another way of custom validation, different from above
            return value == "true"
        }).withMessage('Accept T&C and privacy policy')
    ]
}