var spawn = require('child_process').spawn

function spawnPlease(command, args, stdin, options) {

  var stdout = ''
  var stderr = ''
  var child = spawn(command, args, options)

  if(!spawnPlease.Promise) {
    throw new Error('No built-in Promise. You will need to use a Promise library and spawnPlease.Promise = Promise.')
  }

  return new spawnPlease.Promise(function (resolve, reject) {

    if(stdin !== undefined) {
      child.stdin.write(stdin)
    }
    child.stdin.end()

    child.stdout.on('data', function (data) {
      stdout += data
    })

    child.stderr.on('data', function (data) {
      stderr += data
    })

    child.addListener('error', reject)

    child.on('close', function (code) {
      if(code !== 0) {
        reject(stderr)
      }
      else {
        resolve(stdout)
      }
    })

  })
}

spawnPlease.Promise = typeof Promise !== 'undefined' ? Promise : null

module.exports = spawnPlease
