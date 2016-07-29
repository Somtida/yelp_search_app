'use strict';

const mongoose = require('mongoose');

let yelpSchema = new mongoose.Schema({
  id: {type: String, required: true},
  count: { type: String }

})

var Yelpp = mongoose.model('Yelpp', yelpSchema);

module.exports = Yelpp;
