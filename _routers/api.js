require('../_mongoose/connection')
const express = require('express')
const { validationResult } = require('express-validator')
const { logInValidation, registrationValidation } = require('../_middlewares/validations')
const { isLoggedOut } = require('../_middlewares/auth')
const { userModel } = require('../_mongoose/models')
const bcrypt = require('bcrypt')

saltRounds = 10

var router = express.Router()

router.use(express.urlencoded({
    extended: true
}))

router.use(express.json())

router.use('/dashboard', isLoggedOut, require('./dashboard'))

router.post('/log-in', logInValidation, (req, res) => {
    
    //if (errors) don't bother search database
    var validationErrors = validationResult(req).formatWith( ({ msg }) => {
        return msg
    })
    if(!validationErrors.isEmpty()) return res.status(401).send({ validationErrors: validationErrors.mapped() })

    userModel.findOne({ email: req.body.email }, (error, document) => {
        if(error) throw error

        if (document) {
            //email found
            bcrypt.compare(req.body.password, document.password, (error, result) => {
                if (error) throw error
                
                //user found
                if (result) {
                    req.session.UID = document._id
                    return res.send('repl-success')
                } else res.status(401).end()
            })
        } else res.status(401).end()
    })
})

router.post('/register', registrationValidation, (req, res) => {

    var validationErrors = validationResult(req).formatWith( ({ msg }) => {
        return msg
    })
    if(!validationErrors.isEmpty()) return res.status(401).send({ validationErrors: validationErrors.mapped() })

    bcrypt.hash(req.body.password, saltRounds, (error, hash) => {
        if(error) throw error

        req.body.password = hash

        userModel.create(req.body, (error, document) => {
            if(error) throw error

            if (document) {
                req.session.UID = document._id
                res.send('repl-success')
            }
        })
    })

})

module.exports = router