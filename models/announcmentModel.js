const mongoose = require("mongoose");

const announcmentSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, "Duyuru başlığı boş olamaz!"],
  },

  creator: {
    type: String,
    required: [true, "Duyuruyu kimin oluşturduğunu belirmelisiniz!"],
  },
  announcment: {
    type: String,
    required: [true, "Bir duyuru girmelisiniz!"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Announcment = mongoose.model("Announcment", announcmentSchema);

module.exports = Announcment;
