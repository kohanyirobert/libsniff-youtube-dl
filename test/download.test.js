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
        assert.equal(downloads.length, options.targets.length)
        downloads.forEach(function(download) {
          assert.include(options.targets, download.target)
          assert.equal(download.files.length, 1)
          download.files.forEach(function(file) {
            var destPath = path.resolve(path.join(options.dir, download.target))
            assert.equal(file.indexOf(destPath), 0)
            assert.include(file, 'youtube-dl')
          })
        })
        done()
      })
    })
  })
})
