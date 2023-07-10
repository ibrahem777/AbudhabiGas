const Note = require('./note')
const User = require('./user')
const Team = require('./team')
const Membership = require('./membership')
const Order = require('./order')
const Product = require('./product')
const OrderProducts = require('./orderproducts')
const Ads = require('./ads')


User.hasMany(Note)
Note.belongsTo(User)
User.hasMany(Order)
Order.belongsTo(User)

// Note.sync({ alter: true })
// User.sync({ alter: true })

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })

Order.belongsToMany(Product, { through: OrderProducts })
Product.belongsToMany(Order, { through: OrderProducts })
Order.hasMany(OrderProducts)
OrderProducts.belongsTo(Order)
Product.hasMany(OrderProducts)
OrderProducts.belongsTo(Product)



module.exports = {
  Note, User, Team, Membership, Order, Product, OrderProducts, Ads
}