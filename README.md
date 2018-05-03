# subtitle-convert
Subtitle converter from traditional subtitles.  
It automatically detects file encoding and easily convert to other file encoding with different subtitle type.  
eg.) SMI(EUC-KR) -> WEBVTT(UTF-8)

## Usage
``` js
// in ES Style..
import Converter from 'subtitle-convert';

// in Common Style..
const Converter = require('subtitle-convert').default;

// Default initialize.
const smi2vtt = new Converter(smifilePath, convertFilename);

// You may manually set file encoding type of input file.
const smi2vtt = new Converter(smifilePath, DestFilenameWithoutExtension, 'UTF-8');

// Parse from raw file.
smi2vtt.parse();

// Convert parsed data to chosen type.
// Then parser will create an new file in destination with specific encoding.
// Default : UTF-8.
// At 0.1.0, only VTT, UTF-8 supported.
smi2vtt.convert('vtt');

```

## Result
```
WEBVTT

...

STYLE
::cue(.style2) {
	color: #8BC3FF;
}

STYLE
::cue(.style3) {
	color: #ff3939;
}

0
00:00:10.000 --> 00:00:10.700
<c.style0>[ 르네상스 시대 3대 발명 ]
나침반, 화약, 활판 인쇄</c>


1
00:00:10.700 --> 00:00:11.900
<c.style0>[ 르네상스 시대 3대 발명 ]
나침반, 화약, <u>활판 인쇄</u></c>
그러한 연유로-
```



## Tips
When you using vtt files with Chrome browser you may confused because they won't support vtt inline css style.  
In this module, convert function automatically supports for css hack with WEBVTT comment(called NOTE) like below-
```
WEBVTT

NOTE
STYLE_START
/* For not-supported browser only.
 Paste this part to head style using xhr. */
video::cue(.style0) {
	color: #A4A0A0;
}
video::cue(.style1) {
	color: #F8B203;
}
video::cue(.style2) {
	color: #8BC3FF;
}
video::cue(.style3) {
	color: #ff3939;
}
/* End of inner css. */
STYLE_END

STYLE
::cue(.style0) {
	color: #A4A0A0;
}

...
```
You may use to parse these parts to put in your own head style to apply subtitle style in Chrome.

## Future Works
-Aegisub, srt support.  
-Output encoding.  
-VTT Fully support (At 0.1.0, it only supports essentials.)

## License

MIT
