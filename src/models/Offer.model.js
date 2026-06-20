const mongoose = require('mongoose');

const paymentDetailsSchema = new mongoose.Schema(
  {
    publisherName: { type: String, default: '', trim: true },
    agencyPOC: { type: String, default: '', trim: true },
    endDate: { type: Date, default: null },
    validationDate: { type: Date, default: null },
    invoiceDate: { type: Date, default: null },
    paymentDate: { type: Date, default: null },
    publisherConfirmation: { type: String, default: '', trim: true }
  },
  { _id: false }
);

const offerSchema = new mongoose.Schema(
  {
    campaignName: { type: String, required: true, trim: true, index: true },
    market: { type: String, required: true, trim: true, index: true },
    kpi: { type: String, default: '', trim: true },
    costingModel: { type: String, default: '', trim: true },
    payout: { type: Number, default: 0, min: 0 },
    note: { type: String, default: '', trim: true },
    publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher', required: true, index: true },
    status: { type: String, required: true, trim: true, index: true },
    endDate: { type: Date, required: true, index: true },
    paymentDetails: { type: paymentDetailsSchema, default: () => ({}) },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

offerSchema.index({ publisherId: 1, createdAt: -1 });
offerSchema.index({ createdBy: 1, createdAt: -1 });
offerSchema.index({ 'paymentDetails.paymentDate': 1 });

module.exports = mongoose.model('Offer', offerSchema);
