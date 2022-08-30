const User = require("../models/user");
const Product = require('../models/product')
const { validationResult } = require('express-validator')

exports.addToWishlist = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation error', errors: errors.array() })
  }
  try {
    const { productId } = req.body
    // Searching user
    const user = await User.findById(req.user._id);
    // Finding product
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    // Updating user
    user.wishlist.push(productId);
    await user.save();
    res.status(200).json({ message: "Product added to wishlist" });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong",
    });
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation error', errors: errors.array() })
  }
  try {
    // Searching user
    const user = await User.findById(req.user._id);
    // Checking if product present in wishlist
    const idx = user.wishlist.indexOf(req.body.productId);
    if (idx === -1) {
      return res.status(404).json({ message: "Product not there in wishlist" });
    }
    // Updating user
    user.wishlist.splice(idx, 1);
    await user.save();
    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong",
    });
  }
};
