const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product',  { 
        pageTitle: 'Add product',
        path: '/admin/add-product', 
        activAddProduct: true, 
        productCSS: true, 
        formsCSS: true
    })
}

exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body
    const product = new Product(title, imageUrl, description, price)
    product.save()
    res.redirect('/')
}

exports.getEditProduct = (req, res, next) => {
    res.render('admin/edit-product',  { 
        pageTitle: 'Edit product',
        path: '/admin/edit-product', 
        activAddProduct: true, 
        productCSS: true, 
        formsCSS: true
    })
}

exports.postEditProduct = (req, res, next) => {

    // fetch object, edit, save
    res.redirect('/')
}

exports.deleteProduct = (req, res, next) => {

    // fetch object, edit, save
    res.redirect('/')
}

exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/product-list', {
            prods: products,
            pageTitle: 'Admin Product list',
            path:'/admin/product-list',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true })
    })
}