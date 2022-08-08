const router = require("express").Router();
const userFetchController = require("../controllers/userFetch");
const authMiddleware = require("../middleware/auth");

// URL: /user/:id
// METHOD: GET
router.get("/:id", authMiddleware, userFetchController.getUserById);

// URL: /user/all
// METHOD: GET
router.get("/all", authMiddleware, userFetchController.getAllUsers);

module.exports = router;
