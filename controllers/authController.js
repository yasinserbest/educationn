const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");
const Email = require("./../utils/email");
const { promisify } = require("util");

const signToken = (id) => {
  //token yaratma
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, //normalde bunun hemen altında secure: true yazmıştı ama o https olunca kullanılır dedi. şimdi kullanırsam hata verir. o yüzden productionda olunca eklensin diye if yazdım alta
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions); //cookie böyle oluşturulur

  //remove password from the output
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  //kullanıcı yaratma ve token yaratma
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {
  //giriş yapma ve token yaratma
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(
      new AppError("Lütfen mail adresinizi ve şifrenizi girin!", 400)
    );
  }
  // 2) Check if user exists && password is correct. Normalde getAllUsers dediğimizde veya getUser dediğimizde paraloyaı da çıktı olarak vermiyordu çünkü userModel password field’inde select:false eklemiştik. karşılaştırma yapmamız için almamız gerekiyor passwordu
  const user = await User.findOne({ email }).select("+password");

  //burda modele yazdığım correctPassword fonksiyosunu true veya false döndürüyor.
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Hatalı email veya şifre!", 401));
  }
  // 3) If everything ok, send token to client
  const token = signToken(user._id);
  createSendToken(user, 200, res);
});
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    // createsendtoken res.cookie'de jwt dedğimiz için burda da jwt diyoruz
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  //1) getting token and check of it's there. Postman header kısmından key kısmına authorization value kısmına da bearer asfefeafder girdik.
  let token;
  if (
    //console.log(req.headers) böyle yaparak bakabilirsin headerslarına.
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token || req.cookies.jwt === "loggedout") {
    return next(new AppError("Lütfen devam etmek için giriş yapınız.", 401));
  }

  //2) verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //tokenin Geçerli ol. Olm. Promisify ve verify ile kontrol ettik. Promisify ile ayrıştırdık. Şuan docedende { id: ‘321432432’, iat:123124312, exp:3432432 } şeklinbde obje var jwt kriptolanmış şeklinde.

  //3)check if user still exist. User üyeliğini silmiş olabilir ama token hala geçerlidir. öyle olduğu zaman tokenide deaktif yapmak lazım
  const currentUser = await User.findById(decoded.id); //decoded'te id geliyor ise demekki o user var ve true döner
  if (!currentUser) {
    return next(
      new AppError(
        "Kullanıcının sahip oluduğu anahtar artık geçerli değil",
        401
      )
    );
  }

  //4) checkk if user changed password after the token was created

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "Kullanıcı şifreyi değiştirdi, lütfen tekrar giriş yapın.",
        401
      )
    );
  }
  //GRANT ACCCESS TO PROTECTED ROUTE
  req.user = currentUser; //burda bir sonraki aşamalarda kullanabiliyim diye req.user’a atadım login olan kullanıcıyı.
  res.locals.user = currentUser;

  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError("Bu email ile kayıtlı olan bir kullanıcı yok.", 404)
    );
  }

  //2) Generate the random reset token . Bu bizim kullanıcıya göndereceğimiz resetleme token'i olacak. Her kulllanıcının kendi resetleme tokenini neden başta yaratıp database'e koymuyoruz? çünkü saldırı gelirse tokenler çalınır ve passwordları hackerlar resetler. bu tokenide şifreleyeceğiz şifresini tutacağız database’de. kullanıcıya şifresiz token'i göndereceğiz, o bize post ile tekrar bunu gönderdiğinde database'de olan şifreliyle karşılaştıracağız ikisi uyuşuyor mu diye.
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/sifremiYenile/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    //console.log(err);
    return next(
      new AppError(
        "Email gönderilmesinde sorun yaşandı. Lütfen daha sonra tekrar deneyiniz!"
      ),
      500
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) get user base on the token. Bak burda plain text’i şifreliye çevirdik. Sonra databasede findone ile eşit olanı bulduk.
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, //burda şifrelenmiş tokeni Database’de eşit olanı buldu ve baktı expired date şimdiden ileriki bir tarih mi diye, eğer öyle ise olur ama süresi geçmiş ise error attı.
  });
  ///2)if token has not expired,and there is user, set the new password
  if (!user) {
    return next(new AppError("Anahtar geçersiz veya süresi dolmuş!", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save(); //save kullandım update değil. içine de yukardakiler gibi validate false demedim. çünkü tüm validasyonlarımın asağlanmasını istiyorum.
  //3)update changedPasswordAt property for the user

  //4)log the user in, send jwt
  createSendToken(user, 200, res);
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  //2)check if posted current password
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    //correctPassword ise userModel'da tanımlı
    return next(new AppError("Mevcut şifreniz yanlış!", 401));
  }
  //3)if so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); //burda da findByIdAndUpdate kullamadık farkındaysan çünkü validatelar geçerli olsun istiyoruz

  //4) lo user in, send jwt
  createSendToken(user, 200, res);
});
