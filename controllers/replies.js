exports.quickReplies = () => {
  return ({
    'text': 'Vous souhaitez connaitre des artistes en commun avec ceux que vous connaissez déjà ? Donné moi le nom de l\'artiste de votre choix où choisissez parmi les plus recherchés ci-dessous.',
    'quick_replies': [{
        'content_type': 'text',
        'title': 'Marina Kaye',
        'payload': 'pbpayload'
      },{
        'content_type': 'text',
        'title': 'Johnny Hallyday',
        'payload': 'pbpayload'
      },{
        'content_type': 'text',
        'title': 'Orelsan',
        'payload': 'pbpayload'
      },{
        'content_type': 'text',
        'title': 'Ariana Grande',
        'payload': 'pbpayload'
      },{
        'content_type': 'text',
        'title': 'Elvis Presley',
        'payload': 'pbpayload'
      }]
  });
}

exports.findSimilars = (person) => {
  return ({text: `Je recherche des artistes similaires à ${person} !` });
}

exports.sayHello = () => {
  return ({text: 'Hey !' });
}

exports.notFound = () => {
  return ({text: `Oops, je n'ai trouvé aucun résultats !` });
}

exports.found = () => {
  return ({text: `Voilà ce que j'ai trouvé :` });
}

exports.attachments = (cards) => {
  return ({type: "template", payload: {template_type: 'generic', elements: cards}});
}

exports.carousel = (attachment) => {
  return ({'attachment': attachment});
}
