import { Parser } from 'htmlparser2';
import _ from 'lodash';
import { Cue, textStyle } from './basestyle';

const smiParser = (encoded) => {
  let parser = null;
  let cue = null;
  let style = null;
  let styleNum = -1;
  const styleList = [];
  const cueList = [];
  const commentList = [];
  parser = new Parser({
    onopentag: (name, attr) => {
      if (name === 'sync') {
        const start = new Date(parseInt(attr.start, 10)).toISOString().slice(11, -1);
        if (cue) {
          cue.end = start;
          if (cue.text.trim() !== '') {
            cueList.push(cue);
            // console.log(cue.text, cue.start, cue.end);
          }
        }
        cue = Cue();
        cue.start = start;
      } else if (name === 'br') {
        if (cue.text === '') {
          cue.text += ' ';
        }
        cue.text += '\n';
      } else if (name === 'font') {
        style = textStyle();
        _.forEach(attr, (value, key) => {
          style[key] = value;
        });
        // console.log(style);
        styleNum = _.findIndex(
          styleList,
          _.matches({ color: style.color, face: style.face }),
        );
        if (styleNum < 0) {
          styleNum = styleList.length;
          styleList.push(style);
        }
        cue.text += `<c.style${styleNum}>`;
      } else if (!name.match(/sami|p|body|head|title|style/)) {
        // console.log(name);
        cue.text += `<${name}>`;
      }
    },
    ontext: (text) => {
      if (cue) {
        cue.text += text.replace(/\r?\n|\r/g, '');
      }
    },
    onclosetag: (tagname) => {
      // console.log(tagname);
      if (tagname === 'font') {
        cue.text += '</c>';
      } else if (!tagname.match(/sami|p|body|head|title|style|br|sync/)) {
        cue.text += `</${tagname}>`;
      }
    },
  }, { decodeEntities: true });
  parser.write(encoded);
  parser.end();
  const regex = new RegExp(
    '<!--[\\s\\S]*?(?:-->)?'
    + '<!---+>?' // A comment with no body
    + '|<!(?![dD][oO][cC][tT][yY][pP][eE]|\\[CDATA\\[)[^>]*>?'
    + '|<[?][^>]*>?', // A pseudo-comment
    'g',
  );
  encoded.match(regex).forEach((el) => {
    commentList.push(el.replace(/(\r\n){2}|(<!--)|(-->)|/g, '')
      .replace(/^(\r\n)/g, ''));
  });
  return {
    styleList,
    cueList,
    commentList,
  };
};

export default smiParser;
