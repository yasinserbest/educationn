const express = require("express");
const homePageController = require("./../controllers/homePageController");
const contactController = require("./../controllers/contactController");
const router = express.Router();

router.route("/duyurular").get(homePageController.getAllAnnouncments);
router.route("/iletisim").post(contactController.sendMail);
router.route("/galeri").get(homePageController.getAllGallery);

module.exports = router;
