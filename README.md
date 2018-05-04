# subtitle-convert
Subtitle converter from traditional subtitles.  
It automatically detects file encoding and easily convert to other file encoding with different subtitle type.  
eg.) SMI(EUC-KR) -> WEBVTT(UTF-8)  

At 0.2.0, it only supports SMI and VTT only. Please check Future Works section.

## Install
``` bash
> npm install --save subtitle-convert
// or
> yarn add subtitle-convert
```

## Usage
### Node
``` js
// In node.js,

// in ES Style..
import Converter from 'subtitle-convert';

// in Common Style..
const Converter = require('subtitle-convert').default;

// Default initialize and load files.
const smi2vtt = new Converter();

smi2vtt.load(filePath);

/* Or you may write specific encoding of input and output.
 In this case, converter automatically parse extension so you don't have to set
 extname to file extension obviously unless you're going to change it. So, */
const smi2vtt = new Converter(filePath, extname, inputEncoding, outputEncoding);
// or just null.
const smi2vtt = new Converter(filePath, null, inputEncoding, outputEncoding);
// These two case of initialization step, converter automatically calls load function.

// Parse from raw file.
smi2vtt.parse();

// You may add delay(seconds) to each cue separately.
smi2vtt.delay(delayTime, cueIndex);

// Or add delay to entire cueList.
smi2vtt.delay(delayTime);

// These two statements are equivalent :
smi2vtt.delay(-12.3); // 12.3 seconds faster.
smi2vtt.delay('-12.3'); // 12.3 seconds faster too.

/* Convert parsed data to chosen type.
 Then parser will create an new file in destination with specific encoding.
 At 0.2.0, only VTT supported.
 Both two cases, result variable get result of conversion if succeed or get false. */
const result = smi2vtt.convert('.vtt', outputFilePath);
// Without saving file.
const result = smi2vtt.convert('.vtt');


```
### Browser
``` js
// In browser,

// All of methods are same, but you should set string that contains subtitle details
// instead of filepath.
const smi2vtt = new Converter(textofSubtitle);

// You may skip to call parse method if you need only just conversion.
const result = smi2vtt.convert('.vtt');
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

## Test
``` bash
> npm test
// or
> yarn test
```

## Future Works
-Aegisub, srt support.  
-Output encoding.  
-VTT Fully support (At 0.2.0, it only supports essentials.)

## License

MIT
