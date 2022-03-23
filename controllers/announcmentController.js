const Announcment = require("./../models/announcmentModel");
const factory = require("./handlerFactory");

exports.createAnnouncment = factory.createOne(Announcment);

exports.deleteAnnouncment = factory.deleteOne(Announcment);
