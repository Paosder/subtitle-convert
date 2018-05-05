'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
  function SubtitleWriter(parsed, type, encoding, fs) {
    _classCallCheck(this, SubtitleWriter);

    this.styleList = parsed.styleList;
    this.cueList = parsed.cueList;
    this.commentList = parsed.commentList;
    this.type = type;
    this.encoding = encoding;
    this.fs = fs;
  }

  _createClass(SubtitleWriter, [{
    key: 'writeFile',
    value: function writeFile(target, buf) {
      if (target !== undefined) {
        if (!process.browser) {
          var fp = this.fs.createWriteStream(target, {
            flags: 'w',
            encoding: this.encoding
          });
          fp.write(buf);
          fp.end();
          return true;
        }
      }
      return false;
    }
  }]);

  return SubtitleWriter;
}();

exports.default = { Cue: Cue, textStyle: textStyle, SubtitleWriter: SubtitleWriter };