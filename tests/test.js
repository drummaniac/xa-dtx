'use strict';

let chai = require('chai');
chai.use(require('chai-as-promised'));
chai.should();

let fs = require('fs');

let convert = require('../converter');

describe('convert', () => {
  let srcPath = './tests/res/test.xa';
  let dstPath = './tests/res/test.wav';

  it('should return true', done => {
    convert(srcPath, dstPath)
      .should.eventually.to.equal(true)
      .notify(() => {
        fs.unlinkSync(dstPath);
        done();
      });
  });
});
