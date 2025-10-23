import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  username: {
    type: String,
    sparse: true
  },
  bio: String,
  avatar: String,
  reputation: {
    type: Number,
    default: 0
  },
  tags: [String],
  socialLinks: {
    twitter: String,
    github: String,
    website: String
  },
  settings: {
    notifications: {
      type: Boolean,
      default: true
    },
    publicProfile: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);
