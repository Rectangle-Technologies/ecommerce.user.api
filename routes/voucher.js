const router = require('express').Router()
const voucherController = require('../controllers/voucher')
const authMiddleWare = require('../middleware/auth')
const { body } = require('express-validator')

// URL /voucher/create
// DESC Create voucher
router.post('/create', authMiddleWare, voucherController.createVoucher)

// URL /voucher/delete
// DESC Delete voucher
router.delete('/:id', authMiddleWare, voucherController.deleteVoucher)

// URL /voucher/calculate
// DESC Calculate discount
router.post('/calculate', authMiddleWare, [
    body('name').not().isEmpty().withMessage('Voucher name is required'),
    body('orderAmount').isFloat({ min: 0 }).withMessage('Enter valid order amount')
], voucherController.calculateDiscount)

// URL /voucher/fetchall
// DESC Fetch all vouchers
router.get('/fetchall', authMiddleWare, voucherController.fetchAllVouchers)

module.exports = router