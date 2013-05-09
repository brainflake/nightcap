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

  self.eventEmitter = new EventEmitter()
  self.mongouri = mongouri
  self.collection = options.collection
  self.query = options.query
  self.targetPercentage = options.targetPercentage

  setInterval(function() {
    self.performCheck()
  }, 5000)
}

Nightcap.prototype.performCheck = function performCheck() {
  var self = this

  console.log('checking ...');

  Db.connect(self.mongouri, function(err, db) {
    if (err) {
      // XXX
    }

    db.collection(self.collection).count(self.query, function(err, queryCount) {
      if (err) {
        // XXX
      }

      db.collection(self.collection).count(function(err, totalCount) {
        if (err) {
          // XXX
        }

        var actualPercentage = (Number(queryCount) / Number(totalCount)) * 100

        console.log('Actual percentage: ' + actualPercentage);
        console.log('Target percentage: ' + self.targetPercentage);

        if (actualPercentage > self.targetPercentage) {
          self.eventEmitter.emit('breach', actualPercentage)
        }
      })
    })
  })
}

Nightcap.prototype.on = function on(eventName, callback) {
  var self = this

  self.eventEmitter.on(eventName, callback)
}

module.exports = Nightcap
