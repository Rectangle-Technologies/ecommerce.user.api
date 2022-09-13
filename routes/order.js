const router = require("express").Router();
const authMiddleware = require("../middleware/auth");
const orderController = require("../controllers/order");
const { body } = require('express-validator')

// URL: /order/create
// Method: POST
router.post("/create", [
  body('products').isArray().withMessage('Select one product'),
  body('amount').isFloat().withMessage('Please enter valid amount')
], authMiddleware, orderController.createOrder);

// URL: /order/fetch/all
// Method: GET
router.get("/fetch/all", authMiddleware, orderController.fetchAllOrders);

// URL: /order/fetch
// METHOD: GET
router.get('/fetch', authMiddleware, orderController.fetchOrders)

// URL: /order/fetch/pending
// Method: GET
router.get(
  "/fetch/pending",
  authMiddleware,
  orderController.fetchPendingOrders
);

// URL: /order/fetch/:id
// Method: GET
router.get("/fetch/:id", authMiddleware, orderController.fetchOrder);

module.exports = router;
