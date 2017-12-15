const facebookApi = require('./facebookApi');
const replies = require('./replies');
const config = require('../config');
const request = require('request');

//Fonction qui réagi en fonction du message
exports.build = (entities, sender_psid) => {
  let responseCount = 0;
  if (entities.greeting_word && ++responseCount) { facebookApi.callSendAPI(sender_psid, replies.sayHello()); } //On dit bonjour
  if (entities.person && ++responseCount) {
    const person = entities.person[0].raw;
    facebookApi.callSendAPI(sender_psid, replies.findSimilars(person)); //On indique que la recherche est en cour
    const cards = findSimilar(person, (cards) => {
      const attachment = replies.attachments(cards);
      if (!cards || cards.length === 0) { facebookApi.callSendAPI(sender_psid, replies.notFound()); } //Le presonnage n'est pas dans la BDD
      else { facebookApi.callSendAPI(sender_psid, replies.found()); facebookApi.callSendAPI(sender_psid, replies.carousel(attachment)); } //Le personnage est en BDD
    });
  }
  if (responseCount === 0) { facebookApi.callSendAPI(sender_psid, replies.quickReplies()); }
};

//Fonction qui request l'api last.fm pour récupérer les 5 artistes en rapport avec celui fournit.
const findSimilar = (person, next) => {
  request(`http://ws.audioscrobbler.com/2.0/?limit=10&method=artist.getsimilar&autocorrect=0&artist=${person}&api_key=${config.LAST_FM_API_KEY}&format=json`, function (error, response, body) {
    if (error) {
      console.log('error:', error);
    } else {
      const result = JSON.parse(body);
      const similars = result.similarartists;
      var cards = null;
      if (similars) {
        cards = similars.artist.map(e => ({
          title: e.title || e.name,
          image_url: e.image[2]['#text'],
          buttons: [{
            type: 'web_url',
            url: e.url,
            title: 'Plus',
          }]
        }));
      }
      next(cards);
    }
  });
};
