const router = require("express").Router();
const authController = require("../controllers/auth");
const { body } = require("express-validator");

// METHOD: POST
// URL: /auth/signup
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("firstName")
      .not()
      .isEmpty()
      .withMessage("Please enter your first name"),
    body("lastName").not().isEmpty().withMessage("Please enter your last name"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("contact").custom((value, { req }) => {
      var regex = /^[6-9]\d{9}$/;
      if (!regex.test(value)) {
        throw new Error("Please enter a valid contact number");
      }
      return true;
    }),
    body("address").not().isEmpty().withMessage("Please enter your address"),
  ],
  authController.signup
);

// METHOD: POST
// URL: /auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  authController.login
);

// METHOD: POST
// URL: /auth/admin/login
router.post(
  "/admin/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  authController.adminLogin
);

module.exports = router;
