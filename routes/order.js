const router = require("express").Router();
const authMiddleware = require("../middleware/auth");
const orderController = require("../controllers/order");

// URL: /order/create
// Method: POST
router.post("/create", authMiddleware, orderController.createOrder);

// URL: /order/fetch
// Method: GET
router.get("/fetch", authMiddleware, orderController.fetchOrders);

module.exports = router;
