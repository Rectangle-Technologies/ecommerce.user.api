const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const ejs = require('ejs');
const nodemailer = require('nodemailer');

exports.signup = async (req, res, next) => {
    const { email, firstName, lastName, password, contact, line1, city, state, pincode, type } =
        req.body;
    // Error validation
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .json({ message: "Validation error", errors: errors.array() });
    }
    try {
        // Checking if user already exists
        const user = await User.findOne({ contact: contact });
        if (user) {
            return res
                .status(400)
                .json({ message: "User already exists. Please login!" });
        }
        // Encrypting password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Creating user
        const name = firstName + " " + lastName;
        const newUser = await User.create({
            email,
            password: hashedPassword,
            name,
            contact,
            address: {
                line1,
                city,
                state,
                pincode,
            },
            type,
        });
        res.status(201).json({
            message: "User created successfully",
            user: newUser,
        });
    } catch (err) {
        res.status(500).json({ message: err.message || "Something went wrong" });
    }
};

exports.login = async (req, res, next) => {
    const { contact, password } = req.body;
    // Error validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .json({ message: "Validation error", errors: errors.array() });
    }
    try {
        // Finding user
        const user = await User.findOne({ contact });
        if (!user) {
            return res.status(404).json({ message: "User doesn't exist" });
        }
        // Matching password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }
        // Generating JWT token
        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET_KEY
        );
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                email: user.email,
                name: user.name,
                contact: user.contact,
                address: user.address,
                cartTotal: user.cart.products.length
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message || "Something went wrong" });
    }
};

exports.adminLogin = async (req, res, next) => {
    // Error validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .json({ message: "Validation error", errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        // Searching user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User doesn't exist" });
        }
        // Checking if admin
        if (user.type !== "admin" && user.type !== 'staff') {
            return res.status(401).json({ message: "Not authorized!" });
        }
        // Checking password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }
        // Generating JWT token
        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET_KEY
        );
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                email,
                name: user.name,
                contact: user.contact,
                address: user.address,
                type: user.type
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message || "Something went wrong" });
    }
};

exports.adminSignup = async (req, res, next) => {
    if (req.user.type !== 'admin') {
        return res.status(401).json({ message: 'Not authorized!' })
    }
    const { email, firstName, lastName, password, contact, type } =
        req.body;
    // Error validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .json({ message: "Validation error", errors: errors.array() });
    }
    try {
        // Checking if user already exists
        const user = await User.findOne({ email: email });
        if (user) {
            return res
                .status(400)
                .json({ message: "User already exists. Please login!" });
        }
        // Encrypting password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Creating user
        const name = firstName + " " + lastName;
        const newUser = await User.create({
            email,
            password: hashedPassword,
            name,
            contact,
            address: {
                line1: 'F-21, Sacred Heart World, Opposite of Sacred Heart Town, Wanowrei',
                city: 'Pune',
                state: 'Maharashtra',
                pincode: '411040',
            },
            type,
        });
        res.status(201).json({
            message: "User created successfully",
            user: newUser,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message || "Something went wrong" });
    }
};
function randomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.updatePassword = async (req, res) => {
    const { email } = req.params;
    const { password, token } = req.body;

    const user = await User.find({ email: email })
    if (user.length === 0) {
        return res.status(400).json({
            message: "Invalid email or token"
        })
    }
    if (user[0].reset_password_token !== token) {
        return res.status(400).json({
            message: "Invalid email or token"
        })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user[0].password = hashedPassword;
    user[0].reset_password_token = '';
    await user[0].save();

    return res.json({
        message: 'Password reset successfully'
    })
}

exports.generateForgotPasswordToken = async (req, res) => {
    const user = await User.find({ email: req.body.email });
    if (!user.length) {
        return res.json({
            message: 'Email has been sent with a reset password link, if the account exists'
        })
    }

    const salt = await bcrypt.genSalt(10);
    user[0].reset_password_token = await bcrypt.hash(randomString(12), salt);

    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: 'samyak.shah123@outlook.com',
            pass: 'Samyak3009'
        }
    })

    var dirname = '';
    const dirs = __dirname.split("/");
    dirs.map((name, index) => {
        if (index !== dirs.length - 1) {
            dirname += name + "/";
        }
    })
    ejs.renderFile(dirname + 'views/reset_password.ejs', { token: user[0].reset_password_token, email: req.body.email }, async (err, str) => {
        const options = {
            from: 'samyak.shah123@outlook.com',
            to: req.body.email,
            subject: 'Password reset link',
            html: str
        }
        if (err) {
            console.log(err)
        }
        const info = await transporter.sendMail(options)
        await user[0].save()
        return res.json({
            message: 'Email has been sent with a reset password link, if the account exists'
        })
    })
}