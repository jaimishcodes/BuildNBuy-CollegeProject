const mongoose = require('mongoose');

const previousProjectSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    location: { type: String, trim: true, default: '' },
    projectType: { type: String, trim: true, default: '' },
    completionYear: { type: Number, min: 1900, max: 2100 },
    description: { type: String, trim: true, default: '' },
    images: [{ url: String, publicId: String }],
  },
  { _id: true }
);
const contractorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContractorUser',
      required: true,
      unique: true,
    },
    companyName: { type: String, trim: true, default: '' },
    about: { type: String, default: '' },
    experienceYears: { type: Number, default: 0, min: 0 },
    teamSize: { type: Number, default: 0, min: 0 },

    location: {
      city: { type: String, required: true },
      state: { type: String, default: '' },
      address: { type: String, default: '' },
    },

    specializations: [{ type: String }], // e.g. Residential, Commercial, Interior, Renovation
    servicesOffered: [{ type: String }],

    coverImage: { url: String, publicId: String },
    gallery: [{ url: String, publicId: String }],
    previousProjects: [previousProjectSchema],

    completedProjectsCount: { type: Number, default: 0 },
    minBudget: { type: Number, default: 0 },
    maxBudget: { type: Number, default: 0 },

    availability: {
      type: String,
      enum: ['Available', 'Busy', 'Not Available'],
      default: 'Available',
    },

    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    rejectionReason: { type: String, default: '' },

    // simple analytics counters, incremented by relevant controllers
    profileViews: { type: Number, default: 0 },
    inquiryCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

contractorProfileSchema.index({ 'location.city': 1, verificationStatus: 1 });

module.exports = mongoose.model('ContractorProfile', contractorProfileSchema);
