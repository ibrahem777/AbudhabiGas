// const mongoose = require('mongoose')
// const uniqueValidator = require('mongoose-unique-validator')

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   mobile: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   status:{
//     type: Number,
//     default:0
//   },
//   passwordHash: String,
  
// })

// userSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//     // the passwordHash should not be revealed
//     delete returnedObject.passwordHash
//   }
// })
// userSchema.plugin(uniqueValidator)

// const User = mongoose.model('User', userSchema)

// module.exports = User
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../utils/db')

class User extends Model {}

User.init({
  
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
  },
  status:{
    type: DataTypes.INTEGER,
    defaultValue:0,
  },

  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user'
})

module.exports = User