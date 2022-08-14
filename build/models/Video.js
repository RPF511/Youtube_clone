"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//export const formatHashtags = (hashtags) => hashtags.split(",").map((word) => word.startsWith('#') ? word : `#${word}`);
var videoSchema = new _mongoose["default"].Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 80
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100
  },
  fileUrl: {
    type: String,
    required: true
  },
  thumbUrl: {
    type: String,
    required: true
  },
  //Date.now() : executed every time / Date.now : executed when created
  createdAt: {
    type: Date,
    required: true,
    "default": Date.now
  },
  hashtags: [{
    type: String,
    trim: true
  }],
  meta: {
    views: {
      type: Number,
      required: true,
      "default": 0
    },
    rating: {
      type: Number,
      required: true,
      "default": 0
    }
  },
  comments: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Comment"
  }],
  owner: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
}); // videoSchema.pre('save', async function() {
//   this.hashtags = this.hashtags[0]
//   .split(",")
//   .map((word) => word.startsWith('#') ? word : `#${word}`);
// });

videoSchema["static"]('formatHashtags', function (hashtags) {
  return hashtags.split(",").map(function (word) {
    return word.startsWith('#') ? word : "#".concat(word);
  });
});

var Video = _mongoose["default"].model("Video", videoSchema);

var _default = Video;
exports["default"] = _default;