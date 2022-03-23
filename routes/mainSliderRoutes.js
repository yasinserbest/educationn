const express = require("express");
const mainSliderController = require("./../controllers/mainSliderController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .post(
    mainSliderController.uploadCommentPhoto,
    mainSliderController.createmainSlider
  );
router.route("/:id").delete(mainSliderController.deletemainSlider);

module.exports = router;
