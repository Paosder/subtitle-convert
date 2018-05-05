const path = require('path');
const colors = require('colors');
const SC = require('../lib').default;

const a = new SC();
a.load('./test/test.sami', '.smi');
a.parse();
console.log('test'.red);
