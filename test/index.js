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
invariant(inittest3.convert('.vtt', 'test.vtt'), 'init test3 : Convert to VTT failed');
console.log('PASS'.cyan);
console.log(`--------------------
  VTT Parse Test
--------------------`.green);
const testVTT = new SC(
  path.join(__dirname, 'test.vtt'),
  '.vtt',
);
console.log('expect : ' + 'true'.yellow);
invariant(testVTT.parse(), 'parse vtt : Parse VTT failed');
console.log('PASS'.cyan);
console.log('expect : ' + 'true'.yellow);
invariant(testVTT.convert('.vtt'), 'parse vtt : Convert to VTT failed');
console.log('PASS'.cyan);
console.log(`--------------------
  Stringify && Parse Test
--------------------`.green);
console.log('expect : ' + 'true'.yellow);
const objectStringify = testVTT.stringify();
invariant(testVTT.parse(objectStringify), 'stringify : Parse failed');
console.log('PASS'.cyan);


console.log('Test Completed!'.cyan);
