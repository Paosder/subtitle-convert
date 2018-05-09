'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _smiparser = require('./smiparser');

var _smiparser2 = _interopRequireDefault(_smiparser);

var _vttparser = require('./vttparser');

var _vttparser2 = _interopRequireDefault(_vttparser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  SMIParser: _smiparser2.default,
  VTTParser: _vttparser2.default
};