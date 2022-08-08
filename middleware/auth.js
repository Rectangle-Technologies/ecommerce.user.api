const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Not authorized!" });
  }
  const token = authHeader.split(" ")[1];
  let decodedToken, user;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodedToken) {
      return res.status(401).json({ message: "Not authenticated!" });
    }
    user = await User.findById(decodedToken.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Not authenticated!" });
  }
  req.user = user;
  next();
};
