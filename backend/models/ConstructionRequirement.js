const mongoose = require('mongoose');

const constructionRequirementSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Optional: sent to a specific contractor, or left open for any contractor to respond
    contractor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContractorUser',
      default: null,
    },
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    plotArea: {
      value: { type: Number, required: true },
      unit: { type: String, enum: ['sqft', 'sqyd', 'acre'], default: 'sqft' },
    },
    houseType: { type: String, default: '' }, // e.g. 3 BHK
    floors: { type: Number, default: 1 },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    approxBudget: { type: Number, required: true },
    preferredStartDate: { type: Date },
    description: { type: String, default: '' },
    additionalRequirements: { type: String, default: '' },
    messages: [{
      sender: { type: mongoose.Schema.Types.ObjectId, refPath: 'messages.senderModel', required: true },
      senderModel: { type: String, enum: ['User', 'ContractorUser'], default: 'User', required: true },
      senderRole: { type: String, enum: ['customer', 'contractor'], required: true },
      text: { type: String, trim: true, required: true, maxlength: 2000 },
      createdAt: { type: Date, default: Date.now },
    }],
    status: {
      type: String,
      enum: ['Open', 'Responded', 'In Discussion', 'Accepted', 'Rejected', 'Closed'],
      default: 'Open',
    },
  },
  { timestamps: true }
);

constructionRequirementSchema.index({ customer: 1 });
constructionRequirementSchema.index({ contractor: 1, status: 1 });

module.exports = mongoose.model('ConstructionRequirement', constructionRequirementSchema);
