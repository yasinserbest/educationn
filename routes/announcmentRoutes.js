const express = require("express");
const announcmentController = require("./../controllers/announcmentController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.use(authController.protect);
router.route("/").post(announcmentController.createAnnouncment);
router.route("/:id").delete(announcmentController.deleteAnnouncment);

module.exports = router;
