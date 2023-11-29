const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const username = 'manuelcasupanan'
const password = 'BTCsgCW0T7JHiXuW'
const mongoDbUrl = `mongodb+srv://${username}:${password}@nodejscourse.tdqni9o.mongodb.net/?retryWrites=true&w=majority`

const mongoConnect = (callback) => {
    console.log(mongoDbUrl)
    MongoClient.connect(mongoDbUrl)
    .then(client => {
        console.log('Connected')
        callback(client)
    })
    .catch(err => console.log(err))
}

module.exports = mongoConnect
