const path = require('path')

const express = require('express')

const { body} = require('express-validator')

const adminController = require('../controllers/admin')

const isAuth = require('../middleware/is-auth')
const { isFloat32Array } = require('util/types')

const router = express.Router()


router.get('/products', isAuth, adminController.getProducts)

router.get('/add-product', isAuth,  adminController.getAddProduct)

router.get('/edit-product/:productId', isAuth,  adminController.getEditProduct)

router.post(
    '/add-product', 
    [
        body('title')
            .isString()
            .isLength({ min: 3 })
            .withMessage('Title need at least 3 characters and must be alphanumeric.')
            .trim(),
        body('imageUrl')
            .isURL(),
        body('price')
            .isFloat(),
        body('description')
            .isLength({ min: 5 })
            .trim(),
    ],
    isAuth,
    adminController.postAddProduct
)

router.post(
    '/edit-product', 
    [
        body('title')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('imageUrl')
            .isURL(),
        body('price')
            .isFloat(),
        body('description')
            .isLength({ min: 5 })
            .trim(),
    ],
    isAuth, 
    adminController.postEditProduct
)

router.post('/delete-product', isAuth, adminController.postDeleteProduct)

module.exports = router
