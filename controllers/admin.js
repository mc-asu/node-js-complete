const { validationResult } = require('express-validator')
const errorHandler = require('../util/errorHandler')

const Product = require('../models/product')
const User = require("../models/user")


exports.getAddProduct = (req, res, next) => {
  if(!req.session.isLoggedIn) {
    return res.redirect('/login')
  }
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product', 
    editing: false, 
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  })
}

exports.postAddProduct = (req, res, next) => {
  const { title, price, description } = req.body
  const image = req.file
  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: false,  
      hasError: true,
      product: {
        title: title,
        price: price, 
        description: description, 
      },
      errorMessage: 'Attached file is not an image',
      validationErrors: [],
    })
  }
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/edit-product',
        editing: false,  
        hasError: true,
        product: {
          title: title,
          price: price, 
          description: description, 
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      })
  }

  const imageUrl = image.path
  const product = new Product({
    title: title, 
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  })
  product.save().then(result => {
    console.log('Product created')
    res.redirect('/admin/products')
  }).catch(err => errorHandler(err, next))
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId
  Product.findById(prodId).then(product => {
    if (!product) {
      return res.redirect('/')
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      hasError: false,
      errorMessage: null,
      validationErrors: [],
    })
  }).catch(err => errorHandler(err, next))
}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId
  const {     
    title, 
    price ,
    description
  } = req.body
  const image = req.file
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: true, 
        hasError: true,
        product: {
          title: title,
          price: price, 
          description: description, 
          _id: prodId
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      })
  }

  Product.findById(prodId).then(product => {
    if(product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/')
    }
    product.title = title
    product.price = price
    if(image) {
      product.imageUrl = image.path
    }
    product.description = description
    return product.save().then(result => {
      console.log('Updated product')
      res.redirect('/admin/products')
    })
  }).catch(err => errorHandler(err, next))
}

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id})
  // .select('title price -_id')
  // .populate('userId', 'name')
  .then(products => {
    console.log(products)
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    })
  }).catch(err => errorHandler(err, next))
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      return User.updateMany(
        {},
        { $pull: { "cart.items": { productId: prodId } } }
      )
    }).then(() => {
      console.log("Deleted product and removed it from every cart !")
      res.redirect('/admin/products')
    }).catch(err => errorHandler(err, next))
}
