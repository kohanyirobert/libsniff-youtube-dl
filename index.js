var mkdirp = require('mkdirp')
var path = require('path')
var vargs = require('vargs-callback')
var rimraf = require('rimraf')
var request = require('request')
var fs = require('fs')
var package = require('./package.json')

var baseUrl = 'http://yt-dl.org/latest/'

var getUrl = function(target) {
  return baseUrl + getBinary(target)
}

var getPath = function(opts, target) {
  return path.join(getDir(opts, target), getBinary(target))
}

var getDir = function(opts, target) {
  return path.join(opts.dir, target)
}

var getBinary = function(target) {
  if (target.indexOf('win32-') === 0) {
    return 'youtube-dl.exe'
  }
  return 'youtube-dl'
}

var doCollect = function(opts, target, downloads, file, cb) {
  downloads.push({
    target: target,
    file: file
  })
  if (downloads.length === opts.targets.length) {
    cb(downloads)
  }
}

var doCreate = function(opts, target, downloads, cb) {
  mkdirp(getDir(opts, target), function() {
    var out = fs.createWriteStream(getPath(opts, target))
    out.on('finish', function() {
      doCollect(opts, target, downloads, path.resolve(getPath(opts, target)), cb)
    })
    request(getUrl(target)).pipe(out)
  })
}

var doTargets = function(opts, cb) {
  var downloads = []
  opts.targets.forEach(function(target) {
    doCreate(opts, target, downloads, cb)
  })
}

var doCleanup = function(opts, cb) {
  rimraf(opts.dir, function() {
    doTargets(opts, cb)
  })
}

var doDownload = function(opts, cb) {
  opts = opts || {}
  opts.dir = opts.dir || 'youtube-dl'
  opts.targets = opts.targets || [
    'linux-ia32',
    'linux-x64',
    'win32-ia32',
    'win32-x64',
    'darwin-x64'
  ]
  cb = cb || function() {}
  doCleanup(opts, cb)
}

module.exports = vargs.strict(doDownload)
