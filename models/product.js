const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../utils/db')

class Product extends Model {}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  name: {
    type: DataTypes.STRING,

  },
  desc: {
    type: DataTypes.STRING,

  },
  img: {
    type: DataTypes.STRING,

  },
  price: {
    type: DataTypes.INTEGER,
    defaultValue:0,
  }, 
 
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
updatedAt: 'updated_at',
  modelName: 'product'
})

module.exports = Product