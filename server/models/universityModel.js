const mongoose = require('mongoose');

const UniversitySchema = mongoose.Schema({
  name: {type: String, trim: true, maxLength: 50, index: true, required: true},
  state: {type: String, trim: true, maxLength: 25},
  domains: [{type: String, lowercase: true}]
});

module.exports = mongoose.model('University', UniversitySchema);