const Order = require("../models/order");
const User = require("../models/user");
const nodemailer = require('nodemailer')

exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { products, amount, instructions, userDetails } = req.body;
    // Input validation
    if (!products || !amount) {
      return res.status(400).json({
        message: "Please provide products and amount",
      });
    }
    // Searching user
    const user = await User.findById(userId);
    // Creating order
    const order = new Order({
      user: { ...userDetails, id: userId },
      products,
      amount,
      instructions
    });
    await order.save();

    const populatedOrder = await Order.findById(order._id).populate("products.productId");

    // Updating user
    user.orders.push(order._id);
    user.cart.products = [];
    user.cart.total = 0;
    await user.save();

    // Sending mail
    const transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: 'samyak.shah123@outlook.com',
        pass: 'Samyak3009'
      }
    })
    const options = {
      from: 'samyak.shah123@outlook.com',
      to: user.email,
      subject: 'Congratulations! Order successfully placed',
      text: 'Order placed'
    }
    const info = await transporter.sendMail(options)

    res.status(201).json({
      message: "Order placed successfully!",
      order: populatedOrder,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

exports.fetchOrders = async (req, res, next) => {
  try {
    // Checking authorization
    if (req.user.type !== "admin") {
      return res.status(401).json({ message: "Not authorized!" });
    }
    // Fetching orders
    const orders = await Order.find()
      .populate({
        path: "userId",
        select: "-password -orders -cart -wishlist",
      })
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

exports.fetchPendingOrders = async (req, res, next) => {
  try {
    // Checking authorization 
    if (req.user.type !== "admin") {
      return res.status(401).json({ message: "Not authorized!" });
    }
    // Fetching orders
    const orders = await Order.find({ status: "placed" })
      .populate({
        path: "userId",
        select: "-password -orders -cart -wishlist",
      })
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
  // Checking authorization
  if (req.user.type !== "admin") {
    return res.status(401).json({ message: "Not authorized!" });
  }
  try {
    // Fetching order
    const order = await Order.findById(req.params.id)
      .populate({
        path: "userId",
        select: "-password -orders -cart -wishlist",
      })
      .populate({
        path: "products.productId",
      });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};
