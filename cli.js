#!/usr/bin/env node

'use strict';
var h5psd = require('./');
var optimist = require('optimist');
var fs = require('fs');
var path = require('path');
var util = require('util');
var colors = require('colors');

var argv = optimist
  .usage('$0 <input.psd> [-o output] [-s img]')

.alias('h', 'help')
  .describe('h', 'Show this help message and exit.')
  .string('h')

.alias('o', 'output')
  .describe('o', 'Output directory.')
  .string('o')

.alias('s', 'images')
  .describe('s', 'Images directory.')
  .string('s')
  .default('images')

.alias('l', 'layer')
  .describe('l', 'Export "<name>.layer.json" file.')
  .boolean('l')
  .default(false)

.alias('t', 'title')
  .describe('t', 'Layer name to attribute "title".')
  .boolean('t')
  .default(false)

.alias('v', 'version')
  .describe('v', 'Print version number and exit.')

.wrap(80)
  .argv;

if (argv._.length < 1) {
  if (argv.version) {
    var json = require('./package.json');
    console.log(json.name + ' ' + json.version);
    return;
  }

  console.log(
    String(function () {
      /*
Usage:

    #{h5,yellow}#{psd,blue} <input list> [options]

Options:

    #{-v, --version,cyan}                Output h5psd version
    #{-o, --output,cyan}                 Output directory (default input directory)
    #{-s, --images,cyan}                 Images directory (default "images")
    #{-l, --layer,cyan}                  Export "<name>.layer.json" file (default false)
    #{-t, --title,cyan}                  Layer name to attribute "title" (default false)
      */
    })
    .replace(/[^]*\/\*!?\s*|\s*\*\/[^]*/g, '')
    .replace(/#\{(.*?),(\w+)\}/g, function (all, text, color) {
      return colors[color](text);
    })
  );
  return;
}

argv._.forEach(function (filename) {
  h5psd.build(filename, argv);
});

