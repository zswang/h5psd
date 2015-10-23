var h5psd = require('../.');
var assert = require('should');
var fs = require('fs');
var util = require('util');
var path = require('path');
var rimraf = require('rimraf');

describe('coverage', function () {
  var output = 'test/page2';
  it('tpl/404.html', function () {
    h5psd.build('test/psd/m2.psd', {
      output: output,
      template: 'tpl/404.html'
    });
  });

  it('$ h5psd psd/m2.psd -l -t tpl/auto-bottom.html -o ' + output, function (done) {
    h5psd.build('test/psd/m2.psd', {
      output: output,
      template: 'tpl/auto-bottom.html',
      layer: true,
      title: true
    }).then(function () {
      assert.ok(fs.existsSync(path.join(output, 'm2.layer')));
      assert.ok(fs.existsSync(path.join(output, 'm2.html')));
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
