const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const ndjson = require('ndjson');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(express.static(path.resolve(__dirname, 'build')));

// Always return the main index.html, so react-router render the route in the client
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});


app.get('/api/:lines?', (req, res) => {
  let readStream = fs.createReadStream(__dirname + '/todos.ndjson').pipe(ndjson.parse());
  let count = 0;
  readStream.on('data', (data) => {
    if (req.params.lines && (req.params.lines <= count)) {
      readStream.pause();
      res.end();
    } else {
      res.write(JSON.stringify(data) +'\n');
      ++count;
    }

    // res.write(ndjson.serialize(data));
  });

  readStream.on('end', () => {
    res.end();
  });
})

var listener = app.listen(5000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
