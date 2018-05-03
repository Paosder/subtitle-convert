const invariant = require('invariant');
const SC = require('../lib').default;
const path = require('path');

const test = new SC(
  path.join(__dirname, 'test.smi'),
  path.join(__dirname, 'test'),
);

invariant(test.parse(), 'Parse Test');
invariant(test.convert('vtt'), 'Convert Test');

const testVTT = new SC(
  path.join(__dirname, 'test.vtt'),
  path.join(__dirname, 'test'),
);

invariant(testVTT.parse(), 'Parse Test');
invariant(testVTT.convert('vtt'), 'Convert Test');

console.log('Test completed!');
