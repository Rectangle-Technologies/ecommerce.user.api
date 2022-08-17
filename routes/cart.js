const router = require("express").Router();
const authMiddleware = require("../middleware/auth");
const cartController = require("../controllers/cart");

// URL: /cart/add
// METHOD: POST
router.post("/add", authMiddleware, cartController.addToCart);

// URL: /cart/delete
// METHOD: POST
router.post(
  "/delete/:productId",
  authMiddleware,
  cartController.deleteFromCart
);

module.exports = router;
