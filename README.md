<p align="right">
  <a href="https://travis-ci.org/drummaniac/xa-dtx"><img src="https://travis-ci.org/drummaniac/xa-dtx.svg?branch=master" alt="Travis CI"></a>
</p>

<h1 align="center">DTX XA to WAV conversion library</h1>

Usage example:

```js
let convert = require('xa-dtx');

convert('file.xa').then(wav => {
  console.log('XA file converted to buffer', wav);
});

convert('file.xa', 'file.wav').then(() => {
  console.log('XA file converted to WAV file');
});

let xaBuffer = fs.readFileSync('file.xa')
convert(xaBuffer).then(wav => {
  console.log('XA buffer converted to buffer', wav);
});

```