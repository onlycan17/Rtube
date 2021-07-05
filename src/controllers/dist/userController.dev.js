"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.see = exports.postChangePassword = exports.getChangePassword = exports.postEdit = exports.getEdit = exports.logout = exports.finishGithubLogin = exports.startGithubLogin = exports.postLogin = exports.getLogin = exports.postJoin = exports.getJoin = void 0;

var _User = _interopRequireDefault(require("../models/User"));

var _Video = _interopRequireDefault(require("../models/Video"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getJoin = function getJoin(req, res) {
  return res.render("join", {
    pageTitle: "Join"
  });
};

exports.getJoin = getJoin;

var postJoin = function postJoin(req, res) {
  var _req$body, name, username, email, password, password2, location, pageTitle, exists;

  return regeneratorRuntime.async(function postJoin$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, username = _req$body.username, email = _req$body.email, password = _req$body.password, password2 = _req$body.password2, location = _req$body.location;
          pageTitle = "Join";

          if (!(password !== password2)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).render("join", {
            pageTitle: pageTitle,
            errorMessage: "Password confirmation does not match."
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(_User["default"].exists({
            $or: [{
              username: username
            }, {
              email: email
            }]
          }));

        case 6:
          exists = _context.sent;

          if (!exists) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(400).render("join", {
            pageTitle: pageTitle,
            errorMessage: "This username/email is already taken."
          }));

        case 9:
          _context.prev = 9;
          _context.next = 12;
          return regeneratorRuntime.awrap(_User["default"].create({
            name: name,
            username: username,
            email: email,
            password: password,
            location: location
          }));

        case 12:
          return _context.abrupt("return", res.redirect("/login"));

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](9);
          return _context.abrupt("return", res.status(400).render("join", {
            pageTitle: "Upload Video",
            errorMessage: _context.t0._message
          }));

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[9, 15]]);
};

exports.postJoin = postJoin;

var getLogin = function getLogin(req, res) {
  return res.render("login", {
    pageTitle: "Login"
  });
};

exports.getLogin = getLogin;

var postLogin = function postLogin(req, res) {
  var _req$body2, username, password, pageTitle, user, ok;

  return regeneratorRuntime.async(function postLogin$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, username = _req$body2.username, password = _req$body2.password;
          pageTitle = "Login";
          _context2.next = 4;
          return regeneratorRuntime.awrap(_User["default"].findOne({
            username: username,
            socialOnly: false
          }));

        case 4:
          user = _context2.sent;

          if (user) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(400).render("login", {
            pageTitle: pageTitle,
            errorMessage: "An account with this username does not exists."
          }));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(_bcrypt["default"].compare(password, user.password));

        case 9:
          ok = _context2.sent;

          if (ok) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", res.status(400).render("login", {
            pageTitle: pageTitle,
            errorMessage: "Wrong password"
          }));

        case 12:
          req.session.loggedIn = true;
          req.session.user = user;
          return _context2.abrupt("return", res.redirect("/"));

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.postLogin = postLogin;

var startGithubLogin = function startGithubLogin(req, res) {
  var baseUrl = "https://github.com/login/oauth/authorize";
  var config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email"
  };
  var params = new URLSearchParams(config).toString();
  var finalUrl = "".concat(baseUrl, "?").concat(params);
  return res.redirect(finalUrl);
};

exports.startGithubLogin = startGithubLogin;

