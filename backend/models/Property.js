const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, unique: true },
    description: { type: String, required: true },

    propertyType: {
      type: String,
      enum: [
        'Apartment',
        'Villa',
        'House',
        'Penthouse',
        'Plot/Land',
        'Office',
        'Shop',
        'Commercial',
        'Farm House',
        'Luxury Property',
      ],
      required: true,
    },
    listingType: {
      type: String,
      enum: ['Sale', 'Rent'],
      required: true,
    },

    price: { type: Number, required: true },
    priceUnit: { type: String, enum: ['total', 'per_month'], default: 'total' },

    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      lat: { type: Number },
      lng: { type: Number },
    },

    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area: {
      value: { type: Number, required: true },
      unit: { type: String, enum: ['sqft', 'sqyd', 'acre'], default: 'sqft' },
    },
    parking: { type: Number, default: 0 },
    furnishing: {
      type: String,
      enum: ['Unfurnished', 'Semi-Furnished', 'Fully-Furnished'],
      default: 'Unfurnished',
    },
    amenities: [{ type: String }],

    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    videos: [
      {
        url: String,
        publicId: String,
      },
    ],

    // Who listed it — either a customer (self-listing) or a contractor
    listedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'listedByModel',
      required: true,
    },
    listedByModel: {
      type: String,
      enum: ['User', 'ContractorUser'],
      default: 'User',
      required: true,
    },
    listedByRole: {
      type: String,
      enum: ['customer', 'contractor'],
      required: true,
    },

    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Sold', 'Rented'],
      default: 'Pending',
    },
    rejectionReason: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },

    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

propertySchema.index({ 'location.city': 1, propertyType: 1, listingType: 1, status: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ title: 'text', description: 'text', 'location.city': 'text' });

propertySchema.pre('validate', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug =
      this.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Math.random().toString(36).slice(2, 7);
  }
  next();
});

module.exports = mongoose.model('Property', propertySchema);
