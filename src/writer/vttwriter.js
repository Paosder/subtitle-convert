import { SubtitleWriter } from '../basestyle';

class VTTWriter extends SubtitleWriter {
  write(target) {
    let buf = '';
    buf += 'WEBVTT\r\n\r\n';
    buf += 'NOTE\r\nSTYLE_START\r\n';
    buf += '/* For not-supported browser only.\r\n';
    buf += ' Paste this part to head style using xhr. */\r\n';
    this.styleList.forEach((el, i) => {
      buf += `video::cue(.style${i}) {\r\n`;
      buf += `\tcolor: ${el.color.length === 6 ? `#${el.color}` : el.color};\r\n`;
      if (el.face) {
        buf += `\tfont-family: ${el.face};\r\n`;
      }
      buf += '}\r\n';
    });
    buf += '/* End of inner css. */\r\nSTYLE_END\r\n\r\n';
    this.commentList.forEach((el) => {
      buf += 'NOTE\r\n';
      buf += `${el}\r\n\r\n`;
    });
    this.styleList.forEach((el, i) => {
      buf += 'STYLE\r\n';
      buf += `::cue(.style${i}) {\r\n`;
      buf += `\tcolor: ${el.color.length === 6 ? `#${el.color}` : el.color};\r\n`;
      if (el.face) {
        buf += `\tfont-family: ${el.face};\r\n`;
      }
      buf += '}\r\n\r\n';
    });
    this.cueList.forEach((el, i) => {
      buf += `${i}\r\n`;
      buf += `${el.start.toISOString().slice(11, -1)} ` +
        `--> ${el.end.toISOString().slice(11, -1)}\r\n`;
      buf += `${el.text}\r\n`;
      buf += '\r\n';
    });
    if (this.writeFile(target, buf)) {
      return true;
    }
    return buf;
  }
}

export default VTTWriter;
