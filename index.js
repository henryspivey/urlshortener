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

const isValidUrl = urlString => {
  var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
  return !!urlPattern.test(urlString);
}

// Your first API endpoint
app.post('/api/shorturl/', function (req, res) {
  const original_url = req.body.url
  if (!isValidUrl(original_url)) {
    res.json({ error: 'invalid url' })
    return
  }
  const short_url_int = Object.keys(URL_DICT).length + 1 // ensure that we have at least 1 open spot

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
