const cloudinary = require("cloudinary").v2

// Configuration
cloudinary.config({
    cloud_name: 'ddpxef7nv',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (file) => {
    // Upload an image
    const uploadResult = await cloudinary.uploader
        .upload(
            file, {
            public_id: 'property_images',
        }
        )
        .catch((error) => {
            console.log(error);
        });

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('property_images', {
        fetch_format: 'auto',
        quality: 'auto'
    });

    return uploadResult
}

module.exports = uploadToCloudinary