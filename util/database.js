const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const username = 'manuelcasupanan'
const password = 'BTCsgCW0T7JHiXuW'
const mongoDbUrl = `mongodb+srv://${username}:${password}@nodejscourse.tdqni9o.mongodb.net/?retryWrites=true&w=majority`
let _db

const mongoConnect = (callback) => {
    MongoClient.connect(mongoDbUrl)
    .then(client => {
        console.log('Connected')
        _db = client.db()
        callback()
    })
    .catch(err => {
        console.log(err)
        throw err
    })
}

const getDb = () => {
    if(_db) {
        return _db
    }
    throw 'No database found!'
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb
