import fs from 'fs';
import kNode from 'detect-node';

export const Cue = () => ({
  start: 0,
  end: 0,
  text: '',
});

export const textStyle = () => ({
  color: '',
  face: '',
});

export class SubtitleWriter {
  constructor(parsed, type, encoding) {
    this.styleList = parsed.styleList;
    this.cueList = parsed.cueList;
    this.commentList = parsed.commentList;
    this.type = type;
    this.encoding = encoding;
  }
  writeFile(target, buf) {
    if (target !== undefined && kNode) {
      const fp = fs.createWriteStream(target, {
        flags: 'w',
        encoding: this.encoding,
      });
      fp.write(buf);
      fp.end();
      return true;
    }
    return false;
  }
}
export default { Cue, textStyle, SubtitleWriter };
