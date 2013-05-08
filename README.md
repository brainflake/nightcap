nightcap
========

Monitor your Mongo capped collections

## installation
```
npm install nightcap
```

## usage
```
var Nightcap = require('nightcap');

var nc = new Nightcap(mongouri, {
  query: { isImported: false },
  targetPercentage: 50,
  collection: 'messagequeue'
});

nc.on('breach', function(percentage) {
  console.log('%s%% of your messages are not imported!', percentage);
});
```
