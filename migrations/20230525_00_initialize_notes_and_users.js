const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('notes', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      important: {
        type: DataTypes.BOOLEAN
      },
      date: {
        type: DataTypes.DATE
      },
    })
    await queryInterface.createTable('users', {
      
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

    })
    await queryInterface.addColumn('notes', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('notes')
    await queryInterface.dropTable('users')
  },
}