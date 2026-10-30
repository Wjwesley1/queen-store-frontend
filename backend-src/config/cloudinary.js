const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(filePath, originalName) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'queen-store/produtos',
    public_id: `${Date.now()}-${originalName.replace(/\.[^/.]+$/, '')}`,
    resource_type: 'image'
  });

  fs.unlinkSync(filePath); // remove arquivo temporario

  return result.secure_url;
}

module.exports = {
  cloudinary,
  uploadToCloudinary
};
