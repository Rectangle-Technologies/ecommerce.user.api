const mongoose = require('mongoose')

const voucherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['order', 'value']
    },
    percentDiscount: {
        type: Number
    },
    orderLimit: {
        type: Number
    },
    minOrderAmount: {
        type: Number
    },
    maxDiscount: {
        type: Number
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
})

module.exports = mongoose.model('Voucher', voucherSchema)