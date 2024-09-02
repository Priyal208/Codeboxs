const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dwhz6cbqg',  // Replace with actual value
  api_key: '711166981443555',  // Replace with actual value
  api_secret: 'zQCSOjajk9-vaYDgmKWYYMnVyhE',  // Replace with actual value
});

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    if (!file || !file.tempFilePath) {
        throw new Error('File or tempFilePath is missing');
    }

    const options = { folder };
    if (height) {
        options.height = height;
    }
    if (quality) {
        options.quality = quality;
    }
    options.resource_type = "auto";

    try {
        console.log('Uploading file to Cloudinary:', file.tempFilePath);
        const result = await cloudinary.uploader.upload(file.tempFilePath, options);
        console.log('Upload successful:', result);
        return result;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Cloudinary upload failed');
    }
};
