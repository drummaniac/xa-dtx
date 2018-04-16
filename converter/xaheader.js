'use strict';

class XAHeader {
  /**
   * @param {Buffer} buffer
   */
  constructor(buffer) {
    this.readHeader(buffer);
    this.calculateSize()
  }

  readHeader(buffer) {
    this._id = buffer.toString('ascii', 0, 4);

    if (this._id !== 'KWD1') {
      throw 'Wrong id';
    }

    this._nDataLen = buffer.readUInt32LE(4);
    this._nSamples = buffer.readUInt32LE(8);
    this._nSamplesPerSec = buffer.readUInt16LE(12);
    this._nBits = buffer.readUInt8(14);
    this._nChannels = buffer.readUInt8(15);
    //this._nLoopPtr = buffer.readUInt32LE(16);
  }

  calculateSize() {
    switch (this._nBits) {
      case 4:
        this._packetSize = 17;
        break;
      case 6:
        this._packetSize = 25;
        break;
      case 8:
        this._packetSize = 33;
        break;
      default:
        throw 'Invalid nBits value'
    }

    this._rawDataLen = (this._nDataLen / this._packetSize + 1) << 6;
  }

  get rawDataLen() {
    return this._rawDataLen;
  }

  get nChannels() {
    return this._nChannels;
  }

  get nSamples() {
    return this._nSamples;
  }

  get packetSize() {
    return this._packetSize;
  }

  get nBits() {
    return this._nBits;
  }

  get nSamplesPerSec() {
    return this._nSamplesPerSec;
  }
}

module.exports = XAHeader;
