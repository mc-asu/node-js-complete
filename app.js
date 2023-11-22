const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// set any values globally //sharing data
app.set('view engine', 'pug') // set templating engine
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
    res.status(404).render('404')
}) 


app.listen(3000) // localhost portname