const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../utils/db')

class OrderProducts extends Model {}

OrderProducts.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue:1,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'orders', key: 'id' },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'products', key: 'id' },
  },
  
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'orderproduct'
})

module.exports = OrderProducts