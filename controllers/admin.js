const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  Product.create({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    description: req.body.description
  }).then(result => {
    // console.log(result)
    console.log('Product created')
    res.redirect('/');
  }).catch(err => console.log(err))
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId).then(product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  }).catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findByPk(prodId).then(product => {
    product.title = req.body.title
    product.price = req.body.price
    product.imageUrl = req.body.imageUrl
    product.description = req.body.description
    return product.save()
  }).then(result => {
    console.log('Updated product')
    res.redirect('/admin/products')
  }).catch(err => console.log(err))
};

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err => console.log(err))
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // Product.destroy({where: {id: prodId}})
  Product.findByPk(prodId).then(product => {
    return product.destroy()
  }).then(() => {
    console.log('Product deleted')
    res.redirect('/admin/products');
  }).catch(err => console.log(err))
};
