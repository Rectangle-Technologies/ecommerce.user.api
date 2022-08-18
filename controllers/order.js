const Order = require("../models/order");

exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { products, amount } = req.body;
    if (!products || !amount) {
      return res.status(400).json({
        message: "Please provide products and amount",
      });
    }
    const order = new Order({
      userId,
      products,
      amount,
    });
    await order.save();
    res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};
