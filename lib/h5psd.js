/**
 * @file h5psd
 *
 * Converting PSD files into mobile page
 * @author
 *   zswang (http://weibo.com/zswang)
 * @version 0.0.1
 * @date 2015-10-16
 */
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var colors = require('colors/safe');
var crypto = require('crypto');
var psd = require('psd');
var jdists = require('jdists');
/**
 * 编译 h5psd 文件
 *
 * @param {string} filename 文件名或者是内容
 * @param {Object} argv 配置项
 * @param {boolean} argv.output 输出目录，如果没有指定则和为输入目录
 */
function build(filename, argv) {
  filename = path.resolve('', filename || '');
  if (!fs.existsSync(filename)) {
    console.warn(
      colors.blue('File "%s" not exists.'), filename
    );
    return;
  }
  // 处理默认值
  argv = argv || {};
  var output = argv.output || path.dirname(filename);
  var images = argv.images || 'images';
  return psd.open(filename).then(function (context) {
    mkdirp.sync(path.join(output, images)); // 确保输出目录存在
    var tree = context.tree();
    var treeInfo = tree.export();
    var h5 = {
      name: path.basename(filename),
      width: treeInfo.document.width,
      height: treeInfo.document.height,
      layers: []
    };
    // var promise = [];
    var layers = h5.layers;
    var md5dict = {};
    tree.descendants().forEach(function (node) {
      if (node.isGroup()) {
        return true;
      }
      var nodeInfo = node.export();
      // 计算 MD5 戳
      var buffer = new Buffer(node.toPng().data);
      var md5 = crypto.createHash('md5');
      md5.update(buffer);
      var flag = md5.digest('hex');
      if (md5dict[flag]) { // 内容已经出现过
        return;
      }
      md5dict[flag] = true;
      var image = path.join(images, flag.slice(1, 7) + '.png');
      var imageOutput = path.join(output, image);
      var exists = fs.existsSync(imageOutput);
      node.saveAsPng(imageOutput).then(function () {
        if (exists) {
          console.warn(
            colors.blue('File %j overwrite.'), imageOutput
          );
        }
        console.log(colors.green('Image %j output complete.'), imageOutput);
      });
      layers.unshift({
        name: nodeInfo.name,
        image: image,
        left: nodeInfo.left,
        top: nodeInfo.top,
        width: nodeInfo.width,
        height: nodeInfo.height,
        opacity: nodeInfo.opacity
      });
    });
    if (argv.layer) {
      var layer = path.basename(filename, path.extname(filename)) + '.layer.json';
      fs.writeFileSync(path.join(output, layer), JSON.stringify(h5, null, '  '));
    }
    return {
      h5: h5,
      title: argv.title,
      output: path.resolve('', output),
      page: path.join(output, path.basename(filename, path.extname(filename)) + '.html')
    };
  }).then(function (context) {
    fs.writeFileSync(context.page,
      jdists.build('tpl/page.html', {
        output: context.page
      }, function (scope) {
        scope.setVariant('context', context);
      })
    );
    console.log(colors.green('Page %j output complete.'), context.page);
  }).catch(function (err) {
    console.log(colors.red(err.stack));
  });
}
exports.build = build;
