import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  signature: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  type: {
    type: String,
    enum: ['purchase', 'royalty', 'collaboration_payment'],
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  fromWallet: {
    type: String,
    required: true
  },
  toWallet: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'SOL'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  },
  metadata: {
    type: Map,
    of: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Transaction', transactionSchema);
