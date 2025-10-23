import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  genre: String,
  tags: [String],
  authorWallet: {
    type: String,
    required: true,
    index: true
  },
  contractAddress: {
    type: String,
    sparse: true,
    unique: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'paid'],
    default: 'private'
  },
  price: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'SOL'
  },
  coverImage: String,
  coverColor: String,
  status: {
    type: String,
    enum: ['draft', 'active', 'published', 'archived'],
    default: 'draft'
  },
  collaborators: [{
    walletAddress: String,
    role: {
      type: String,
      enum: ['author', 'co-author', 'editor', 'reviewer']
    },
    revenueShare: {
      type: Number,
      default: 0
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  stats: {
    totalReaders: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    },
    reviews: {
      type: Number,
      default: 0
    }
  },
  publishedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Project', projectSchema);
