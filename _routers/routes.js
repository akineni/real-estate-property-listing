const express = require('express')
const { isLoggedIn, isLoggedOut } = require('../_middlewares/auth')
const { propertyModel } = require('../_mongoose/models')
const cleanDeep = require('clean-deep')
var router = express.Router()

var keywordQuery = str => {
    regex = ''
    str.split(' ').forEach((keyword, i, arr) => {
        regex += '(' + keyword + ')'
        if (i < arr.length - 1) regex += '|'
    })

    return regex
}

router.use(express.urlencoded({
    extended: true
}))
router.use(express.json())

router.use('/api', require('./api'))

router.get('/', (req, res) => {
    res.render('index')
})

router.post('/results', async (req, res) => {
    query = cleanDeep(req.body)

    if (query['spec.bedrooms'] == "6+") query['spec.bedrooms'] = { $gte: "6" }
    if(query.location) {

        query.location['$regex'] = keywordQuery(query.location['$regex'])
        query.location['$options'] = 'i'

    }
    if(query.description) {

        query.description['$regex'] = keywordQuery(query.description['$regex'])
        query.description['$options'] = 'i'

    }

    propertyModel.find(query, null, {sort: '-now'}, (error, result) => {
        if (error) throw error

        document = [] 
        result.forEach((property, i) => {
            document[i] = property._doc
        })

        res.render( 'results', {document} )
    })
})

router.get('/property/:propertyId', (req, res) => {
    propertyModel.findById(req.params.propertyId, '-_id -UID -__v', (error, document) => {
        if (error) throw error

        if (document) res.render('property', { document: document._doc } )
    })
})

router.get('/login', isLoggedIn, (req, res) => {
    res.render('login')
})

router.get('/register', isLoggedIn, (req, res) => {
    res.render('register')
})

router.get('/dashboard', isLoggedOut, (req, res) => {
    res.render('dashboard')
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/login')
    }) 
})

router.get('/dashboard/*', isLoggedOut, (req, res) => {
    res.render('dashboard')
})

router.get('*', (req, res) => {
    res.status(404).render('404')
})

module.exports = router