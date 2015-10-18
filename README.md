# [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coverage-image]][coverage-url]

> Converting PSD files into mobile page

PSD 转换成移动端页面的工具。

## 功能

+ 自动导出图层的 PNG 文件；
+ 导出 PNG 用 hash 命名，避免出现重复素材；
+ 自动判断背景图；
+ 可以使用自定义模板。（ 使用 [jdists](https://github.com/zswang/jdists) 编写）。

### 预制模板

+ `tpl/page.html` 标准模板
+ `tpl/auto-bottom.html` 自动计算需要居底的图层

## 效果

[线上体验](http://jhtmls.com/h5psd/m2.html)

+ 输出的网页
![image](https://cloud.githubusercontent.com/assets/536587/10546866/4ae3bd6e-7463-11e5-9055-25a00e3997c1.png)

+ PSD 设计稿
![image](https://cloud.githubusercontent.com/assets/536587/10546873/58cd32fc-7463-11e5-9746-f9faae3025a3.png)

## 使用

### PSD 准备

+ 模式 RGB 颜色、8 位通道；
+ 合并和栅格化实际的图层；
+ 隐藏不需要导出的图层。

### 安装

`$ npm install h5psd [-g]`

### 命令行

```
Usage:

    h5psd <input list> [options]

Options:

    -v, --version                Output h5psd version.
    -o, --output                 Output directory (default input directory).
    -s, --images                 Images directory (default "images").
    -l, --layer                  Export "<name>.layer" file (default false).
    -n, --name                   Enable the "name" attribute (default false).
    -t, --template               Page jdists template file.
```

## License

MIT © [zswang](http://weibo.com/zswang)

[npm-url]: https://npmjs.org/package/h5psd
[npm-image]: https://badge.fury.io/js/h5psd.svg
[travis-url]: https://travis-ci.org/zswang/h5psd
[travis-image]: https://travis-ci.org/zswang/h5psd.svg?branch=master
[coverage-url]: https://coveralls.io/github/zswang/h5psd?branch=master
[coverage-image]: https://coveralls.io/repos/zswang/h5psd/badge.svg?branch=master&service=github
