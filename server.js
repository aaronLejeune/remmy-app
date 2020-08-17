const express = require('express');
const path = require('path');
const ejs = require('ejs');
const request = require('request');
var cors = require('cors');

const {
  google
} = require('googleapis');
const env = require('./env.js');

const oauth2Client = new google.auth.OAuth2(
  env.YOUR_CLIENT_ID,
  env.YOUR_CLIENT_SECRET,
  env.YOUR_REDIRECT_URL,
);

let bearerToken = false;

const app = express();

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/dist'));
app.use(cors());

app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root


// Get photo's
app.get('/images', async (req, res) => {
  if (!bearerToken) {
    // Use return to block the traffic
    return res.json({
      error: 'Please login first (browse to /login)',
    });

  }

  //LIST ALL POHOTOS
  /*request({
    method: 'GET',
    url: 'https://photoslibrary.googleapis.com/v1/mediaItems',
    qs: { key: env.YOUR_APIKEY },
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${bearerToken}`,
    },
  }, (error, response, body) => {
    if (error) throw new Error(error);
    const data = JSON.parse(body);
    res.json({
      data: data.mediaItems,
    });
  });*/

  // GET ALBUM ID
  /*request({
    method: 'GET',
    url: 'https://photoslibrary.googleapis.com/v1/albums',
    qs: {
      key: env.YOUR_APIKEY
    },
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${bearerToken}`,
    },
  }, (error, response, body) => {
    if (error) throw new Error(error);
    const data = JSON.parse(body);
    console.log(data);
    res.json({
      data: data.mediaItems,
    });
  });*/

  // DISPLAY ALBUM WITH CONTENT
  request({
    method: 'POST',
    url: 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
    qs: {
      key: env.YOUR_APIKEY
    },
    json: {
      pageSize: 100,
      albumId: "ANuYcrScvntxdpVYv86DJ2qpfS9BlSceCD9vfMswGx0d8g3rEAIBwPZ9WlLWe2BfMsfpMW7qAExJ"
    },
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${bearerToken}`,
    },
  }, (error, response, body) => {
    if (error) throw new Error(error);
    //const data = JSON.parse(body);
    res.json({
      data: body.mediaItems,
    });
  });
});

// Login to Google Photos
app.get('/login', (req, res) => {
  // generate a url that asks permissions for Blogger and Google Calendar scopes
  const scopes = [
    'https://www.googleapis.com/auth/photoslibrary.readonly',
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });

  res.redirect(url);
});

// Get redirected from Google
app.get('/redirect', async (req, res) => {
  const {
    tokens
  } = await oauth2Client.getToken(req.query.code);
  oauth2Client.setCredentials(tokens);
  console.log('tokens:', tokens);

  bearerToken = tokens.access_token;

  // TODO: implement refresh_token

  res.redirect('/images');
});

// Start the app
app.listen(Number(env.port), () => {
  console.log(`Google Photo's app started on port ${env.port}`);
});