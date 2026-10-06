const mongoose = require('mongoose');

const propertyInquirySchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'requesterModel',
      required: true,
    },
    requesterModel: { type: String, enum: ['User', 'ContractorUser'], required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'ownerModel',
      required: true,
    },
    ownerModel: { type: String, enum: ['User', 'ContractorUser'], required: true },
    preferredVisitDate: { type: Date },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: ['Pending', 'Accepted', 'Declined'], default: 'Pending' },
  },
  { timestamps: true }
);

propertyInquirySchema.index({ owner: 1, ownerModel: 1, createdAt: -1 });
propertyInquirySchema.index({ requester: 1, property: 1, status: 1 });

// Keep this collection name aligned with the Booking inquiries collection in Atlas.
module.exports = mongoose.model('PropertyInquiry', propertyInquirySchema, 'Booking inquiries');
