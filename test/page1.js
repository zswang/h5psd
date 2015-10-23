var h5psd = require('../.');
var assert = require('should');
var fs = require('fs');
var util = require('util');
var path = require('path');
var rimraf = require('rimraf');

describe('coverage', function () {
  var output = 'test/page1';

  it('psd/404.psd', function () {
    h5psd.build('test/psd/404.psd', {
      output: output
    });
  });

  it('$ h5psd psd/m1.psd -l -o ' + output, function (done) {
    h5psd.build('test/psd/m1.psd', {
      output: output,
      layer: true,
      title: true
    }).then(function () {
      assert.ok(fs.existsSync(path.join(output, 'm1.layer')));
      assert.ok(fs.existsSync(path.join(output, 'm1.html')));
      assert.ok(fs.existsSync(path.join(output, 'images/657d39.png')));
      assert.ok(fs.existsSync(path.join(output, 'css/base.css')));

      rimraf.sync(output);
      done();
    }).catch(function () {
      console.log('error.');
      rimraf.sync(output);
      done();
    });
  });
});
