'use strict';

let fs = require('fs');
let XAStream = require('./xastream');
let WavStream = require('./wavstream');

class XAConverter {
  constructor() {
    this._c1map = [0, 240, 460, 392, 488];
    this._c2map = [0, 0, 208, 220, 240];
  }

  convert(input) {
    if (typeof input === 'string') {
      return new Promise((resolve, reject) => {
        fs.readFile(input, (error, buffer) => {
          if (error) {
            return reject(error);
          }

          return resolve(this.convertBuffer(buffer));
        });
      });
    }
    else {
      return this.convertBuffer(input);
    }
  }

  convertBuffer(buffer) {
    return this
      .loadXAStream(buffer)
      .then(() => this.prepareWavStream())
      .then(() => this.decodeXAStream())
  }

  loadXAStream(buffer) {
    return new Promise(resolve => {
      this._xaStream = new XAStream(buffer);

      resolve(this._xaStream);
    })
  }

  prepareWavStream() {
    return new Promise(resolve => {
      this._wavStream = new WavStream(this._xaStream.header);

      resolve(this._wavStream);
    })
  }

  decodeXAStream() {
    switch (this._xaStream.header.nChannels) {
      case 1:
        this.decodeMono();
        break;
      case 2:
        this.decodeStereo();
        break;
      default:
        throw 'Invalid nChannels value';
    }

    return Promise.resolve(this._wavStream);
  }

  decodeMono() {
    let xaStream = this._xaStream;
    let wavStream = this._wavStream;
    let packetSize = xaStream.header.packetSize;

    let xaBuffer = new Array(32);
    let wavBuffer = new Array(32);

    let samples = [0, 0];

    while (true) {
      if (xaStream.size < xaStream.pos + packetSize) {
        break;
      }

      if (wavStream.size < wavStream.pos + 64) {
        break;
      }

      let flag = xaStream.read(xaBuffer);
      this.calculate(samples, flag, xaBuffer, wavBuffer, 32);

      wavStream.write([wavBuffer]);
    }
  }

  decodeStereo() {
    let xaStream = this._xaStream;
    let wavStream = this._wavStream;
    let packetSize2 = xaStream.header.packetSize * 2;

    let xaBuffer = new Array(32);
    let leftWavBuffer = new Array(32);
    let rightWavBuffer = new Array(32);

    let leftSamples = [0, 0];
    let rightSamples = [0, 0];

    while (true) {
      if (xaStream.size < xaStream.pos + packetSize2) {
        break;
      }

      if (wavStream.size < wavStream.pos + 64) {
        break;
      }

      let leftFlag = xaStream.read(xaBuffer);
      this.calculate(leftSamples, leftFlag, xaBuffer, leftWavBuffer, 32);

      let rightFlag = xaStream.read(xaBuffer);
      this.calculate(rightSamples, rightFlag, xaBuffer, rightWavBuffer, 32);

      wavStream.write([leftWavBuffer, rightWavBuffer]);
    }
  }

  calculate(samples, flag, xaBuffer, wavBuffer, packetSize) {
    let shift = flag & 0x0f;
    let mod = flag >> 4;

    let c1 = this._c1map[mod];
    let c2 = this._c2map[mod];

    let sample1 = samples[0];
    let sample2 = samples[1];

    let highOutput = (0xffff & packetSize) >> 16;
    let output = 0;

    for (let i = 0; i < packetSize; i++) {
      let value0 = xaBuffer[i];

      if ((value0 & 0x8000) === 0x8000) {
        value0 -= 0x10000;
      }

      value0 = value0 >> shift;
      output = value0;

      let value1 = c1 * sample1 - c2 * sample2;


      let byte4 = (value1 >> 16 >> 16) & 0xff;

      let value2 = (value1 & 0xffffffff) + byte4;


      output += value2 >> 8;

      let writeOutput = 0xFFFF & output;
      highOutput = 0xffff0000 & output;

      wavBuffer[i] = writeOutput;

      sample2 = sample1;
      sample1 = output
    }

    samples[0] = sample1;
    samples[1] = sample2;
  }
}

module.exports = XAConverter;
