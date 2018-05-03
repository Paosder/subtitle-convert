import { Cue, textStyle } from './basestyle';

const vttParser = encoded => {
  // const d = /(?:NOTE[\r\n]){1}(?:[^\u000A\u000D]+[\n\r]{0,1})*/g;
  // const t = new RegExp(/(?:NOTE)[\r\n](?:.+[\n\r]{0,1})*[\r\n]{0,1}/, 'g', 'y');
  const chunks = encoded.split('\r\n\r\n');
  const cueList = [];
  const styleList = [];
  const commentList = [];
  chunks.forEach(el => {
    if (el.match(/NOTE/)) {
      if (!el.match(/STYLE_START/)) {
        commentList.push(el.replace(/(\r\n)?NOTE\r\n/, ''));
      }
    } else if (el.match(/STYLE/)) {
      const style = textStyle();
      const css = el.split(/[{}]/)[1].replace(/[\t\r\n]+/g, '').split(';');
      css.forEach(e => {
        const [attr, value, blank] = e.split(':');
        if (attr.match(/color/)) {
          style.color = value;
        } else if (attr.match(/font-family/)) {
          style.face = value;
        }
      });
      styleList.push(style);
    } else if (!el.match(/^WEBVTT/)) {
      const data = el.split(/\r\n/);
      if (data.length === 3) {
        const cue = Cue();
        let cueTime = null;
        [, cueTime, cue.text] = data;
        [cue.start, cue.end] = cueTime.split(' --> ');
        cueList.push(cue);
      }
    }
  });
  return {
    styleList,
    cueList,
    commentList
  };
};

export default vttParser;