const router = require("express").Router();
const authMiddleware = require("../middleware/auth");
const cartController = require("../controllers/cart");
const { body } = require('express-validator');

// URL: /cart/add
// METHOD: POST
router.post("/add", [
  body('productId').not().isEmpty().withMessage('Product ID is needed'),
  body('quantity').isFloat({ min: 1 }).withMessage('Enter a valid quantity'),
  body('size').not().isEmpty().withMessage('Please select size')
], authMiddleware, cartController.addToCart);

// URL: /cart/delete
// METHOD: POST
router.post(
  "/delete/:productId", [
  body('size').not().isEmpty().withMessage('Please select size')
],
  authMiddleware,
  cartController.deleteFromCart
);

module.exports = router;
