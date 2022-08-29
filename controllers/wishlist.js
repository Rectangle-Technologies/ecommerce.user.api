const User = require("../models/user");

exports.addToWishlist = async (req, res, next) => {
  try {
    // Searching user
    const user = await User.findById(req.user._id);
    // Updating user
    user.wishlist.push(req.body.productId);
    await user.save();
    res.status(200).json({ message: "Product added to wishlist" });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong",
    });
  }
};

exports.removeFromWishlist = async (req, res, next) => {
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
