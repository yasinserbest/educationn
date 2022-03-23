const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const compression = require("compression");

const galleryRouter = require("./routes/galleryRoutes");
const commentRouter = require("./routes/commentRoutes");
const homePageRouter = require("./routes/homePageRoutes");
const announcmentRouter = require("./routes/announcmentRoutes");
const mainSliderRouter = require("./routes/mainSliderRoutes");
const userRouter = require("./routes/userRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(helmet());
const scriptSrcUrls = ["https://cdnjs.cloudflare.com/"];
const connectSrcUrls = ["ws://127.0.0.1:*/"];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      connectSrc: ["'self'", ...connectSrcUrls],
      defaultSrc: [],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: ["'self'", "blob:", "data:"],
    },
  })
);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const limiter = rateLimit({
  max: 15,
  windowMs: 1 * 60 * 60 * 1000, //1 saat
  message: "too many requests from this IP, please try 1 hour again later!",
});

app.use("/admin/kullanici/login", limiter); //bu route'a 15 defa max saatlik giriş yapılmayı deneyebilir.

app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json()); //req.body diye almak için

app.use(compression());

app.use("/", viewRouter); //bunu diğerlerinin de en üstüne koy
app.use("/v1", homePageRouter);
app.use("/v1/admin/duyurular", announcmentRouter);
app.use("/v1/admin/yorumlar", commentRouter);
app.use("/v1/admin/anaSlayt", mainSliderRouter);
app.use("/v1/admin/kullanici", userRouter);
app.use("/v1/admin/galeri", galleryRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
