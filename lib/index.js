'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _textEncoding = require('text-encoding');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _iconv = require('iconv');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _detectCharacterEncoding = require('detect-character-encoding');

var _detectCharacterEncoding2 = _interopRequireDefault(_detectCharacterEncoding);

var _vttwriter = require('./vttwriter');

var _vttwriter2 = _interopRequireDefault(_vttwriter);

var _smiparser = require('./smiparser');

var _smiparser2 = _interopRequireDefault(_smiparser);

var _vttparser = require('./vttparser');

var _vttparser2 = _interopRequireDefault(_vttparser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SubtitleConverter = function () {
  function SubtitleConverter(filename, target, encode) {
    _classCallCheck(this, SubtitleConverter);

    var raw = _fs2.default.readFileSync(filename);
    var autoencode = (0, _detectCharacterEncoding2.default)(raw);
    var enc = null;
    if (arguments.length === 1) {
      enc = autoencode.encoding;
    } else if (arguments.length === 2) {
      enc = autoencode.encoding;
    } else if (autoencode.encoding !== encode.toUpperCase()) {
      console.log('[Warning] Expected encoding : ' + autoencode.encoding + ' / Input : ' + encode);
    }
    if (!enc) {
      enc = encode;
    }
    var iconv = new _iconv.Iconv(enc, 'UTF-8');
    var convraw = iconv.convert(raw);
    this.encoded = new _textEncoding.TextDecoder('UTF-8').decode(convraw);
    this.target = target;
    this.origin = _path2.default.extname(filename).toUpperCase();
    this.parsed = false;
  }

  _createClass(SubtitleConverter, [{
    key: 'parse',
    value: function parse() {
      switch (this.origin) {
        case '.SMI':
          this.parsed = (0, _smiparser2.default)(this.encoded);
          break;
        case '.VTT':
          this.parsed = (0, _vttparser2.default)(this.encoded);
          break;
        default:
          return false;
      }
      return true;
    }
  }, {
    key: 'convert',
    value: function convert(type) {
      var res = false;
      if (!this.parsed) {
        this.parse();
      }
      if (type.toUpperCase() === 'VTT') {
        res = new _vttwriter2.default(this.parsed, type).write(this.target);
      } else {
        return res;
      }
      return res;
    }
  }]);

  return SubtitleConverter;
}();
/*
const a = new SubtitleConverter('./test/test.vtt', './test/test');
a.parse();
a.convert('vtt');
*/

exports.default = SubtitleConverter;