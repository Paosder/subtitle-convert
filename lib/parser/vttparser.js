'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _basestyle = require('../basestyle');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var vttParser = function vttParser(encoded) {
  // const d = /(?:NOTE[\r\n]){1}(?:[^\u000A\u000D]+[\n\r]{0,1})*/g;
  // const t = new RegExp(/(?:NOTE)[\r\n](?:.+[\n\r]{0,1})*[\r\n]{0,1}/, 'g', 'y');
  var chunks = encoded.split('\r\n\r\n');
  var cueList = [];
  var styleList = [];
  var commentList = [];
  chunks.forEach(function (el) {
    if (el.match(/NOTE/)) {
      if (!el.match(/STYLE_START/)) {
        commentList.push(el.replace(/(\r\n)?NOTE\r\n/, ''));
      }
    } else if (el.match(/STYLE/)) {
      var style = (0, _basestyle.textStyle)();
      var css = el.split(/[{}]/)[1].replace(/[\t\r\n]+/g, '').split(';');
      css.forEach(function (e) {
        var _e$split = e.split(':'),
            _e$split2 = _slicedToArray(_e$split, 3),
            attr = _e$split2[0],
            value = _e$split2[1],
            blank = _e$split2[2];

        if (attr.match(/color/)) {
          style.color = value;
        } else if (attr.match(/font-family/)) {
          style.face = value;
        }
      });
      styleList.push(style);
    } else if (!el.match(/^WEBVTT|^REGION/)) {
      var data = el.split(/\r\n/);
      if (data.length === 3) {
        var cue = (0, _basestyle.Cue)();
        var cueTime = null;

        var _data = _slicedToArray(data, 3);

        cueTime = _data[1];
        cue.text = _data[2];

        cueTime.split(' --> ').forEach(function (e) {
          var time = e.split(':');

          var _time$pop$split = time.pop().split('.'),
              _time$pop$split2 = _slicedToArray(_time$pop$split, 2),
              sec = _time$pop$split2[0],
              milli = _time$pop$split2[1];

          if (cue.start === 0) {
            cue.start = new Date(Date.UTC.apply(Date, [2018, 4, 3].concat(_toConsumableArray(time), [sec, milli])));
          } else {
            cue.end = new Date(Date.UTC.apply(Date, [2018, 4, 3].concat(_toConsumableArray(time), [sec, milli])));
          }
        });
        cueList.push(cue);
      }
    }
  });
  return {
    styleList: styleList,
    cueList: cueList,
    commentList: commentList
  };
};

exports.default = vttParser;