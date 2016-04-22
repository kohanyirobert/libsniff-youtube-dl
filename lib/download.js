var download = require('libsniff-download').download
var urldl = require('libsniff-download').urldl
var _ = require('lodash')

var getUrl = function(target) {
  return 'http://yt-dl.org/latest/' + getDestName(target)
}

var getDestName = function(target) {
  if (target.indexOf('win32-') === 0) {
    return 'youtube-dl.exe'
  }
  return 'youtube-dl'
}

module.exports = function(opts, cb) {
  var downloader = download(urldl)
  downloader(_.defaults(opts, {
    targetDir: true,
    archive: false,
    getUrl: getUrl,
    getDestName: getDestName
  }), cb)
}
