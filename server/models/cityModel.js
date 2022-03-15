const mongoose = require('mongoose');

const CityModel = mongoose.Schema({
  name: {type: String, trim: true, index: true},
  state: {type: String, trim: true}
});

module.exports = mongoose.model('City', CityModel);