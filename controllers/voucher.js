const Voucher = require('../models/voucher')
const { validationResult } = require("express-validator");
const User = require('../models/user');

exports.createVoucher = async (req, res) => {
    if (req.user.type !== 'admin') {
        return res.status(401).json({ message: 'Not authorized!' })
    }
    try {
        const { name, type, percentDiscount, orderLimit, minOrderAmount, maxDiscount } = req.body
        // Validation
        if (!name || name.length === 0) {
            return res.status(422).json({ message: 'Voucher name is required' })
        }
        if (!type || type.length === 0) {
            return res.status(422).json({ message: 'Voucher type is required' })
        }
        if (type !== 'order' && type !== 'value') {
            return res.status(422).json({ message: 'Invalid voucher type' })
        }
        if (!percentDiscount) {
            return res.status(422).json({ message: 'Percentage discount is required' })
        }
        // Check voucher type and create voucher
        if (type === 'order') {
            if (!orderLimit || orderLimit <= 0) {
                return res.status(422).json({ message: 'Order limit is required' })
            }
            const voucher = await Voucher.create({
                name, type, percentDiscount, orderLimit
            })
            res.status(200).json({ message: 'Voucher created successfully', voucher })
        } else if (type === 'value') {
            if (!minOrderAmount || minOrderAmount <= 0) {
                return res.status(422).json({ message: 'Minimum order amount is required' })
            }
            if (!maxDiscount || maxDiscount <= 0) {
                return res.status(422).json({ message: 'Maximum discount value is required' })
            }
            const voucher = await Voucher.create({
                name, type, percentDiscount, minOrderAmount, maxDiscount
            })
            res.status(200).json({ message: 'Voucher created successfully', voucher })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message || 'Something went wrong' })
    }
}

exports.deleteVoucher = async (req, res) => {
    if (req.user.type !== 'admin') {
        return res.status(401).json({ message: 'Not authorized!' })
    }
    try {
        await Voucher.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Voucher deleted successfully' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message || 'Something went wrong' })
    }
}

exports.fetchAllVouchers = async (req, res) => {
    if (req.user.type !== 'admin') {
        return res.status(401).json({ message: 'Not authorized!' })
    }
    try {
        const vouchers = await Voucher.find()
        res.status(200).json({ message: 'Vouchers fetched successfully', vouchers })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message || 'Something went wrong' })
    }
}

exports.calculateDiscount = async (req, res) => {
    try {
        // Validation
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({ message: "Validation error", errors: errors.array() });
        }
        const { name, orderAmount } = req.body
        // Find voucher
        const voucher = await Voucher.findOne({ name })
        // Find user
        const user = await User.findById(req.user._id)
        if (!voucher) {
            return res.status(404).json({ message: 'Voucher is not applicable' })
        }
        // Check voucher type and calculate discount
        if (voucher.type === 'order') {
            if (user.orders.length > voucher.orderLimit) {
                return res.status(404).json({ message: 'Voucher not applicable' })
            }
            const discount = voucher.percentDiscount / 100 * orderAmount
            res.status(200).json({ message: 'Discount calculated', discount })
        } else if (voucher.type === 'value') {
            if (orderAmount < voucher.minOrderAmount) {
                return res.status(404).json({ message: `Voucher is valid for a minimum order of ${voucher.minOrderAmount}` })
            }
            const discount = Math.min(voucher.maxDiscount, voucher.percentDiscount / 100 * orderAmount)
            res.status(200).json({ message: 'Discount calculated', discount })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message || 'Something went wrong' })
    }
}