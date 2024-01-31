require('dotenv')
var router = require('express').Router()
const { userModel, propertyModel } = require('../_mongoose/models')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

var storage = multer.diskStorage({
    destination: process.env.UPLOADS_DIR,
    filename: (req, file, cb) => {
        cb(null, uuidv4() + file.originalname.substr(file.originalname.lastIndexOf('.')))
    }
})

var upload = multer({ storage })

//current-user
router.get('/cu', (req, res) => {
    userModel.findById(req.session.UID, '-password', (error, document) => {
        if (error) throw error

        if (document) res.json( {document} )
    })
})

router.get('/properties', (req, res) => {
    propertyModel.find({UID: req.session.UID}, null, {sort: '-now'}, (error, document) => {
        if (error) throw error

        if (document) res.json( {document} )
    })
})

router.get('/property/:propertyId', (req, res) => {
    propertyModel.findById(req.params.propertyId, '-_id -UID -__v', (error, document) => {
        if (error) throw error

        if (document) res.json( document )
    })
})

//list-property
router.post('/lp', upload.array('photos', process.env.UPLOAD_MAX), (req, res) => {
    req.body.photos = req.files.map(file => { return file.path })
    req.body.UID = req.session.UID
    
    propertyModel.create(req.body, (error, document) => {
        if(error) throw error

        if(document) res.send('repl-success')
    }) 
})

module.exports = router