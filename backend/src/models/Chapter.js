import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  chapterNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  encryptedContentUri: {
    type: String,
    sparse: true
  },
  contentHash: String,
  wordCount: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number,
    default: 0
  },
  authorWallet: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  version: {
    type: Number,
    default: 1
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

chapterSchema.index({ projectId: 1, chapterNumber: 1 }, { unique: true });

chapterSchema.pre('save', function(next) {
  this.updatedAt = Date.now();

  // Calculate word count and reading time
  if (this.content) {
    const words = this.content.trim().split(/\s+/).length;
    this.wordCount = words;
    this.readingTime = Math.ceil(words / 200); // 200 words per minute
  }

  next();
});

export default mongoose.model('Chapter', chapterSchema);
