// clientPayment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientPaymentSchema = new Schema({
    paymentDate: {
        type: Date,
        required: true,
    },
    paymentAmount: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        required: true,
    },
},
{
  timestamps: true,
});

module.exports = mongoose.model("ClientPayment", clientPaymentSchema);
