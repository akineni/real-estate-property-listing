require('dotenv').config()
const express = require('express')

const app = express()
const port = 3000
const host = 'localhost'

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

//caching
app.use('/dashboard', require('nocache')())
app.set('etag', false)

app.use(require('express-session')({
    secret: process.env.EXPRESS_SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}))

app.use(express.static('public')) //serve static files in ./public
app.use('/uploads', express.static('uploads'))

app.use('/', require('./_routers/routes'))

app.listen(port, () => { 
  console.log(`Example app listening at http://${host}:${port}`)
})