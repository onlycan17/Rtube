"use strict";

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _regeneratorRuntime = require("regenerator-runtime");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var videoContainer = document.getElementById("videoContainer");
var form = document.getElementById("commentForm"); //const videoComments = document.querySelector(".video__comments ul");

var deleteIcon = document.getElementsByClassName("delete_icon");
var editIcom = document.getElementsByClassName("edit_icon"); //console.log(deleteIcon[0]);

var editComment =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(tag, id) {
    var li, textSpan, input, saveBtn, cancelBtn, spanArray;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            li = tag.parentNode;
            console.log(li.querySelector("span"));
            textSpan = li.querySelector("span"); //console.log(textSpan.innerText);

            input = document.createElement("input");
            input.setAttribute("id", id);
            input.setAttribute("value", textSpan.innerText);
            saveBtn = document.createElement("button");
            saveBtn.setAttribute("id", id);
            saveBtn.innerText = "Save";
            cancelBtn = document.createElement("button");
            cancelBtn.setAttribute("id", "cancel_" + id);
            cancelBtn.innerText = 'Cancel';
            spanArray = li.querySelectorAll("span");
            spanArray.forEach(function (element) {
              element.setAttribute("style", "display:none");
            }); //li.remove();

            li.appendChild(input);
            li.appendChild(saveBtn);
            li.appendChild(cancelBtn);
            saveBtn.addEventListener("click", function () {
              return handleEdit(id, input.value, li);
            });
            cancelBtn.addEventListener("click", function () {
              return handleCancel(li, id);
            });

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function editComment(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var handleCancel = function handleCancel(li, id) {
  var spanArray = li.querySelectorAll("span");
  spanArray.forEach(function (element) {
    element.setAttribute("style", "display:auto");
  });
  var input = li.querySelector("input");
  var button = li.querySelectorAll("button");
  input.remove();
  button.forEach(function (element) {
    element.remove();
  });
};

var handleEdit =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(id, text, li) {
    var response, span;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log(id);
            console.log(id.length);
            _context2.next = 4;
            return (0, _nodeFetch["default"])("/api/videos/".concat(id, "/comment"), {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                text: text
              })
            });

          case 4:
            response = _context2.sent;

            if (response.status === 200) {
              span = li.querySelector("span");
              span.innerText = text;
              handleCancel(li, id);
            }

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function handleEdit(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

var handleDelete =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(id) {
    var response, span, li;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log('id:' + id);
            _context3.next = 3;
            return (0, _nodeFetch["default"])("/api/videos/".concat(id, "/comment"), {
              method: "get"
            });

          case 3:
            response = _context3.sent;
            console.log('status: ' + response.status);

            if (response.status === 200) {
              span = document.getElementById(id);
              li = span.parentNode;
              console.log(li);
              li.remove();
            }

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function handleDelete(_x6) {
    return _ref3.apply(this, arguments);
  };
}();

var addComment = function addComment(text, id) {
  var videoComments = document.querySelector(".video__comments ul");
  var newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  var icon = document.createElement("i");
  icon.className = "fas fa-comment";
  var span = document.createElement("span");
  span.innerText = " ".concat(text);
  var span2 = document.createElement("span");
  span2.innerText = "❌";
  span2.setAttribute("class", "delete_icon");
  span2.setAttribute("id", id);
  var span3 = document.createElement("span");
  span3.innerText = '📝';
  span3.setAttribute("class", "edit_icon");
  span3.setAttribute("id", "id");
  span3.dataset.id = id; //span2.setAttribute("data-id",id);

  console.log(id);
  span2.dataset.id = id;
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  newComment.appendChild(span3);
  videoComments.prepend(newComment);
  deleteIcon = document.getElementsByClassName("delete_icon");

  var _loop = function _loop(i) {
    //deleteIcon[i].dataset.id = id;
    var id = deleteIcon[i].dataset.id;
    console.log(id);
    deleteIcon[i].addEventListener("click", function () {
      return handleDelete(id);
    });
  };

  for (var i = 0; i < deleteIcon.length; i++) {
    _loop(i);
  }
};

var btn = form.querySelector("button");

var handleSubmit =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(event) {
    var textarea, text, videoId, response, _ref5, newCommentId;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            event.preventDefault();
            textarea = form.querySelector("textarea");
            text = textarea.value;
            videoId = videoContainer.dataset.id;

            if (!(text === '')) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt("return");

          case 6:
            _context4.next = 8;
            return (0, _nodeFetch["default"])("/api/videos/".concat(videoId, "/comment"), {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                text: text
              })
            });

          case 8:
            response = _context4.sent;
            console.log(status);

            if (!(response.status === 201)) {
              _context4.next = 17;
              break;
            }

            textarea.value = "";
            _context4.next = 14;
            return response.json();

          case 14:
            _ref5 = _context4.sent;
            newCommentId = _ref5.newCommentId;
            addComment(text, newCommentId);

          case 17:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function handleSubmit(_x7) {
    return _ref4.apply(this, arguments);
  };
}();

if (form) {
  form.addEventListener("submit", handleSubmit);
}

var _loop2 = function _loop2(i) {
  var id = deleteIcon[i].dataset.id; //console.log(id); 

  deleteIcon[i].addEventListener("click", function () {
    return handleDelete(id);
  });
  editIcom[i].addEventListener("click", function () {
    return editComment(editIcom[i], id);
  });
};

for (var i = 0; i < deleteIcon.length; i++) {
  _loop2(i);
}