const router = require("express").Router();
const authMiddleware = require("../middleware/auth");
const orderController = require("../controllers/order");

// URL: /order/create
// Method: POST
router.post("/create", authMiddleware, orderController.createOrder);

module.exports = router;
