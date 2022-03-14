const mongoose = require('mongoose');

const UniversitySchema = mongoose.Schema({
  name: {
    type: String,
    index: true,
    required: [true, 'University must have a name']
  },
  state: {
    type: String
  },
  domains: [{
    type: String,
    lowercase: true
  }],
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

module.exports = mongoose.model('University', UniversitySchema);