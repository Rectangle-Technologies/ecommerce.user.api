const Order = require("../models/order");
const User = require("../models/user");
const Product = require('../models/product')
const Voucher = require('../models/voucher')
const nodemailer = require('nodemailer')

exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { products, amount, instructions, userDetails, voucherName } = req.body;
    // Input validation
    if (!products || !amount) {
      return res.status(400).json({
        message: "Please provide products and amount",
      });
    }
    // Searching user
    const user = await User.findById(userId);
    // Checking for products
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      const prod = await Product.findById(product.productId)
      if (!prod) {
        return res.status(404).json({ message: 'Product not found' })
      }
      const sizeObjectIdx = prod.sizes.findIndex(s => s.title === product.size)
      if (sizeObjectIdx === -1) {
        return res.status(400).json({ message: 'Size unavailable' })
      }
      if (prod.type !== 'ORDER' && prod.sizes[sizeObjectIdx].stock <= 0) {
        return res.status(400).json({ message: 'Size unavailable' })
      }
      if (prod.type === 'STOCK' && prod.sizes[sizeObjectIdx].stock < product.quantity) {
        return res.status(400).json({ message: 'Insufficient quantity' })
      }
      if (prod.type === 'STOCK') {
        prod.sizes[sizeObjectIdx].stock -= product.quantity
      }
      await prod.save()
    }

    // Adding voucher details
    const voucher = await Voucher.findOne({ name: voucherName })
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' })
    }
    // Creating order
    const order = new Order({
      user: { ...userDetails, id: userId },
      products,
      amount,
      instructions,
      voucher: voucher._id
    });
    const newOrder = await order.save();
    // Adding order to voucher
    voucher.orders.push(newOrder._id)
    await voucher.save()

    const populatedOrder = await Order.findById(order._id).populate("products.productId");

    // Updating user
    user.orders.push(order._id);
    user.cart.products = [];
    user.cart.total = 0;
    await user.save();

    // Sending mail
    // const transporter = nodemailer.createTransport({
    //   service: 'hotmail',
    //   auth: {
    //     user: 'samyak.shah123@outlook.com',
    //     pass: 'Samyak3009'
    //   }
    // })
    // const options = {
    //   from: 'samyak.shah123@outlook.com',
    //   to: user.email,
    //   subject: 'Congratulations! Order successfully placed',
    //   text: 'Order placed'
    // }
    // const info = await transporter.sendMail(options)

    res.status(201).json({
      message: "Order placed successfully!",
      order: populatedOrder,
    });
  } catch (err) {
    console.log(err)
    console.log('Error')
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

exports.fetchAllOrders = async (req, res, next) => {
  try {
    // Checking authorization
    if (req.user.type !== "admin") {
      return res.status(401).json({ message: "Not authorized!" });
    }
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 100
    const name = req.query.search
    // Fetching orders
    if (name !== '' && name !== 'undefined') {
      const count = await Order.find({ 'user.name': { $regex: name, $options: 'i' } }).count()
      const orders = await Order.find({ 'user.name': { $regex: name, $options: 'i' } }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
      res.status(200).json({
        message: "Orders fetched successfully",
        orders,
        count
      });
    } else {
      const count = await Order.find().count()
      const orders = await Order.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
      res.status(200).json({
        message: "Orders fetched successfully",
        orders,
        count
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

exports.fetchPendingOrders = async (req, res, next) => {
  try {
    // Checking authorization 
    if (req.user.type !== "admin" && req.user.type !== "staff") {
      return res.status(401).json({ message: "Not authorized!" });
    }
    // Fetching orders
    const orders = await Order.find({ status: "placed" })
      .populate({
        path: "products.productId",
      })
      .sort({ createdAt: -1 });
    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

exports.fetchOrder = async (req, res, next) => {
  try {
    // Fetching order
    const order = await Order.findById(req.params.id)
      .populate({
        path: "products.productId",
      });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (req.user.type === 'admin' || req.user._id.toString() === order.user.id._id.toString()) {
      res.status(200).json({
        message: "Order fetched successfully",
        order,
      });
    } else {
      res.status(401).json({ message: 'Not authenticated!' })
    }
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

exports.fetchOrders = async (req, res) => {
  try {
    // Fetching user
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const user = await User.findById(req.user._id).populate({
      path: 'orders',
      populate: {
        path: 'products.productId',
        select: 'name imageUrls'
      },
      options: {
        sort: { createdAt: -1 }
      }
    })
    const count = user.orders.length
    const startIdx = (page - 1) * limit
    const endIdx = Math.min(page * limit, count)
    res.status(200).json({ message: 'Orders fetched successfully', orders: user.orders.splice(startIdx, endIdx), count })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message || "Something went wrong" })
  }
}
