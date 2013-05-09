nightcap
========

Monitor your Mongo capped collections.  If you're using a circular queue, you can make sure data is not overwritten.

## installation
```
npm install nightcap
```

## usage
```
var Nightcap = require('nightcap');

var nc = new Nightcap(mongouri, {
  query: { isProcessed: false },
  targetPercentage: 50,
  collection: 'messagequeue'
});

nc.on('breach', function(percentage) {
  console.log('%s%% of your documents are waiting to be processed!', percentage);
});
```

The above will log to the console if number of unprocessed documents exceeds 50% of the collection size.

## params

### query

This defines the set of documents we want to keep an eye on

### targetPercentage

If the set of documents defined by *query* is over *targetPercentage* of the collection, the *breach* event will be emitted.

### collection

This the collection we want to monitor.

### debug

Turn your logs into War & Peace
