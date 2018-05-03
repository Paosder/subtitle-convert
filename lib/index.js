import { TextDecoder } from 'text-encoding';
import fs from 'fs';
import { Iconv } from 'iconv';
import path from 'path';
import DetectEncoding from 'detect-character-encoding';
import VTTWriter from './vttwriter';
import smiParser from './smiparser';
import vttParser from './vttparser';

class SubtitleConverter {
  constructor(filename, target, encode) {
    const raw = fs.readFileSync(filename);
    const autoencode = DetectEncoding(raw);
    let enc = null;
    if (arguments.length === 1) {
      enc = autoencode.encoding;
    } else if (arguments.length === 2) {
      enc = autoencode.encoding;
    } else if (autoencode.encoding !== encode.toUpperCase()) {
      console.log(`[Warning] Expected encoding : ${autoencode.encoding} / Input : ${encode}`);
    }
    if (!enc) {
      enc = encode;
    }
    const iconv = new Iconv(enc, 'UTF-8');
    const convraw = iconv.convert(raw);
    this.encoded = new TextDecoder('UTF-8').decode(convraw);
    this.target = target;
    this.origin = path.extname(filename).toUpperCase();
    this.parsed = false;
  }
  parse() {
    switch (this.origin) {
      case '.SMI':
        this.parsed = smiParser(this.encoded);
        break;
      case '.VTT':
        this.parsed = vttParser(this.encoded);
        break;
      default:
        return false;
    }
    return true;
  }
  convert(type) {
    let res = false;
    if (!this.parsed) {
      this.parse();
    }
    if (type.toUpperCase() === 'VTT') {
      res = new VTTWriter(this.parsed, type).write(this.target);
    } else {
      return res;
    }
    return res;
  }
}
/*
const a = new SubtitleConverter('./test/test.vtt', './test/test');
a.parse();
a.convert('vtt');
*/

export default SubtitleConverter;