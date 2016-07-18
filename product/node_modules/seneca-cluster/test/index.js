'use strict'

// Load modules
var Code = require('code')
var Lab = require('lab')
var Seneca = require('seneca')
var senecaCluster = require('..')

// Shortcuts
var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var expect = Code.expect

describe('seneca-cluster', function () {
  it('can be used by seneca', function (done) {
    var seneca = Seneca({ log: 'silent', default_plugins: { cluster: false } })

    var fn = function () {
      seneca.use(senecaCluster)
    }

    expect(fn).to.not.throw()
    done()
  })

  it('cluster errors when node version is less than 0.12.0', function (done) {
    var version = process.versions.node
    var seneca = Seneca({ log: 'silent', default_plugins: { cluster: false } })
    seneca.use(senecaCluster)

    seneca.die = function (err) {
      process.versions.node = version
      expect(err.code).to.equal('bad_cluster_version')
      done()
    }

    delete process.versions.node
    process.versions.node = '0.11.99'
    seneca.cluster()
  })
})
