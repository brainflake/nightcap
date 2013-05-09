var EventEmitter = require('events').EventEmitter
  , _ = require('underscore')
  , mongodb = require('mongodb')
  , Db = mongodb.Db

function Nightcap(mongouri, options) {
  if (!(this instanceof Nightcap)) {
    return new Nightcap(mongouri, options)
  }

  var self = this

  if (!mongouri) {
    throw new Error('You must provide a mongo connection string')
  }

  if (!(options && options.query)) {
    throw new Error('You must provide a query')
  }

  if (!(options && options.collection)) {
    throw new Error('You must provide a collection name')
  }

  if (!(options && options.targetPercentage)) {
    throw new Error('You must provide a target percentage')
  }

  self.debug = false
  if (options.debug === true) {
    self.debug = true
  }

  self.mongouri = mongouri
  self.collection = options.collection
  self.query = options.query
  self.targetPercentage = options.targetPercentage

  setInterval(function() {
    self.performCheck()
  }, 5000)
}

Nightcap.prototype.__proto__ = EventEmitter.prototype

Nightcap.prototype.performCheck = function performCheck() {
  var self = this

  if (self.debug) {
    console.log('Performing check...')
  }

  Db.connect(self.mongouri, function(err, db) {
    if (err) {
      self.emit('error', err)
    }

    db.collection(self.collection).count(self.query, function(err, queryCount) {
      if (err) {
        self.emit('error', err)
      }

      db.collection(self.collection).count(function(err, totalCount) {
        if (err) {
          self.emit('error', err)
        }

        var actualPercentage = (Number(queryCount) / Number(totalCount)) * 100

        if (self.debug) {
          console.log('Actual percentage: ' + actualPercentage)
          console.log('Target percentage: ' + self.targetPercentage)
        }

        if (actualPercentage > self.targetPercentage) {
          self.emit('breach', actualPercentage)
        }
      })
    })
  })
}

module.exports = Nightcap
