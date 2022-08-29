const User = require("../models/user");
const Product = require("../models/product");

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity, size } = req.body;
    // Finding user
    const user = await User.findById(req.user._id);
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
      (p) => p.productId.toString() === productId && p.size === size
    );
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
    const user = await User.findById(req.user._id);
    // Searching user
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // Searching product in cart
    const idx = user.cart.products.findIndex(
      (p) => p.productId.toString() === productId && p.size === size
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
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong",
    });
  }
};
