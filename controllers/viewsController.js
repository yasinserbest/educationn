const Announcment = require("./../models/announcmentModel");
const Comment = require("./../models/commentModel");
const Gallery = require("./../models/galleryModel");
const mainSlider = require("./../models/mainSliderModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

exports.gethomePage = catchAsync(async (req, res) => {
  const announcments = await Announcment.find().sort({ createdAt: -1 });
  const comments = await Comment.find().sort({ createdAt: -1 });
  const mainSlides = await mainSlider.find().sort({ createdAt: -1 });

  res
    .status(200)
    .set(
      "Content-Security-Policy",
      "default-src 'self' https://*.google.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://google.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render("homePage", {
      title: "Ana Sayfa",
      announcments,
      comments,
      mainSlides,
    });
});
exports.getAnnouncments = catchAsync(async (req, res) => {
  const features = await new APIFeatures(Announcment.find(), req.query)
    .sort()
    .paginate();

  const announcments = await features.query;
  const numOfDocs = await Announcment.find().countDocuments();
  const { page, limit } = await req.query;
  const numOfPages = Math.ceil(numOfDocs / limit);
  // console.log(page, limit);
  // console.log(numOfPages, numOfDocs);
  res.status(200).render("announcment", {
    title: "Tüm Duyurular",
    announcments,
    numOfPages,
    page,
    limit,
  });
});
exports.getContact = catchAsync(async (req, res) => {
  res.status(200).render("contact", {
    title: "İletişim",
  });
});
exports.getGallery = catchAsync(async (req, res) => {
  const galleries = await Gallery.find().sort({ createdAt: -1 });
  res.status(200).render("gallery", {
    title: "Galeri",
    galleries,
  });
});
exports.getLogin = catchAsync(async (req, res) => {
  res.status(200).render("./login/login", {
    title: "Giriş Yap",
  });
});
exports.getadminComments = catchAsync(async (req, res) => {
  const comments = await Comment.find().sort({ createdAt: -1 });
  res.status(200).render("./adminPanel/admin-comment", {
    title: "Yorum Oluştur",
    comments,
  });
});
exports.getadminAnnouncments = catchAsync(async (req, res) => {
  const announcments = await Announcment.find().sort({ createdAt: -1 });
  res.status(200).render("./adminPanel/admin-announcment", {
    title: "Duyuru Oluştur",
    announcments,
  });
});
exports.getadminGallery = catchAsync(async (req, res) => {
  const galleries = await Gallery.find().sort({ createdAt: -1 });
  res.status(200).render("./adminPanel/admin-gallery", {
    title: "Galeri Düzenle",
    galleries,
  });
});
exports.getadminmainSlide = catchAsync(async (req, res) => {
  const mainsliders = await mainSlider.find().sort({ createdAt: -1 });
  res.status(200).render("./adminPanel/admin-mainSlide", {
    title: "Ana Slayt Düzenle",
    mainsliders,
  });
});
exports.getpasswordUpdate = catchAsync(async (req, res) => {
  res.status(200).render("./adminPanel/admin-updateMyPassword", {
    title: "Şifremi Güncelle",
  });
});
exports.forgotPassword = catchAsync(async (req, res) => {
  res.status(200).render("./login/forgotPassword", {
    title: "Şifremi Unuttum",
  });
});
exports.resetPassword = catchAsync(async (req, res) => {
  res.status(200).render("./login/resetPassword", {
    title: "Şifremi Yenile",
  });
});
