const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const expressHbs = require('express-handlebars')

const app = express()

// set any values globally //sharing data
app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname:'hbs'}))
app.set('view engine', 'hbs') // use handlebars template engine

//Define engine as the engine isnt installed yet unlike pug


// app.set('view engine', 'pug') // use pug template engine
app.set('views', 'views') // where to find these template

const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminData.routes)
app.use(shopRoutes)

// catch all route
app.use((req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
    res.status(404).render('404', { pageTitle: 'Page not found'})
}) 


app.listen(3000) // localhost portname