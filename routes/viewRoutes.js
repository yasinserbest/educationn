const express = require("express");
const router = express.Router();
const viewsContoller = require("../controllers/viewsController");
const commentsContoller = require("../controllers/commentController");
const authContoller = require("../controllers/authController");

router.get("/", viewsContoller.gethomePage);
router.get("/duyurular", viewsContoller.getAnnouncments);
router.route("/iletisim").get(viewsContoller.getContact);
router.get("/galeri", viewsContoller.getGallery);
router.get("/login", viewsContoller.getLogin);
router.get("/sifremiUnuttum", viewsContoller.forgotPassword);
router.get("/sifremiYenile/:token", viewsContoller.resetPassword);

router.get(
  "/admin-yorumlar",
  authContoller.protect,
  viewsContoller.getadminComments
);

router.get(
  "/admin-duyurular",
  authContoller.protect,
  viewsContoller.getadminAnnouncments
);

router.get(
  "/admin-galeri",
  authContoller.protect,
  viewsContoller.getadminGallery
);

router.get(
  "/admin-anaSlayt",
  authContoller.protect,
  viewsContoller.getadminmainSlide
);
router.get(
  "/admin-sifremiGuncelle",
  authContoller.protect,
  viewsContoller.getpasswordUpdate
);

module.exports = router;
