"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("./db");

require("./models/Video");

var _express = _interopRequireDefault(require("express"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _morgan = _interopRequireDefault(require("morgan"));

var _expressFlash = _interopRequireDefault(require("express-flash"));

var _rootRouter = _interopRequireDefault(require("./routers/rootRouter"));

var _userRouter = _interopRequireDefault(require("./routers/userRouter"));

var _videoRouter = _interopRequireDefault(require("./routers/videoRouter"));

var _middlewares = require("./middlewares");

var _connectMongo = _interopRequireDefault(require("connect-mongo"));

var _apiRouter = _interopRequireDefault(require("./routers/apiRouter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])(); //combined, dev

var logger = (0, _morgan["default"])("dev");
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(_express["default"].urlencoded({
  extended: true
})); //middleware that convert stringified string to js object

app.use(_express["default"].json()); //session must be declared before routers

app.use((0, _expressSession["default"])({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 864000000
  },
  store: _connectMongo["default"].create({
    mongoUrl: process.env.DB_URL
  })
}));
/*
//check session
app.use((req,res,next) => {
    req.sessionStore.all((error,sessions) => {
        console.log(sessions);
        next();
    });
});
*/

app.use((0, _expressFlash["default"])()); //localsMiddleware must come after session middleware

app.use(_middlewares.localsMiddleware);
app.use("/", _rootRouter["default"]);
app.use("/videos", _videoRouter["default"]);
app.use("/users", _userRouter["default"]); //express.static exposes the folder to server

app.use("/uploads", _express["default"]["static"]("uploads"));
app.use("/static", _express["default"]["static"]("assets"));
app.use("/api", _apiRouter["default"]);
var _default = app;
exports["default"] = _default;