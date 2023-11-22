const path = require('path')

const express = require('express')

const rootDir = require('../util/path')
const adminData = require('./admin')

const router = express.Router()

router.get('/', (req, res, next) => {
    // console.log('shopjs', adminData.products)
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
    const products = adminData.products
    res.render('shop', {prods: products, pageTitle: 'Shop', path:'/', hasProducts: products.length > 0, activeShop: true, productCSS: true })
    // hasProducts: products.length > 0, added because handlebars don't suppurt statements

}) 



module.exports = router