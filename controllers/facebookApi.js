const config = require('../config');
const utilities = require('./utilities');
const request = require('request');
const recastai = require('recastai');
const recastReq = new recastai.request(config.REQUEST_TOKEN, config.LANGUAGE);

// Handles messages events
exports.handleMessage = (sender_psid, received_message) => {
  recastReq.analyseText(strCapitalize(received_message))
    .then(function(res) {
      utilities.build(res.entities, sender_psid);
    });
}

// Sends response messages via the Send API
exports.callSendAPI = (sender_psid, response) => {
  let request_body = { "recipient": { "id": sender_psid }, "message": response }
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": config.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (err)
      console.error("Unable to send message:" + err);
    else
      return (true);
  });
}

const strCapitalize = (str) => {
  var nstr = '';
  str.split(' ').forEach((word) => {
    nstr += (nstr.length > 0 ? ' ' : '') + word.charAt(0).toUpperCase() + word.slice(1);
  });
  return nstr;
}
