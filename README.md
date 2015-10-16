# [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coverage-image]][coverage-url]

> Converting PSD files into mobile page

## 效果

+ 输出的网页
![image](https://cloud.githubusercontent.com/assets/536587/10546866/4ae3bd6e-7463-11e5-9055-25a00e3997c1.png)

+ PSD 设计稿
![image](https://cloud.githubusercontent.com/assets/536587/10546873/58cd32fc-7463-11e5-9746-f9faae3025a3.png)

## 使用

### 安装

`$ npm install h5psd [-g]`

### 命令行

```
Usage:

    h5psd <input list> [options]

Options:

    -v, --version                Output h5psd version
    -o, --output                 Output directory (default input directory)
    -s, --images                 Images directory (default "images")
    -l, --layer                  Export "<name>.layer.json" file (default false)
    -t, --title                  Layer name to attribute "title" (default false)
```

## License

MIT © [zswang](http://weibo.com/zswang)

[npm-url]: https://npmjs.org/package/h5psd
[npm-image]: https://badge.fury.io/js/h5psd.svg
[travis-url]: https://travis-ci.org/zswang/h5psd
[travis-image]: https://travis-ci.org/zswang/h5psd.svg?branch=master
[coverage-url]: https://coveralls.io/github/zswang/h5psd?branch=master
[coverage-image]: https://coveralls.io/repos/zswang/h5psd/badge.svg?branch=master&service=github
