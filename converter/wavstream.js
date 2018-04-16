'use strict';

class WavStream {
  /**
   * @param {XAHeader} header
   */
  constructor(header) {
    this._nChannels = header.nChannels;
    this.createBuffer(header.rawDataLen);
    this.writeHeader(header);
  }

  createBuffer(dataLen) {
    this._buffer = new Buffer(dataLen);
  }

  writeHeader(header) {
    let buffer = this._buffer;

    buffer.write('RIFF', 0);
    let dataSize = 2 * header.nChannels * header.nSamples;

    buffer.writeUInt32LE(dataSize + 8, 4);
    buffer.write('WAVE', 8);
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16);

    // WAVEFORMAT

    // WORD wFormatTag;
    buffer.writeUInt16LE(1, 20);
    // WORD nChannels;
    buffer.writeUInt16LE(header.nChannels, 22);
    // DWORD nSamplesPerSec;
    buffer.writeUInt32LE(header.nSamplesPerSec, 24);
    // DWORD nAvgBytesPerSec;
    let nAvgBytesPerSec = header.nSamplesPerSec * 2 * header.nChannels;
    buffer.writeUInt32LE(nAvgBytesPerSec, 28);
    // WORD nBlockAlign;
    let nBlockAlign = 2 * header.nChannels;
    buffer.writeUInt16LE(nBlockAlign, 32);
    // WORD wBitsPerSample;
    buffer.writeUInt16LE(16, 34);

    // data
    buffer.write('data', 36);
    buffer.writeUInt32LE(dataSize, 40);

    this._pos = 44;
    this._size = header.rawDataLen - 44;
  }

  write(channels) {
    let buffer = this._buffer;
    let step = 2 * this._nChannels;

    for (let i = 0; i < channels.length; i++) {
      let pos = this._pos + i * 2;
      let channel = channels[i];

      for (let j = 0; j < channel.length; j++) {
        let value = channel[j];
        buffer.writeUInt16LE(value, pos);
        pos += step;
      }
    }

    this._pos = this._pos + step * channels[0].length;
  }

  get pos() {
    return this._pos;
  }

  get size() {
    return this._size;
  }

  get buffer() {
    return this._buffer;
  }
}

module.exports = WavStream;
