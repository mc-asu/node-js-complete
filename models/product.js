const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

class Product{
  constructor(title, price, description, imageUrl, id) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
    this._id = id ? new mongodb.ObjectId(id) : null
  }

  save() {
    const db = getDb()
    let dbOp 
    if(this._id) {
      dbOp = db.collection('products').updateOne({_id: this._id}, { $set: this })
    } else {
      dbOp = db.collection('products').insertOne(this)
    }
    return dbOp
      .then(result => {
        console.log(result)
      })
      .catch(err => console.log(err))
  }

  static fetchAll() {
    const db = getDb()
    return db.collection('products')
      .find().toArray()
      .then(products => {
        return products
      })
      .catch(err => console.log(err))
  }

  static findById(prodId) {
    const db = getDb()
    return db.collection('products')
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then(product => product)
      .catch(err => console.log(err))
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: new ObjectId(prodId) })
      .then((result) => {
        return db.collection('users').updateMany(
          {},
          { $pull: { "cart.items": { productId: new ObjectId(prodId) } } }
        );
      })
      .then((result) => {
        console.log('Cart Item Deleted');
      })
      .then(() => {
        console.log('Product Deleted');
      });
    }
}

module.exports = Product