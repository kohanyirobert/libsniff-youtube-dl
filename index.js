var download = require('libsniff-download')
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
  download(_.defaults(opts, {
    archive: false,
    getUrl: getUrl,
    getDestName: getDestName
  }), cb)
}
