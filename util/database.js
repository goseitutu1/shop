const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_shop','root','',{
    dialect: "mysql",
    host: "localhost"
})

module.exports = sequelize;