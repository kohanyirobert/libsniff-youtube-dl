var assert = require('chai').assert
var path = require('path')
var tmp = require('tmp')
var download = require('../lib/download')

var THIRTY_SECONDS = 30 * 1000

describe('download.js', function() {
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
        assert(downloads.length === options.targets.length)
        downloads.forEach(function(download) {
          assert(options.targets.indexOf(download.target) != -1)
          assert(download.files.length === 1)
          download.files.forEach(function(file) {
            var destPath = path.resolve(path.join(options.dir, download.target))
            assert(file.indexOf(destPath) === 0)
            assert(file.indexOf('youtube-dl') != -1)
          })
        })
        done()
      })
    })
  })
})
