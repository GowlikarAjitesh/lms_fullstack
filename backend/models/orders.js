const mongoose = require('mongoose');

const OrdersSchema = mongoose.Schema({
//make the orders
});

module.exports = mongoose.model('Orders', OrdersSchema);