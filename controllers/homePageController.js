const Announcment = require("./../models/announcmentModel");
const Comment = require("./../models/commentModel");
const mainSlider = require("./../models/mainSliderModel");
const Gallery = require("./../models/galleryModel");

const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getAllAnnouncments = factory.getAll(Announcment);
exports.getAllGallery = factory.getAll(Gallery);
