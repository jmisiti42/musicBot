const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const facebookApi = require('./controllers/facebookApi');
const app = express();
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  let body = req.body;
  if (body.object === 'page') {
    body.entry.forEach(function(entry) {
      let webhookEvent = entry.messaging[0];
      let sender_psid = webhookEvent.sender.id;
      if (webhookEvent.message) {
        facebookApi.handleMessage(sender_psid, webhookEvent.message.text);
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

app.get('/webhook', (req, res) => {
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === config.VERIFY_TOKEN) {
      res.status(200).send('yo');
    } else {
      res.sendStatus(403);
    }
  }
});

app.listen(config.PORT, () => console.log(`App started on port ${config.PORT}`));
