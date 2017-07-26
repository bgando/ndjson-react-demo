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


app.get('/api/:lines', (req, res) => {
  let readStream = fs.createReadStream(__dirname + '/todos.ndjson').pipe(ndjson.parse());

  const chunks = [];
  readStream.on('data', (data) => {
    if(req.params.lines && chunks.length < req.params.lines) {
      chunks.push(JSON.stringify(data));
    }
  });

  readStream.on('end', () => {
    var id = setInterval(() => {
      if (chunks.length) {
        res.write(chunks.shift() + '\n');
      } else {
        clearInterval(id);
        res.end();
      }
    }, 500);
  });
})

var listener = app.listen(5000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});