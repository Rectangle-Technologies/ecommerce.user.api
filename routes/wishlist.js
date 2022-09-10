const router = require("express").Router();
const authMiddleware = require("../middleware/auth");
const wishlistController = require("../controllers/wishlist");
const { body } = require('express-validator')

// URL: /wishlist/add
// METODO: POST
router.post("/add", [
    body('productId').not().isEmpty().withMessage('Product ID is required')
], authMiddleware, wishlistController.addToWishlist);

// URL: /wishlist/remove
// METODO: POST
router.post("/remove", [
    body('productId').not().isEmpty().withMessage('Product ID is required')
], authMiddleware, wishlistController.removeFromWishlist);

// URL /wishlist/get
router.get('/get', authMiddleware, wishlistController.fetchWishlist)

module.exports = router;
