'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var SubtitleWriter = exports.SubtitleWriter = function SubtitleWriter(parsed, type) {
  _classCallCheck(this, SubtitleWriter);

  this.styleList = parsed.styleList;
  this.cueList = parsed.cueList;
  this.commentList = parsed.commentList;
  this.type = type;
};

exports.default = { Cue: Cue, textStyle: textStyle, SubtitleWriter: SubtitleWriter };