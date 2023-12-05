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
  })
}

exports.postAddProduct = (req, res, next) => {
  const { title, price, description, imageUrl } = req.body
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
  }).catch(err => console.log(err))
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
    })
  }).catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId
  const {     
    title, 
    price ,
    imageUrl,
    description
  } = req.body

  Product.findById(prodId).then(product => {
    product.title = title
    product.price = price
    product.imageUrl = imageUrl
    product.description = description
    return product.save()
  }).then(result => {
    console.log('Updated product')
    res.redirect('/admin/products')
  }).catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
  Product.find()
  // .select('title price -_id')
  // .populate('userId', 'name')
  .then(products => {
    console.log(products)
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    })
  }).catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  Product.findByIdAndDelete(prodId)
    .then(() => {
      return User.updateMany(
        {},
        { $pull: { "cart.items": { productId: prodId } } }
      )
    }).then(() => {
      console.log("Deleted product and removed it from every cart !")
      res.redirect('/admin/products')
    }).catch(err => console.log(err))
}
