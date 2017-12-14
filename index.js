const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const config = require('./config.js');
const app = express();

app.use(bodyParser.json());

const findSimilar = (person, res) => {
  request(`http://ws.audioscrobbler.com/2.0/?limit=5&method=artist.getsimilar&autocorrect=0&artist=${person}&api_key=2c797a114ef97a8abc511c695e29341c&format=json`, function (error, response, body) {
    if (error) {
      console.log('error:', error); // Print the error if one occurred
    } else {
      const result = JSON.parse(body);
      const similars = result.similarartists;
      var cards = null;
      if (similars) {
        cards = similars.artist.map(e => ({
          title: e.title || e.name,
          imageUrl: e.image[2]['#text'],
          buttons: [{
            type: 'web_url',
            value: e.url,
            title: 'Voir l\'artiste',
          }],
        }));
      }
      sendResult(cards, res);
    }
  });
};

const sendResult = (cards, res) => {
  if (!cards || cards.length === 0) {
    res.json({ replies: [{type: 'text', content: 'Oops, je n\'ai trouvé aucun résultats !' }]});
  } else {
    res.json({
      replies: [{type: 'text', content: 'Voilà ce que j\'ai trouvé :' }, {
        type: 'carouselle',
        content: cards
      }]
    });
  }
};

app.post('/errors', (req, res) => {
   console.error(req.body);
   res.sendStatus(200);
});

app.post('/find', (req, res) => {
  findSimilar(req.body.conversation.memory.person.raw, res);
});

app.listen(config.PORT, () => console.log(`App started on port ${config.PORT}`));
