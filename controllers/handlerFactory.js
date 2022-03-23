const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");
const multer = require("multer");

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.file) req.body.photo = req.file.filename;
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("Böyle bir id bulunamadı", 404));
    }
    res.status(200).json({
      status: "success",
      data: null,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query).sort().paginate();

    //EXECUTE QUERY
    const doc = await features.query;

    //SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
