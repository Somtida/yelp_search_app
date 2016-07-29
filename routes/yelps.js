'use strict';

let express = require('express');
let router = express.Router();
let Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET,
});

// yelp.search({ term: 'food', location: 'Montreal' })
// .then(function (data) {
//   console.log(data);
// })
// .catch(function (err) {
//   console.error(err);
// });
//
// yelp.business('yelp-san-francisco')
//   .then(console.log)
//   .catch(console.error);




router.get('/:businessName', (req, res) => {
  console.log('req.params.businessName: ',req.params.businessName);
  yelp.business(req.params.businessName)
    .then(console.log)
    .catch(console.error);
})

module.exports = router;
