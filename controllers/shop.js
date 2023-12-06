const Product = require('../models/product')
const Order = require('../models/order')
const errorHandler = require('../util/errorHandler')

exports.getProducts = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    })
  }).catch(err => errorHandler(err))
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId
  Product.findById(prodId).then((product) => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
    })
  }).catch(err => errorHandler(err))
}

exports.getIndex = (req, res, next) => {
  Product.find().then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    })
  }).catch(err => errorHandler(err))
} 

exports.getCart = (req, res, next) => {
  req.user
      .populate('cart.items.productId')
      .then(user => {
        const products = user.cart.items
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: products,
        })
      }).catch(err => errorHandler(err))
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId

  Product.findById(prodId).then(product => {
    return req.user.addToCart(product)
  }).then(result => {
    res.redirect('/cart')
  }).catch(err => errorHandler(err))

}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  req.user.removeFromCart(prodId).then((result) => {
    res.redirect('/cart')
  }).catch(err => errorHandler(err))
}

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: {...i.productId._doc}}
      })
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products
      })
      return order.save()
    })
    .then(result => {
      return req.user.clearCart()
   }).then(() => {
    res.redirect('/orders')
   }).catch(err => errorHandler(err))
}

exports.getOrders = (req, res, next) => {
  Order.find({'user.userId': req.user._id})
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
    })
  }).catch(err => errorHandler(err))

}
