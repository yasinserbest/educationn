const mainSlider = require("./../models/mainSliderModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  //burası nereye ve hangi ad ile kaydedilecek kısmı
  destination: (req, file, cb) => {
    cb(null, "public/img/mainSlider");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `mainSlide-${Date.now()}.${ext}`);
  },
});
const multerFilter = (req, file, cb) => {
  //burası sadece image'ler yüklenecek filtrelemesi
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Dosya resim dosyası değil. Lütfen resim dosyası yükleyiniz!",
        400
      ),
      false
    );
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter }); //bu da kullanım

exports.uploadCommentPhoto = upload.single("photo");

exports.createmainSlider = factory.createOne(mainSlider);
exports.deletemainSlider = factory.deleteOne(mainSlider);
