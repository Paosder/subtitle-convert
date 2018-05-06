/* eslint-disable */
const path = require('path');
const colors = require('colors');
const SC = require('../lib').default;

const a = new SC();
//a.load('./test/test.vtt', '.vtt');
a.load('./test/test.sami', '.smi');
a.parse();
a.convert('.vtt', './test/test.vtt');
const b = new SC();
a.parse(a.stringify());
// console.log(a.encoded);
console.log(a.delay(10));
console.log(a.parsed.cueList[3]);
console.log(a.parsed.cueList[4]);
console.log('test'.red);
