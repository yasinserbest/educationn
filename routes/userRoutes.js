const express = require("express");
const authController = require("./../controllers/authController");
const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);

router.post("/sifremiUnuttum", authController.forgotPassword);
router.patch("/sifremiYenile/:token", authController.resetPassword);

router.patch(
  "/sifremiGuncelle",
  authController.protect,
  authController.updatePassword
);

module.exports = router;
