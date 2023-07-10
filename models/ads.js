const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../utils/db')

class Ads extends Model {}

Ads.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  title: {
    type: DataTypes.STRING,

  },
  desc: {
    type: DataTypes.STRING,

  },
  img: {
    type: DataTypes.STRING,

  },
 
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  modelName: 'ads'
})

module.exports = Ads