const router = require("express").Router();
const authMiddleware = require("../middleware/auth");
const wishlistController = require("../controllers/wishlist");

// URL: /wishlist/add
// METODO: POST
router.post("/add", authMiddleware, wishlistController.addToWishlist);

// URL: /wishlist/remove
// METODO: POST
router.post("/remove", authMiddleware, wishlistController.removeFromWishlist);

module.exports = router;
