const router = require('express').Router()
const emailController = require('../controllers/email')

router.post('/send', emailController.sendMail)

module.exports = router