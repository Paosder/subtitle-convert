'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _textEncoding = require('text-encoding');

var _writer = require('./writer');

var _writer2 = _interopRequireDefault(_writer);

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var kEnvironment = process.env.NODE_ENV && process.env.NODE_ENV.trim().toLowerCase() === 'production' ? 'production' : 'development';
var fs = null;

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
        {
          this.encoded = filename;
          this.originext = ext;
        }
        this.originext = this.originext.toUpperCase();
        this.targetencode = targetencode;
        this.parsed = false;
        this.loaded = true;
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }, {
    key: 'parse',
    value: function parse(object) {
      if (object !== undefined) {
        if (typeof object === 'string') {
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
        } else {
          return false;
        }
      }
      if (!this.loaded) {
        return false;
      }
      switch (this.originext) {
        case '.SMI':
          this.parsed = _parser2.default.SMIParser(this.encoded);
          break;
        case '.VTT':
          this.parsed = _parser2.default.VTTParser(this.encoded);
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
        res = new _writer2.default.VTTWriter(this.parsed, type, this.targetencode, fs).write(target);
      } else {
        console.log('\n        There are no such types to convert : ' + upperType + '\n      ');
        return res;
      }
      return res;
    }
  }, {
    key: 'delay',
    value: function delay(time, index, end, resize) {
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
      var cueIndex = index || 0;
      var cueIndexEnd = index || this.parsed.cueList.length - 1;
      if (cueIndex < this.parsed.cueList.length) {
        if (index && typeof end === 'number') {
          if (end >= 0) {
            cueIndexEnd = end;
          } else {
            cueIndexEnd = this.parsed.cueList.length - 1;
          }
        }
        if (cueIndexEnd < this.parsed.cueList.length) {
          for (var i = cueIndex; i <= cueIndexEnd; i += 1) {
            resize !== undefined || this.parsed.cueList[i].start.setUTCSeconds(this.parsed.cueList[i].start.getUTCSeconds() + sec);
            this.parsed.cueList[i].end.setUTCSeconds(this.parsed.cueList[i].end.getUTCSeconds() + sec);
            if (milli !== undefined) {
              resize !== undefined || this.parsed.cueList[i].start.setUTCMilliseconds(this.parsed.cueList[i].start.getUTCMilliseconds() + milli);
              this.parsed.cueList[i].end.setUTCMilliseconds(this.parsed.cueList[i].end.getUTCMilliseconds() + milli);
            }
          }
          return true;
        }
      } else {
        return false;
      }
      return true;
    }
  }, {
    key: 'resize',
    value: function resize(time, index, end) {
      return this.delay(time, index, end, true);
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
  }, {
    key: 'apply',
    value: function apply(cueList) {
      if ((typeof cueList === 'undefined' ? 'undefined' : _typeof(cueList)) === 'object') {
        /* https://developer.mozilla.org/en-US/docs/Web/API/TextTrack,
          cues are read-only but it can modify like tricky method below.
          This is temporary modification method so we should write other codes
          to modify.
        */
        for (var i = 0; i < cueList.length; i += 1) {
          var arr = cueList[i];
          var el = this.parsed.cueList[parseInt(arr.id, 10)];
          arr.endTime = el.end.getUTCMinutes() * 60 + el.end.getUTCSeconds() + el.end.getUTCMilliseconds() * 0.001;
          arr.startTime = el.start.getUTCMinutes() * 60 + el.start.getUTCSeconds() + el.start.getUTCMilliseconds() * 0.001;
          arr.text = el.text;
        }
        return true;
      }
      return false;
    }
  }]);

  return SubtitleConverter;
}();

exports.default = SubtitleConverter;
