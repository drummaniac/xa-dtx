'use strict';

let expect = require('chai').expect;
let fs = require('fs');

let XAHeader = require('../converter/xaheader');

describe('XAHeader', () => {
  let srcPath = './tests/res/test.xa';
  let srcBuffer = fs.readFileSync(srcPath);

  it('parses header', () => {
    let header = new XAHeader(srcBuffer);
    expect(header.nBits).to.equal(6);
    expect(header.nChannels).to.equal(2);
    expect(header.nSamples).to.equal(57088);
    expect(header.nSamplesPerSec).to.equal(44100);
  });

  it('calculates size', () => {
    let header = new XAHeader(srcBuffer);
    expect(header.rawDataLen).to.equal(228416);
    expect(header.packetSize).to.equal(25);
  });
});
