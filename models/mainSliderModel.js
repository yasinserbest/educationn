const mongoose = require("mongoose");

const mainSliderSchema = new mongoose.Schema({
  photo: {
    type: String,
    required: [true, "Bir resim olmalı!"],
  },
  mainHeader: {
    type: String,
    required: [true, "Bir başlık belirtmelisiniz"],
  },
  subHeader: {
    type: String,
    required: [true, "Bir alt başlık belirtmelisiniz"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
const MainSlider = mongoose.model("MainSlider", mainSliderSchema);

module.exports = MainSlider;
