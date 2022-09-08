const nodemailer = require('nodemailer')

exports.sendMail = async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: 'samyak.shah123@outlook.com',
                pass: 'Samyak3009'
            }
        })
        const options = {
            from: 'samyak.shah123@outlook.com',
            to: 'samyak.shah123@gmail.com',
            subject: 'Congratulations! Order successfully placed',
            html: '<h1>Order placed</h1>'
        }
        const info = await transporter.sendMail(options)
        console.log(info)
        res.status(200).json({ message: 'Mail sent' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Could not send mail' })
    }
}