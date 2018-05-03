import fs from 'fs';
import { SubtitleWriter } from './basestyle';

class VTTWriter extends SubtitleWriter {
  write(target) {
    const fp = fs.createWriteStream(`${target}.${this.type}`, {
      flags: 'w',
    });
    fp.write('WEBVTT\r\n\r\n');
    fp.write('NOTE\r\nSTYLE_START\r\n');
    fp.write('/* For not-supported browser only.\r\n');
    fp.write(' Paste this part to head style using xhr. */\r\n');
    this.styleList.forEach((el, i) => {
      fp.write(`video::cue(.style${i}) {\r\n`);
      fp.write(`\tcolor: ${el.color.length === 6 ? `#${el.color}` : el.color};\r\n`);
      if (el.face) {
        fp.write(`\tfont-family: ${el.face};\r\n`);
      }
      fp.write('}\r\n');
    });
    fp.write('/* End of inner css. */\r\nSTYLE_END\r\n\r\n');
    this.commentList.forEach((el) => {
      fp.write('NOTE\r\n');
      fp.write(`${el}\r\n\r\n`);
    });
    this.styleList.forEach((el, i) => {
      fp.write('STYLE\r\n');
      fp.write(`::cue(.style${i}) {\r\n`);
      fp.write(`\tcolor: ${el.color.length === 6 ? `#${el.color}` : el.color};\r\n`);
      if (el.face) {
        fp.write(`\tfont-family: ${el.face};\r\n`);
      }
      fp.write('}\r\n\r\n');
    });
    this.cueList.forEach((el, i) => {
      fp.write(`${i}\r\n`);
      fp.write(`${el.start} --> ${el.end}\r\n`);
      fp.write(`${el.text}\r\n`);
      fp.write('\r\n');
    });
    fp.end();
    return true;
  }
}

export default VTTWriter;
