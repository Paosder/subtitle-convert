'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _basestyle = require('./basestyle');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VTTWriter = function (_SubtitleWriter) {
  _inherits(VTTWriter, _SubtitleWriter);

  function VTTWriter() {
    _classCallCheck(this, VTTWriter);

    return _possibleConstructorReturn(this, (VTTWriter.__proto__ || Object.getPrototypeOf(VTTWriter)).apply(this, arguments));
  }

  _createClass(VTTWriter, [{
    key: 'write',
    value: function write(target) {
      var buf = '';
      buf += 'WEBVTT\r\n\r\n';
      buf += 'NOTE\r\nSTYLE_START\r\n';
      buf += '/* For not-supported browser only.\r\n';
      buf += ' Paste this part to head style using xhr. */\r\n';
      this.styleList.forEach(function (el, i) {
        buf += 'video::cue(.style' + i + ') {\r\n';
        buf += '\tcolor: ' + (el.color.length === 6 ? '#' + el.color : el.color) + ';\r\n';
        if (el.face) {
          buf += '\tfont-family: ' + el.face + ';\r\n';
        }
        buf += '}\r\n';
      });
      buf += '/* End of inner css. */\r\nSTYLE_END\r\n\r\n';
      this.commentList.forEach(function (el) {
        buf += 'NOTE\r\n';
        buf += el + '\r\n\r\n';
      });
      this.styleList.forEach(function (el, i) {
        buf += 'STYLE\r\n';
        buf += '::cue(.style' + i + ') {\r\n';
        buf += '\tcolor: ' + (el.color.length === 6 ? '#' + el.color : el.color) + ';\r\n';
        if (el.face) {
          buf += '\tfont-family: ' + el.face + ';\r\n';
        }
        buf += '}\r\n\r\n';
      });
      this.cueList.forEach(function (el, i) {
        buf += i + '\r\n';
        buf += el.start.toISOString().slice(11, -1) + ' ' + ('--> ' + el.end.toISOString().slice(11, -1) + '\r\n');
        buf += el.text + '\r\n';
        buf += '\r\n';
      });
      if (this.writeFile(target, buf)) {
        return true;
      }
      return buf;
    }
  }]);

  return VTTWriter;
}(_basestyle.SubtitleWriter);

exports.default = VTTWriter;