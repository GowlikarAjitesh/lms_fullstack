const mongoose = require('mongoose');

const OrdersSchema = new mongoose.Schema({
//make the orders
    userId: String,
    userName: String,
    userEmail: String,
    orderStatus: String,
    orderDate: Date,
    paymentId: String,
    paymentMethod: String,
    paymentStatus: String,
    payerId: String,
    instructorName: String,
    instructorId: String,
    courseId: String,
    courseTitle: String,
    courseImage: String,
    coursePricing: String

});

module.exports = mongoose.model('Order', OrdersSchema);