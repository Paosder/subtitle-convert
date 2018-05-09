'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _htmlparser = require('htmlparser2');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _basestyle = require('../basestyle');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var smiParser = function smiParser(encoded) {
  var parser = null;
  var cue = null;
  var style = null;
  var styleNum = -1;
  var styleList = [];
  var cueList = [];
  var commentList = [];
  parser = new _htmlparser.Parser({
    onopentag: function onopentag(name, attr) {
      if (name === 'sync') {
        var start = new Date(parseInt(attr.start, 10));
        if (cue) {
          cue.end = new Date(parseInt(attr.start, 10));
          if (cue.text.trim() !== '') {
            cueList.push(cue);
          }
        }
        cue = (0, _basestyle.Cue)();
        cue.start = start;
      } else if (name === 'br') {
        if (cue.text === '') {
          cue.text += ' ';
        }
        cue.text += '\n';
      } else if (name === 'font') {
        style = (0, _basestyle.textStyle)();
        _lodash2.default.forEach(attr, function (value, key) {
          style[key] = value;
        });
        styleNum = _lodash2.default.findIndex(styleList, _lodash2.default.matches({ color: style.color, face: style.face }));
        if (styleNum < 0) {
          styleNum = styleList.length;
          styleList.push(style);
        }
        cue.text += '<c.style' + styleNum + '>';
      } else if (!name.match(/sami|p|body|head|title|style/)) {
        cue.text += '<' + name + '>';
      }
    },
    ontext: function ontext(text) {
      if (cue) {
        cue.text += text.replace(/\r?\n|\r/g, '');
      }
    },
    onclosetag: function onclosetag(tagname) {
      if (tagname === 'font') {
        cue.text += '</c>';
      } else if (!tagname.match(/sami|p|body|head|title|style|br|sync/)) {
        cue.text += '</' + tagname + '>';
      }
    }
  }, { decodeEntities: true });
  parser.write(encoded);
  parser.end();
  var regex = new RegExp('<!--[\\s\\S]*?(?:-->)?' + '<!---+>?' + '|<!(?![dD][oO][cC][tT][yY][pP][eE]|\\[CDATA\\[)[^>]*>?' + '|<[?][^>]*>?', 'g');
  encoded.match(regex).forEach(function (el) {
    commentList.push(el.replace(/(\r\n){2}|(<!--)|(-->)|/g, '').replace(/^(\r\n)/g, ''));
  });
  return {
    styleList: styleList,
    cueList: cueList,
    commentList: commentList
  };
};

exports.default = smiParser;