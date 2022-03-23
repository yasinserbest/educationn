const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, "Bir başlık belirtmelisiniz"],
  },
  review: {
    type: String,
    required: [true, "Yorumu  belirtmelisiniz"],
  },
  photo: {
    type: String,
    required: [true, "Bir resim olmalı!"],
  },
  name: {
    type: String,
    required: [true, "Bir isim girmelisiniz"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
