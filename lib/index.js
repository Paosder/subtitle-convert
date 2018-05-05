'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _textEncoding = require('text-encoding');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _iconv = require('iconv');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _detectCharacterEncoding = require('detect-character-encoding');

var _detectCharacterEncoding2 = _interopRequireDefault(_detectCharacterEncoding);

var _detectNode = require('detect-node');

var _detectNode2 = _interopRequireDefault(_detectNode);

var _vttwriter = require('./vttwriter');

var _vttwriter2 = _interopRequireDefault(_vttwriter);

var _smiparser = require('./smiparser');

var _smiparser2 = _interopRequireDefault(_smiparser);

var _vttparser = require('./vttparser');

var _vttparser2 = _interopRequireDefault(_vttparser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SubtitleConverter = function () {
  function SubtitleConverter() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _classCallCheck(this, SubtitleConverter);

    this.loaded = false;
    if (arguments.length > 0) {
      this.load.apply(this, args);
    }
  }

  _createClass(SubtitleConverter, [{
    key: 'load',
    value: function load(filename, ext, encode) {
      var targetencode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'UTF-8';

      try {
        if (_detectNode2.default) {
          var raw = _fs2.default.readFileSync(filename);
          var autoencode = (0, _detectCharacterEncoding2.default)(raw);
          var enc = null;
          if (arguments.length <= 2) {
            enc = autoencode.encoding;
          } else if (autoencode.encoding !== encode.toUpperCase()) {
            console.log('[Warning] Expected encoding : ' + autoencode.encoding + ' / Input : ' + encode);
          }
          if (!enc) {
            enc = encode;
          }
          var iconv = new _iconv.Iconv(enc, targetencode);
          var convraw = iconv.convert(raw);
          this.encoded = new _textEncoding.TextDecoder(targetencode).decode(convraw);
          this.originext = ext || _path2.default.extname(filename).toUpperCase();
        } else {
          this.encoded = filename;
          this.originext = ext;
        }
        this.originext = this.originext.toUpperCase();
        this.targetencode = targetencode;
        this.parsed = false;
        this.loaded = true;
        return true;
      } catch (e) {
        return false;
      }
    }
  }, {
    key: 'parse',
    value: function parse(object) {
      if (object !== undefined) {
        try {
          var that = JSON.parse(object);
          this.originext = that.originext;
          this.targetencode = that.targetencode;
          this.parsed = that.parsed;
          this.loaded = that.loaded;
          this.parsed.cueList = this.parsed.cueList.map(function (el) {
            var newel = Object.assign({}, el);
            newel.start = new Date(el.start);
            newel.end = new Date(el.end);
            return newel;
          });
          return true;
        } catch (e) {
          return false;
        }
      }
      if (!this.loaded) {
        return false;
      }
      switch (this.originext) {
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
    value: function convert(type, target) {
      var res = false;
      if (!this.parsed && !this.parse()) {
        console.log('\n        Parse failed! you may forgot to load before covert or\n        there is no method to parse : ' + this.originext + '.\n      ');
        return false;
      }
      if (type === undefined) {
        console.log('\n        There is no type to convert : ' + type + '. Please check arguments.\n      ');
        return false;
      }
      var upperType = type.toUpperCase();
      if (upperType === '.VTT') {
        res = new _vttwriter2.default(this.parsed, type, this.targetencode).write(target);
      } else {
        console.log('\n        There are no such types to convert : ' + upperType + '\n      ');
        return res;
      }
      return res;
    }
  }, {
    key: 'delay',
    value: function delay(time, index, resize) {
      if (!this.parsed) {
        console.log('\n        You must parse data before using this method.\n      ');
        return false;
      }

      var _time$toString$split = time.toString(10).split('.'),
          _time$toString$split2 = _slicedToArray(_time$toString$split, 2),
          sec = _time$toString$split2[0],
          milli = _time$toString$split2[1];

      if (milli !== undefined) {
        milli = parseInt(milli, 10);
        if (milli < 10) {
          milli *= 100;
        } else if (milli < 100) {
          milli *= 10;
        }
        if (sec.match('-')) {
          milli *= -1;
        }
      }
      sec = parseInt(sec, 10);
      if (index === undefined) {
        this.parsed.cueList.forEach(function (el) {
          resize !== undefined || el.start.setUTCSeconds(el.start.getUTCSeconds() + sec);
          el.end.setSeconds(el.end.getUTCSeconds() + sec);
          if (milli !== undefined) {
            resize !== undefined || el.start.setUTCMilliseconds(el.start.getUTCMilliseconds() + milli);
            el.end.setUTCMilliseconds(el.end.getUTCMilliseconds() + milli);
          }
        });
      } else if (index < this.parsed.cueList.length) {
        resize !== undefined || this.parsed.cueList[index].start.setUTCSeconds(this.parsed.cueList[index].start.getUTCSeconds() + sec);
        this.parsed.cueList[index].end.setUTCSeconds(this.parsed.cueList[index].end.getUTCSeconds() + sec);
        if (milli !== undefined) {
          resize === undefined || this.parsed.cueList[index].start.setUTCMilliseconds(this.parsed.cueList[index].start.getUTCMilliseconds() + milli);
          this.parsed.cueList[index].end.setUTCMilliseconds(this.parsed.cueList[index].end.getUTCMilliseconds() + milli);
        }
      } else {
        return false;
      }
      return true;
    }
  }, {
    key: 'resize',
    value: function resize(time, index) {
      this.delay(time, index, true);
    }
  }, {
    key: 'stringify',
    value: function stringify() {
      var that = {
        originext: this.originext,
        targetencode: this.targetencode,
        loaded: this.loaded,
        parsed: this.parsed
      };
      return JSON.stringify(that);
    }
  }]);

  return SubtitleConverter;
}();

exports.default = SubtitleConverter;