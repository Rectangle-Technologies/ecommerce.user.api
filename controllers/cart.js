const User = require("../models/user");
const Product = require("../models/product");
const { validationResult } = require('express-validator');

exports.addToCart = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation error", errors: errors.array() });
  }
  try {
    const { productId, quantity, size } = req.body;
    // Finding user
    const user = await User.findById(req.user._id).populate('cart.products.productId');
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // Finding product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    // Checking if product already in cart
    const idx = user.cart.products.findIndex(
      (p) => p.productId._id.toString() === productId && p.size === size
    );

    // Checking stock of product
    const sizeObjectIdx = product.sizes.findIndex(s => s.title === size)
    if (sizeObjectIdx === -1) {
      return res.status(400).json({ message: 'Size unavailable' })
    }
    if (product.type === 'STOCK' && product.sizes[sizeObjectIdx].stock <= 0) {
      return res.status(400).json({ message: 'Size unavailable' })
    }
    if (product.type === 'STOCK' && product.sizes[sizeObjectIdx].stock < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity' })
    }

    if (idx === -1) {
      // Product not in cart
      user.cart.products.push({
        productId,
        quantity,
        price: product.price,
        size,
      });
    } else {
      // Product in cart
      user.cart.products[idx].quantity += quantity;
    }
    // Updating cart total
    user.cart.total += product.price * quantity;
    await user.save();
    res.status(200).json({
      message: "Product added to cart",
      cart: user.cart,
      cartTotal: user.cart.products.length
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong",
    });
  }
};

exports.deleteFromCart = async (req, res, next) => {
  try {
    const { size } = req.body;
    const productId = req.params.productId;
    const user = await User.findById(req.user._id).populate('cart.products.productId');
    // Searching user
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // Searching product in cart
    const idx = user.cart.products.findIndex(
      (p) => p.productId._id.toString() === productId && p.size === size
    );
    if (idx === -1) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }
    // Updating cart
    user.cart.total -= +user.cart.products[idx].price;
    if (user.cart.products[idx].quantity === 1) {
      user.cart.products.splice(idx, 1);
    } else {
      user.cart.products[idx].quantity--;
    }
    await user.save();
    res.status(200).json({
      message: "Product deleted from cart",
      cart: user.cart,
      cartTotal: user.cart.products.length
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong",
    });
  }
};

exports.fetchCart = async (req, res, next) => {
  try {
    // Fetching user
    const user = await User.findById(req.user._id).populate('cart.products.productId')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({
      message: 'Cart fetched',
      cart: user.cart
    })
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong",
    });
  }
}
