const mongoose = require("mongoose");
const gallerySchema = new mongoose.Schema({
  photo: {
    type: String,
    required: [true, "Bir resim olmalı!"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;
