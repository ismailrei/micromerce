'use strict'

// Load modules
var Eraro = require('eraro')
var Semver = require('semver')

// Declare internals
var internals = {
  name: 'seneca-cluster',
  error: Eraro({
    package: 'seneca',
    msgmap: {
      bad_cluster_version: 'Cluster API requires Node 0.12. Found <%=version%>'
    },
    override: true
  })
}

module.exports = function (options) {
  var seneca = this

  seneca.decorate('cluster', internals.cluster)

  return { name: internals.name }
}


internals.cluster = function api_cluster () {
  var seneca = this
  var version = process.versions.node

  if (Semver.lt(version, '0.12.0')) {
    return seneca.die(internals.error('bad_cluster_version', { version: version }))
  }

  var cluster = require('cluster')

  if (cluster.isMaster) {
    require('os').cpus().forEach(function () {
      cluster.fork()
    })

    cluster.on('disconnect', function (worker) {
      cluster.fork()
    })

    var noopinstance = seneca.delegate()
    for (var fn in noopinstance) {
      if (typeof noopinstance[fn] !== 'function') {
        continue
      }

      noopinstance[fn] = function () {
        return noopinstance
      }
    }

    return noopinstance
  }

  return seneca
}
