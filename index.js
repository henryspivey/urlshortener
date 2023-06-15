require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const URL_DICT = {}

// Your first API endpoint
app.post('/api/shorturl/', function (req, res) {
  const short_url_int = Object.keys(URL_DICT).length + 1 // ensure that we have at least 1 open spot
  const original_url = req.body.url
  URL_DICT[short_url_int] = original_url
  res.json({ original_url, short_url: short_url_int });
});

app.get('/api/shorturl/:id', function (req, res) {
  const { id } = req.params

  const original_url = URL_DICT[id]
  res.redirect(original_url)

})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
