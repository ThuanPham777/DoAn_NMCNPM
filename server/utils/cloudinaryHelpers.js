const cloudinary = require('../config/cloudinary');
const extractPublicId = (imageUrl) => {
  const matches = imageUrl.match(/\/upload\/v\d+\/(.+)\.\w+$/); // Biểu thức chính quy để lấy public_id
  if (!matches || !matches[1]) {
    throw new Error('Invalid imageUrl format');
  }
  return matches[1]; // Trả về public_id
};
exports.storeImageInCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: folder, // Set the folder name
      },
      (error, result) => {
        if (error) {
          return reject(
            new Error(`Cloudinary upload failed: ${error.message}`)
          );
        }
        resolve(result.secure_url); // Return the secure URL of the uploaded image
      }
    );

    uploadStream.end(file.buffer); // Pass the memory buffer
  });
};

exports.deleteImageInCloudinary = (imageUrl) => {
  if (imageUrl) {
    const publicId = extractPublicId(imageUrl);
    return cloudinary.uploader.destroy(publicId);
  }
};
