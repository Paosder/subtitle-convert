import { TextDecoder } from 'text-encoding';
import Writer from './writer';
import Parser from './parser';

const kEnvironment = (process.env.NODE_ENV && (process.env.NODE_ENV)
  .trim().toLowerCase() === 'production') ? 'production' : 'development';

let Iconv = null;
let path = null;
let fs = null;
let DetectEncoding = null;

if (!process.browser) {
  Iconv = require('iconv').Iconv; // eslint-disable-line
  path = require('path'); // eslint-disable-line global-require
  fs = require('fs'); // eslint-disable-line global-require
  DetectEncoding = require('detect-character-encoding'); // eslint-disable-line global-require
}

class SubtitleConverter {
  constructor(...args) {
    this.loaded = false;
    if (arguments.length > 0) {
      this.load(...args);
    }
  }

  load(filename, ext, encode, targetencode = 'UTF-8') {
    try {
      if (!process.browser) {
        const raw = fs.readFileSync(filename);
        const autoencode = DetectEncoding(raw);
        let enc = null;
        if (arguments.length <= 2) {
          enc = autoencode.encoding;
        } else if (autoencode.encoding !== encode.toUpperCase()) {
          console.log(`[Warning] Expected encoding : ${autoencode.encoding} / Input : ${encode}`);
        }
        if (!enc) {
          enc = encode;
        }
        const iconv = new Iconv(enc, targetencode);
        const convraw = iconv.convert(raw);
        this.encoded = new TextDecoder(targetencode).decode(convraw);
        this.originext = ext || path.extname(filename).toUpperCase();
      } else {
        this.encoded = filename;
        this.originext = ext;
      }
      this.originext = this.originext.toUpperCase();
      this.targetencode = targetencode;
      this.parsed = false;
      this.loaded = true;
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  parse(object) {
    if (object !== undefined) {
      if (typeof object === 'string') {
        try {
          const that = JSON.parse(object);
          this.originext = that.originext;
          this.targetencode = that.targetencode;
          this.parsed = that.parsed;
          this.loaded = that.loaded;
          this.parsed.cueList = this.parsed.cueList.map((el) => {
            const newel = { ...el };
            newel.start = new Date(el.start);
            newel.end = new Date(el.end);
            return newel;
          });
          return true;
        } catch (e) {
          return false;
        }
      } else {
        return false;
      }
    }
    if (!this.loaded) {
      return false;
    }
    switch (this.originext) {
      case '.SMI':
        this.parsed = Parser.SMIParser(this.encoded);
        break;
      case '.VTT':
        this.parsed = Parser.VTTParser(this.encoded);
        break;
      default:
        return false;
    }
    return true;
  }

  convert(type, target) {
    let res = false;
    if (!this.parsed && !this.parse()) {
      console.log(`
        Parse failed! you may forgot to load before covert or
        there is no method to parse : ${this.originext}.
      `);
      return false;
    }
    if (type === undefined) {
      console.log(`
        There is no type to convert : ${type}. Please check arguments.
      `);
      return false;
    }
    const upperType = type.toUpperCase();
    if (upperType === '.VTT') {
      res = new Writer.VTTWriter(
        this.parsed,
        type,
        this.targetencode,
        fs,
      ).write(target);
    } else {
      console.log(`
        There are no such types to convert : ${upperType}
      `);
      return res;
    }
    return res;
  }

  delay(time, index, end, resize) {
    if (!this.parsed) {
      console.log(`
        You must parse data before using this method.
      `);
      return false;
    }
    let [sec, milli] = time.toString(10).split('.');
    if (milli !== undefined) {
      milli = parseInt(milli, 10);
      if (milli < 10) {
        milli *= 100;
      } else if (milli < 100) {
        milli *= 10;
      }
      if (sec.match('-')) {
        milli *= -1;
      }
    }
    sec = parseInt(sec, 10);
    const cueIndex = index || 0;
    let cueIndexEnd = index || this.parsed.cueList.length - 1;
    if (cueIndex < this.parsed.cueList.length) {
      if (index && typeof end === 'number') {
        if (end >= 0) {
          cueIndexEnd = end;
        } else {
          cueIndexEnd = this.parsed.cueList.length - 1;
        }
      }
      if (cueIndexEnd < this.parsed.cueList.length) {
        for (let i = cueIndex; i <= cueIndexEnd; i += 1) {
          if (resize) {
            this.parsed.cueList[i].start
              .setUTCSeconds(this.parsed.cueList[i].start.getUTCSeconds() + sec);
          }
          this.parsed
            .cueList[i]
            .end
            .setUTCSeconds(this.parsed.cueList[i].end.getUTCSeconds() + sec);
          if (milli !== undefined) {
            if (resize) {
              this.parsed.cueList[i].start
                .setUTCMilliseconds(this.parsed.cueList[i].start.getUTCMilliseconds() + milli);
            }
            this.parsed
              .cueList[i]
              .end
              .setUTCMilliseconds(this.parsed.cueList[i].end.getUTCMilliseconds() + milli);
          }
        }
        return true;
      }
    } else {
      return false;
    }
    return true;
  }

  resize(time, index, end) {
    return this.delay(time, index, end, true);
  }

  stringify() {
    const that = {
      originext: this.originext,
      targetencode: this.targetencode,
      loaded: this.loaded,
      parsed: this.parsed,
    };
    return JSON.stringify(that);
  }

  apply(cueList) {
    if (typeof cueList === 'object') {
      /* https://developer.mozilla.org/en-US/docs/Web/API/TextTrack,
        cues are read-only but it can modify like tricky method below.
        This is temporary modification method so we should write other codes
        to modify.
      */
      for (let i = 0; i < cueList.length; i += 1) {
        const arr = cueList[i];
        const el = this.parsed.cueList[parseInt(arr.id, 10)];
        arr.endTime = (el.end.getUTCMinutes() * 60)
          + el.end.getUTCSeconds() + (el.end.getUTCMilliseconds() * 0.001);
        arr.startTime = (el.start.getUTCMinutes() * 60)
          + el.start.getUTCSeconds() + (el.start.getUTCMilliseconds() * 0.001);
        arr.text = el.text;
      }
      return true;
    }
    return false;
  }
}

export default SubtitleConverter;
