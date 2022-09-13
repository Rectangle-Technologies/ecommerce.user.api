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
router.get("/fetch", authMiddleware, userFetchController.getUserById);

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
    body("contact").custom((value, { req }) => {
      var regex = /^[6-9]\d{9}$/;
      if (!regex.test(value)) {
        throw new Error("Please enter a valid contact number");
      }
      return true;
    }),
    body("line1").not().isEmpty().withMessage("Please enter your address"),
    body("city").not().isEmpty().withMessage("Please enter your city"),
    body("state").not().isEmpty().withMessage("Please enter your state"),
    body('pincode').custom(value => {
      const regex = /^[1-9]{1}[0-9]{5}$/
      if (!regex.test(value)) {
        throw new Error('Invalid pincode')
      }
      return true;
    })
  ],
  userUpdateController.updateUser
);

module.exports = router;
