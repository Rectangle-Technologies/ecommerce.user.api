const User = require("../models/user");

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    // Finding user
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // Updating user
    const { email, firstName, lastName, contact, address } = req.body;
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.contact = contact;
    user.address = address;
    await user.save();
    res.status(200).json({
      message: "User updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong",
    });
  }
};
