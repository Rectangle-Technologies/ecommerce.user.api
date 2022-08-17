const router = require("express").Router();
const userFetchController = require("../controllers/userFetch");
const userUpdateController = require("../controllers/userUpdate");
const authMiddleware = require("../middleware/auth");
const { body } = require("express-validator");

// URL: /user/all
// METHOD: GET
router.get("/all", authMiddleware, userFetchController.getAllUsers);

// URL: /user/:id
// METHOD: GET
router.get("/:id", authMiddleware, userFetchController.getUserById);

// URL: /user/update
// METHOD: PUT
router.put(
  "/update",
  authMiddleware,
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
  userUpdateController.updateUser
);

module.exports = router;
