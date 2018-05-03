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
  constructor(parsed, type) {
    this.styleList = parsed.styleList;
    this.cueList = parsed.cueList;
    this.commentList = parsed.commentList;
    this.type = type;
  }
}
export default { Cue, textStyle, SubtitleWriter };
