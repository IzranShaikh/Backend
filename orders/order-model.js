const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    customerID: { type: mongoose.SchemaTypes.ObjectId, ref:'Customer', required: true },
    bookID: { type: mongoose.SchemaTypes.ObjectId, ref:'Books', required: true },
    recieveDate: { type: Date, required: true },
    returnDate: { type: Date, required: true }
});

module.exports = mongoose.model("Order", OrderSchema);