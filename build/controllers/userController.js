"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postChangePassword = exports.getChangePassword = exports.logout = exports.search = exports.remove = exports.postEdit = exports.getEdit = exports.finishGithubLogin = exports.startGithubLogin = exports.postLogin = exports.getLogin = exports.postJoin = exports.getJoin = exports.see = void 0;

var _User = _interopRequireDefault(require("../models/User"));

var _Video = _interopRequireDefault(require("../models/Video"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var see = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var id, user;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = req.params.id;
            _context.next = 3;
            return _User["default"].findById(id).populate("videos");

          case 3:
            user = _context.sent;
            ;

            if (user) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", res.status(404).render("404", {
              pageTitle: "User not Found"
            }));

          case 7:
            return _context.abrupt("return", res.render("users/profile", {
              pageTitle: "".concat(user.name),
              user: user
            }));

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function see(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.see = see;

var getJoin = function getJoin(req, res) {
  return res.render("users/join", {
    pageTitle: "Join"
  });
};

exports.getJoin = getJoin;

var postJoin = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var pageTitle, _req$body, name, username, email, password, passwordCheck, location, usernameError, emailError, passwordError, errorExists;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            pageTitle = "Join";
            _req$body = req.body, name = _req$body.name, username = _req$body.username, email = _req$body.email, password = _req$body.password, passwordCheck = _req$body.passwordCheck, location = _req$body.location;
            usernameError = "";
            emailError = "";
            passwordError = "";
            errorExists = 0; //const exists = await User.exists({$or: [{username},{email}]} );

            _context2.next = 8;
            return _User["default"].exists({
              username: username
            });

          case 8:
            if (!_context2.sent) {
              _context2.next = 11;
              break;
            }

            usernameError = "this username is already taken";
            errorExists = 1;

          case 11:
            _context2.next = 13;
            return _User["default"].exists({
              email: email
            });

          case 13:
            if (!_context2.sent) {
              _context2.next = 16;
              break;
            }

            emailError = "this email is already taken";
            errorExists = 1;

          case 16:
            if (password !== passwordCheck) {
              passwordError = "password does not match";
              errorExists = 1;
            }

            if (!errorExists) {
              _context2.next = 19;
              break;
            }

            return _context2.abrupt("return", res.status(400).render("users/join", {
              pageTitle: "Join",
              usernameError: usernameError,
              emailError: emailError,
              passwordError: passwordError,
              name: name,
              username: username,
              email: email,
              location: location
            }));

          case 19:
            _context2.prev = 19;
            _context2.next = 22;
            return _User["default"].create({
              name: name,
              username: username,
              email: email,
              password: password,
              location: location
            });

          case 22:
            return _context2.abrupt("return", res.redirect("/login"));

          case 25:
            _context2.prev = 25;
            _context2.t0 = _context2["catch"](19);
            return _context2.abrupt("return", res.status(400).render("users/join", {
              pageTitle: "Join",
              errorMessage: _context2.t0._message
            }));

          case 28:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[19, 25]]);
  }));

  return function postJoin(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.postJoin = postJoin;

var getLogin = function getLogin(req, res) {
  return res.render("users/login", {
    pageTitle: "Login"
  });
};

exports.getLogin = getLogin;

var postLogin = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var _req$body2, username, password, pageTitle, user, ok;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _req$body2 = req.body, username = _req$body2.username, password = _req$body2.password;
            pageTitle = "Login";
            _context3.next = 4;
            return _User["default"].findOne({
              username: username
            });

          case 4:
            user = _context3.sent;

            if (user) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt("return", res.status(400).render("users/login", {
              pageTitle: pageTitle,
              errorMessage: "An account with this username doesn't exists."
            }));

          case 7:
            _context3.next = 9;
            return _bcrypt["default"].compare(password, user.password);

          case 9:
            ok = _context3.sent;

            if (ok) {
              _context3.next = 12;
              break;
            }

            return _context3.abrupt("return", res.status(400).render("users/login", {
              pageTitle: pageTitle,
              errorMessage: "Wrong PassWord."
            }));

          case 12:
            req.session.loggedIn = true;
            req.session.user = user;
            return _context3.abrupt("return", res.redirect("/"));

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function postLogin(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.postLogin = postLogin;

var startGithubLogin = function startGithubLogin(req, res) {
  var baseUrl = "https://github.com/login/oauth/authorize";
  var config = {
    client_id: process.env.GH_CLIENT,
    //allow_signup:false,
    scope: "read:user user:email"
  };
  var params = new URLSearchParams(config).toString();
  var finalUrl = "".concat(baseUrl, "?").concat(params);
  return res.redirect(finalUrl);
};

exports.startGithubLogin = startGithubLogin;

var finishGithubLogin = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var baseUrl, config, params, finalUrl, tokenRequest, access_token, apiUrl, userData, emailData, emailObj, user, _user;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            baseUrl = "https://github.com/login/oauth/access_token";
            config = {
              client_id: process.env.GH_CLIENT,
              client_secret: process.env.GH_SECRET,
              code: req.query.code
            };
            params = new URLSearchParams(config).toString();
            finalUrl = "".concat(baseUrl, "?").concat(params);
            _context4.next = 6;
            return (0, _nodeFetch["default"])(finalUrl, {
              method: "POST",
              headers: {
                Accept: "application/json"
              }
            });

          case 6:
            _context4.next = 8;
            return _context4.sent.json();

          case 8:
            tokenRequest = _context4.sent;

            if (!("access_token" in tokenRequest)) {
              _context4.next = 37;
              break;
            }

            access_token = tokenRequest.access_token;
            apiUrl = "https://api.github.com";
            _context4.next = 14;
            return (0, _nodeFetch["default"])("".concat(apiUrl, "/user"), {
              headers: {
                Authorization: "token ".concat(access_token)
              }
            });

          case 14:
            _context4.next = 16;
            return _context4.sent.json();

          case 16:
            userData = _context4.sent;
            _context4.next = 19;
            return (0, _nodeFetch["default"])("".concat(apiUrl, "/user/emails"), {
              headers: {
                Authorization: "token ".concat(access_token)
              }
            });

          case 19:
            _context4.next = 21;
            return _context4.sent.json();

          case 21:
            emailData = _context4.sent;
            emailObj = emailData.find(function (email) {
              return email.primary === true && email.verified === true;
            });

            if (emailObj) {
              _context4.next = 25;
              break;
            }

            return _context4.abrupt("return", res.redirect("/login"));

          case 25:
            _context4.next = 27;
            return _User["default"].findOne({
              email: emailObj.email
            });

          case 27:
            user = _context4.sent;

            if (user) {
              _context4.next = 32;
              break;
            }

            _context4.next = 31;
            return _User["default"].create({
              avatarUrl: userData.avatar_url,
              name: userData.name,
              username: userData.login,
              email: emailObj.email,
              password: "",
              socialOnly: true,
              location: userData.location
            });

          case 31:
            _user = _context4.sent;

          case 32:
            req.session.loggedIn = true;
            req.session.user = user;
            return _context4.abrupt("return", res.redirect("/"));

          case 37:
            return _context4.abrupt("return", res.redirect("/login"));

          case 38:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function finishGithubLogin(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.finishGithubLogin = finishGithubLogin;

var getEdit = function getEdit(req, res) {
  return res.render("users/edit-profile", {
    pageTitle: "Edit Profile",
    name: req.session.user.name,
    email: req.session.user.email,
    username: req.session.user.username,
    location: req.session.user.location
  });
};

exports.getEdit = getEdit;

var postEdit = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var usernameError, emailError, passwordError, errorExists, _req$session$user, _id, avatarUrl, _req$body3, name, email, username, location, password, file, currentUser, ok, updatedUser;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            //let errorMessages = { usernameError :"" ,emailError :"" ,passwordError :""};
            usernameError = "";
            emailError = "";
            passwordError = "";
            errorExists = 0;
            _req$session$user = req.session.user, _id = _req$session$user._id, avatarUrl = _req$session$user.avatarUrl, _req$body3 = req.body, name = _req$body3.name, email = _req$body3.email, username = _req$body3.username, location = _req$body3.location, password = _req$body3.password, file = req.file;
            _context5.next = 7;
            return _User["default"].findById(_id);

          case 7:
            currentUser = _context5.sent;
            _context5.next = 10;
            return _bcrypt["default"].compare(password, currentUser.password);

          case 10:
            ok = _context5.sent;

            if (!ok) {
              passwordError = "Wrong PassWord";
              errorExists = 1;
            }

            _context5.t0 = currentUser.email !== email;

            if (!_context5.t0) {
              _context5.next = 17;
              break;
            }

            _context5.next = 16;
            return _User["default"].exists({
              email: email
            });

          case 16:
            _context5.t0 = _context5.sent;

          case 17:
            if (!_context5.t0) {
              _context5.next = 20;
              break;
            }

            emailError = "this email is already taken";
            errorExists = 1;

          case 20:
            _context5.t1 = currentUser.username !== username;

            if (!_context5.t1) {
              _context5.next = 25;
              break;
            }

            _context5.next = 24;
            return _User["default"].exists({
              username: username
            });

          case 24:
            _context5.t1 = _context5.sent;

          case 25:
            if (!_context5.t1) {
              _context5.next = 28;
              break;
            }

            usernameError = "this username is already taken";
            errorExists = 1;

          case 28:
            if (!errorExists) {
              _context5.next = 33;
              break;
            }

            console.log(usernameError);
            console.log(emailError);
            console.log(passwordError);
            return _context5.abrupt("return", res.status(400).render("users/edit-profile", {
              pageTitle: "Edit Profile",
              usernameError: usernameError,
              emailError: emailError,
              passwordError: passwordError,
              name: name,
              email: email,
              username: username,
              location: location
            }));

          case 33:
            _context5.next = 35;
            return _User["default"].findByIdAndUpdate(_id, {
              avatarUrl: file ? file.path : avatarUrl,
              name: name,
              email: email,
              username: username,
              location: location
            }, //without this option, user.findByIdAndUpdate will return old object
            {
              "new": true
            });

          case 35:
            updatedUser = _context5.sent;
            return _context5.abrupt("return", res.redirect("/users/edit"));

          case 37:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function postEdit(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.postEdit = postEdit;

var remove = function remove(req, res) {
  return res.send("Remove User");
};

exports.remove = remove;

var search = function search(req, res) {
  return res.send("Search");
};

exports.search = search;

var logout = function logout(req, res) {
  try {
    req.session.destroy();
  } catch (error) {
    return res.status(400).render("/", {
      pageTitle: "Home",
      errorMessage: error._message
    });
  }

  return res.redirect("/");
};

exports.logout = logout;

var getChangePassword = function getChangePassword(req, res) {
  return res.render("users/change-password", {
    pageTitle: "Change Password"
  });
};

exports.getChangePassword = getChangePassword;

var postChangePassword = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    var errorExists, passwordError, passwordCheckError, _req$session$user2, _id, password, _req$body4, passwordOld, passwordNew, passwordNewCheck, currentUser, ok;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            errorExists = 0;
            passwordError = "";
            passwordCheckError = "";
            _req$session$user2 = req.session.user, _id = _req$session$user2._id, password = _req$session$user2.password, _req$body4 = req.body, passwordOld = _req$body4.passwordOld, passwordNew = _req$body4.passwordNew, passwordNewCheck = _req$body4.passwordNewCheck;
            _context6.next = 6;
            return _User["default"].findById(_id);

          case 6:
            currentUser = _context6.sent;
            _context6.next = 9;
            return _bcrypt["default"].compare(passwordOld, currentUser.password);

          case 9:
            ok = _context6.sent;

            if (!ok) {
              passwordError = "Wrong Password";
              errorExists = 1;
            }

            if (passwordNew !== passwordNewCheck) {
              passwordCheckError = "Password does not match";
              errorExists = 1;
            }

            if (!errorExists) {
              _context6.next = 14;
              break;
            }

            return _context6.abrupt("return", res.status(400).render("users/change-password", {
              pageTitle: "change-password",
              passwordError: passwordError,
              passwordCheckError: passwordCheckError
            }));

          case 14:
            currentUser.password = passwordNew;
            currentUser.save();
            req.session.user.password = currentUser.password;
            return _context6.abrupt("return", res.redirect("/users/logout"));

          case 18:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function postChangePassword(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

exports.postChangePassword = postChangePassword;