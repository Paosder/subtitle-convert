'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _basestyle = require('./basestyle');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      var fp = _fs2.default.createWriteStream(target + '.' + this.type, {
        flags: 'w'
      });
      fp.write('WEBVTT\r\n\r\n');
      fp.write('NOTE\r\nSTYLE_START\r\n');
      fp.write('/* For not-supported browser only.\r\n');
      fp.write(' Paste this part to head style using xhr. */\r\n');
      this.styleList.forEach(function (el, i) {
        fp.write('video::cue(.style' + i + ') {\r\n');
        fp.write('\tcolor: ' + (el.color.length === 6 ? '#' + el.color : el.color) + ';\r\n');
        if (el.face) {
          fp.write('\tfont-family: ' + el.face + ';\r\n');
        }
        fp.write('}\r\n');
      });
      fp.write('/* End of inner css. */\r\nSTYLE_END\r\n\r\n');
      this.commentList.forEach(function (el) {
        fp.write('NOTE\r\n');
        fp.write(el + '\r\n\r\n');
      });
      this.styleList.forEach(function (el, i) {
        fp.write('STYLE\r\n');
        fp.write('::cue(.style' + i + ') {\r\n');
        fp.write('\tcolor: ' + (el.color.length === 6 ? '#' + el.color : el.color) + ';\r\n');
        if (el.face) {
          fp.write('\tfont-family: ' + el.face + ';\r\n');
        }
        fp.write('}\r\n\r\n');
      });
      this.cueList.forEach(function (el, i) {
        fp.write(i + '\r\n');
        fp.write(el.start + ' --> ' + el.end + '\r\n');
        fp.write(el.text + '\r\n');
        fp.write('\r\n');
      });
      fp.end();
      return true;
    }
  }]);

  return VTTWriter;
}(_basestyle.SubtitleWriter);

exports.default = VTTWriter;