const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generic storage factory so different resources land in different folders
const makeStorage = (folder, resourceType = 'image') =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `buildnbuy/${folder}`,
      resource_type: resourceType,
      allowed_formats:
        resourceType === 'video'
          ? ['mp4', 'mov', 'avi', 'webm']
          : ['jpg', 'jpeg', 'png', 'webp'],
      transformation:
        resourceType === 'image' ? [{ width: 1920, crop: 'limit', quality: 'auto' }] : undefined,
    },
  });

const uploadPropertyImages = multer({
  storage: makeStorage('properties'),
  limits: { fileSize: 8 * 1024 * 1024 },
});

const uploadPropertyVideos = multer({
  storage: makeStorage('property-videos', 'video'),
  limits: { fileSize: 50 * 1024 * 1024 },
});

const uploadContractorMedia = multer({
  storage: makeStorage('contractors'),
  limits: { fileSize: 8 * 1024 * 1024 },
});

const uploadAvatar = multer({
  storage: makeStorage('avatars'),
  limits: { fileSize: 4 * 1024 * 1024 },
});

module.exports = {
  cloudinary,
  uploadPropertyImages,
  uploadPropertyVideos,
  uploadContractorMedia,
  uploadAvatar,
};
