const router = require("express").Router();
const authController = require("../controllers/auth");

// METHOD: POST
// URL: /auth/signup
router.post("/signup", authController.signup);

// METHOD: POST
// URL: /auth/login
router.post("/login", authController.login);

module.exports = router;
