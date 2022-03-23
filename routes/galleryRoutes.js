const express = require("express");
const galleryController = require("./../controllers/galleryController");
const handlerController = require("./../controllers/handlerFactory");
const authController = require("./../controllers/authController");
const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .post(galleryController.uploadCommentPhoto, galleryController.createGallery);
router.route("/:id").delete(galleryController.deleteGallery);

module.exports = router;
