const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    lowercase: true,
    trim: true,
    required: [true, 'Please add a first name']
  },
  lastName: {
    type: String,
    lowercase: true,
    trim: true,
    required: [true, 'Please add a last name']
  },
  email: {
    type: String,
    lowercase:true,
    trim: true,
    unique: true,
    index: true,
    required: [true, 'Please add an email']
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'Please add a password']
  },
  personalDetails: {
    age: {
      type: Number,
      min: 18,
      max:30,
    },
    bio: {
      type: String,
      maxLength: 500 
    },
    gender: {
      type: String,
      lowercase: true
    },
    education: {
      school: {
        type: String,
        lowercase: true
      },
      graduated: {
        type: Boolean
      }
    },
    work: {
      employed: {
        type: Boolean
      }, 
      title: {
        type: String,
        lowercase: true
      },
      company: {
        type: String,
        lowercase: true
      }
    },
    socials: {
      twitter: String,
      instagram: String,
      facebook: String,
      linkedin: String,
      snapchat: String,
    }
  },
  locationDetails: {
    origin: {
      state: {
        type: String,
        lowercase: true
      },
      city: {
        type: String,
        lowercase: true
      }
    },
    targets: [{
      type: String,
      lowercase: true
    }],


  },
  leads: [{type: mongoose.Schema.Types.ObjectId}],
  fullAccess: [{type: mongoose.Schema.Types.ObjectId}],
  hidden: {
    type: Boolean,
    default: false
  }
}, 
{
  timestamps: true
});

// Make a model from the schema and export it
module.exports = mongoose.model('User', UserSchema);
