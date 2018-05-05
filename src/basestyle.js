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
  constructor(parsed, type, encoding, fs) {
    this.styleList = parsed.styleList;
    this.cueList = parsed.cueList;
    this.commentList = parsed.commentList;
    this.type = type;
    this.encoding = encoding;
    this.fs = fs;
  }
  writeFile(target, buf) {
    if (target !== undefined) {
      if (!process.browser) {
        const fp = this.fs.createWriteStream(target, {
          flags: 'w',
          encoding: this.encoding,
        });
        fp.write(buf);
        fp.end();
        return true;
      }
    }
    return false;
  }
}
export default { Cue, textStyle, SubtitleWriter };
