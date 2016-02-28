var tmp = require('tmp')
var rimraf = require('rimraf')
var path = require('path')
var assert = require('chai').assert
var download = require('./')
var package = require('./package.json')

var THIRTY_SECONDS = 15 * 1000

describe(package.name, function() {
  it('should download the specfied targets', function(done) {
    this.timeout(THIRTY_SECONDS)
    tmp.dir({unsafeCleanup: true}, function(err, tmpDir) {
      var options = {
        dir: tmpDir,
        targets: [
          'linux-ia32',
          'darwin-x64'
        ]
      }
      download(options, function(downloads) {
        assert(downloads)
        assert(downloads.length === options.targets.length)
        downloads.forEach(function(download) {
          assert(options.targets.indexOf(download.target) > -1)
          assert(download.file)
          assert(download.file.indexOf(path.join(options.dir, download.target)) === 0)
          assert(download.file.indexOf('youtube-dl') > -1)
        })
        done()
      })
    })
  })
})
