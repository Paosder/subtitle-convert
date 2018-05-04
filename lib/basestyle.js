'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SubtitleWriter = exports.textStyle = exports.Cue = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _detectNode = require('detect-node');

var _detectNode2 = _interopRequireDefault(_detectNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cue = exports.Cue = function Cue() {
  return {
    start: 0,
    end: 0,
    text: ''
  };
};

var textStyle = exports.textStyle = function textStyle() {
  return {
    color: '',
    face: ''
  };
};

var SubtitleWriter = exports.SubtitleWriter = function () {
  function SubtitleWriter(parsed, type, encoding) {
    _classCallCheck(this, SubtitleWriter);

    this.styleList = parsed.styleList;
    this.cueList = parsed.cueList;
    this.commentList = parsed.commentList;
    this.type = type;
    this.encoding = encoding;
  }

  _createClass(SubtitleWriter, [{
    key: 'writeFile',
    value: function writeFile(target, buf) {
      if (target !== undefined && _detectNode2.default) {
        var fp = _fs2.default.createWriteStream(target, {
          flags: 'w',
          encoding: this.encoding
        });
        fp.write(buf);
        fp.end();
        return true;
      }
      return false;
    }
  }]);

  return SubtitleWriter;
}();

exports.default = { Cue: Cue, textStyle: textStyle, SubtitleWriter: SubtitleWriter };