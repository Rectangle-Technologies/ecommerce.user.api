const Order = require("../models/order");
const User = require("../models/user");

exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { products, amount } = req.body;
    if (!products || !amount) {
      return res.status(400).json({
        message: "Please provide products and amount",
      });
    }
    const user = await User.findById(userId);
    const order = new Order({
      userId,
      products,
      amount,
    });
    await order.save();
    user.orders.push(order._id);
    await user.save();
    res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

exports.fetchOrders = async (req, res, next) => {
  try {
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};
