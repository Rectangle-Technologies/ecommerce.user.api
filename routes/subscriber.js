const router = require('express').Router()
const subscriberController = require('../controllers/subscriber')
const { body } = require('express-validator')

// URL: /subscriber/add
// DESC Add a subscriber
router.post('/add', [
    body('email').isEmail().withMessage('Please enter a valid email')
], subscriberController.addSubscriber)

module.exports = router