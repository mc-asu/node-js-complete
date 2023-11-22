const path = require ('path')

const express = require('express')

const router = express.Router()

router.get('/bye', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'bye.html'))
})

module.exports = router