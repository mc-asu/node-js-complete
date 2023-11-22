const path = require ('path')

const express = require('express')

const router = express.Router()

router.get('/hello', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'hello.html'))
})

module.exports = router