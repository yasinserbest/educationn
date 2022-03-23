const Comment = require("./../models/commentModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  //burası nereye ve hangi ad ile kaydedilecek kısmı
  destination: (req, file, cb) => {
    cb(null, "public/img/comments");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `comment-${Date.now()}.${ext}`);
  },
});
const multerFilter = (req, file, cb) => {
  //burası sadece image'ler yüklenecek filtrelemesi
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Dosya resim dosyası değil. Lütfen resim dosyası yükleyiniz! ",
        400
      ),
      false
    );
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter }); //bu da kullanım

exports.uploadCommentPhoto = upload.single("photo");

exports.createComment = factory.createOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