var finishGithubLogin = function finishGithubLogin(req, res) {
  var baseUrl, config, params, finalUrl, tokenRequest, access_token, apiUrl, userData, emailData, emailObj, user;
  return regeneratorRuntime.async(function finishGithubLogin$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          baseUrl = "https://github.com/login/oauth/access_token";
          config = {
            client_id: process.env.GH_CLIENT,
            client_secret: process.env.GH_SECRET,
            code: req.query.code
          };
          params = new URLSearchParams(config).toString();
          finalUrl = "".concat(baseUrl, "?").concat(params);
          _context3.t0 = regeneratorRuntime;
          _context3.next = 7;
          return regeneratorRuntime.awrap((0, _nodeFetch["default"])(finalUrl, {
            method: "post",
            headers: {
              Accept: "application/json"
            }
          }));

        case 7:
          _context3.t1 = _context3.sent.json();
          _context3.next = 10;
          return _context3.t0.awrap.call(_context3.t0, _context3.t1);

        case 10:
          tokenRequest = _context3.sent;

          if (!("access_token" in tokenRequest)) {
            _context3.next = 46;
            break;
          }

          access_token = tokenRequest.access_token;
          apiUrl = "https://api.github.com";
          _context3.t2 = regeneratorRuntime;
          _context3.next = 17;
          return regeneratorRuntime.awrap((0, _nodeFetch["default"])("".concat(apiUrl, "/user"), {
            headers: {
              Authorization: "token ".concat(access_token)
            }
          }));

        case 17:
          _context3.t3 = _context3.sent.json();
          _context3.next = 20;
          return _context3.t2.awrap.call(_context3.t2, _context3.t3);

        case 20:
          userData = _context3.sent;
          _context3.t4 = regeneratorRuntime;
          _context3.next = 24;
          return regeneratorRuntime.awrap((0, _nodeFetch["default"])("".concat(apiUrl, "/user/emails"), {
            headers: {
              Authorization: "token ".concat(access_token)
            }
          }));

        case 24:
          _context3.t5 = _context3.sent.json();
          _context3.next = 27;
          return _context3.t4.awrap.call(_context3.t4, _context3.t5);

        case 27:
          emailData = _context3.sent;
          console.log(userData);
          console.log('______data______');
          console.log(emailData);
          emailObj = emailData.find(function (email) {
            return email.primary === true && email.verified === true;
          });

          if (emailObj) {
            _context3.next = 34;
            break;
          }

          return _context3.abrupt("return", res.redirect("/login"));

        case 34:
          _context3.next = 36;
          return regeneratorRuntime.awrap(_User["default"].findOne({
            email: emailObj.email
          }));

        case 36:
          user = _context3.sent;

          if (user) {
            _context3.next = 41;
            break;
          }

          _context3.next = 40;
          return regeneratorRuntime.awrap(_User["default"].create({
            avatarUrl: userData.avatar_url,
            name: userData.name,
            email: emailObj.email,
            username: userData.login,
            password: "",
            socialOnly: true,
            location: userData.location
          }));

        case 40:
          user = _context3.sent;

        case 41:
          req.session.loggedIn = true;
          req.session.user = user;
          return _context3.abrupt("return", res.redirect("/"));

        case 46:
          return _context3.abrupt("return", res.redirect("/login"));

        case 47:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.finishGithubLogin = finishGithubLogin;

var logout = function logout(req, res) {
  req.session.destroy();
  req.flash("info", "Bye Bye");
  return res.redirect("/");
};

exports.logout = logout;

var getEdit = function getEdit(req, res) {
  console.log(req.session.user);
  return res.render("edit-profile", {
    pageTitle: "Edit Profile"
  });
};

exports.getEdit = getEdit;

var postEdit = function postEdit(req, res) {
  var _req$session$user, _id, avatarUrl, session_email, session_username, _req$body3, name, email, username, location, file, checkBool, checkUpdate, updatedUser;

  return regeneratorRuntime.async(function postEdit$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$session$user = req.session.user, _id = _req$session$user._id, avatarUrl = _req$session$user.avatarUrl, session_email = _req$session$user.email, session_username = _req$session$user.username, _req$body3 = req.body, name = _req$body3.name, email = _req$body3.email, username = _req$body3.username, location = _req$body3.location, file = req.file;
          console.log(file);

          if (session_email !== email || session_username !== username) {
            checkBool = true;
          }

          if (!checkBool) {
            _context4.next = 8;
            break;
          }

          _context4.next = 6;
          return regeneratorRuntime.awrap(_User["default"].exists({
            _id: {
              $ne: _id
            },
            $or: [{
              username: username
            }, {
              email: email
            }]
          }));

        case 6:
          checkUpdate = _context4.sent;
          console.log("updateChek Result:" + checkUpdate);

        case 8:
          if (!checkUpdate) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", res.status(400).render("edit-profile", {
            pageTitle: "Edit Profile",
            errorMessage: "This username/email is already use."
          }));

        case 10:
          _context4.next = 12;
          return regeneratorRuntime.awrap(_User["default"].findByIdAndUpdate(_id, {
            avatarUrl: file ? file.path : avatarUrl,
            name: name,
            email: email,
            username: username,
            location: location
          }, {
            "new": true
          }));

        case 12:
          updatedUser = _context4.sent;
          req.session.user = updatedUser;
          return _context4.abrupt("return", res.redirect("/users/edit"));

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.postEdit = postEdit;

var getChangePassword = function getChangePassword(req, res) {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "Can't change password.");
    return res.redirect("/");
  }

  return res.render("users/change-password", {
    pageTitle: "Change Password"
  });
};

exports.getChangePassword = getChangePassword;

var postChangePassword = function postChangePassword(req, res) {
  var _id, _req$body4, oldPassword, newPassword, newPasswordConfirmation, user, ok;

  return regeneratorRuntime.async(function postChangePassword$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _id = req.session.user._id, _req$body4 = req.body, oldPassword = _req$body4.oldPassword, newPassword = _req$body4.newPassword, newPasswordConfirmation = _req$body4.newPasswordConfirmation;
          _context5.next = 3;
          return regeneratorRuntime.awrap(_User["default"].findById(_id));

        case 3:
          user = _context5.sent;
          _context5.next = 6;
          return regeneratorRuntime.awrap(_bcrypt["default"].compare(oldPassword, user.password));

        case 6:
          ok = _context5.sent;

          if (ok) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: " The current password is incorrect"
          }));

        case 9:
          if (!(newPassword !== newPasswordConfirmation)) {
            _context5.next = 11;
            break;
          }

          return _context5.abrupt("return", res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The password does not match the confirmation"
          }));

        case 11:
          user.password = newPassword;
          _context5.next = 14;
          return regeneratorRuntime.awrap(user.save());

        case 14:
          req.flash("info", "Password update");
          return _context5.abrupt("return", res.redirect("/users/logout"));

        case 16:
        case "end":
          return _context5.stop();
      }
    }
  });
};

exports.postChangePassword = postChangePassword;

var see = function see(req, res) {
  var id, user, videos;
  return regeneratorRuntime.async(function see$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.id;
          _context6.next = 3;
          return regeneratorRuntime.awrap(_User["default"].findById(id).populate({
            path: "videos",
            populate: {
              path: "owner",
              model: "User"
            }
          }));

        case 3:
          user = _context6.sent;

          if (user) {
            _context6.next = 6;
            break;
          }

          return _context6.abrupt("return", res.status(400).render("404", {
            pageTitle: "User not found."
          }));

        case 6:
          _context6.next = 8;
          return regeneratorRuntime.awrap(_Video["default"].find({
            owner: user._id
          }));

        case 8:
          videos = _context6.sent;
          return _context6.abrupt("return", res.render("users/profile", {
            pageTitle: user.name,
            user: user,
            videos: videos
          }));

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  });
};

exports.see = see;