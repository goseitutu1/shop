const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Product = sequelize.define("Product",{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  // UserId: {
  //   type: Sequelize.INTEGER,
  //   allowNull: true,
  //   foreignKey: true
  // }
})

module.exports = Product;
 