<h1 align="center">DTX XA to WAV conversion library</h1>

<p align="center">
  <a href="https://travis-ci.org/drummaniac/xa-dtx"><img src="https://travis-ci.org/drummaniac/xa-dtx.svg?branch=master" alt="Travis CI"></a>
</p>

---

Usage example:

```js
let convert = require('xa-dtx');

convert('file.xa').then(wav => {
  console.log('XA file converted to buffer', wav);
});
```