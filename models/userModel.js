const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Lütfen bir isim soyisim girin"],
  },
  email: {
    type: String,
    required: [true, "Lütfen bir email girin"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Lütfen bir şifre girin"],
    minlength: [8, "Şifreniz en az 8 karakter içermeli"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Lütfen bir confirm şifre gir"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Girilen şifreler aynı değil!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String, //bu ve alttakini forgotPassword için ekledik.
  passwordResetExpires: Date,
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  //kullanıcının yaratılış tarihi mi daha eski yoksa password değiştirdiği tarih mi eski onu bulmaya yardımıcı olan  fonksiyon. true dönerse kullanıcı password değiştirmiş, false deönerse değiştirmemiş
  if (this.passwordChangedAt) {
    //yok ise bu özellik demekki değiştirmemiş hiç pasaport
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(JWTTimestamp, changedTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  //false means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto //bu şifreli bir şekilde Database’de saklanacak
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 dakikada expire oluyor.

  return resetToken;
};
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
