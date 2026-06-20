const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    market: { type: String, required: true, trim: true, index: true },
    poc: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true, index: true },
    wishlist: { type: String, default: '', trim: true },
    agencyPoc: { type: String, default: '', trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

publisherSchema.index({ createdBy: 1, createdAt: -1 });

module.exports = mongoose.model('Publisher', publisherSchema);
