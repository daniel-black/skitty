const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  // identification and authorization information
  firstName: {type: String, lowercase: true, trim: true, required: true, maxLength: 25},
  lastName: {type: String, lowercase: true, trim: true, required: true, maxLength: 25},
  eduEmail: {type: String, lowercase:true, trim: true, unique: true, index: true, required: true, maxLength: 40},
  altEmail: {type: String, lowercase:true, trim: true, unique: true, maxLength: 40},
  useAltEmail:{type: Boolean, default: false},
  phone: {type: String, maxLength: 20},
  password: {type: String, required: true},
  // personal information
  university: {type: mongoose.Schema.ObjectId, required: true},
  graduated: {type: Boolean},
  graduationYear: {type: Number, min: 2018, max: 2050},
  age: {type: Number, min: 18, max: 28},
  gender: {type: String, lowercase: true, trim: true, maxLength: 25},
  employed: {type: Boolean},
  jobTitle: {type: String, lowercase: true, trim: true, maxLength: 50},
  company: {type: String, trim: true, maxLength: 25},
  currentState: {type: String, lowercase: true, trim: true, maxLength: 25},
  currentCity: {type: String, lowercase: true, trim: true, maxLength: 25},
  instagram: {type: String, trim: true, maxLength: 30},
  twitter: {type: String, trim: true, maxLength: 30},  
  // relationships with other users
  pendingConnections: [{type: mongoose.Schema.ObjectId}],
  permitted: [{type: mongoose.Schema.ObjectId}],
  // account related information
  hidden: {type: Boolean, default: false},
  paying: {type: Boolean, default: false}
}, 
{
  timestamps: true
});

// Make a model from the schema and export it
module.exports = mongoose.model('User', UserSchema);



// leads: [{type: mongoose.Schema.Types.ObjectId}],
// fullAccess: [{type: mongoose.Schema.Types.ObjectId}],