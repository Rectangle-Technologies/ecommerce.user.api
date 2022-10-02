const Subscriber = require('../models/subscriber')
const { validationResult } = require("express-validator");

exports.addSubscriber = async (req, res) => {
    try {
        // Input validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({ message: "Validation error", errors: errors.array() });
        }
        const { email } = req.body
        const subs = await Subscriber.findOne({ email })
        if (subs) {
            return res.status(200).json({ message: 'You are already subscribed!' })
        }
        const subscriber = await Subscriber.create({ email })
        res.status(200).json({ message: 'Thank you for subscribing!', subscriber })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message || 'Something went wrong' })
    }
}