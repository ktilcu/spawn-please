var chai            = require('chai')
var should          = chai.should()
var chaiAsPromised  = require('chai-as-promised')
var BluebirdPromise = require('bluebird')
var requireNew      = require('require-new')
var spawn           = require('../index.js')

chai.use(chaiAsPromised)

describe('spawn-please', function() {

  it('should resolve', function () {
    return spawn('true')
  })

  it('should reject on failure', function () {
    return spawn('false')
      .then(function () {
        return should.not.exist(true, 'should not resolve!')
      })
      .catch(function (err) {
        return should.exist(err)
      })
  })

  it('should handle command-line arguments', function () {
    return spawn('printf', ['hello'])
      .then(function (output) {
        return output.should.equal('hello')
      })
  })

  it('should accept stdin', function () {
    return spawn('cat', [], 'test')
      .then(function (output) {
        return output.should.equal('test')
      })
  })

  it('should accept 4 arguments', function () {
    return spawn.length.should.equal(4);
  });

  it('should pass options to child_process.spawn()', function () {
    return spawn('env', [], '', { env: { OMG: 1 } } )
      .then(function (results) {
        return results.indexOf('OMG').should.be.at.least(0);
      })
  });

  it('should allow you to specify a custom Promise', function () {
    var spawn = requireNew('../index.js')
    spawn('true').should.not.be.an.instanceof(BluebirdPromise)
    spawn.Promise = BluebirdPromise
    spawn('true').should.be.an.instanceof(BluebirdPromise)
  })

})
