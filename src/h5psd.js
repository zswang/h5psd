/*<jdists encoding="ejs" data="../package.json">*/
/**
 * @file <%- name %>
 *
 * <%- description %>
 * @author
     <% (author instanceof Array ? author : [author]).forEach(function (item) { %>
 *   <%- item.name %> (<%- item.url %>)
     <% }); %>
 * @version <%- version %>
     <% var now = new Date() %>
 * @date <%- [
      now.getFullYear(),
      now.getMonth() + 101,
      now.getDate() + 100
    ].join('-').replace(/-1/g, '-') %>
 */
/*</jdists>*/

var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var colors = require('colors/safe');
var crypto = require('crypto');
var psd = require('psd');
var jdists = require('jdists');
var url = require('url');

/**
 * 将 RGBA 转换成颜色表达式
 *
 * @param {Array[4]} value rgba 值
 * @return {string} 返回颜色表达式
 */
function rgba2color(value) {
  if (value[3] === 255) {
    return '#' + value.slice(0, -1).map(function (value) {
      return (0x100 + parseInt(value)).toString(16).slice(1);
    }).join('').replace(/(.)\1(.)\2(.)\3/, '$1$2$3');
  }
  else {
    return 'rgba(' + value.join() + ')';
  }
}

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
      colors.blue('PSD file "%s" not exists.'), filename
    );
    return;
  }

  template = argv.template || path.join(__dirname, '../tpl/page.html');
  if (!fs.existsSync(template)) {
    console.warn(
      colors.blue('Template file "%s" not exists.'), template
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
    var promises = [];

    var descendants = tree.descendants();
    descendants.forEach(function (node, index) {
      if (node.isGroup() || node.hidden()) {
        return true;
      }
      var nodeInfo = node.export();
      if (nodeInfo.width <= 0 || nodeInfo.height <= 0) { // 无效数据
        return;
      }

      // 计算 MD5 戳
      var buffer = new Buffer(node.toPng().data);
      var isBackground;
      var backgroundColor;
      if (index === descendants.length - 1 &&
        nodeInfo.left === 0 &&
        nodeInfo.top === 0 &&
        nodeInfo.width === h5.width &&
        nodeInfo.height === h5.height) { // 可能是背景
        var lastRgba = [buffer[0], buffer[1], buffer[2], buffer[3]];
        var fit = true;
        for (var i = 4; i < buffer.length; i += 4) {
          var currRgba = [buffer[i + 0], buffer[i + 1], buffer[i + 2], buffer[i + 3]];
          if (Math.abs(currRgba[0] - lastRgba[0]) > 5 ||
            Math.abs(currRgba[1] - lastRgba[1]) > 5 ||
            Math.abs(currRgba[2] - lastRgba[2]) > 5 ||
            Math.abs(currRgba[3] - lastRgba[3]) > 5
          ) {
            fit = false;
            break;
          }
          lastRgba = currRgba;
        }
        isBackground = true;
        if (fit) {
          backgroundColor = rgba2color(lastRgba);
        }
      }
      var image;
      if (!backgroundColor) {
        var md5 = crypto.createHash('md5');
        md5.update(buffer);
        var flag = md5.digest('hex');
        image = path.join(images, flag.slice(1, 7) + '.png');

        if (!md5dict[flag]) { // 内容没有出现过
          md5dict[flag] = true;
          if (!nodeInfo.text) { // 非文本节点
            var imageOutput = path.join(output, image);
            var exists = fs.existsSync(imageOutput);
            promises.push(node.saveAsPng(imageOutput).then(function () {
              if (exists) {
                console.warn(
                  colors.blue('File %j overwrite.'), imageOutput
                );
              }
              console.log(colors.green('Image %j output complete.'), imageOutput);
            }));
          }
        }
      }

      if (image) {
        image = url.format(image); // @see issues#1 处理 Windows 路径分隔符
      }
      if (isBackground) {
        h5.background = {
          name: nodeInfo.name,
          color: backgroundColor,
          image: image,
          opacity: nodeInfo.opacity,
          text: nodeInfo.text
        };
      }
      else {
        layers.unshift({
          name: nodeInfo.name,
          image: image,
          left: nodeInfo.left,
          top: nodeInfo.top,
          width: nodeInfo.width,
          height: nodeInfo.height,
          opacity: nodeInfo.opacity,
          text: nodeInfo.text
        });
      }
    });
    if (argv.layer) {
      var layer = path.basename(filename, path.extname(filename)) + '.layer';
      fs.writeFileSync(path.join(output, layer), JSON.stringify(h5, null, '  '));
    }

    return Promise.all(promises).then(function () {
      var page = path.join(output, path.basename(filename, path.extname(filename)) + '.html');
      fs.writeFileSync(page,
        jdists.build(template, {
          output: page
        }, function (scope) {
          scope.setVariant('context', {
            h5: h5,
            enableName: argv.name,
            output: path.resolve('', output)
          });
        })
      );
      console.log(colors.green('Page %j output complete.'), page);
    });
  }).catch(function (err) {
    console.log(colors.red(err.stack));
  });
}

exports.build = build;
