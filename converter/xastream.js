'use strict';

const XAHeader = require('./xaheader');

class XAStream {
  /**
   * @param {Buffer} buffer
   */
  constructor(buffer) {
    this._header = new XAHeader(buffer);

    switch (this._header.nBits) {
      case 4:
        this._reader = this.read4bit;
        break;
      case 6:
        this._reader = this.read6bit;
        break;
      case 8:
        this._reader = this.read8bit;
        break;
      default:
        throw 'Invalid nBits value'
    }

    this.readBody(buffer);
  }

  readBody(buffer) {
    this._buffer = buffer.slice(0x20);
    this._pos = 0;
    this._size = buffer.length;
  }

  read(buffer) {
    return this._reader.call(this, buffer)
  }

  get header() {
    return this._header
  }

  get pos() {
    return this._pos;
  }

  get size() {
    return this._size;
  }

  read4bit(decodeBuffer) {
    let ret = this._buffer[this._pos];
    let cursor = this._pos + 1;
    for (let i = 0; i < 16; i += 2) {
      let s1 = this._buffer[cursor];

      let d1 = (s1 & 0xf0) << 8;
      let d2 = s1 << 12;

      decodeBuffer[i] = d1;
      decodeBuffer[i + 1] = d2;

      cursor++
    }

    this._pos = cursor;

    return ret;
  }

  read6bit(decodeBuffer) {
    let buffer = this._buffer;
    let ret = buffer[this._pos];
    let cursor = this._pos + 1;

    for (let i = 0; i < 32; i += 4) {
      let s1 = buffer[cursor];
      let s2 = buffer[cursor + 1];
      let s3 = buffer[cursor + 2];

      let d = (s1 << 16) | (s2 << 8) | s3;

      decodeBuffer[i] = (d >> 8) & 0xfc00;
      decodeBuffer[i + 1] = (d >> 2) & 0xfc00;
      decodeBuffer[i + 2] = 0xffff & ((d & 0xffc0) << 4);
      decodeBuffer[i + 3] = 0xffff & (d << 10);

      cursor += 3;
    }

    this._pos = cursor;

    return ret;
  }

  read8bit(decodeBuffer) {
    let buffer = this._buffer;
    let ret = buffer[this._pos];
    let cursor = this._pos + 1;

    for (let i = 0; i < 32; i++) {
      decodeBuffer[i] = buffer[cursor] << 8;
      cursor++;
    }

    this._pos = cursor;

    return ret;
  }
}

module.exports = XAStream;
