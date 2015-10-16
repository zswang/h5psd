var h5psd = require('../.');
var assert = require('should');
var fs = require('fs');
var util = require('util');
var path = require('path');
var rimraf = require('rimraf');

describe('coverage', function () {
  it('psd/m1.psd', function (done) {
    h5psd.build('test/psd/m1.psd', {
      output: 'test/page'
    }).then(function () {
      it('m1.html exits.', function () {
        assert.ok(fs.existsSync('test/page/m1.html'));
      });

      it('f3e1c4.png exits.', function () {
        assert.ok(fs.existsSync('test/fixtures/page/images/'));
      });

      it('base.css exits.', function () {
        assert.ok(fs.existsSync('test/page/css/base.css'));
      });

      rimraf.sync('test/page');
      done();
    }).catch(function () {
      done();
    });
  });
});
