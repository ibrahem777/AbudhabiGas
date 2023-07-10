const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('ads', {
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        
       },
       updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
       },
    })
    await queryInterface.createTable('orders', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          status: {
            type: DataTypes.INTEGER,
            defaultValue:0,
        
          },
          payment_type: {
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
           delivery_charge: {
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
          created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            
           },
           updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
           },
    })
    await queryInterface.createTable('products', {
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
          created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            
           },
           updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
           },
      })
    await queryInterface.createTable('orderproducts', {
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
          order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'orders', key: 'id' },
          },
          product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'products', key: 'id' },
          },
    })
    await queryInterface.addColumn('orders', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('orders')
    await queryInterface.dropTable('products')
    await queryInterface.dropTable('orderproducts')

  },
}