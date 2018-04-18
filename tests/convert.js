'use strict';

let chai = require('chai');
chai.use(require('chai-as-promised'));
chai.should();
let fs = require('fs');

let convert = require('../converter');

describe('convert()', () => {
  let srcPath = './tests/res/test.xa';

  describe('to file', () => {
    let dstPath = './tests/res/test.wav';

    it('should return true', done => {
      convert(srcPath, dstPath)
        .should.eventually.to.equal(true)
        .notify(done);
    });

    it('should create a file', done => {
      convert(srcPath, dstPath)
        .then(() => { return Promise.resolve(fs.existsSync(dstPath)) })
        .should.eventually.to.equal(true)
        .notify(done);
    });

    afterEach(() => {
      fs.unlinkSync(dstPath);
    });
  });

  describe('to buffer', () => {
    it('should return WavStream with buffer', done => {
      convert(srcPath)
        .should.eventually.has.property('buffer')
        .notify(done);
    });
  });
});
