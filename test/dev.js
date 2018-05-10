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
console.log(a.delay(-0.5));
console.log(a.delay(-0.5));
console.log(a.parsed.cueList[0]);
console.log(a.parsed.cueList[1]);
console.log('test'.red);
