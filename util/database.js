const Sequelize = require('sequelize').Sequelize;
const sequelize = new Sequelize('node-complete', 'root', 'rootpassword', {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize