const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../utils/db')

class Order extends Model {}

Order.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue:0,

  },
  paymentType: {
    type: DataTypes.INTEGER,
    defaultValue:0,

  }, 
  lat: {
    type: DataTypes.INTEGER,
    allowNull: false,


  },
   long: {
    type: DataTypes.INTEGER,
    allowNull: false,


  }, 
  amount: {
    type: DataTypes.INTEGER,

  },
   vat: {
    type: DataTypes.INTEGER,

  },
   deliveryCharge: {
    type: DataTypes.INTEGER,

  }, 
  date: {
    type: DataTypes.DATE,
    defaultValue:0,

  },
   total: {
    type: DataTypes.INTEGER,
    defaultValue:0,

  }, 
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
updatedAt: 'updated_at',
  modelName: 'order'
})

module.exports = Order