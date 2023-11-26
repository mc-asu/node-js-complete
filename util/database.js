const Sequelize = require('sequelize')
const sequelize = new Sequelize('node-complete', 'root', 'rootpassword', {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize