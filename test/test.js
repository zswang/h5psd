var h5psd = require('../.');
var assert = require('should');
var fs = require('fs');
var util = require('util');
var path = require('path');
var rimraf = require('rimraf');

describe('coverage', function () {
  it('psd/404.psd', function () {
    h5psd.build('test/psd/404.psd', {
      output: 'test/page'
    });
  });

  it('psd/m1.psd -l -t -> "m1.layer.json" exits.', function (done) {
    h5psd.build('test/psd/m1.psd', {
      output: 'test/page',
      layer: true,
      title: true
    }).then(function () {
      assert.ok(fs.existsSync('test/page/m1.layer.json'));
      assert.ok(fs.existsSync('test/page/m1.html'));
      assert.ok(fs.existsSync('test/fixtures/page/images/'));
      assert.ok(fs.existsSync('test/page/css/base.css'));

      rimraf.sync('test/page');
      done();
    }).catch(function () {
      done();
    });
  });
});
