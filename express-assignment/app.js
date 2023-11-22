const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const byeRoutes = require('./routes/bye')
const helloRoutes = require('./routes/hello')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))


app.use(byeRoutes)
app.use(helloRoutes)

app.listen(3000)