DTX XA to WAV conversion library
===

Usage example:

```js
let convert = require('dtx-xa');

convert('file.xa').then(wav => {
  console.log('XA file converted to buffer', wav);
});
```