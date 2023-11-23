const Product = require('../models/product')

exports.getIndex = (req, res, next) => {
    res.render('shop/index', { 
        pageTitle: 'Home',
        path:'/',
    })
}

exports.getCart = (req, res, next) => {
    res.render('shop/cart', { 
        pageTitle: 'Cart',
        path:'/cart',
    })
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', { 
        pageTitle: 'Checkout',
        path:'/checkout',
    })
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', { 
        pageTitle: 'Orders',
        path:'/orders',
    })
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Product List',
            path:'/product-list',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true })
    })
}