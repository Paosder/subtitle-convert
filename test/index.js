/* eslint-disable */
const invariant = require('invariant');
const path = require('path');
const colors = require('colors');
const SC = require('../lib').default;

// init test 1
console.log(`--------------------
  INIT TEST 1 - without files
--------------------`.green);
const inittest1 = new SC();

console.log('expect : ' + 'false'.yellow);
invariant(!inittest1.parse(), 'init test1 : Unknown parse success.');
console.log('PASS'.cyan);
console.log('expect : ' + 'false'.yellow);
invariant(!inittest1.convert(), 'init test1 : Unknown convert success.');
console.log('PASS'.cyan);

// init test 2
console.log(`--------------------
  INIT TEST 2 - with SAMI(.smi)
--------------------`.green);
const inittest2 = new SC();
console.log('expect : ' + 'true'.yellow);
invariant(
  inittest2.load(
    path.join(__dirname, 'test.sami'),
    '.smi',
  ),
  'init test2 : Load failed.',
);
console.log('PASS'.cyan);
console.log('expect : ' + 'true'.yellow);
invariant(inittest2.parse(), 'init test2 : Parse SMI failed.');
console.log('PASS'.cyan);
console.log('expect : ' + 'false'.yellow);
invariant(!inittest2.convert(), 'init test2 : Unknown convert success.');
console.log('PASS'.cyan);
console.log('expect : ' + 'true'.yellow);
invariant(inittest2.convert('.vtt'), 'init test2 : Convert to VTT failed.');
console.log('PASS'.cyan);

// init test 3
console.log(`--------------------
  INIT TEST 3 - with SAMI(.smi)
--------------------`.green);
const inittest3 = new SC(
  path.join(__dirname, 'test.sami'),
  '.smi',
);
console.log('expect : ' + 'true'.yellow);
invariant(inittest3.parse(), 'init test3 : Parse SMI failed');
console.log('PASS'.cyan);
console.log('expect : ' + 'true'.yellow);
invariant(inittest3.convert('.vtt', path.join(__dirname, 'test.vtt')), 'init test3 : Convert to VTT failed');
console.log('PASS'.cyan);

// vtt parse test
console.log(`--------------------
  VTT Parse Test
--------------------`.green);
const testVTT = new SC(
  path.join(__dirname, 'test.vatt'),
  '.vtt',
);
console.log('expect : ' + 'true'.yellow);
invariant(testVTT.parse(), 'parse vtt : Parse VTT failed');
console.log('PASS'.cyan);
console.log('expect : ' + 'true'.yellow);
invariant(testVTT.convert('.vtt'), 'parse vtt : Convert to VTT failed');
console.log('PASS'.cyan);

// stringify && parse test
console.log(`--------------------
  Stringify && Parse Test
--------------------`.green);
console.log('expect : ' + 'true'.yellow);
const objectStringify = testVTT.stringify();
invariant(testVTT.parse(objectStringify), 'stringify : Parse failed');
console.log('PASS'.cyan);

// delay && resize test
console.log(`--------------------
  Delay && Resize Test
--------------------`.green);
console.log('expect : ' + 'true'.yellow);
invariant(testVTT.delay(10), 'delay : failed');
console.log('PASS'.cyan);
console.log('expect : ' + 'true'.yellow);
invariant(testVTT.delay(10, 0), 'delay-index : failed');
console.log('PASS'.cyan);
console.log('expect : ' + 'true'.yellow);
invariant(testVTT.delay(10, 3, -1), 'delay-to-end : failed');
console.log('PASS'.cyan);
console.log('expect : ' + 'true'.yellow);
invariant(testVTT.resize(10), 'resize : failed');
console.log('PASS'.cyan);
console.log('expect : ' + 'true'.yellow);
invariant(testVTT.resize(10, 0), 'resize-index : failed');
console.log('PASS'.cyan);
console.log('expect : ' + 'true'.yellow);
invariant(testVTT.resize(10, 3, -1), 'resize-to-end : failed');
console.log('PASS'.cyan);

console.log('Test Completed!'.cyan);
